// Step 1 of joining: check the form, save the sign-up and open Stripe Checkout for the upfront
// card payment (gi + licence & insurance + first month). The monthly Direct Debit is set up
// after the card payment (see /api/membership/billing-request).
import { NextResponse } from 'next/server'
import { parseSignupBody } from '@/lib/membership/signup'
import { membershipCheckoutParams } from '@/lib/membership/checkout'
import { saveSignupById } from '@/lib/gocardless/store'
import { getForzaStripe, SITE_URL } from '@/lib/paid/stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const b = await req.json().catch(() => null)
  const parsed = parseSignupBody(b)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status })
  const signup = parsed.signup

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
