// Step 1 of joining: check the form, save the sign-up and open Stripe Checkout for the upfront
// card payment (gi + licence & insurance + first month). The monthly Direct Debit is set up
// after the card payment (see /api/membership/billing-request).
import { NextResponse } from 'next/server'
import { parseSignupBody } from '@/lib/membership/signup'
import { membershipCheckoutParams } from '@/lib/membership/checkout'
import { saveSignupById } from '@/lib/gocardless/store'
import { getForzaStripe, SITE_URL } from '@/lib/paid/stripe'
import { trialLookupEnabled, trialLookupReady, trustedTrials } from '@/lib/membership/trial-lookup'
import { clientIp } from '@/lib/membership/client-ip'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const b = await req.json().catch(() => null)
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
