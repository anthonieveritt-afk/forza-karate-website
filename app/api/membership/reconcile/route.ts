import { NextResponse } from 'next/server'
import { processBillingRequest, recordCardPaid } from '@/lib/gocardless/fulfil'
import { listRecentBillingRequestIds, listRecentCardSignupIds, loadCardOutcome, loadOutcome, loadSignup } from '@/lib/gocardless/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

// Never touch these (pre-fix test sign-ups; mandate since cancelled).
import { SKIP_BILLING_REQUESTS as SKIP } from '@/lib/gocardless/fulfil'

/**
 * Safety net (Vercel Cron): finishes any paid sign-up whose confirmation page was closed
 * early or whose Club Honbu hand-off failed. OFF unless MEMBERSHIP_RECONCILE_ENABLED=1.
 * Only Stripe-paid (new flow) sign-ups from the last 7 days; all steps are idempotent.
 */
export async function GET(req: Request) {
  const secret = process.env.CRON_SECRET?.trim()
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) return new NextResponse('Unauthorized', { status: 401 })
  if (process.env.MEMBERSHIP_RECONCILE_ENABLED !== '1') return NextResponse.json({ ok: true, skipped: 'disabled' })

  const ids = await listRecentBillingRequestIds(Date.now() - 7 * 86400_000)
  const results: Record<string, string> = {}
  for (const id of ids) {
    if (SKIP.has(id)) continue
    try {
      const done = await loadOutcome(id)
      if (done?.honbu.ok) continue
      const s = await loadSignup(id)
      if (!s?.stripe?.paidAt) continue // legacy flow: never auto-process
      const r = await processBillingRequest(id)
      results[id] = r.state === 'done' ? (r.outcome.honbu.ok ? 'recorded' : 'honbu-failed') : r.state === 'pending' ? `pending:${r.status}` : r.state
    } catch (e) {
      console.error('reconcile failed', id, e)
      results[id] = 'error'
    }
  }
  // Card-paid members not yet in Club Honbu (Honbu was down at payment time).
  for (const id of await listRecentCardSignupIds(Date.now() - 7 * 86400_000)) {
    try {
      const c = await loadCardOutcome(id)
      if (!c || c.honbu.ok) continue
      const r = await recordCardPaid(id, c.stripe, { honbuWaits: [0] })
      results[id] = r.state
    } catch (e) {
      console.error('reconcile card failed', id, e)
      results[id] = 'error'
    }
  }
  return NextResponse.json({ ok: true, results })
}
