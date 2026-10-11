import { NextRequest, NextResponse } from 'next/server'
import { getForzaStripe, SITE_URL, UNAVAILABLE_MSG } from '@/lib/paid/stripe'
import { BELTS, getBelt, GUIDE_BUNDLE_PRICE_PENCE, GUIDE_PRICE_PENCE } from '@/lib/paid/catalogue'

export async function POST(req: NextRequest) {
  let body: { belt?: unknown }
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }) }
  const slug = typeof body.belt === 'string' ? body.belt : ''
  const bundle = slug === 'bundle'
  const belt = bundle ? null : getBelt(slug)
  if (!bundle && !belt) return NextResponse.json({ error: 'Please choose a guide.' }, { status: 400 })

  const stripe = getForzaStripe()
  if (!stripe) return NextResponse.json({ error: UNAVAILABLE_MSG.replace('booking', 'purchasing'), unavailable: true }, { status: 503 })

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'gbp',
          unit_amount: bundle ? GUIDE_BUNDLE_PRICE_PENCE : GUIDE_PRICE_PENCE,
          product_data: bundle
            ? { name: `Forza grading guides — all ${BELTS.length} belts (PDF)` }
            : { name: `Forza grading guide — ${belt!.grade} ${belt!.name} (PDF)` },
        },
      }],
      metadata: { source: 'forza-karate-website', kind: 'guide', guides: bundle ? 'bundle' : belt!.slug },
      success_url: `${SITE_URL}/grading-guides/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/grading-guides`,
    })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Guides checkout error:', err)
    return NextResponse.json({ error: UNAVAILABLE_MSG, unavailable: true }, { status: 503 })
  }
}
