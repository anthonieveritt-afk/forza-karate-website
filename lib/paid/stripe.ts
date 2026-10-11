import Stripe from 'stripe'

// Forza's own Stripe account (separate from the shop's STRIPE_SECRET_KEY).
// Use a restricted key (rk_test_… / rk_live_…) or a secret key (sk_test_… / sk_live_…).
// Test-mode keys work end-to-end with Stripe test cards (4242 4242 4242 4242).

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://forza-karate-website.vercel.app').replace(/\/$/, '')
// No club phone is published on the site; set FORZA_CLUB_PHONE to include one.
export const CLUB_PHONE = process.env.FORZA_CLUB_PHONE?.trim() || ''
export const CLUB_EMAIL = 'hello@forzakarate.co.uk'
export const UNAVAILABLE_MSG = CLUB_PHONE
  ? `Sorry, online booking is temporarily unavailable. Please call us on ${CLUB_PHONE} or email ${CLUB_EMAIL} and we'll book you in.`
  : `Sorry, online booking is temporarily unavailable. Please get in touch on ${CLUB_EMAIL} or via our contact page and we'll book you in.`

export function forzaStripeKey(): string | null {
  return process.env.FORZA_STRIPE_SECRET_KEY?.trim() || null
}

export function stripeTestMode(): boolean {
  const k = forzaStripeKey() || ''
  return /^(sk|rk)_test_/.test(k)
}

/** Returns a Stripe client, or null when FORZA_STRIPE_SECRET_KEY isn't set. */
export function getForzaStripe(): Stripe | null {
  const key = forzaStripeKey()
  if (!key) return null
  // STRIPE_API_HOST/PORT/PROTOCOL exist only so tests can point at a local mock.
  const host = process.env.STRIPE_API_HOST
  return new Stripe(key, {
    apiVersion: '2026-04-22.dahlia',
    ...(host
      ? {
          host,
          port: Number(process.env.STRIPE_API_PORT || 443),
          protocol: (process.env.STRIPE_API_PROTOCOL as 'http' | 'https') || 'https',
        }
      : {}),
  })
}
