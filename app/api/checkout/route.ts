import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getProduct, getUnitPrice } from '@/lib/shop/catalogue'
import { parseItems, sessionItemsSummary, stripeProductMetadata, stripeProductName } from '@/lib/shop/checkout'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://forza-karate-website.vercel.app'

type LineItem = NonNullable<Stripe.Checkout.SessionCreateParams['line_items']>[number]

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 })
}

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return badRequest('Invalid request.')
  }

  const parsed = parseItems(body)
  if ('error' in parsed) return badRequest(parsed.error)

  // Every name and price comes from the server-side catalogue.
  const lineItems: LineItem[] = parsed.items.map(item => {
    const product = getProduct(item.productKey)!
    const unitAmount = getUnitPrice(item.productKey, item.size)!
    return {
      price_data: {
        currency: 'gbp',
        product_data: {
          name: stripeProductName(item),
          images: [new URL(product.img, SITE_URL).toString()],
          metadata: stripeProductMetadata(item),
        },
        unit_amount: unitAmount,
      },
      quantity: item.quantity,
    }
  })

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-04-22.dahlia' })
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${SITE_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/shop`,
      metadata: {
        source: 'forza-karate-website',
        items: sessionItemsSummary(parsed.items),
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
