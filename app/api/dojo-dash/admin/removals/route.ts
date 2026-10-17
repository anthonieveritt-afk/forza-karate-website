// Admin endpoint for the Dojo Dash removal queue. Needs "Authorization: Bearer <DD_ADMIN_TOKEN>".
// Disabled (403) unless DD_ADMIN_TOKEN is set (16+ characters).
//
// GET                          pending requests, what each would remove, and the latest log lines
// POST {"action":"process"}    remove matching entries for every pending request, log them, clear the queue
//      add "dryRun": true      to see what would happen without changing anything
// POST {"action":"remove","n":"Nickname","mode":"unsure"}   remove one nickname directly (logged)
import { NextRequest } from 'next/server'
import { clean, json, unavailable, kvConfigured, isAdmin, readBody, redis, LOG_KEY, LOG_MAX } from '@/lib/dojo-dash/store'
import { MODES, applyRequest, newRequestId, processQueue, readLog, readQueue, type LogItem, type Mode, type RemovalRequest } from '@/lib/dojo-dash/removals'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return json({ error: 'forbidden' }, 403)
  if (!kvConfigured()) return unavailable()
  try {
    const queue = await readQueue()
    const pending = []
    for (const { req: r } of queue) pending.push({ ...r, wouldRemove: await applyRequest(r, true) })
    return json({ pending, log: await readLog(50) })
  } catch {
    return unavailable()
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return json({ error: 'forbidden' }, 403)
  if (!kvConfigured()) return unavailable()
  const b = (await readBody(req, 1024)) || {}
  try {
    if (b.action === 'process') {
      const results = await processQueue(b.dryRun === true)
      return json({ ok: true, dryRun: b.dryRun === true, processed: results.length, removedEntries: results.reduce((a, r) => a + r.removed.length, 0), results })
    }
    if (b.action === 'remove') {
      const n = clean(b.n)
      const mode = (clean(b.mode) || 'unsure') as Mode
      if (!n || n.length > 25 || !MODES.includes(mode)) return json({ error: 'bad request' }, 400)
      const r: RemovalRequest = { id: 'admin-' + newRequestId(), n, mode, parent: false, at: Date.now() }
      const removed = await applyRequest(r, false)
      const item: LogItem = { at: Date.now(), id: r.id, n, mode, parent: false, removed, result: removed.length ? 'removed' : 'no match' }
      await redis([['LPUSH', LOG_KEY, JSON.stringify(item)], ['LTRIM', LOG_KEY, 0, LOG_MAX - 1]])
      return json({ ok: true, ...item })
    }
    return json({ error: 'unknown action' }, 400)
  } catch {
    return unavailable()
  }
}
