import crypto from 'node:crypto'
import type Stripe from 'stripe'

export const VIDEO_COOKIE = 'forza-video-access'
export const VIDEO_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

function secret(): string | null {
  return process.env.VIDEO_ACCESS_SECRET?.trim() || process.env.FORZA_STRIPE_WEBHOOK_SECRET?.trim() || null
}

/** Signed token "<customerId>.<expiryEpoch>.<hmac>". */
export function signAccess(customerId: string, ttlSeconds = VIDEO_COOKIE_MAX_AGE): string | null {
  const s = secret()
  if (!s) return null
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds
  const payload = `${customerId}.${exp}`
  const mac = crypto.createHmac('sha256', s).update(payload).digest('base64url')
  return `${payload}.${mac}`
}

export function verifyAccess(token: string | undefined | null): string | null {
  const s = secret()
  if (!s || !token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const [cid, exp, mac] = parts
  const expected = crypto.createHmac('sha256', s).update(`${cid}.${exp}`).digest('base64url')
  const a = Buffer.from(mac), b = Buffer.from(expected)
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null
  if (Number(exp) < Date.now() / 1000) return null
  return cid
}

export async function hasActiveVideoSub(stripe: Stripe, customerId: string): Promise<boolean> {
  const subs = await stripe.subscriptions.list({ customer: customerId, status: 'all', limit: 10 })
  return subs.data.some(
    (s) => ['active', 'trialing', 'past_due'].includes(s.status) && s.metadata?.kind === 'video',
  )
}
