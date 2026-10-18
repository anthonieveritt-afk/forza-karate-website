// Card-then-Direct-Debit membership sign-up: recording the card payment, the Club Honbu hand-off
// and the confirmation emails. Everything here is idempotent (Stripe and GoCardless can call us
// more than once, and the success page also checks), using lib/paid/once markers for emails.
//
// Order: form -> Stripe Checkout (gi + licence + first month) -> success page -> GoCardless
// Direct Debit (monthly fee only, from the following 1st). The card is taken FIRST so a
// mandate can never exist without the upfront payment: the billing-request route refuses to
// start a Direct Debit until the card payment is confirmed with Stripe. If someone pays by card
// but doesn't finish the Direct Debit, the card payment is still recorded (progress file, Club
// Honbu stage "card_paid_awaiting_direct_debit" and an email to the club) so the club can follow up.
import 'server-only'
import { PLANS, DOJOS, pounds } from '@/lib/gocardless/plans'
import { loadProgress, saveProgress, loadSignupById, type CardPayment, type Signup, type SignupProgress } from '@/lib/gocardless/store'
import { emailConfigured, envAddresses, esc, sendEmail } from '@/lib/email'
import { claimOnce, releaseOnce } from '@/lib/paid/once'
import { upfrontItems } from './signup'

type GcIds = { billingRequestId: string; customerId: string; mandateId: string; subscriptionId: string | null; subscriptionStart: string | null }
type Stage = 'card_paid_awaiting_direct_debit' | 'complete'

const ukDate = (iso: string | null | undefined) =>
  iso ? new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''

/**
 * Club Honbu hand-off for the card-then-DD model. POST CLUB_HONBU_SIGNUP_URL with
 * X-Website-Signup-Secret. Idempotent on signupId (Club Honbu should upsert: the same sign-up is
 * sent at "card_paid_awaiting_direct_debit" and again at "complete").
 */
export async function honbuHandOff(s: Signup, stage: Stage, card: CardPayment | undefined, gcIds: GcIds | null) {
  const url = process.env.CLUB_HONBU_SIGNUP_URL?.trim()
  const secret = process.env.CLUB_HONBU_SIGNUP_SECRET?.trim()
  if (!url || !secret) return { ok: false, detail: 'Club Honbu hand-off not configured (CLUB_HONBU_SIGNUP_URL / CLUB_HONBU_SIGNUP_SECRET)' }
  const up = upfrontItems(s)
  const payload = {
    model: 'card-then-dd', stage, signupId: s.signupId,
    billingRequestId: gcIds?.billingRequestId ?? null,
    plan: s.plan, monthlyFeePence: s.monthlyFeePence ?? PLANS[s.plan].price, fullMonthlyFeePence: PLANS[s.plan].price,
    dojo: s.dojo, clubName: DOJOS[s.dojo], classTime: s.classTime, trialDate: s.trialDate, startDate: s.startDate,
    directDebitStart: gcIds?.subscriptionStart ?? s.directDebitStart ?? null,
    students: s.students, parent: s.parent, emergency: s.emergency, consent: s.consent,
    discount: s.discount ?? null, notes: s.discount?.note,
    payments: {
      card: card ? { provider: 'stripe', sessionId: card.sessionId, paymentIntentId: card.paymentIntentId, amountPence: card.amountPence, paidAt: card.paidAt, livemode: card.livemode, items: up.items } : null,
      directDebit: gcIds ? { provider: 'gocardless', customerId: gcIds.customerId, mandateId: gcIds.mandateId, subscriptionId: gcIds.subscriptionId, startDate: gcIds.subscriptionStart, monthlyPence: s.monthlyFeePence } : null,
    },
    // Kept for the existing contract fields:
    gocardless: gcIds ? { customerId: gcIds.customerId, mandateId: gcIds.mandateId, subscriptionId: gcIds.subscriptionId, firstPaymentId: null, extrasPaymentId: null } : null,
    firstMonth: s.firstMonth ?? null,
    trial: s.trial ?? null,
    firstPaymentPence: s.firstPaymentPence ?? 0, extrasPence: s.extrasPence, upfrontPence: s.upfrontPence ?? up.totalPence,
  }
  try {
    const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'X-Website-Signup-Secret': secret }, body: JSON.stringify(payload), cache: 'no-store' })
    const j = await res.json().catch(() => ({}))
    if (!res.ok) return { ok: false, detail: `Club Honbu ${res.status}: ${String(j?.error ?? '').slice(0, 200)}` }
    return { ok: true, memberIds: j.memberIds as number[] }
  } catch {
    return { ok: false, detail: 'Club Honbu unreachable' }
  }
}

export function summaryLines(s: Signup, card: CardPayment | undefined, ddStart: string | null, ddDone: boolean): string[] {
  const up = upfrontItems(s)
  const fee = s.monthlyFeePence ?? PLANS[s.plan].price
  return [
    `Package: ${PLANS[s.plan].label} (${s.students.length} student${s.students.length > 1 ? 's' : ''})`,
    `Dojo: ${DOJOS[s.dojo]}${s.classTime ? `, ${s.classTime}` : ''}`,
    `Membership starts: ${ukDate(s.startDate)}`,
    ...(s.firstMonth ? [`First month: joining ${s.firstMonth.short}, ${s.firstMonth.percent}% of ${pounds(s.firstMonth.monthlyFullPence)} = ${pounds(s.firstMonth.bandedPence)}${s.discount ? `, ${pounds(s.firstMonth.pence)} after code ${s.discount.code}` : ''}`] : []),
    ...(s.discount ? [`Discount code: ${s.discount.code} (${s.discount.percent}% off training fees only)`] : []),
    '',
    `Paid today by card: ${pounds(card?.amountPence ?? up.totalPence)}${card ? '' : ' (not confirmed yet)'}`,
    ...up.items.map((i) => `  - ${i.label}: ${pounds(i.pricePence)}`),
    '',
    fee > 0
      ? `Monthly training fee: ${pounds(fee)} by Direct Debit on the 1st of each month${ddStart ? `, from ${ukDate(ddStart)}` : ''}${s.discount ? ` (was ${pounds(s.discount.monthlyFullPence)})` : ''}${ddDone ? '' : ' - Direct Debit NOT set up yet'}`
      : `Monthly training fee: £0 with code ${s.discount?.code ?? ''}, so there is no Direct Debit.`,
  ]
}

async function once(key: string, send: () => Promise<boolean>): Promise<boolean> {
  const c = await claimOnce(key)
  if (c === 'duplicate') return true
  const ok = await send()
  if (!ok && c === 'claimed') await releaseOnce(key)
  return ok
}

async function memberEmail(s: Signup, lines: string[]) {
  if (!emailConfigured() || !s.parent.email) return false
  const names = s.students.map((x) => x.firstName).join(', ')
  const text = [`Hi ${s.parent.givenName},`, '', `Thank you for joining Forza Karate Club. Here is the summary of your membership for ${names}:`, '', ...lines, '',
    'Stripe emails a receipt for the card payment, and GoCardless emails to confirm any Direct Debit. Questions? Just reply to this email.', '', 'Oss!', 'Forza Karate Club'].join('\n')
  const r = await sendEmail({ to: s.parent.email, subject: 'Welcome to Forza Karate Club: your membership summary', text, html: `<p>${text.split('\n').map(esc).join('<br/>')}</p>`, replyTo: 'hello@forzakarate.co.uk' })
  if (!r.ok) console.error('[membership] member email failed', r)
  return r.ok
}

async function clubEmail(s: Signup, subject: string, intro: string, lines: string[]) {
  const to = envAddresses('CONTACT_TO_EMAIL')
  if (!emailConfigured() || !to.length) return false
  const text = [intro, '', `Sign-up: ${s.signupId}`, `Parent/guardian: ${s.parent.givenName} ${s.parent.familyName}, ${s.parent.email}, ${s.parent.phone}`,
    `Students: ${s.students.map((x) => `${x.firstName} ${x.surname} (${x.belt}, gi ${x.suit?.size ?? '?'})`).join('; ')}`, '', ...lines].join('\n')
  const r = await sendEmail({ to, subject, text, html: `<p>${text.split('\n').map(esc).join('<br/>')}</p>`, replyTo: s.parent.email })
  if (!r.ok) console.error('[membership] club email failed', r)
  return r.ok
}

/**
 * Records a paid Stripe Checkout session for a sign-up (from the webhook or the success page).
 * The caller must already have checked the session with Stripe (paid, metadata.signupId matches).
 */
export async function recordCardPayment(signupId: string, card: CardPayment): Promise<{ signup: Signup; progress: SignupProgress } | null> {
  const s = await loadSignupById(signupId)
  if (!s) return null
  const progress: SignupProgress = (await loadProgress(signupId)) ?? { signupId, updatedAt: new Date().toISOString() }
  if (!progress.card) progress.card = card
  if (card.amountPence !== s.upfrontPence) console.error('[membership] card amount differs from the sign-up total', signupId, card.amountPence, s.upfrontPence)
  const fee = s.monthlyFeePence ?? PLANS[s.plan].price
  const tag = card.livemode ? '' : ' [TEST]'
  progress.emails = progress.emails ?? {}

  if (fee <= 0) {
    // 100% code: nothing to collect monthly, so the sign-up is complete once the card is paid.
    if (!progress.honbu?.ok || progress.honbu.stage !== 'complete') progress.honbu = { stage: 'complete', ...(await honbuHandOff(s, 'complete', progress.card, null)) }
    const lines = summaryLines(s, progress.card, null, false)
    progress.emails.member = progress.emails.member || await once(`membership-${signupId}-member`, () => memberEmail(s, lines))
    progress.emails.club = progress.emails.club || await once(`membership-${signupId}-club`, () => clubEmail(s, `New member sign-up${s.discount ? ` [code ${s.discount.code}]` : ''}: ${s.parent.familyName}${tag}`,
      `New membership: paid by card, no monthly Direct Debit (training fees £0).${progress.honbu?.ok ? ' Recorded in Club Honbu.' : ` ⚠ NOT recorded in Club Honbu automatically (${progress.honbu?.detail ?? ''}), please add by hand.`}`, lines))
  } else {
    if (!progress.honbu?.ok) progress.honbu = { stage: 'card_paid_awaiting_direct_debit', ...(await honbuHandOff(s, 'card_paid_awaiting_direct_debit', progress.card, null)) }
    const lines = summaryLines(s, progress.card, s.directDebitStart ?? null, false)
    progress.emails.cardClub = progress.emails.cardClub || await once(`membership-${signupId}-cardclub`, () => clubEmail(s, `Card paid, Direct Debit pending: ${s.parent.familyName}${tag}`,
      `A new member has paid ${pounds(progress.card!.amountPence)} by card. Their monthly Direct Debit is the next step; you'll get another email when it's set up. If it never arrives, please follow up.`, lines))
  }
  progress.updatedAt = new Date().toISOString()
  await saveProgress(signupId, progress)
  return { signup: s, progress }
}

/** Called by fulfil once the GoCardless billing request is fulfilled and the subscription exists. */
export async function completeAfterDirectDebit(s: Signup, gcIds: GcIds): Promise<{ ok: boolean; detail?: string; memberIds?: number[] }> {
  const id = s.signupId!
  const progress: SignupProgress = (await loadProgress(id)) ?? { signupId: id, updatedAt: new Date().toISOString() }
  progress.billingRequestId = gcIds.billingRequestId
  if (!progress.honbu?.ok || progress.honbu.stage !== 'complete') progress.honbu = { stage: 'complete', ...(await honbuHandOff(s, 'complete', progress.card, gcIds)) }
  const honbu = progress.honbu
  const lines = summaryLines(s, progress.card, gcIds.subscriptionStart, true)
  progress.emails = progress.emails ?? {}
  progress.emails.member = progress.emails.member || await once(`membership-${id}-member`, () => memberEmail(s, lines))
  progress.emails.club = progress.emails.club || await once(`membership-${id}-club`, () => clubEmail(s, `New member sign-up${s.discount ? ` [code ${s.discount.code}]` : ''}: ${s.parent.familyName}${progress.card && !progress.card.livemode ? ' [TEST]' : ''}`,
    `New membership complete: card paid${progress.card ? '' : ' (⚠ card payment not found, please check Stripe)'} and monthly Direct Debit set up (GoCardless ${gcIds.billingRequestId}).${honbu.ok ? ' Recorded in Club Honbu.' : ` ⚠ NOT recorded in Club Honbu automatically (${honbu.detail ?? ''}), please add by hand.`}`, lines))
  progress.updatedAt = new Date().toISOString()
  await saveProgress(id, progress)
  return honbu
}
