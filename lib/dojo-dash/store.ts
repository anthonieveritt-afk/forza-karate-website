// Shared helpers for the Dojo Dash leaderboard: Upstash Redis REST, rate limits, boards, nickname checks.
import { createHash, randomBytes, timingSafeEqual } from 'crypto'
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import NF from '@/lib/dojo-dash/nickfilter'

const KV_URL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const KV_TOKEN = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
export const kvConfigured = () => !!(KV_URL && KV_TOKEN)

export const FIXED_BOARDS = ['dojoDashLeaderboard', 'dojoDashTeam', 'dojoDashMastery'] as const
export const DAILY_RE = /^dojoDashDaily-(\d{4}-\d{2}-\d{2})$/
export const MAX_KEEP = 50 // cap on stored entries per board
export const NICK_MAX = 12
export const DAILY_TTL = 14 * 86400 // daily boards are deleted after 14 days
export const RETENTION_MS = 365 * 86400 * 1000 // entries older than 12 months are removed
export const DAY_MS = 86400000

// What is stored per entry. `h` is a one-way hash of the removal token given to the player's device.
export type Entry = { n: string; s: number; t: number; b: number; m?: number; d: number; h?: string }
export type PublicEntry = Omit<Entry, 'h'>

export const boardKey = (board: string) => 'dd:lb:' + board
export const QUEUE_KEY = 'dd:rq' // removal requests waiting to be processed
export const LOG_KEY = 'dd:rq:log' // what was removed, and when
export const QUEUE_MAX = 200
export const LOG_MAX = 500

export function json(body: unknown, status = 200, cache = 'no-store') {
  return NextResponse.json(body, { status, headers: { 'Cache-Control': cache } })
}
export const unavailable = () => json({ error: 'leaderboard unavailable', local: true }, 503)

export async function redis(cmds: (string | number)[][]): Promise<unknown[]> {
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

export const ymdUTC = (ms: number) => new Date(ms).toISOString().slice(0, 10)

// Only today's daily board (allowing for time zones) can be written; older ones are read-only.
export function boardOk(board: string, forWrite: boolean): boolean {
  if ((FIXED_BOARDS as readonly string[]).includes(board)) return true
  const m = DAILY_RE.exec(board)
  if (!m) return false
  const day = Date.parse(m[1] + 'T00:00:00Z')
  if (!Number.isFinite(day)) return false
  const diffDays = (day - Date.now()) / DAY_MS
  return forWrite ? diffDays > -2 && diffDays < 1.5 : diffDays > -15 && diffDays < 1.5
}
// every board that can currently hold entries
export function allBoards(): string[] {
  const out: string[] = [...FIXED_BOARDS]
  for (let i = -1; i < 15; i++) out.push('dojoDashDaily-' + ymdUTC(Date.now() - i * DAY_MS))
  return out
}

export const clean = (s: unknown) => String(s ?? '').replace(/\s+/g, ' ').trim()
export function int(v: unknown, lo: number, hi: number): number | null {
  const n = Math.floor(Number(v))
  return Number.isFinite(n) && n >= lo && n <= hi ? n : null
}
export const nickOk = (name: string) => name.length >= 1 && name.length <= NICK_MAX && NF.check(name).ok
export const nickShown = (n: string) => (n.split(' & ').every((x) => NF.check(x).ok) ? n : 'Ninja')

export const newToken = () => randomBytes(16).toString('hex')
export const hashToken = (tk: string) => createHash('sha256').update('dd-rm:' + tk).digest('hex').slice(0, 32)
export const TOKEN_RE = /^[0-9a-f]{32}$/

// Rate limit using a salted one-way hash of the connection address that changes every day. The key is
// held in Redis only for the length of the window, then deleted. The address itself is never stored or logged.
export async function rateLimited(req: NextRequest, bucket: string, max: number, windowSec: number) {
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'anon'
  const day = ymdUTC(Date.now())
  const rk = 'dd:rl:' + bucket + ':' + createHash('sha256').update((process.env.DD_RATE_SALT || 'dojo') + day + ip).digest('hex').slice(0, 24)
  const [cnt] = await redis([['INCR', rk], ['EXPIRE', rk, windowSec, 'NX']])
  return Number(cnt) > max
}

export function parseEntry(raw: unknown): Entry | null {
  try {
    const e = JSON.parse(String(raw))
    return e && typeof e.n === 'string' && typeof e.s === 'number' ? (e as Entry) : null
  } catch {
    return null
  }
}
export function toPublic(e: Entry): PublicEntry {
  const { h: _h, ...rest } = e // never send the token hash out
  void _h
  return { ...rest, n: nickShown(rest.n) }
}

export async function readBody(req: NextRequest, max: number): Promise<Record<string, unknown> | null> {
  try {
    const text = await req.text()
    if (text.length > max) return null
    const b = JSON.parse(text || '{}')
    return b && typeof b === 'object' && !Array.isArray(b) ? b : null
  } catch {
    return null
  }
}

export function isAdmin(req: NextRequest) {
  const admin = process.env.DD_ADMIN_TOKEN
  if (!admin || admin.length < 16) return false
  const got = req.headers.get('authorization') || ''
  const a = Buffer.from(got), b = Buffer.from('Bearer ' + admin)
  return a.length === b.length && timingSafeEqual(a, b)
}
