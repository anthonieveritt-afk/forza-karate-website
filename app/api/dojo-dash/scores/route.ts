// Dojo Dash shared leaderboard API.
//
// Stores ONLY: nickname (chosen by the player, filtered), score, time, belt, mastery level and date,
// on a board per game mode. No real names, IP addresses, location, device or browser details.
//
// Storage: Upstash Redis (Vercel Marketplace). Needs KV_REST_API_URL + KV_REST_API_TOKEN
// (or UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN). If they are missing, or Redis is down,
// every request returns 503 and the game keeps saving on the player's own device.
import { createHash } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import NF from '@/lib/dojo-dash/nickfilter'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN

const FIXED_BOARDS = new Set(['dojoDashLeaderboard', 'dojoDashTeam', 'dojoDashMastery'])
const DAILY_RE = /^dojoDashDaily-(\d{4}-\d{2}-\d{2})$/
const MAX_KEEP = 50 // cap on stored entries per board
const SHOW = 10 // entries returned to the game
const RATE_MAX = 6 // saves per client per window
const RATE_WIN = 60 // seconds
const MAX_BODY = 1024 // bytes
const NICK_MAX = 12 // characters per nickname
const DAILY_TTL = 14 * 86400 // daily boards are deleted after 14 days
const RETENTION_MS = 365 * 86400 * 1000 // entries older than 12 months are removed

type Entry = { n: string; s: number; t: number; b: number; m?: number; d: number }

function json(body: unknown, status = 200, cache = 'no-store') {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': cache } })
}
const unavailable = () => json({ error: 'leaderboard unavailable', local: true }, 503)

async function redis(cmds: (string | number)[][]): Promise<unknown[]> {
  const ctl = new AbortController()
  const timer = setTimeout(() => ctl.abort(), 3000)
  try {
    const r = await fetch(KV_URL + '/pipeline', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + KV_TOKEN, 'Content-Type': 'application/json' },
      body: JSON.stringify(cmds),
      signal: ctl.signal,
      cache: 'no-store',
    })
    if (!r.ok) throw new Error('redis ' + r.status)
    const out = (await r.json()) as { result?: unknown; error?: string }[]
    if (out.some((x) => x.error)) throw new Error('redis command error')
    return out.map((x) => x.result)
  } finally {
    clearTimeout(timer)
  }
}

// Only today's daily board (allowing for time zones) can be written; older ones are read-only.
function boardOk(board: string, forWrite: boolean): boolean {
  if (FIXED_BOARDS.has(board)) return true
  const m = DAILY_RE.exec(board)
  if (!m) return false
  const day = Date.parse(m[1] + 'T00:00:00Z')
  if (!Number.isFinite(day)) return false
  const diffDays = (day - Date.now()) / 86400000
  return forWrite ? diffDays > -2 && diffDays < 1.5 : diffDays > -15 && diffDays < 1.5
}

const clean = (s: unknown) => String(s ?? '').replace(/\s+/g, ' ').trim()
function int(v: unknown, lo: number, hi: number): number | null {
  const n = Math.floor(Number(v))
  return Number.isFinite(n) && n >= lo && n <= hi ? n : null
}
function nickOk(name: string) {
  return name.length >= 1 && name.length <= NICK_MAX && NF.check(name).ok
}

// Rate-limit key: a salted one-way hash of the connection address that changes every day. It is
// held in Redis for 60 seconds and then deleted. The address itself is never stored or logged.
function rateKey(req: NextRequest) {
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'anon'
  const day = new Date().toISOString().slice(0, 10)
  return 'dd:rl:' + createHash('sha256').update((process.env.DD_RATE_SALT || 'dojo') + day + ip).digest('hex').slice(0, 24)
}

function parseEntries(raw: unknown): Entry[] {
  const cutoff = Date.now() - RETENTION_MS
  return (Array.isArray(raw) ? raw : [])
    .map((s) => {
      try {
        return JSON.parse(String(s)) as Entry
      } catch {
        return null
      }
    })
    .filter((e): e is Entry => !!e && typeof e.n === 'string' && typeof e.s === 'number' && (e.d || 0) >= cutoff)
    // re-check names on the way out too, so a filter update also hides older entries
    .map((e) => (e.n.split(' & ').every((x) => NF.check(x).ok) ? e : { ...e, n: 'Ninja' }))
}

export async function GET(req: NextRequest) {
  if (!KV_URL || !KV_TOKEN) return unavailable()
  const board = req.nextUrl.searchParams.get('board') || 'dojoDashLeaderboard'
  if (!boardOk(board, false)) return json({ error: 'bad board' }, 400)
  try {
    const [raw] = await redis([['ZREVRANGE', 'dd:lb:' + board, 0, SHOW - 1]])
    // short CDN cache keeps Redis command use low; the game also shows the player's own score locally
    return json({ board, entries: parseEntries(raw) }, 200, 'public, s-maxage=10, stale-while-revalidate=30')
  } catch {
    return unavailable()
  }
}

export async function POST(req: NextRequest) {
  if (!KV_URL || !KV_TOKEN) return unavailable()
  let b: Record<string, unknown>
  try {
    const text = await req.text()
    if (text.length > MAX_BODY) return json({ error: 'too large' }, 413)
    b = JSON.parse(text || '{}')
    if (!b || typeof b !== 'object' || Array.isArray(b)) throw new Error()
  } catch {
    return json({ error: 'bad json' }, 400)
  }

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
    const rk = rateKey(req)
    const [cnt] = await redis([['INCR', rk], ['EXPIRE', rk, RATE_WIN, 'NX']])
    if (Number(cnt) > RATE_MAX) return json({ error: 'slow down' }, 429)

    const d = Date.now()
    const entry: Entry = { n: names.join(' & '), s, t, b: bl, d }
    if (m !== undefined) entry.m = m
    const key = 'dd:lb:' + board
    // score is the sort key; a tiny time-based fraction ranks earlier equal scores higher
    const sortKey = s + (1 - (d % 1e9) / 1e9) * 0.5
    const isDaily = board.startsWith('dojoDashDaily-')
    const [, , , all] = await redis([
      ['ZADD', key, sortKey, JSON.stringify(entry)],
      ['ZREMRANGEBYRANK', key, 0, -(MAX_KEEP + 1)], // keep only the top 50
      isDaily ? ['EXPIRE', key, DAILY_TTL] : ['PERSIST', key],
      ['ZRANGE', key, 0, -1],
    ])
    // remove anything older than 12 months
    const cutoff = d - RETENTION_MS
    const stale = (Array.isArray(all) ? all : []).filter((raw) => {
      try {
        return (JSON.parse(String(raw)).d || 0) < cutoff
      } catch {
        return true
      }
    })
    if (stale.length) await redis([['ZREM', key, ...stale.map(String)]])
    return json({ ok: true, entry }, 201)
  } catch {
    return unavailable()
  }
}

// Removal requests (privacy notice): DELETE with header "Authorization: Bearer <DD_ADMIN_TOKEN>"
// and body {"n":"Nickname"} removes every entry with that nickname (including team entries) from all
// boards. Disabled unless DD_ADMIN_TOKEN is set.
export async function DELETE(req: NextRequest) {
  const admin = process.env.DD_ADMIN_TOKEN
  if (!admin || req.headers.get('authorization') !== 'Bearer ' + admin) return json({ error: 'forbidden' }, 403)
  if (!KV_URL || !KV_TOKEN) return unavailable()
  let nick = ''
  try {
    nick = clean((await req.json()).n).toLowerCase()
  } catch {}
  if (!nick) return json({ error: 'nickname required' }, 400)
  try {
    const keys: string[] = ['dojoDashLeaderboard', 'dojoDashTeam', 'dojoDashMastery']
    for (let i = -1; i < 15; i++) keys.push('dojoDashDaily-' + new Date(Date.now() - i * 86400000).toISOString().slice(0, 10))
    let removed = 0
    for (const board of keys) {
      const key = 'dd:lb:' + board
      const [all] = await redis([['ZRANGE', key, 0, -1]])
      const hits = (Array.isArray(all) ? all : []).map(String).filter((raw) => {
        try {
          return String(JSON.parse(raw).n).toLowerCase().split(' & ').includes(nick)
        } catch {
          return false
        }
      })
      if (hits.length) {
        await redis([['ZREM', key, ...hits]])
        removed += hits.length
      }
    }
    return json({ ok: true, removed })
  } catch {
    return unavailable()
  }
}
