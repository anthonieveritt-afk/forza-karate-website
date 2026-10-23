// Pending sign-ups, keyed by GoCardless billing request id (BRQ…) or provisional
// signup id (MSU…) before Stripe/GoCardless complete.
// Stored in Vercel Blob, AES-256-GCM encrypted with SIGNUP_ENCRYPTION_KEY, so the
// (unguessable) blob URL alone reveals nothing.
import 'server-only'
import { createCipheriv, createDecipheriv, randomBytes, createHash } from 'crypto'
import { put, list } from '@vercel/blob'
import type { PlanKey, DojoKey } from './plans'

export type Student = {
  firstName: string
  surname: string
  dateOfBirth: string
  belt: string
  medical?: string
  suit?: { key: string; size: string; pricePence: number } | null
  licence?: { type: string; feePence: number; expiry?: string } | null
}

export type StripePayment = {
  sessionId: string
  paymentIntentId: string | null
  amountPence: number
  paidAt: string
}

export type Signup = {
  /** Provisional id (MSU…) before a billing request exists; kept after BR is linked. */
  signupId?: string
  plan: PlanKey
  dojo: DojoKey
  classTime: string
  trialDate: string
  startDate: string
  students: Student[]
  parent: { givenName: string; familyName: string; email: string; phone: string; address: string; city: string; postCode: string }
  emergency: { name: string; phone: string }
  consent: { photos: boolean; terms: boolean }
  extrasPence: number
  /** Pro-rata first month in pence (charged via Stripe with extras). */
  proRataPence?: number
  /** One-off Stripe charge (kit + licence + pro-rata). Set after Checkout succeeds. */
  stripe?: StripePayment | null
  /** Linked once the GoCardless billing request is created after Stripe. */
  billingRequestId?: string | null
  createdAt: string
}

export type Outcome = {
  billingRequestId: string
  customerId: string
  mandateId: string
  subscriptionId: string | null
  subscriptionStart: string | null
  /** Legacy GoCardless one-off ids (null when one-off was taken on Stripe). */
  firstPaymentId?: string | null
  firstPaymentDate?: string | null
  extrasPaymentId?: string | null
  stripeSessionId?: string | null
  stripePaymentIntentId?: string | null
  stripeAmountPence?: number | null
  honbu: { ok: boolean; detail?: string; memberIds?: number[] }
  completedAt: string
}

function key(): Buffer {
  const k = process.env.SIGNUP_ENCRYPTION_KEY
  if (!k) throw new Error('SIGNUP_ENCRYPTION_KEY not set')
  return createHash('sha256').update(k).digest()
}

function enc(obj: unknown): string {
  const iv = randomBytes(12)
  const c = createCipheriv('aes-256-gcm', key(), iv)
  const data = Buffer.concat([c.update(JSON.stringify(obj), 'utf8'), c.final()])
  return Buffer.concat([iv, c.getAuthTag(), data]).toString('base64')
}

function dec<T>(b64: string): T {
  const buf = Buffer.from(b64, 'base64')
  const d = createDecipheriv('aes-256-gcm', key(), buf.subarray(0, 12))
  d.setAuthTag(buf.subarray(12, 28))
  return JSON.parse(Buffer.concat([d.update(buf.subarray(28)), d.final()]).toString('utf8'))
}

const PREFIX = 'membership-signups'
type Kind = 'signup' | 'done'

/**
 * Pathnames:
 * - Preferred (exact): membership-signups/${id}.signup | .done
 * - Legacy (addRandomSuffix: true treated ".signup"/".done" as the extension):
 *   membership-signups/${id}-<random>.signup | .done
 *
 * load() lists by prefix `${PREFIX}/${id}` (not `…/${id}.signup`) so both
 * forms are found; exact match wins when both exist.
 * id is either BRQ… or MSU… (provisional signup id).
 */
async function save(id: string, kind: Kind, obj: unknown) {
  await put(`${PREFIX}/${id}.${kind}`, enc(obj), {
    access: 'public',
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: 'text/plain',
  })
}

function matchesKind(pathname: string, id: string, kind: Kind): boolean {
  const exact = `${PREFIX}/${id}.${kind}`
  if (pathname === exact) return true
  const rest = pathname.startsWith(`${PREFIX}/`) ? pathname.slice(PREFIX.length + 1) : pathname
  return rest.startsWith(`${id}-`) && rest.endsWith(`.${kind}`)
}

async function load<T>(id: string, kind: Kind): Promise<T | null> {
  const { blobs } = await list({ prefix: `${PREFIX}/${id}` })
  const matches = blobs.filter((b) => matchesKind(b.pathname, id, kind))
  if (!matches.length) return null
  const exactPath = `${PREFIX}/${id}.${kind}`
  const exact = matches.find((b) => b.pathname === exactPath)
  const latest =
    exact ??
    matches.sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))[0]
  const res = await fetch(latest.url, { cache: 'no-store' })
  if (!res.ok) return null
  return dec<T>(await res.text())
}

/** New provisional signup id (before Stripe / GoCardless). */
export function newSignupId(): string {
  return `MSU${randomBytes(12).toString('hex').toUpperCase()}`
}

export const saveSignup = (id: string, s: Signup) => save(id, 'signup', s)
export const loadSignup = (id: string) => load<Signup>(id, 'signup')
export const saveOutcome = (brId: string, o: Outcome) => save(brId, 'done', o)
export const loadOutcome = (brId: string) => load<Outcome>(brId, 'done')
