// Called by the page Stripe returns to: confirms the card payment with Stripe (doesn't wait for
// the webhook), records it, and says whether a monthly Direct Debit is still needed.
import { NextResponse } from 'next/server'
import { SIGNUP_ID } from '@/lib/membership/signup'
import { paidCardFor } from '@/lib/membership/checkout'
import { recordCardPayment } from '@/lib/membership/flow'
import { loadProgress, loadSignupById } from '@/lib/gocardless/store'
import { getForzaStripe } from '@/lib/paid/stripe'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}))
  const signupId = typeof b?.signupId === 'string' ? b.signupId : ''
  const sessionId = typeof b?.sessionId === 'string' ? b.sessionId : ''
  if (!SIGNUP_ID.test(signupId)) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  const stripe = getForzaStripe()
  if (!stripe) return NextResponse.json({ error: 'Not available' }, { status: 503 })
  try {
    const s = await loadSignupById(signupId)
    if (!s) return NextResponse.json({ error: 'Sign-up not found' }, { status: 404 })
    let progress = await loadProgress(signupId)
    if (!progress?.card) {
      const card = await paidCardFor(stripe, signupId, sessionId || s.stripeSessionId || '')
      if (!card) return NextResponse.json({ paid: false })
      progress = (await recordCardPayment(signupId, card))?.progress ?? null
    }
    const monthly = s.monthlyFeePence ?? 0
    return NextResponse.json({
      paid: true, amountPence: progress?.card?.amountPence ?? s.upfrontPence, monthlyFeePence: monthly,
      needsDirectDebit: monthly > 0 && !progress?.billingRequestId, directDebitStart: s.directDebitStart ?? null,
      discount: s.discount ? { code: s.discount.code, percent: s.discount.percent } : null,
    })
  } catch (e) {
    console.error('membership card-status error', e instanceof Error ? e.message : e)
    return NextResponse.json({ error: 'Could not check the payment yet' }, { status: 502 })
  }
}
