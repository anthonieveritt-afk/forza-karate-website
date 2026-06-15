import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://forza-karate-website.vercel.app'

export async function POST(req: NextRequest) {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2026-04-22.dahlia' })
    const { items } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    const lineItems = items.map((item: {
      name: string
      size: string
      price: number
      priceLabel: string
      img: string
      quantity: number
    }) => ({
      price_data: {
        currency: 'gbp',
        product_data: {
          name: `${item.name} — ${item.size}`,
          images: item.img.startsWith('http') ? [item.img] : [],
        },
        unit_amount: item.price,
      },
      quantity: item.quantity,
    }))

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${SITE_URL}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/shop`,
      metadata: {
        source: 'forza-karate-website',
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
