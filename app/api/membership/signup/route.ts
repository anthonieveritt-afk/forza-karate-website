// Step 1 of joining: check the form, save the sign-up and open Stripe Checkout for the upfront
// card payment (gi + licence & insurance + first month). The monthly Direct Debit is set up
// after the card payment (see /api/membership/billing-request).
// With the approval-gated tester code: no Stripe, no GoCardless. The sign-up is held as PENDING
// and Anthoni is emailed Approve / Reject links (lib/membership/tester.ts).
import { NextResponse } from 'next/server'
import { parseSignupBody } from '@/lib/membership/signup'
import { membershipCheckoutParams } from '@/lib/membership/checkout'
import { saveSignupById } from '@/lib/gocardless/store'
import { getForzaStripe, SITE_URL } from '@/lib/paid/stripe'
import { asTesterSignup, codeAttemptLimited, isTesterCode, submitTesterSignup, testerAvailable, RATE_LIMITED_MESSAGE, TESTER_PENDING_MESSAGE } from '@/lib/membership/tester'
import { trialLookupEnabled, trialLookupReady, trustedTrials } from '@/lib/membership/trial-lookup'
import { clientIp } from '@/lib/membership/client-ip'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const b = await req.json().catch(() => null)
  const rawCode = typeof b?.discountCode === 'string' ? b.discountCode.trim() : ''
  // Every submitted code counts towards the same 10-per-10-minutes limit as the "Apply" button.
  if (rawCode && await codeAttemptLimited(req)) return NextResponse.json({ error: RATE_LIMITED_MESSAGE }, { status: 429 })
  // Trial lookup on: names, DOB and trial date come from Club Honbu (re-read now), not the browser.
  let trial: { refs: string[]; trialDate: string; statuses: string[] } | undefined
  if (trialLookupEnabled()) {
    if (!trialLookupReady()) return NextResponse.json({ error: 'Online joining is not available right now. Please email hello@forzakarate.co.uk.' }, { status: 503 })
    if (!b || typeof b !== 'object') return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    const body = b as { trialToken?: unknown; trialRefs?: unknown; students?: unknown; trialDate?: unknown }
    let t: Awaited<ReturnType<typeof trustedTrials>>
    try { t = await trustedTrials(body.trialToken, body.trialRefs, clientIp(req)) }
    catch (e) {
      console.error('[trial-lookup] re-check failed', e instanceof Error ? e.message : 'error')
      return NextResponse.json({ error: 'We could not check your trial booking just now. Please try again in a few minutes.' }, { status: 502 })
    }
    if (!t.ok) return NextResponse.json({ error: t.error }, { status: t.status })
    const sent = Array.isArray(body.students) ? body.students : []
    if (sent.length !== t.trials.length) return NextResponse.json({ error: 'Please choose who is joining from your trial booking.' }, { status: 400 })
    body.students = t.trials.map((tr, i) => ({ ...(sent[i] as object), firstName: tr.firstName, surname: tr.surname, dateOfBirth: tr.dateOfBirth ?? (sent[i] as { dateOfBirth?: string })?.dateOfBirth }))
    body.trialDate = t.trialDate
    trial = { refs: t.trials.map(x => x.trialRef), trialDate: t.trialDate, statuses: t.trials.map(x => x.status) }
  }

  if (rawCode && isTesterCode(rawCode)) {
    if (!testerAvailable()) return NextResponse.json({ error: "Sorry, that discount code isn't valid." }, { status: 400 })
    // Validate the form exactly as for a paid sign-up (without the code), then make everything £0.
    const parsed = parseSignupBody({ ...b, discountCode: '' })
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status })
    const signup = asTesterSignup(parsed.signup)
    if (trial) signup.trial = trial
    try {
      const r = await submitTesterSignup(signup, SITE_URL)
      if (!r.ok) return NextResponse.json({ error: 'We could not send your sign-up for approval. Please try again.' }, { status: 502 })
      return NextResponse.json({ pending: true, message: TESTER_PENDING_MESSAGE, upfrontPence: 0, monthlyFeePence: 0, directDebitStart: null })
    } catch (e) {
      console.error('membership tester signup error', e instanceof Error ? e.message : 'unknown')
      return NextResponse.json({ error: 'We could not send your sign-up for approval. Please try again.' }, { status: 502 })
    }
  }

  const parsed = parseSignupBody(b)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status })
  const signup = parsed.signup
  if (trial) signup.trial = trial

  const stripe = getForzaStripe()
  if (!stripe) return NextResponse.json({ error: 'Online joining is not available right now. Please email hello@forzakarate.co.uk.' }, { status: 503 })
  try {
    const session = await stripe.checkout.sessions.create(membershipCheckoutParams(signup, SITE_URL))
    signup.stripeSessionId = session.id
    await saveSignupById(signup.signupId!, signup)
    return NextResponse.json({ url: session.url, signupId: signup.signupId, upfrontPence: signup.upfrontPence, monthlyFeePence: signup.monthlyFeePence, directDebitStart: signup.directDebitStart })
  } catch (e) {
    console.error('membership signup checkout error', e instanceof Error ? e.message : e)
    return NextResponse.json({ error: 'We could not start the card payment. Please try again.' }, { status: 502 })
  }
}
