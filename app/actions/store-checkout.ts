'use server'

// Starts a store checkout: validates the basket, prices every line from the
// server-side catalogue and creates a Stripe hosted Checkout Session.
//
// Payment methods are not listed in code, so Stripe shows whatever is turned
// on in Dashboard → Settings → Payment methods (cards, Apple Pay, Google Pay,
// Link, PayPal…). Nothing is shipped: there is no address collection.
//
// The paid order reaches Club Honbu through Stripe's checkout.session.completed
// webhook (Club Honbu /api/webhooks/stripe), using the metadata set below.

import { randomBytes } from 'node:crypto'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { getStoreProduct } from '@/lib/store/catalogue'
import { getCollectionOption } from '@/lib/store/collection'
import {
  MAX_LINES, MAX_QTY_PER_LINE, cleanPersonalisation, describeSelections, lineKey, unitPrice,
  type Selections,
} from '@/lib/store/pricing'

export interface CheckoutLineInput {
  slug: string
  options: Selections
  personalisation?: string
  quantity: number
}

export interface StoreCheckoutInput {
  lines: CheckoutLineInput[]
  studentName: string
  collectionId: string
  guardianConfirmed: boolean
  termsAccepted: boolean
}

export type StoreCheckoutResult = { url: string } | { error: string }

type LineItem = NonNullable<Stripe.Checkout.SessionCreateParams['line_items']>[number]

const ITEM_GONE = 'Something in your basket is no longer available or has changed. Please remove it and add it again.'

function newOrderRef(): string {
  // e.g. FKMG4T2Q-7A3F: short, unique enough, fits Club Honbu's order_ref (varchar 20).
  return `FK${Date.now().toString(36).toUpperCase().slice(-6)}-${randomBytes(2).toString('hex').toUpperCase()}`
}

async function siteUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '')
  // Preview deployments have no NEXT_PUBLIC_SITE_URL: use the host the visitor is on.
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000'
  const proto = h.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https')
  return `${proto}://${host}`
}

function isPlainStringRecord(value: unknown): value is Selections {
  return !!value && typeof value === 'object' && !Array.isArray(value) &&
    Object.values(value as object).every(v => typeof v === 'string')
}

export async function startStoreCheckout(input: StoreCheckoutInput): Promise<StoreCheckoutResult> {
  // ── Customer details ───────────────────────────────────────────────────────
  const studentName = typeof input?.studentName === 'string' ? input.studentName.replace(/\s+/g, ' ').trim() : ''
  if (studentName.length < 2 || studentName.length > 80 || !/^[\p{L}\p{M} '’.\-]+$/u.test(studentName)) {
    return { error: 'Please enter the student’s name (letters, spaces, hyphens and apostrophes only).' }
  }
  const collection = getCollectionOption(input?.collectionId)
  if (!collection) return { error: 'Please choose the class where you’ll collect your order.' }
  if (input.guardianConfirmed !== true) {
    return { error: 'Please confirm you are the student’s parent or guardian, or the student is 18 or over.' }
  }
  if (input.termsAccepted !== true) return { error: 'Please agree to the Terms of Sale.' }

  // ── Basket ─────────────────────────────────────────────────────────────────
  const rawLines = Array.isArray(input?.lines) ? input.lines : []
  if (rawLines.length === 0) return { error: 'Your basket is empty.' }
  if (rawLines.length > MAX_LINES) return { error: `Please order no more than ${MAX_LINES} different items at once.` }

  const merged = new Map<string, { line: CheckoutLineInput; product: NonNullable<Awaited<ReturnType<typeof getStoreProduct>>>; price: number }>()
  for (const raw of rawLines) {
    if (!raw || typeof raw.slug !== 'string' || !isPlainStringRecord(raw.options)) return { error: ITEM_GONE }
    if (typeof raw.quantity !== 'number' || !Number.isInteger(raw.quantity) || raw.quantity < 1) {
      return { error: 'Please check the quantities in your basket.' }
    }
    const product = await getStoreProduct(raw.slug)
    if (!product) return { error: ITEM_GONE }
    const price = unitPrice(product, raw.options)
    if (price == null || price <= 0) return { error: ITEM_GONE }

    let personalisation: string | undefined
    if (product.personalisation) {
      const cleaned = cleanPersonalisation(raw.personalisation, product.personalisation)
      if (!cleaned) return { error: `Please check the ${product.personalisation.label.toLowerCase()} for ${product.name}.` }
      personalisation = cleaned
    } else if (raw.personalisation) {
      return { error: ITEM_GONE }
    }

    const key = lineKey(product.slug, raw.options, personalisation)
    const quantity = (merged.get(key)?.line.quantity ?? 0) + raw.quantity
    if (quantity > MAX_QTY_PER_LINE) return { error: `Please order no more than ${MAX_QTY_PER_LINE} of any one item.` }
    merged.set(key, { line: { slug: product.slug, options: raw.options, personalisation, quantity }, product, price })
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    return { error: 'Online payment isn’t switched on for this version of the site yet.' }
  }

  const base = await siteUrl()
  const orderRef = newOrderRef()

  // Every name and price comes from the server-side catalogue.
  const lineItems: LineItem[] = [...merged.values()].map(({ line, product, price }) => {
    const details = [describeSelections(product, line.options), line.personalisation && `${product.personalisation!.label}: ${line.personalisation}`]
      .filter(Boolean).join(' · ')
    return {
      quantity: line.quantity,
      price_data: {
        currency: 'gbp',
        unit_amount: price,
        product_data: {
          name: product.name,
          ...(details ? { description: details.slice(0, 500) } : {}),
          ...(product.image ? { images: [new URL(product.image, base).toString()] } : {}),
          metadata: {
            slug: product.slug,
            options: JSON.stringify(line.options).slice(0, 500),
            ...(line.personalisation ? { personalisation: line.personalisation } : {}),
          },
        },
      },
    }
  })

  const metadata: Record<string, string> = {
    source: 'forza-karate-website-store',
    orderRef,
    studentName,
    collectionId: collection.id,
    collectionDojo: collection.dojo,
    collectionClass: collection.label.slice(0, 500),
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' })
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      client_reference_id: orderRef,
      metadata,
      payment_intent_data: {
        description: `Forza Karate store order ${orderRef}`,
        metadata,
      },
      locale: 'en-GB',
      // Hold the basket for an hour (Stripe allows 30 minutes to 24 hours).
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60,
      custom_text: {
        submit: {
          message: `Collection only: we’ll bring this order to ${collection.label}. Nothing is posted.`,
        },
      },
      success_url: `${base}/store/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${base}/store/checkout?cancelled=1`,
    })
    if (!session.url) return { error: 'We couldn’t start the payment. Please try again.' }
    return { url: session.url }
  } catch (err) {
    console.error('Store checkout: Stripe session failed', err)
    return { error: 'We couldn’t start the payment. Please try again.' }
  }
}
