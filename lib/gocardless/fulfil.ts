// Runs once a billing request is fulfilled (called from the redirect/onSuccess
// handler and from the GoCardless webhook; safe to call more than once).
import { completeAfterDirectDebit } from '@/lib/membership/flow'
import 'server-only'
import { gc, GcError } from './client'
import { loadSignup, loadOutcome, saveOutcome, loadProgress, type Outcome, type Signup } from './store'
import { PLANS, DOJOS, proRataPence, proRataLabel, firstOfNextMonth, extrasLineItems, pounds } from './plans'
import { emailConfigured, envAddresses, esc, sendEmail } from '@/lib/email'

/**
 * Club Honbu hand-off. Contract (see club-honbu PR, POST /api/enrolment/website-signup):
 *   Header  X-Website-Signup-Secret: <CLUB_HONBU_SIGNUP_SECRET>
 *   Body    { billingRequestId, plan, monthlyFeePence, dojo, clubName, classTime, trialDate,
 *             startDate, students[], parent{}, emergency{}, consent{},
 *             gocardless: { customerId, mandateId, subscriptionId } }
 *   Returns { ok: true, memberIds: number[] }  (idempotent on billingRequestId)
 * Disabled unless CLUB_HONBU_SIGNUP_URL and CLUB_HONBU_SIGNUP_SECRET are set.
 */
async function handOffToHonbu(brId: string, s: Signup, g: { customerId: string; mandateId: string; subscriptionId: string | null; firstPaymentId: string | null; extrasPaymentId: string | null }) {
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
        monthlyFeePence: monthlyFee(s),
        fullMonthlyFeePence: PLANS[s.plan].price,
        discount: s.discount ?? null,
        notes: s.discount ? s.discount.note : undefined,
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
        firstPaymentPence: firstPayment(s),
        extrasPence: s.extrasPence,
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

/** Training fees after any discount code (older saved sign-ups have no discount = full price). */
function monthlyFee(s: Signup): number {
  return typeof s.monthlyFeePence === 'number' ? s.monthlyFeePence : PLANS[s.plan].price
}
function firstPayment(s: Signup): number {
  return typeof s.firstPaymentPence === 'number' ? s.firstPaymentPence : proRataPence(PLANS[s.plan].price, s.startDate)
}

/** Plain-text summary used in both confirmation emails. */
function summaryLines(s: Signup, o: { subscriptionStart: string | null; firstPaymentDate: string | null }): string[] {
  const fee = monthlyFee(s)
  const items = extrasLineItems(s.students)
  return [
    `Package: ${PLANS[s.plan].label} (${s.students.length} student${s.students.length > 1 ? 's' : ''})`,
    `Dojo: ${DOJOS[s.dojo]}${s.classTime ? `, ${s.classTime}` : ''}`,
    `Membership starts: ${s.startDate}`,
    ...(s.discount ? [`Discount code: ${s.discount.code} (${s.discount.percent}% off training fees, saving ${pounds(s.discount.monthlyDiscountPence)} a month)`] : []),
    fee > 0
      ? `Monthly training fee: ${pounds(fee)} by Direct Debit on the 1st${o.subscriptionStart ? `, from ${o.subscriptionStart}` : ''}${s.discount ? ` (was ${pounds(s.discount.monthlyFullPence)})` : ''}`
      : `Monthly training fee: £0 (${s.discount ? s.discount.code : 'no charge'}), so no monthly Direct Debit is set up`,
    `First part-month payment: ${pounds(firstPayment(s))}${o.firstPaymentDate ? ` (from ${o.firstPaymentDate})` : ''}`,
    ...items.map((i) => `${i.label}: ${pounds(i.pricePence)}`),
    `One-off total (gi + licence): ${pounds(s.extrasPence)}`,
  ]
}

async function sendConfirmations(brId: string, s: Signup, o: { subscriptionStart: string | null; firstPaymentDate: string | null }, prev?: { member: boolean; club: boolean }) {
  const done = { member: !!prev?.member, club: !!prev?.club }
  if (!emailConfigured()) return done
  const lines = summaryLines(s, o)
  const names = s.students.map((x) => x.firstName).join(', ')
  if (!done.member && s.parent.email) {
    const text = [`Hi ${s.parent.givenName},`, '', `Thank you for joining Forza Karate Club. Here is a summary of your membership for ${names}:`, '', ...lines, '',
      'GoCardless will also email you to confirm your Direct Debit. Questions? Just reply to this email.', '', 'Oss!', 'Forza Karate Club'].join('\n')
    const r = await sendEmail({ to: s.parent.email, subject: 'Welcome to Forza Karate Club: your membership summary', text, html: `<p>${text.split('\n').map(esc).join('<br/>')}</p>`, replyTo: 'hello@forzakarate.co.uk' })
    done.member = r.ok
  }
  const club = envAddresses('CONTACT_TO_EMAIL')
  if (!done.club && club.length) {
    const text = [`New membership sign-up (GoCardless ${brId})`, '', `Parent/guardian: ${s.parent.givenName} ${s.parent.familyName}, ${s.parent.email}, ${s.parent.phone}`,
      `Students: ${s.students.map((x) => `${x.firstName} ${x.surname} (${x.belt})`).join('; ')}`, '', ...lines].join('\n')
    const r = await sendEmail({ to: club, subject: `New member sign-up${s.discount ? ` [code ${s.discount.code}]` : ''}: ${s.parent.familyName}`, text, html: `<p>${text.split('\n').map(esc).join('<br/>')}</p>`, replyTo: s.parent.email })
    done.club = r.ok
  }
  return done
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

  // Card-then-DD sign-ups (model 'card-then-dd'): the gi, licence and first month were already paid
  // by card (Stripe), so the mandate only carries the monthly subscription from directDebitStart.
  // Legacy sign-ups started before that change (no model) keep the old behaviour: a part-month
  // first payment and a kit/licence payment by Direct Debit, then the subscription.
  const cardFirst = signup.model === 'card-then-dd'
  let subscriptionId: string | null = existing?.subscriptionId ?? null
  let subscriptionStart: string | null = existing?.subscriptionStart ?? null
  let firstPaymentId: string | null = existing?.firstPaymentId ?? null
  let firstPaymentDate: string | null = existing?.firstPaymentDate ?? null
  // Training fees after any discount code (recomputed and stored by the billing-request route).
  const fee = monthlyFee(signup)
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

  // A 100% code makes the training fees £0: GoCardless won't take a £0 payment, so it is skipped.
  if (!cardFirst && !firstPaymentId && firstPayment(signup) > 0) {
    const amount = firstPayment(signup)
    const charge = [signup.startDate, earliest].sort().pop() as string
    let pay: any
    try {
      pay = (await gc('/payments', {
        method: 'POST', idempotencyKey: `prorata-${brId}`,
        body: { payments: {
          amount, currency: 'GBP', charge_date: charge,
          description: `Forza Karate first month (${proRataLabel(signup.startDate)})${signup.discount ? ` - code ${signup.discount.code}` : ''}`.slice(0, 100),
          metadata: { billing_request: brId, kind: 'pro_rata', ...(signup.discount ? { discount: signup.discount.code } : {}) },
          links: { mandate: mandateId },
        } },
      })).payments
    } catch (e) { pay = (await recover(e, '/payments')).payments }
    firstPaymentId = pay.id
    firstPaymentDate = pay.charge_date
  }

  let extrasPaymentId: string | null = existing?.extrasPaymentId ?? null
  if (!cardFirst && !extrasPaymentId && signup.extrasPence > 0) {
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

  // No £0 subscription. (New model: a 100% code never reaches GoCardless at all. Legacy: the mandate
  // stays in place so the club can start a subscription later.)
  if (!subscriptionId && fee > 0) {
    // First 1st after the start date, moved on a month at a time if the mandate can't be charged by then.
    let first = (cardFirst && signup.directDebitStart) || firstOfNextMonth(signup.startDate)
    while (first < earliest) first = firstOfNextMonth(first)
    let sub: any
    try {
      sub = (await gc('/subscriptions', {
        method: 'POST', idempotencyKey: `sub-${brId}`,
        body: { subscriptions: {
          amount: fee, currency: 'GBP', interval_unit: 'monthly', day_of_month: 1, start_date: first,
          name: `Forza Karate membership (${PLANS[signup.plan].label})`.slice(0, 255),
          metadata: { billing_request: brId, students: names.slice(0, 500), ...(signup.discount ? { discount: signup.discount.code } : {}) },
          links: { mandate: mandateId },
        } },
      })).subscriptions
    } catch (e) { sub = (await recover(e, '/subscriptions')).subscriptions }
    subscriptionId = sub.id
    subscriptionStart = sub.start_date
  }

  let honbu: Outcome['honbu']
  let emails: Outcome['emails']
  if (cardFirst && signup.signupId) {
    // Records both payments (card + Direct Debit) in Club Honbu and sends the emails, once each.
    const r = await completeAfterDirectDebit(signup, { billingRequestId: brId, customerId, mandateId, subscriptionId, subscriptionStart })
    honbu = { ok: r.ok, detail: r.detail, memberIds: r.memberIds }
    const pr = await loadProgress(signup.signupId)
    emails = { member: !!pr?.emails?.member, club: !!pr?.emails?.club }
  } else {
    honbu = await handOffToHonbu(brId, signup, { customerId, mandateId, subscriptionId, firstPaymentId, extrasPaymentId })
    emails = await sendConfirmations(brId, signup, { subscriptionStart, firstPaymentDate }, existing?.emails)
  }
  const outcome: Outcome = {
    billingRequestId: brId, customerId, mandateId, subscriptionId, subscriptionStart, firstPaymentId, firstPaymentDate, extrasPaymentId,
    honbu, emails, completedAt: new Date().toISOString(),
  }
  await saveOutcome(brId, outcome)
  return { state: 'done', outcome }
}
