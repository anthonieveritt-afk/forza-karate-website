// Pending sign-ups, keyed by GoCardless billing request id.
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
  licence?: { type: string; feePence: number } | null
}

export type Signup = {
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
  createdAt: string
}

export type Outcome = {
  billingRequestId: string
  customerId: string
  mandateId: string
  subscriptionId: string | null
  subscriptionStart: string | null
  firstPaymentId?: string | null
  firstPaymentDate?: string | null
  extrasPaymentId?: string | null
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

async function save(name: string, obj: unknown) {
  await put(`${PREFIX}/${name}`, enc(obj), {
    access: 'public',
    addRandomSuffix: true,
    contentType: 'text/plain',
  })
}

async function load<T>(name: string): Promise<T | null> {
  const { blobs } = await list({ prefix: `${PREFIX}/${name}` })
  if (!blobs.length) return null
  const latest = blobs.sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt))[0]
  const res = await fetch(latest.url, { cache: 'no-store' })
  if (!res.ok) return null
  return dec<T>(await res.text())
}

export const saveSignup = (brId: string, s: Signup) => save(`${brId}.signup`, s)
export const loadSignup = (brId: string) => load<Signup>(`${brId}.signup`)
export const saveOutcome = (brId: string, o: Outcome) => save(`${brId}.done`, o)
export const loadOutcome = (brId: string) => load<Outcome>(`${brId}.done`)
