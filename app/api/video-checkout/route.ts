import { NextResponse } from 'next/server'
import { getForzaStripe, SITE_URL, UNAVAILABLE_MSG } from '@/lib/paid/stripe'
import { VIDEO_MONTHLY_PENCE } from '@/lib/paid/catalogue'

export async function POST() {
  const stripe = getForzaStripe()
  if (!stripe) return NextResponse.json({ error: UNAVAILABLE_MSG.replace('booking', 'sign-up'), unavailable: true }, { status: 503 })
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'gbp',
          unit_amount: VIDEO_MONTHLY_PENCE,
          recurring: { interval: 'month' },
          product_data: { name: 'Forza video membership (monthly)' },
        },
      }],
      metadata: { source: 'forza-karate-website', kind: 'video' },
      subscription_data: { metadata: { source: 'forza-karate-website', kind: 'video' } },
      success_url: `${SITE_URL}/members/videos/welcome?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/grading-guides#videos`,
    })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Video checkout error:', err)
    return NextResponse.json({ error: UNAVAILABLE_MSG, unavailable: true }, { status: 503 })
  }
}
