// Step 2 of joining (after the card payment): set up the GoCardless Direct Debit for the MONTHLY
// training fee only. Refuses until the card payment for this sign-up is confirmed with Stripe,
// so nobody can end up with a Direct Debit but an unpaid card. Not used when training is £0
// (100% code): then there is no mandate and no subscription at all.
import { NextResponse } from 'next/server'
import { gc, gcEnv, gcConfigured, GcError } from '@/lib/gocardless/client'
import { PLANS } from '@/lib/gocardless/plans'
import { loadProgress, loadSignupById, saveSignup } from '@/lib/gocardless/store'
import { SIGNUP_ID } from '@/lib/membership/signup'
import { paidCardFor } from '@/lib/membership/checkout'
import { recordCardPayment } from '@/lib/membership/flow'
import { getForzaStripe } from '@/lib/paid/stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const b = await req.json().catch(() => null)
  const signupId = typeof b?.signupId === 'string' ? b.signupId : ''
  if (!SIGNUP_ID.test(signupId)) return NextResponse.json({ error: 'Please start from the joining form.' }, { status: 400 })
  if (!gcConfigured()) return NextResponse.json({ error: 'Direct Debit sign-up is not available yet.' }, { status: 503 })

  try {
    const signup = await loadSignupById(signupId)
    if (!signup) return NextResponse.json({ error: 'Sign-up not found. Please start again.' }, { status: 404 })
    const fee = signup.monthlyFeePence ?? PLANS[signup.plan].price
    if (fee <= 0) return NextResponse.json({ error: 'No Direct Debit is needed: your training fees are £0.' }, { status: 409 })

    // The card must be paid first (recorded by the webhook, or confirmed with Stripe now).
    let progress = await loadProgress(signupId)
    if (!progress?.card) {
      const stripe = getForzaStripe()
      const card = stripe && signup.stripeSessionId ? await paidCardFor(stripe, signupId, signup.stripeSessionId) : null
      if (!card) return NextResponse.json({ error: 'Your card payment hasn\'t gone through yet, so the Direct Debit can\'t be set up.' }, { status: 402 })
      progress = (await recordCardPayment(signupId, card))?.progress ?? null
    }

    const { billing_requests: br } = await gc('/billing_requests', {
      method: 'POST', idempotencyKey: `br-${signupId}`,
      body: {
        billing_requests: {
          mandate_request: { scheme: 'bacs', currency: 'GBP', description: `Forza Karate monthly membership — ${PLANS[signup.plan].label}` },
          metadata: { source: 'forza-website-signup', signup: signupId, plan: signup.plan, ...(signup.discount ? { discount: signup.discount.code } : {}) },
        },
      },
    }).catch(async (e) => {
      // Same sign-up retried: reuse the existing billing request.
      const id = e instanceof GcError && e.status === 409 ? (e.body as any)?.error?.errors?.[0]?.links?.conflicting_resource_id : null
      if (id) return gc(`/billing_requests/${id}`)
      throw e
    })
    const origin = new URL(req.url).origin
    const p = signup.parent
    const { billing_request_flows: flow } = await gc('/billing_request_flows', {
      method: 'POST',
      body: {
        billing_request_flows: {
          redirect_uri: `${origin}/join/membership/done?br=${br.id}`,
          exit_uri: `${origin}/join/membership/paid?signup=${signupId}`,
          lock_customer_details: false,
          show_redirect_buttons: false,
          prefilled_customer: {
            given_name: p.givenName, family_name: p.familyName, email: p.email,
            address_line1: p.address, city: p.city, postal_code: p.postCode, country_code: 'GB',
          },
          links: { billing_request: br.id },
        },
      },
    })
    await saveSignup(br.id, signup) // fulfil.ts finds the sign-up by billing request id
    return NextResponse.json({ billingRequestId: br.id, flowId: flow.id, environment: gcEnv(), monthlyFeePence: fee, directDebitStart: signup.directDebitStart ?? null })
  } catch (e) {
    console.error('billing-request error', e instanceof GcError ? JSON.stringify(e.body).slice(0, 500) : e instanceof Error ? e.message : e)
    return NextResponse.json({ error: 'We could not start the Direct Debit set-up. Please try again.' }, { status: 502 })
  }
}
