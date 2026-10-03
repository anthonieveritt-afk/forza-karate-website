import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getProduct, getUnitPrice } from '@/lib/shop/catalogue'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://forza-karate-website.vercel.app'

// Limits on what one checkout can contain.
const MAX_LINES = 20
const MAX_QTY_PER_LINE = 10

type LineItem = NonNullable<Stripe.Checkout.SessionCreateParams['line_items']>[number]
type RequestedItem = { productKey: string; size: string; quantity: number }

function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 })
}

/**
 * Checks the basket sent by the browser. It may only contain a product key,
 * a size and a quantity; any price it sends is ignored. Returns an error
 * message, or the cleaned items with duplicate lines merged.
 */
function parseItems(body: unknown): { error: string } | { items: RequestedItem[] } {
  const raw = (body as { items?: unknown } | null)?.items
  if (!Array.isArray(raw) || raw.length === 0) return { error: 'Your basket is empty.' }
  if (raw.length > MAX_LINES) return { error: `Please order no more than ${MAX_LINES} different items at once.` }

  const merged = new Map<string, RequestedItem>()
  for (const entry of raw) {
    const { productKey, size, quantity } = (entry ?? {}) as Record<string, unknown>
    if (typeof productKey !== 'string' || typeof size !== 'string') {
      return { error: 'Your basket contains an item we don’t recognise. Please clear it and try again.' }
    }
    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1) {
      return { error: 'Please check the quantities in your basket.' }
    }
    if (getUnitPrice(productKey, size) == null) {
      return { error: 'Your basket contains an item that is no longer available. Please clear it and try again.' }
    }
    const id = `${productKey}|${size}`
    const existing = merged.get(id)
    const total = (existing?.quantity ?? 0) + quantity
    if (total > MAX_QTY_PER_LINE) {
      return { error: `Please order no more than ${MAX_QTY_PER_LINE} of any one item.` }
    }
    merged.set(id, { productKey, size, quantity: total })
  }
  return { items: [...merged.values()] }
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
          name: `${product.name} — ${item.size}`,
          images: [new URL(product.img, SITE_URL).toString()],
          metadata: { productKey: item.productKey, size: item.size },
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
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Stripe checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
