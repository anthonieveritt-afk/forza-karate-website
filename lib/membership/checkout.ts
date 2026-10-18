// Stripe Checkout for the upfront card payment at sign-up (gi + licence & insurance + first month).
import 'server-only'
import type Stripe from 'stripe'
import { PLANS, pounds } from '@/lib/gocardless/plans'
import type { CardPayment, Signup } from '@/lib/gocardless/store'
import { upfrontItems } from './signup'

/** Checkout Session parameters (pure, so tests can assert line items without calling Stripe). */
export function membershipCheckoutParams(s: Signup, siteUrl: string): Stripe.Checkout.SessionCreateParams {
  const up = upfrontItems(s)
  const fee = s.monthlyFeePence ?? PLANS[s.plan].price
  const monthlyNote = fee > 0
    ? `From then on, your monthly fee of ${pounds(fee)} is collected by Direct Debit on the 1st. You'll set that up in the next step.`
    : 'Your training fees are £0 with your code, so there is no monthly Direct Debit.'
  return {
    mode: 'payment',
    customer_email: s.parent.email,
    line_items: up.items.map((i) => ({
      quantity: 1,
      price_data: { currency: 'gbp', unit_amount: i.pricePence, product_data: { name: i.label } },
    })),
    payment_intent_data: { description: `Forza Karate membership sign-up ${s.signupId}`, metadata: { kind: 'membership', signupId: s.signupId! } },
    metadata: {
      source: 'forza-karate-website', kind: 'membership', signupId: s.signupId!,
      plan: s.plan, dojo: s.dojo, upfrontPence: String(up.totalPence), monthlyPence: String(fee),
      ...(s.discount ? { discountCode: s.discount.code, discountPercent: String(s.discount.percent) } : {}),
    },
    custom_text: { submit: { message: `Pay today: licence & insurance, suit and first month. ${monthlyNote}`.slice(0, 1200) } },
    success_url: `${siteUrl}/join/membership/paid?signup=${s.signupId}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/join/membership?cancelled=1`,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
  }
}

/** Retrieves a session from Stripe and returns the card payment if it's paid and belongs to this sign-up. */
export async function paidCardFor(stripe: Stripe, signupId: string, sessionId: string): Promise<CardPayment | null> {
  if (!/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) return null
  const ss = await stripe.checkout.sessions.retrieve(sessionId)
  return cardFromSession(ss, signupId)
}

export function cardFromSession(ss: Stripe.Checkout.Session, signupId: string): CardPayment | null {
  if (ss.metadata?.kind !== 'membership' || ss.metadata?.signupId !== signupId || ss.payment_status !== 'paid') return null
  return {
    signupId, sessionId: ss.id,
    paymentIntentId: typeof ss.payment_intent === 'string' ? ss.payment_intent : ss.payment_intent?.id ?? null,
    amountPence: ss.amount_total ?? 0, livemode: !!ss.livemode, paidAt: new Date((ss.created ?? Date.now() / 1000) * 1000).toISOString(),
  }
}
