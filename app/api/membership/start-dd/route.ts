import { NextResponse, after } from 'next/server'
import { recordCardPaid } from '@/lib/gocardless/fulfil'
import { getForzaStripe } from '@/lib/paid/stripe'
import { gc, gcEnv, gcConfigured, GcError } from '@/lib/gocardless/client'
import { PLANS } from '@/lib/gocardless/plans'
import { loadSignup, saveSignup, type Signup } from '@/lib/gocardless/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Step B (after Stripe success): verify the one-off was paid, then create a
 * GoCardless billing request for a mandate only (no GC one-off payments).
 * Idempotent: reuses an existing BR linked on the signup.
 */
export async function POST(req: Request) {
  const { session_id: sessionId } = await req.json().catch(() => ({}))
  if (typeof sessionId !== 'string' || !sessionId.startsWith('cs_'))
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const stripe = getForzaStripe()
  if (!stripe) return NextResponse.json({ error: 'Card payments are not available.' }, { status: 503 })
  if (!gcConfigured()) return NextResponse.json({ error: 'Direct Debit sign-up is not available yet.' }, { status: 503 })

  let session
  try {
    session = await stripe.checkout.sessions.retrieve(sessionId)
  } catch {
    return NextResponse.json({ error: 'Could not verify payment.' }, { status: 502 })
  }

  if (session.metadata?.kind !== 'membership')
    return NextResponse.json({ error: 'Not a membership payment.' }, { status: 400 })
  if (session.payment_status !== 'paid')
    return NextResponse.json({ error: 'Payment not complete yet.', state: 'unpaid' }, { status: 402 })

  const signupId = session.metadata?.signupId
  if (!signupId || !/^MSU[0-9A-F]+$/i.test(signupId))
    return NextResponse.json({ error: 'Sign-up not found for this payment.' }, { status: 404 })

  const signup = await loadSignup(signupId)
  if (!signup) return NextResponse.json({ error: 'Sign-up details not found.' }, { status: 404 })

  const expected = (signup.proRataPence ?? 0) + signup.extrasPence
  const paid = session.amount_total ?? 0
  if (expected > 0 && paid !== expected) {
    console.error('membership start-dd amount mismatch', { signupId, expected, paid, sessionId })
    return NextResponse.json({ error: 'Payment amount does not match this sign-up.' }, { status: 409 })
  }

  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id ?? null

  const stripeInfo = {
    sessionId: session.id,
    paymentIntentId,
    amountPence: paid,
    paidAt: new Date().toISOString(),
  }

  // Stage 1 (same idempotent function as the Stripe webhook): create the member in Club Honbu now,
  // without making the customer wait for it before the Direct Debit form opens.
  after(() => recordCardPaid(signupId, stripeInfo).catch(e => console.error('recordCardPaid failed', signupId, e)))

  // Already created a BR for this paid signup — return the same flow (idempotent).
  if (signup.billingRequestId) {
    try {
      const { billing_requests: br } = await gc(`/billing_requests/${encodeURIComponent(signup.billingRequestId)}`)
      if (br.status === 'fulfilled') {
        return NextResponse.json({
          billingRequestId: br.id,
          alreadyFulfilled: true,
          environment: gcEnv(),
        })
      }
      if (br.status !== 'cancelled' && br.status !== 'fulfilled') {
        const origin = new URL(req.url).origin
        const { billing_request_flows: flow } = await gc('/billing_request_flows', {
          method: 'POST',
          body: {
            billing_request_flows: {
              redirect_uri: `${origin}/join/membership/done?br=${br.id}`,
              exit_uri: `${origin}/join/membership`,
              lock_customer_details: false,
              show_redirect_buttons: false,
              prefilled_customer: {
                given_name: signup.parent.givenName,
                family_name: signup.parent.familyName,
                email: signup.parent.email,
                address_line1: signup.parent.address,
                city: signup.parent.city,
                postal_code: signup.parent.postCode,
                country_code: 'GB',
              },
              links: { billing_request: br.id },
            },
          },
        })
        const updated: Signup = { ...signup, stripe: stripeInfo }
        await saveSignup(signupId, updated)
        await saveSignup(br.id, { ...updated, billingRequestId: br.id })
        return NextResponse.json({
          billingRequestId: br.id,
          flowId: flow.id,
          environment: gcEnv(),
          startDate: signup.startDate,
        })
      }
    } catch (e) {
      console.error('reuse BR failed, creating new', e)
    }
  }

  try {
    let br: any
    try {
      br = (await gc('/billing_requests', {
        method: 'POST',
        // One BR per paid Stripe session — retries don't create duplicates.
        idempotencyKey: `br-after-stripe-${session.id}`,
        body: {
          billing_requests: {
            mandate_request: {
              scheme: 'bacs',
              currency: 'GBP',
              description: `Forza Karate monthly membership — ${PLANS[signup.plan].label}`,
            },
            // GoCardless allows at most 3 metadata keys (5 caused a 422 in production).
            metadata: {
              signupId,
              plan: signup.plan,
              stripeSessionId: session.id,
            },
          },
        },
      })).billing_requests
    } catch (e) {
      if (e instanceof GcError && e.status === 409) {
        const id = (e.body as any)?.error?.errors?.[0]?.links?.conflicting_resource_id
        if (id) br = (await gc(`/billing_requests/${id}`)).billing_requests
        else throw e
      } else throw e
    }

    const origin = new URL(req.url).origin
    const { billing_request_flows: flow } = await gc('/billing_request_flows', {
      method: 'POST',
      body: {
        billing_request_flows: {
          redirect_uri: `${origin}/join/membership/done?br=${br.id}`,
          exit_uri: `${origin}/join/membership`,
          lock_customer_details: false,
          show_redirect_buttons: false,
          prefilled_customer: {
            given_name: signup.parent.givenName,
            family_name: signup.parent.familyName,
            email: signup.parent.email,
            address_line1: signup.parent.address,
            city: signup.parent.city,
            postal_code: signup.parent.postCode,
            country_code: 'GB',
          },
          links: { billing_request: br.id },
        },
      },
    })

    const updated: Signup = {
      ...signup,
      signupId,
      stripe: stripeInfo,
      billingRequestId: br.id,
    }
    // Save under both keys so fulfil (by BR) and retries (by MSU) work.
    await saveSignup(signupId, updated)
    await saveSignup(br.id, updated)

    return NextResponse.json({
      billingRequestId: br.id,
      flowId: flow.id,
      environment: gcEnv(),
      startDate: signup.startDate,
    })
  } catch (e) {
    console.error('start-dd error', e instanceof GcError ? JSON.stringify(e.body).slice(0, 500) : e)
    return NextResponse.json({ error: 'Your card payment went through, but we could not open the Direct Debit form. Please try again, or contact the club and quote this reference: ' + signupId }, { status: 502 })
  }
}
