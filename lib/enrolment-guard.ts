import { createHmac, randomBytes, timingSafeEqual } from 'crypto'

/** Hidden field name on /join. Bots often fill it; people never see it. */
export const HONEYPOT_FIELD = 'company_url'
export const MIN_FILL_MS = 3000
export const MAX_TOKEN_AGE_MS = 48 * 60 * 60 * 1000

export function enrolmentSecret(): string {
  return (process.env.CLUB_HONBU_WEBHOOK_SECRET || process.env.CRON_SECRET || '').trim()
}

export function issueEnrolmentToken(secret: string, now = Date.now()): string {
  const nonce = randomBytes(8).toString('hex')
  const payload = `${now}.${nonce}`
  const sig = createHmac('sha256', secret).update(payload).digest('base64url')
  return `${payload}.${sig}`
}

export type TokenFail = 'missing' | 'invalid' | 'too_fast' | 'expired'

export function verifyEnrolmentToken(
  token: string,
  secret: string,
  now = Date.now(),
): { ok: true } | { ok: false; reason: TokenFail } {
  if (!token || !secret) return { ok: false, reason: 'missing' }
  const parts = token.split('.')
  if (parts.length !== 3) return { ok: false, reason: 'invalid' }
  const [ts, nonce, sig] = parts
  if (!/^\d+$/.test(ts) || !/^[a-f0-9]{8,}$/.test(nonce) || !sig) return { ok: false, reason: 'invalid' }
  const payload = `${ts}.${nonce}`
  const expected = createHmac('sha256', secret).update(payload).digest('base64url')
  const a = Buffer.from(sig)
  const b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return { ok: false, reason: 'invalid' }
  const issued = Number(ts)
  if (issued > now + 2000) return { ok: false, reason: 'invalid' }
  if (now - issued < MIN_FILL_MS) return { ok: false, reason: 'too_fast' }
  if (now - issued > MAX_TOKEN_AGE_MS) return { ok: false, reason: 'expired' }
  return { ok: true }
}

export type GuardDecision = 'accept' | 'silent_drop' | 'refresh'

/** Honeypot, too-fast, or forged token: silent fake-success. Expired/missing: ask a real person to refresh. */
export function enrolmentGuardDecision(input: {
  honeypot?: string | null
  token?: string | null
  secret: string
  now?: number
}): GuardDecision {
  if ((input.honeypot ?? '').trim() !== '') return 'silent_drop'
  const v = verifyEnrolmentToken(input.token ?? '', input.secret, input.now ?? Date.now())
  if (v.ok) return 'accept'
  if (v.reason === 'too_fast' || v.reason === 'invalid') return 'silent_drop'
  return 'refresh'
}
