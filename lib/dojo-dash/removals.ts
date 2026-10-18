// Removal-request queue for the Dojo Dash leaderboard.
// A request holds only: nickname, game mode, an optional approximate date, and an optional
// "I am a parent/carer" tick. No names, emails, messages or contact details.
import { randomBytes } from 'crypto'
import {
  redis, boardKey, allBoards, parseEntry, QUEUE_KEY, LOG_KEY, LOG_MAX, DAY_MS, RETENTION_MS, ymdUTC, type Entry,
} from '@/lib/dojo-dash/store'

export const MODES = ['career', 'daily', 'mastery', 'team', 'unsure'] as const
export type Mode = (typeof MODES)[number]
export type RemovalRequest = { id: string; n: string; mode: Mode; date?: string; parent: boolean; at: number }
export type Removed = { board: string; n: string; s: number; d: string }
export type LogItem = { at: number; id: string; n: string; mode: Mode; date?: string; parent: boolean; removed: Removed[]; result: 'removed' | 'no match' }

export const newRequestId = () => randomBytes(6).toString('hex')

// How close an entry's save date must be to the "approximate date" given in the request.
const DATE_WINDOW_DAYS = 7

function boardsFor(r: RemovalRequest): string[] {
  const all = allBoards()
  if (r.mode === 'career') return ['dojoDashLeaderboard']
  if (r.mode === 'mastery') return ['dojoDashMastery']
  if (r.mode === 'team') return ['dojoDashTeam']
  if (r.mode === 'daily') return all.filter((b) => b.startsWith('dojoDashDaily-'))
  return all
}

export function entryMatches(e: Entry, r: RemovalRequest) {
  const want = r.n.toLowerCase()
  const names = e.n.toLowerCase().split(' & ').map((x) => x.trim())
  if (!names.includes(want)) return false
  if (r.date) {
    const day = Date.parse(r.date + 'T12:00:00Z')
    if (Number.isFinite(day) && Math.abs((e.d || 0) - day) > DATE_WINDOW_DAYS * DAY_MS) return false
  }
  return true
}

export async function readQueue(): Promise<{ raw: string; req: RemovalRequest }[]> {
  const [list] = await redis([['LRANGE', QUEUE_KEY, 0, -1]])
  return (Array.isArray(list) ? list : []).map(String).flatMap((raw) => {
    try {
      return [{ raw, req: JSON.parse(raw) as RemovalRequest }]
    } catch {
      return []
    }
  })
}

export async function readLog(limit = 50): Promise<LogItem[]> {
  const [list] = await redis([['LRANGE', LOG_KEY, 0, limit - 1]])
  return (Array.isArray(list) ? list : []).flatMap((raw) => {
    try {
      return [JSON.parse(String(raw)) as LogItem]
    } catch {
      return []
    }
  })
}

// Find (and unless dryRun, delete) every entry that matches a request.
export async function applyRequest(r: RemovalRequest, dryRun: boolean): Promise<Removed[]> {
  const removed: Removed[] = []
  for (const board of boardsFor(r)) {
    const key = boardKey(board)
    const [all] = await redis([['ZRANGE', key, 0, -1]])
    const hits = (Array.isArray(all) ? all : []).map(String).filter((raw) => {
      const e = parseEntry(raw)
      return !!e && entryMatches(e, r)
    })
    if (!hits.length) continue
    if (!dryRun) await redis([['ZREM', key, ...hits]])
    for (const raw of hits) {
      const e = parseEntry(raw)!
      removed.push({ board, n: e.n, s: e.s, d: ymdUTC(e.d || 0) })
    }
  }
  return removed
}

// Process every queued request: remove matches, write a log line, take the request off the queue.
export async function processQueue(dryRun: boolean) {
  const queue = await readQueue()
  const results: LogItem[] = []
  for (const { raw, req } of queue) {
    const removed = await applyRequest(req, dryRun)
    const item: LogItem = {
      at: Date.now(), id: req.id, n: req.n, mode: req.mode, date: req.date, parent: !!req.parent,
      removed, result: removed.length ? 'removed' : 'no match',
    }
    results.push(item)
    if (!dryRun) {
      await redis([
        ['LPUSH', LOG_KEY, JSON.stringify(item)],
        ['LTRIM', LOG_KEY, 0, LOG_MAX - 1],
        ['LREM', QUEUE_KEY, 1, raw],
      ])
    }
  }
  if (!dryRun) await pruneLog()
  return results
}

// The log is kept for 12 months at most.
async function pruneLog() {
  const [list] = await redis([['LRANGE', LOG_KEY, 0, -1]])
  const cutoff = Date.now() - RETENTION_MS
  const old = (Array.isArray(list) ? list : []).map(String).filter((raw) => {
    try {
      return (JSON.parse(raw).at || 0) < cutoff
    } catch {
      return true
    }
  })
  if (old.length) await redis(old.map((raw) => ['LREM', LOG_KEY, 0, raw]))
}
