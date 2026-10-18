// Public "Request removal" form handler for the Dojo Dash leaderboard.
// Takes nickname, game mode, optional approximate date and an optional parent/carer tick, and adds them
// to the removal queue. No contact details or free text are accepted or stored.
import { NextRequest } from 'next/server'
import { clean, nickOk, json, unavailable, kvConfigured, redis, rateLimited, readBody, QUEUE_KEY, QUEUE_MAX, DAY_MS } from '@/lib/dojo-dash/store'
import { MODES, newRequestId, readQueue, type Mode, type RemovalRequest } from '@/lib/dojo-dash/removals'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const RECEIVED = { ok: true, message: 'Request received' }

export async function POST(req: NextRequest) {
  if (!kvConfigured()) return json({ error: 'unavailable', fallback: 'email' }, 503)
  const b = await readBody(req, 1024)
  if (!b) return json({ error: 'bad request' }, 400)

  // Honeypot: real people never see or fill this field. Pretend it worked and store nothing.
  if (clean(b.website)) return json(RECEIVED, 200)

  const n = clean(b.n)
  if (!nickOk(n)) return json({ error: 'nickname', message: 'Please enter the nickname exactly as it appeared (up to 12 characters).' }, 422)
  const mode = clean(b.mode) as Mode
  if (!MODES.includes(mode)) return json({ error: 'mode', message: 'Please choose a game mode.' }, 422)
  let date: string | undefined
  if (b.date) {
    date = clean(b.date)
    const t = Date.parse(date + 'T12:00:00Z')
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(t) || t > Date.now() + 2 * DAY_MS || t < Date.now() - 400 * DAY_MS)
      return json({ error: 'date', message: 'Please pick a date within the last year, or leave it blank.' }, 422)
  }
  const parent = b.parent === true

  try {
    if (await rateLimited(req, 'rq', 5, 600)) return json({ error: 'slow down', message: 'Too many requests. Please try again in a few minutes.' }, 429)
    const queue = await readQueue()
    // the same request twice only needs to be queued once
    if (queue.some(({ req: q }) => q.n.toLowerCase() === n.toLowerCase() && q.mode === mode && q.date === date)) return json(RECEIVED, 200)
    const r: RemovalRequest = { id: newRequestId(), n, mode, parent, at: Date.now() }
    if (date) r.date = date
    // RPUSH keeps oldest first; LTRIM caps the queue so it cannot be flooded
    await redis([['RPUSH', QUEUE_KEY, JSON.stringify(r)], ['LTRIM', QUEUE_KEY, -QUEUE_MAX, -1]])
    return json(RECEIVED, 201)
  } catch {
    return json({ error: 'unavailable', fallback: 'email' }, 503)
  }
}

export function GET() {
  return unavailable()
}
