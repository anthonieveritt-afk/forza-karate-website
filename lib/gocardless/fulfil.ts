// Runs once a billing request is fulfilled (called from the redirect/onSuccess
// handler and from the GoCardless webhook; safe to call more than once).
import 'server-only'
import { gc, GcError } from './client'
import { sendEmail, envAddresses } from '@/lib/email'
import { honbuSignupUrl, honbuSecret } from '@/lib/honbu'
import { loadSignup, loadOutcome, saveOutcome, loadCardOutcome, saveCardOutcome, type Outcome, type Signup, type CardOutcome, type StripePayment } from './store'
import { PLANS, DOJOS, proRataPence, proRataLabel, firstOfNextMonth, extrasLineItems } from './plans'

/**
 * Club Honbu hand-off: POST /api/enrolment/website-signup (Honbu routes/website-signup.ts).
 *   Header X-Website-Signup-Secret: <CLUB_HONBU_SIGNUP_SECRET>
 * Stripe-first sign-ups use Honbu's "card-then-dd" model, keyed on signupId (MSU…):
 *   1. stage "card_paid_awaiting_direct_debit" right after the card payment → member created now
 *   2. stage "complete" with payments.directDebit {customerId, mandateId, subscriptionId}
 *      → the SAME Honbu record/members are updated and linked (upsert on signup:<id>, advisory-locked).
 * Legacy sign-ups (no Stripe) use the older "dd-only" model keyed on billingRequestId.
 * Honbu also re-uses an existing member with the same name + DOB, so repeats never duplicate.
 */
export type HonbuGc = {
  customerId: string
  mandateId: string
  subscriptionId: string | null
  subscriptionStart?: string | null
  firstPaymentId: string | null
  extrasPaymentId: string | null
  stripeSessionId?: string | null
  stripePaymentIntentId?: string | null
  stripeAmountPence?: number | null
}

export function honbuBody(brId: string | null, s: Signup, g: HonbuGc | null) {
  const stripe = s.stripe?.sessionId
    ? { sessionId: g?.stripeSessionId ?? s.stripe.sessionId, paymentIntentId: g?.stripePaymentIntentId ?? s.stripe.paymentIntentId ?? null, amountPence: g?.stripeAmountPence ?? s.stripe.amountPence ?? null }
    : g?.stripeSessionId ? { sessionId: g.stripeSessionId, paymentIntentId: g.stripePaymentIntentId ?? null, amountPence: g.stripeAmountPence ?? null } : null
  const cardModel = !!(stripe && s.signupId)
  const dd = g ? { customerId: g.customerId, mandateId: g.mandateId, subscriptionId: g.subscriptionId, startDate: g.subscriptionStart ?? undefined,
    firstPaymentId: g.firstPaymentId, extrasPaymentId: g.extrasPaymentId } : null
  return {
    ...(cardModel ? { model: 'card-then-dd', signupId: s.signupId, stage: g ? 'complete' : 'card_paid_awaiting_direct_debit' } : {}),
    ...(brId ? { billingRequestId: brId } : {}),
    plan: s.plan,
    monthlyFeePence: PLANS[s.plan].price,
    dojo: s.dojo,
    clubName: DOJOS[s.dojo],
    classTime: s.classTime,
    trialDate: s.trialDate,
    startDate: s.startDate,
    ...(g?.subscriptionStart ? { directDebitStart: g.subscriptionStart } : {}),
    students: s.students,
    parent: s.parent,
    emergency: s.emergency,
    consent: s.consent,
    ...(dd ? { gocardless: dd } : {}),
    payments: { ...(stripe ? { card: stripe } : {}), ...(dd ? { directDebit: dd } : {}) },
    ...(stripe ? { stripe, paymentReference: stripe.paymentIntentId ?? stripe.sessionId } : {}),
    firstPaymentPence: s.proRataPence ?? proRataPence(PLANS[s.plan].price, s.startDate),
    upfrontPence: stripe?.amountPence ?? undefined,
    extrasPence: s.extrasPence,
    oneOffCollectedVia: stripe ? 'stripe' : 'gocardless',
    // Optional Honbu automations; OFF unless the env flag is exactly "1".
    options: {
      sendPortalAccess: process.env.MEMBERSHIP_AUTO_PORTAL_INVITE === '1',
      enrolOnClass: process.env.MEMBERSHIP_AUTO_ENROL_CLASS === '1',
    },
  }
}

async function handOffOnce(brId: string | null, s: Signup, g: HonbuGc | null) {
  const url = honbuSignupUrl()
  const secret = honbuSecret()
  if (!url || !secret) return { ok: false, detail: 'Club Honbu hand-off not configured (CLUB_HONBU_SIGNUP_SECRET / CLUB_HONBU_WEBHOOK_SECRET)' }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Website-Signup-Secret': secret },
      body: JSON.stringify(honbuBody(brId, s, g)),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })
    const j = await res.json().catch(() => ({}))
    if (!res.ok) return { ok: false, detail: `Club Honbu ${res.status}: ${String(j?.error ?? '').slice(0, 200)}` }
    return { ok: true, memberIds: j.memberIds as number[] }
  } catch {
    return { ok: false, detail: 'Club Honbu unreachable' }
  }
}

/** Hand-off with retries (Honbu is idempotent on billingRequestId, so repeats are safe). */
export async function handOffToHonbu(...args: [...Parameters<typeof handOffOnce>, { waits?: number[] }?]) {
  const opts = (args.length > 3 ? args[3] : undefined) as { waits?: number[] } | undefined
  const waits = opts?.waits ?? [0, 1500, 4000]
  const call = args.slice(0, 3) as Parameters<typeof handOffOnce>
  let last: Awaited<ReturnType<typeof handOffOnce>> = { ok: false, detail: 'not attempted' }
  for (const w of waits) {
    if (w) await new Promise(r => setTimeout(r, w))
    last = await handOffOnce(...call)
    if (last.ok) return last
    // Config errors and 4xx (other than 408/429) won't fix themselves on retry.
    if (/not configured|Club Honbu 4(?!08|29)\d\d/.test(last.detail ?? '')) break
  }
  return last
}

function alertTo() {
  return envAddresses('MEMBERSHIP_ALERT_EMAILS').length ? envAddresses('MEMBERSHIP_ALERT_EMAILS') : envAddresses('CONTACT_TO_EMAIL')
}

async function alertAdmin(brId: string, s: Signup, detail: string) {
  const to = alertTo()
  if (!to.length) { console.error('membership honbu handoff failed (no alert recipients set)', brId, detail); return false }
  const r = await sendEmail({
    to,
    subject: `Action needed: paid membership not added to Club Honbu (${brId})`,
    text: [
      'A membership join was paid but the member could not be created/updated in Club Honbu after retries. Full details are below.',
      `Reference: ${brId}`,
      `Account holder: ${s.parent.givenName} ${s.parent.familyName} <${s.parent.email}>`,
      `Dojo / class: ${s.dojo} / ${s.classTime}`,
      `Students: ${s.students.length}`,
      `Error: ${detail}`,
      '',
      'It will retry automatically next time the confirmation page or GoCardless webhook runs. Otherwise add the member manually in Club Honbu.',
      '',
      ...detailLines(s),
    ].join('\n'),
  })
  if (!r.ok) console.error('membership alert email failed', brId, r)
  return r.ok
}

export type FulfilResult =
  | { state: 'done'; outcome: Outcome }
  | { state: 'pending'; status: string }
  | { state: 'unknown' }

export const SKIP_BILLING_REQUESTS = new Set(['BRQ01M5N9Y05M4AE2YCQ99JT5F2FT'])

/**
 * Idempotent: GoCardless creates use idempotency keys (sub-${brId}) with 409 recovery,
 * Honbu is idempotent on billingRequestId, and a saved outcome with honbu.ok short-circuits.
 * `honbuWaits` lets the user-facing page do a quick single-shot hand-off (webhook/cron retry).
 */
export async function processBillingRequest(brId: string, opts: { honbuWaits?: number[] } = {}): Promise<FulfilResult> {
  if (SKIP_BILLING_REQUESTS.has(brId)) return { state: 'unknown' }
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
    customerId, mandateId, subscriptionId, subscriptionStart, firstPaymentId, extrasPaymentId,
    stripeSessionId, stripePaymentIntentId, stripeAmountPence,
  }, { waits: opts.honbuWaits })
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

/** GoCardless webhook events → same idempotent fulfilment. Returns BR ids processed. */
export async function handleGcEvent(ev: { resource_type?: string; action?: string; links?: Record<string, string> }): Promise<string[]> {
  if (ev.resource_type === 'billing_requests' && ev.action === 'fulfilled' && ev.links?.billing_request) {
    const id = ev.links.billing_request
    if (SKIP_BILLING_REQUESTS.has(id) || !(await loadSignup(id))) return []
    await processBillingRequest(id)
    return [id]
  }
  if (ev.resource_type === 'mandates' && (ev.action === 'created' || ev.action === 'active') && ev.links?.mandate) {
    // Find the website billing request behind this mandate (only ones we have a saved signup for).
    const { mandates: m } = await gc(`/mandates/${encodeURIComponent(ev.links.mandate)}`)
    const { billing_requests: list } = await gc(`/billing_requests?customer=${encodeURIComponent(m.links.customer)}&status=fulfilled&limit=10`)
    const done: string[] = []
    for (const br of list ?? []) {
      if (br.links?.mandate_request_mandate !== ev.links.mandate || SKIP_BILLING_REQUESTS.has(br.id)) continue
      if (!(await loadSignup(br.id))) continue
      await processBillingRequest(br.id)
      done.push(br.id)
    }
    return done
  }
  return []
}

/** Every detail of a sign-up, for the admin backup email (so nothing is lost if Honbu is down). */
function detailLines(s: Signup): string[] {
  return [
    '--- Full sign-up details (backup) ---',
    `Signup: ${s.signupId ?? '?'}  Billing request: ${s.billingRequestId ?? '-'}`,
    `Plan: ${s.plan} (${PLANS[s.plan]?.label ?? ''})  Dojo: ${s.dojo}  Class: ${s.classTime}`,
    `Trial: ${s.trialDate}  Start: ${s.startDate}`,
    `Account holder: ${s.parent.givenName} ${s.parent.familyName} <${s.parent.email}> ${s.parent.phone}`,
    `Address: ${s.parent.address}, ${s.parent.city}, ${s.parent.postCode}`,
    `Emergency: ${s.emergency.name} ${s.emergency.phone}`,
    `Photo consent: ${s.consent.photos ? 'yes' : 'no'}`,
    ...s.students.map((x, i) => `Student ${i + 1}: ${x.firstName} ${x.surname}, DOB ${x.dateOfBirth}, belt ${x.belt}` +
      `${x.medical ? `, medical: ${x.medical}` : ''}${x.suit ? `, suit ${x.suit.key} ${x.suit.size}` : ''}${x.licence ? `, licence ${x.licence.type}` : ''}`),
    s.stripe ? `Card paid: £${(s.stripe.amountPence / 100).toFixed(2)} (Stripe ${s.stripe.sessionId}${s.stripe.paymentIntentId ? ` / ${s.stripe.paymentIntentId}` : ''})` : 'Card: not paid',
  ]
}

export type CardPaidResult = { state: 'recorded' | 'honbu-failed' | 'unknown'; outcome?: CardOutcome }

/**
 * Stage 1, run the moment the card payment succeeds (Stripe webhook + pay-done/start-dd, both safe):
 * keeps a backup (blob + one admin email with every detail) and creates the member in Club Honbu
 * as "card paid, awaiting Direct Debit". Idempotent: a recorded outcome short-circuits; Honbu upserts on signupId.
 * Never writes the signup blob (start-dd owns it), so concurrent runs can't clobber billingRequestId.
 */
export async function recordCardPaid(signupId: string, stripe: StripePayment, opts: { honbuWaits?: number[] } = {}): Promise<CardPaidResult> {
  const existing = await loadCardOutcome(signupId)
  if (existing?.honbu.ok) return { state: 'recorded', outcome: existing }
  const signup = await loadSignup(signupId)
  if (!signup) return { state: 'unknown' }
  const s: Signup = { ...signup, signupId, stripe: signup.stripe?.sessionId ? signup.stripe : stripe }
  // If Direct Debit already finished first, stage 2 handles Honbu (with the mandate) — don't downgrade.
  if (s.billingRequestId) {
    const done = await loadOutcome(s.billingRequestId)
    if (done?.honbu.ok) {
      const o: CardOutcome = { signupId, stripe: s.stripe!, honbu: done.honbu, alertedAt: existing?.alertedAt ?? null, backupEmailedAt: existing?.backupEmailedAt ?? null, at: new Date().toISOString() }
      await saveCardOutcome(signupId, o)
      return { state: 'recorded', outcome: o }
    }
  }
  let backupEmailedAt = existing?.backupEmailedAt ?? null
  const to = alertTo()
  if (!backupEmailedAt && to.length) {
    const r = await sendEmail({ to, subject: `New member paid by card: ${s.parent.givenName} ${s.parent.familyName} (${s.dojo})`,
      text: ['A new membership has been paid by card on the website. Next step for them: Direct Debit set-up.', '', ...detailLines(s)].join('\n') })
    if (r.ok) backupEmailedAt = new Date().toISOString()
    else console.error('membership backup email failed', signupId, r)
  }
  // Save the backup record before calling Honbu, so the details survive whatever happens next.
  const base: CardOutcome = { signupId, stripe: s.stripe!, honbu: existing?.honbu ?? { ok: false, detail: 'not attempted' }, alertedAt: existing?.alertedAt ?? null, backupEmailedAt, at: new Date().toISOString() }
  await saveCardOutcome(signupId, base)
  const honbu = await handOffToHonbu(null, s, null, { waits: opts.honbuWaits })
  let alertedAt = base.alertedAt ?? null
  if (!honbu.ok && !alertedAt) {
    if (await alertAdmin(signupId, s, honbu.detail ?? 'unknown')) alertedAt = new Date().toISOString()
  }
  const outcome: CardOutcome = { ...base, honbu, alertedAt, at: new Date().toISOString() }
  await saveCardOutcome(signupId, outcome)
  return { state: honbu.ok ? 'recorded' : 'honbu-failed', outcome }
}
