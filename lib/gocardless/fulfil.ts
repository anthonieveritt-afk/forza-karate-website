// Runs once a billing request is fulfilled (called from the redirect/onSuccess
// handler and from the GoCardless webhook; safe to call more than once).
import 'server-only'
import { gc, GcError } from './client'
import { loadSignup, loadOutcome, saveOutcome, type Outcome, type Signup } from './store'
import { PLANS, DOJOS } from './plans'

/**
 * Club Honbu hand-off. Contract (see club-honbu PR, POST /api/enrolment/website-signup):
 *   Header  X-Website-Signup-Secret: <CLUB_HONBU_SIGNUP_SECRET>
 *   Body    { billingRequestId, plan, monthlyFeePence, dojo, clubName, classTime, trialDate,
 *             startDate, students[], parent{}, emergency{}, consent{},
 *             gocardless: { customerId, mandateId, subscriptionId } }
 *   Returns { ok: true, memberIds: number[] }  (idempotent on billingRequestId)
 * Disabled unless CLUB_HONBU_SIGNUP_URL and CLUB_HONBU_SIGNUP_SECRET are set.
 */
async function handOffToHonbu(brId: string, s: Signup, g: { customerId: string; mandateId: string; subscriptionId: string | null }) {
  const url = process.env.CLUB_HONBU_SIGNUP_URL?.trim()
  const secret = process.env.CLUB_HONBU_SIGNUP_SECRET?.trim()
  if (!url || !secret) return { ok: false, detail: 'Club Honbu hand-off not configured (CLUB_HONBU_SIGNUP_URL / CLUB_HONBU_SIGNUP_SECRET)' }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Website-Signup-Secret': secret },
      body: JSON.stringify({
        billingRequestId: brId,
        plan: s.plan,
        monthlyFeePence: PLANS[s.plan].price,
        dojo: s.dojo,
        clubName: DOJOS[s.dojo],
        classTime: s.classTime,
        trialDate: s.trialDate,
        startDate: s.startDate,
        students: s.students,
        parent: s.parent,
        emergency: s.emergency,
        consent: s.consent,
        gocardless: g,
      }),
      cache: 'no-store',
    })
    const j = await res.json().catch(() => ({}))
    if (!res.ok) return { ok: false, detail: `Club Honbu ${res.status}: ${String(j?.error ?? '').slice(0, 200)}` }
    return { ok: true, memberIds: j.memberIds as number[] }
  } catch (e) {
    return { ok: false, detail: 'Club Honbu unreachable' }
  }
}

export type FulfilResult =
  | { state: 'done'; outcome: Outcome }
  | { state: 'pending'; status: string }
  | { state: 'unknown' }

export async function processBillingRequest(brId: string): Promise<FulfilResult> {
  const existing = await loadOutcome(brId)
  if (existing && existing.honbu.ok) return { state: 'done', outcome: existing }

  const { billing_requests: br } = await gc(`/billing_requests/${encodeURIComponent(brId)}`)
  if (br.status !== 'fulfilled') return { state: 'pending', status: br.status }

  const signup = await loadSignup(brId)
  if (!signup) return { state: 'unknown' }

  const customerId: string = br.links.customer
  const mandateId: string = br.links.mandate_request_mandate

  // Monthly subscription, first collection on the membership start date
  // (the week after the trial), or the mandate's earliest possible charge date if later.
  let subscriptionId: string | null = existing?.subscriptionId ?? null
  let subscriptionStart: string | null = existing?.subscriptionStart ?? null
  if (!subscriptionId) {
    const { mandates: m } = await gc(`/mandates/${mandateId}`)
    const start = [signup.startDate, m.next_possible_charge_date].filter(Boolean).sort().pop() as string
    const names = signup.students.map(x => `${x.firstName} ${x.surname}`).join(', ')
    try {
      const { subscriptions: sub } = await gc('/subscriptions', {
        method: 'POST',
        idempotencyKey: `sub-${brId}`,
        body: {
          subscriptions: {
            amount: PLANS[signup.plan].price,
            currency: 'GBP',
            interval_unit: 'monthly',
            start_date: start,
            name: `Forza Karate membership (${PLANS[signup.plan].label})`.slice(0, 255),
            metadata: { billing_request: brId, students: names.slice(0, 500) },
            links: { mandate: mandateId },
          },
        },
      })
      subscriptionId = sub.id
      subscriptionStart = sub.start_date
    } catch (e) {
      if (e instanceof GcError && e.status === 409) {
        const id = (e.body as any)?.error?.errors?.[0]?.links?.conflicting_resource_id
        if (id) {
          const { subscriptions: sub } = await gc(`/subscriptions/${id}`)
          subscriptionId = sub.id
          subscriptionStart = sub.start_date
        }
      } else throw e
    }
  }

  const honbu = await handOffToHonbu(brId, signup, { customerId, mandateId, subscriptionId })
  const outcome: Outcome = {
    billingRequestId: brId, customerId, mandateId, subscriptionId, subscriptionStart,
    honbu, completedAt: new Date().toISOString(),
  }
  await saveOutcome(brId, outcome)
  return { state: 'done', outcome }
}
