// POST /api/admin/honbu-sync — re-sends website data to Club Honbu (idempotent on the Club Honbu side).
// Auth: X-Website-Signup-Secret must equal the Club Honbu secret (lib/honbu.ts). Server-to-server only.
//   ?events=1          send every event registration in the website database (backfill / catch-up)
//   ?signups=1         list Direct Debit sign-ups whose Club Honbu hand-off failed (dry run)
//   ?signups=1&apply=1 re-send those to Club Honbu. Uses only the saved GoCardless ids: it never calls
//                      GoCardless and never creates payments, mandates or subscriptions.
// Responses contain counts and ids only, never names.
import { timingSafeEqual } from 'crypto'
import { list } from '@vercel/blob'
import { asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { eventRegistrations } from '@/lib/db/schema'
import { honbuSecret, sendEventRegistrations } from '@/lib/honbu'
import { handOffToHonbu } from '@/lib/gocardless/fulfil'
import { loadOutcome, loadSignup, saveOutcome } from '@/lib/gocardless/store'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

function authorised(req: Request): boolean {
  const expected = honbuSecret()
  const got = req.headers.get('x-website-signup-secret') ?? ''
  if (!expected || !got) return false
  const a = Buffer.from(got), b = Buffer.from(expected)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(req: Request) {
  if (!authorised(req)) return Response.json({ error: 'Unauthorised' }, { status: 401 })
  const url = new URL(req.url)
  const out: Record<string, unknown> = {}

  if (url.searchParams.get('events') === '1') {
    const rows = await db.select().from(eventRegistrations).orderBy(asc(eventRegistrations.id))
    let inserted = 0, errors = 0, failedBatches = 0
    for (let i = 0; i < rows.length; i += 200) {
      const r = await sendEventRegistrations(rows.slice(i, i + 200))
      if (!r.ok) { failedBatches++; out.eventsDetail = r.detail; continue }
      inserted += r.inserted ?? 0; errors += r.errors ?? 0
    }
    out.events = { total: rows.length, inserted, errors, failedBatches }
  }

  if (url.searchParams.get('signups') === '1') {
    const apply = url.searchParams.get('apply') === '1'
    const brIds = new Set<string>()
    let cursor: string | undefined
    do {
      const page = await list({ prefix: 'membership-signups/', cursor, limit: 1000 })
      for (const b of page.blobs) { const m = /membership-signups\/(BRQ[A-Z0-9]+)\.done/.exec(b.pathname); if (m) brIds.add(m[1]) }
      cursor = page.hasMore ? page.cursor : undefined
    } while (cursor)
    const pending: string[] = [], sent: string[] = [], failed: { id: string; detail?: string }[] = []
    let okAlready = 0
    for (const id of brIds) {
      const o = await loadOutcome(id)
      if (!o) continue
      if (o.honbu?.ok) { okAlready++; continue }
      pending.push(id)
      if (!apply) continue
      const s = await loadSignup(id)
      if (!s) { failed.push({ id, detail: 'sign-up details not found' }); continue }
      const honbu = await handOffToHonbu(id, s, { customerId: o.customerId, mandateId: o.mandateId, subscriptionId: o.subscriptionId, firstPaymentId: o.firstPaymentId ?? null, extrasPaymentId: o.extrasPaymentId ?? null })
      if (honbu.ok) { await saveOutcome(id, { ...o, honbu }); sent.push(id) } else failed.push({ id, detail: honbu.detail })
    }
    out.signups = { completedSignups: brIds.size, alreadyInHonbu: okAlready, notInHonbu: pending.length, pendingIds: pending, ...(apply ? { sent: sent.length, failed } : { dryRun: true }) }
  }

  return Response.json({ ok: true, ...out })
}
