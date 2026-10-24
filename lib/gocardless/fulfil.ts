// Runs once a billing request is fulfilled (called from the redirect/onSuccess
// handler and from the GoCardless webhook; safe to call more than once).
import 'server-only'
import { gc, GcError } from './client'
import { sendEmail, envAddresses } from '@/lib/email'
import { honbuSignupUrl, honbuSecret } from '@/lib/honbu'
import { loadSignup, loadOutcome, saveOutcome, type Outcome, type Signup } from './store'
import { PLANS, DOJOS, proRataPence, proRataLabel, firstOfNextMonth, extrasLineItems } from './plans'

/**
 * Club Honbu hand-off. Contract (see club-honbu PR, POST /api/enrolment/website-signup):
 *   Header  X-Website-Signup-Secret: <CLUB_HONBU_SIGNUP_SECRET>
 *   Body    { billingRequestId, plan, monthlyFeePence, dojo, clubName, classTime, trialDate,
 *             startDate, students[], parent{}, emergency{}, consent{},
 *             gocardless: { customerId, mandateId, subscriptionId },
 *             stripe?: { sessionId, paymentIntentId, amountPence }  // additive; one-off on card
 *             firstPaymentPence, extrasPence }
 *   Returns { ok: true, memberIds: number[] }  (idempotent on billingRequestId)
 * URL/secret: lib/honbu.ts (CLUB_HONBU_SIGNUP_URL / CLUB_HONBU_SIGNUP_SECRET, falling back to the
 * Club Honbu URL and the CLUB_HONBU_WEBHOOK_SECRET the trial bookings already use).
 */
async function handOffOnce(
  brId: string,
  s: Signup,
  g: {
    customerId: string
    mandateId: string
    subscriptionId: string | null
    firstPaymentId: string | null
    extrasPaymentId: string | null
    stripeSessionId?: string | null
    stripePaymentIntentId?: string | null
    stripeAmountPence?: number | null
  },
) {
  const url = honbuSignupUrl()
  const secret = honbuSecret()
  if (!url || !secret) return { ok: false, detail: 'Club Honbu hand-off not configured (CLUB_HONBU_SIGNUP_SECRET / CLUB_HONBU_WEBHOOK_SECRET)' }
  try {
    const stripePayload =
      g.stripeSessionId || s.stripe?.sessionId
        ? {
            sessionId: g.stripeSessionId ?? s.stripe?.sessionId ?? null,
            paymentIntentId: g.stripePaymentIntentId ?? s.stripe?.paymentIntentId ?? null,
            amountPence: g.stripeAmountPence ?? s.stripe?.amountPence ?? null,
          }
        : undefined
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
        gocardless: {
          customerId: g.customerId,
          mandateId: g.mandateId,
          subscriptionId: g.subscriptionId,
          // Legacy GC one-off ids (null when one-off was taken on Stripe).
          firstPaymentId: g.firstPaymentId,
          extrasPaymentId: g.extrasPaymentId,
        },
        ...(stripePayload ? { stripe: stripePayload } : {}),
        firstPaymentPence: s.proRataPence ?? proRataPence(PLANS[s.plan].price, s.startDate),
        extrasPence: s.extrasPence,
        // Explicit: one-off collected by card when stripe is present.
        oneOffCollectedVia: stripePayload ? 'stripe' : 'gocardless',
        // Optional Honbu automations; OFF unless the env flag is exactly "1".
        options: {
          sendPortalAccess: process.env.MEMBERSHIP_AUTO_PORTAL_INVITE === '1',
          enrolOnClass: process.env.MEMBERSHIP_AUTO_ENROL_CLASS === '1',
        },
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

/** Hand-off with retries (Honbu is idempotent on billingRequestId, so repeats are safe). */
export async function handOffToHonbu(...args: Parameters<typeof handOffOnce>) {
  const waits = [0, 1500, 4000]
  let last: Awaited<ReturnType<typeof handOffOnce>> = { ok: false, detail: 'not attempted' }
  for (const w of waits) {
    if (w) await new Promise(r => setTimeout(r, w))
    last = await handOffOnce(...args)
    if (last.ok) return last
    // Config errors and 4xx (other than 408/429) won't fix themselves on retry.
    if (/not configured|Club Honbu 4(?!08|29)\d\d/.test(last.detail ?? '')) break
  }
  return last
}

async function alertAdmin(brId: string, s: Signup, detail: string) {
  const to = envAddresses('MEMBERSHIP_ALERT_EMAILS').length ? envAddresses('MEMBERSHIP_ALERT_EMAILS') : envAddresses('CONTACT_TO_EMAIL')
  if (!to.length) { console.error('membership honbu handoff failed (no alert recipients set)', brId, detail); return false }
  const r = await sendEmail({
    to,
    subject: `Action needed: paid membership not added to Club Honbu (${brId})`,
    text: [
      'A membership join was paid (card + Direct Debit set up) but the member could not be created in Club Honbu after retries.',
      `Billing request: ${brId}`,
      `Account holder: ${s.parent.givenName} ${s.parent.familyName} <${s.parent.email}>`,
      `Dojo / class: ${s.dojo} / ${s.classTime}`,
      `Students: ${s.students.length}`,
      `Error: ${detail}`,
      '',
      'It will retry automatically next time the confirmation page or GoCardless webhook runs. Otherwise add the member manually in Club Honbu.',
    ].join('\n'),
  })
  if (!r.ok) console.error('membership alert email failed', brId, r)
  return r.ok
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

  // New flow: kit + licence + pro-rata first month are charged on Stripe before the
  // billing request is created. GoCardless only holds the mandate + monthly subscription.
  // Legacy signups (no stripe on record) still create GC one-off payments for recovery.
  const paidOnStripe = !!(signup.stripe?.sessionId && signup.stripe.paidAt)

  let subscriptionId: string | null = existing?.subscriptionId ?? null
  let subscriptionStart: string | null = existing?.subscriptionStart ?? null
  let firstPaymentId: string | null = existing?.firstPaymentId ?? null
  let firstPaymentDate: string | null = existing?.firstPaymentDate ?? null
  let extrasPaymentId: string | null = existing?.extrasPaymentId ?? null
  const fee = PLANS[signup.plan].price
  const names = signup.students.map(x => `${x.firstName} ${x.surname}`).join(', ')
  const { mandates: m } = await gc(`/mandates/${mandateId}`)
  const earliest: string = m.next_possible_charge_date ?? signup.startDate

  const recover = async (e: unknown, path: string) => {
    if (e instanceof GcError && e.status === 409) {
      const id = (e.body as any)?.error?.errors?.[0]?.links?.conflicting_resource_id
      if (id) return (await gc(`${path}/${id}`))
    }
    throw e
  }

  if (!paidOnStripe) {
    // Legacy path only — do not use for new Stripe-first signups.
    if (!firstPaymentId) {
      const amount = proRataPence(fee, signup.startDate)
      const charge = [signup.startDate, earliest].sort().pop() as string
      let pay: any
      try {
        pay = (await gc('/payments', {
          method: 'POST', idempotencyKey: `prorata-${brId}`,
          body: { payments: {
            amount, currency: 'GBP', charge_date: charge,
            description: `Forza Karate first month (${proRataLabel(signup.startDate)})`,
            metadata: { billing_request: brId, kind: 'pro_rata' },
            links: { mandate: mandateId },
          } },
        })).payments
      } catch (e) { pay = (await recover(e, '/payments')).payments }
      firstPaymentId = pay.id
      firstPaymentDate = pay.charge_date
    }

    if (!extrasPaymentId && signup.extrasPence > 0) {
      const items = extrasLineItems(signup.students).map(i => i.label).join(', ')
      let pay: any
      try {
        pay = (await gc('/payments', {
          method: 'POST', idempotencyKey: `extras-${brId}`,
          body: { payments: {
            amount: signup.extrasPence, currency: 'GBP', charge_date: earliest,
            description: 'Forza Karate kit and licence',
            metadata: { billing_request: brId, kind: 'kit_licence', items: items.slice(0, 500) },
            links: { mandate: mandateId },
          } },
        })).payments
      } catch (e) { pay = (await recover(e, '/payments')).payments }
      extrasPaymentId = pay.id
    }
  } else {
    // Stripe collected the one-off — never create GC /payments for pro-rata or kit/licence.
    firstPaymentId = null
    firstPaymentDate = null
    extrasPaymentId = null
  }

  if (!subscriptionId) {
    // First 1st after the start date, moved on a month at a time if the mandate can't be charged by then.
    let first = firstOfNextMonth(signup.startDate)
    while (first < earliest) first = firstOfNextMonth(first)
    let sub: any
    try {
      sub = (await gc('/subscriptions', {
        method: 'POST', idempotencyKey: `sub-${brId}`,
        body: { subscriptions: {
          amount: fee, currency: 'GBP', interval_unit: 'monthly', day_of_month: 1, start_date: first,
          name: `Forza Karate membership (${PLANS[signup.plan].label})`.slice(0, 255),
          metadata: { billing_request: brId, students: names.slice(0, 500) },
          links: { mandate: mandateId },
        } },
      })).subscriptions
    } catch (e) { sub = (await recover(e, '/subscriptions')).subscriptions }
    subscriptionId = sub.id
    subscriptionStart = sub.start_date
  }

  const stripeSessionId = signup.stripe?.sessionId ?? existing?.stripeSessionId ?? null
  const stripePaymentIntentId = signup.stripe?.paymentIntentId ?? existing?.stripePaymentIntentId ?? null
  const stripeAmountPence = signup.stripe?.amountPence ?? existing?.stripeAmountPence ?? null

  const honbu = await handOffToHonbu(brId, signup, {
    customerId, mandateId, subscriptionId, firstPaymentId, extrasPaymentId,
    stripeSessionId, stripePaymentIntentId, stripeAmountPence,
  })
  let alertedAt = existing?.alertedAt ?? null
  if (!honbu.ok && !alertedAt) {
    if (await alertAdmin(brId, signup, honbu.detail ?? 'unknown')) alertedAt = new Date().toISOString()
  }
  const outcome: Outcome = {
    billingRequestId: brId, customerId, mandateId, subscriptionId, subscriptionStart,
    alertedAt,
    firstPaymentId, firstPaymentDate, extrasPaymentId,
    stripeSessionId, stripePaymentIntentId, stripeAmountPence,
    honbu, completedAt: new Date().toISOString(),
  }
  await saveOutcome(brId, outcome)
  return { state: 'done', outcome }
}
