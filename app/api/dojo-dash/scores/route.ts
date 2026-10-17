// Dojo Dash shared leaderboard API.
//
// Stores ONLY: nickname (chosen by the player, filtered), score, time, belt, mastery level, date, and a
// one-way hash of a random removal token, on a board per game mode. No real names, IP addresses,
// location, device or browser details.
//
// GET    ?board=…            top 10 for a board
// POST   {board,n,s,t,b,m}   save a score; returns {entry, token}. Only the device keeps the token.
// DELETE {board,token}       "Remove my score": deletes the entry whose hash matches, straight away.
//
// Storage: Upstash Redis (Vercel Marketplace). Needs KV_REST_API_URL + KV_REST_API_TOKEN
// (or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN). If they are missing, or Redis is down,
// every request returns 503 and the game keeps saving on the player's own device.
import { NextRequest } from 'next/server'
import {
  boardKey, boardOk, allBoards, clean, int, nickOk, json, unavailable, kvConfigured, redis, rateLimited,
  parseEntry, toPublic, readBody, newToken, hashToken, TOKEN_RE, MAX_KEEP, DAILY_TTL, RETENTION_MS, type Entry,
} from '@/lib/dojo-dash/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const SHOW = 10

export async function GET(req: NextRequest) {
  if (!kvConfigured()) return unavailable()
  const board = req.nextUrl.searchParams.get('board') || 'dojoDashLeaderboard'
  if (!boardOk(board, false)) return json({ error: 'bad board' }, 400)
  try {
    const [raw] = await redis([['ZREVRANGE', boardKey(board), 0, SHOW - 1]])
    const cutoff = Date.now() - RETENTION_MS
    const entries = (Array.isArray(raw) ? raw : [])
      .map(parseEntry)
      .filter((e): e is Entry => !!e && (e.d || 0) >= cutoff)
      .map(toPublic)
    // short CDN cache keeps Redis command use low; the game also shows the player's own score locally
    return json({ board, entries }, 200, 'public, s-maxage=10, stale-while-revalidate=30')
  } catch {
    return unavailable()
  }
}

export async function POST(req: NextRequest) {
  if (!kvConfigured()) return unavailable()
  const b = await readBody(req, 1024)
  if (!b) return json({ error: 'bad request' }, 400)

  const board = typeof b.board === 'string' ? b.board : 'dojoDashLeaderboard'
  if (!boardOk(board, true)) return json({ error: 'bad board' }, 400)

  // one nickname, or two joined by " & " on the team board
  const names = clean(b.n).split(' & ').map(clean)
  const maxNames = board === 'dojoDashTeam' ? 2 : 1
  if (names.length < 1 || names.length > maxNames || !names.every(nickOk)) return json({ error: 'nickname' }, 422)

  const s = int(b.s, 0, 10_000_000)
  const t = int(b.t, 0, 10_000_000)
  const bl = int(b.b, 0, 40)
  const m = b.m == null ? undefined : int(b.m, 1, 999)
  if (s === null || t === null || bl === null || m === null) return json({ error: 'fields' }, 422)

  try {
    if (await rateLimited(req, 'save', 6, 60)) return json({ error: 'slow down' }, 429)

    const d = Date.now()
    const token = newToken()
    const entry: Entry = { n: names.join(' & '), s, t, b: bl, d }
    if (m !== undefined) entry.m = m
    const stored: Entry = { ...entry, h: hashToken(token) }
    const key = boardKey(board)
    // score is the sort key; a tiny time-based fraction ranks earlier equal scores higher
    const sortKey = s + (1 - (d % 1e9) / 1e9) * 0.5
    const isDaily = board.startsWith('dojoDashDaily-')
    const [, , , all] = await redis([
      ['ZADD', key, sortKey, JSON.stringify(stored)],
      ['ZREMRANGEBYRANK', key, 0, -(MAX_KEEP + 1)], // keep only the top 50
      isDaily ? ['EXPIRE', key, DAILY_TTL] : ['PERSIST', key],
      ['ZRANGE', key, 0, -1],
    ])
    // remove anything older than 12 months
    const cutoff = d - RETENTION_MS
    const stale = (Array.isArray(all) ? all : []).map(String).filter((raw) => (parseEntry(raw)?.d || 0) < cutoff)
    if (stale.length) await redis([['ZREM', key, ...stale]])
    // The token is only ever sent back to the device that saved the score.
    return json({ ok: true, entry, token }, 201)
  } catch {
    return unavailable()
  }
}

// "Remove my score" from the device that saved it.
export async function DELETE(req: NextRequest) {
  if (!kvConfigured()) return unavailable()
  const b = await readBody(req, 512)
  const token = b && typeof b.token === 'string' ? b.token : ''
  if (!TOKEN_RE.test(token)) return json({ error: 'bad token' }, 400)
  const board = b && typeof b.board === 'string' ? b.board : ''
  if (board && !boardOk(board, false)) return json({ error: 'bad board' }, 400)
  try {
    if (await rateLimited(req, 'del', 20, 60)) return json({ error: 'slow down' }, 429)
    const h = hashToken(token)
    for (const bd of board ? [board] : allBoards()) {
      const key = boardKey(bd)
      const [all] = await redis([['ZRANGE', key, 0, -1]])
      const hit = (Array.isArray(all) ? all : []).map(String).find((raw) => parseEntry(raw)?.h === h)
      if (hit) {
        await redis([['ZREM', key, hit]])
        return json({ ok: true, removed: 1 })
      }
    }
    // already gone (removed earlier, dropped out of the top 50, or expired)
    return json({ ok: true, removed: 0 }, 404)
  } catch {
    return unavailable()
  }
}
