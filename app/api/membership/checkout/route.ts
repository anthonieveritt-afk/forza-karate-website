import { NextResponse } from 'next/server'
import { getForzaStripe, SITE_URL, UNAVAILABLE_MSG } from '@/lib/paid/stripe'
import { PLANS, pounds, proRataLabel, extrasLineItems } from '@/lib/gocardless/plans'
import { verifyTrialJoinToken } from '@/lib/trialJoin'
import { parseMembershipBody } from '@/lib/gocardless/parse-signup'
import { newSignupId, saveSignup, type Signup } from '@/lib/gocardless/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Step A: save signup + open Stripe Checkout for the one-off total
 * (pro-rata first month + kit + licence). Monthly DD is set up after payment.
 */
export async function POST(req: Request) {
  const b = await req.json().catch(() => null)
  const parsed = parseMembershipBody(b)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

  const stripe = getForzaStripe()
  if (!stripe) return NextResponse.json({ error: UNAVAILABLE_MSG, unavailable: true }, { status: 503 })

  const signupId = newSignupId()
  const { signup: core } = parsed
  const oneOff = core.proRataPence + core.extrasPence
  if (oneOff <= 0) return NextResponse.json({ error: 'Nothing to charge.' }, { status: 400 })

  const signup: Signup = {
    ...core,
    signupId,
    trialMemberId: verifyTrialJoinToken(b?.trialToken),
    stripe: null,
    billingRequestId: null,
    createdAt: new Date().toISOString(),
  }

  const origin = new URL(req.url).origin
  const site = SITE_URL || origin
  const names = core.students.map((x) => `${x.firstName} ${x.surname}`).join(', ')
  const extrasLabels = extrasLineItems(core.students).map((i) => i.label).join('; ')

  try {
    // Idempotent create per signupId (retries from the same browser don't double-create).
    const session = await stripe.checkout.sessions.create(
      {
        mode: 'payment',
        customer_email: core.parent.email,
        line_items: [
          {
            quantity: 1,
            price_data: {
              currency: 'gbp',
              unit_amount: core.proRataPence,
              product_data: {
                name: 'First month (pro-rata)',
                description: `${PLANS[core.plan].label} · ${proRataLabel(core.startDate)} from ${core.startDate}`,
              },
            },
          },
          ...(core.extrasPence > 0
            ? [{
                quantity: 1,
                price_data: {
                  currency: 'gbp' as const,
                  unit_amount: core.extrasPence,
                  product_data: {
                    name: 'Karate suit & FKA licence',
                    description: extrasLabels.slice(0, 500) || 'Kit and licence',
                  },
                },
              }]
            : []),
        ],
        metadata: {
          source: 'forza-karate-website',
          kind: 'membership',
          signupId,
          plan: core.plan,
          dojo: core.dojo,
          students: names.slice(0, 450),
          amountPence: String(oneOff),
        },
        custom_text: {
          submit: {
            message:
              'This card payment covers your suit, licence and first (pro-rata) month only. After this you will set up a Direct Debit for monthly membership fees.',
          },
        },
        success_url: `${site}/join/membership/pay-done?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${site}/join/membership?cancelled=1`,
      },
      { idempotencyKey: `membership-checkout-${signupId}` },
    )

    await saveSignup(signupId, {
      ...signup,
      // Session id recorded before pay; paymentIntent filled after success.
      stripe: session.id
        ? { sessionId: session.id, paymentIntentId: null, amountPence: oneOff, paidAt: '' }
        : null,
    })

    if (!session.url) return NextResponse.json({ error: UNAVAILABLE_MSG, unavailable: true }, { status: 503 })
    return NextResponse.json({
      url: session.url,
      signupId,
      oneOffPence: oneOff,
      oneOffLabel: pounds(oneOff),
      monthlyPence: PLANS[core.plan].price,
    })
  } catch (err) {
    console.error('membership checkout error', err)
    return NextResponse.json({ error: UNAVAILABLE_MSG, unavailable: true }, { status: 503 })
  }
}
