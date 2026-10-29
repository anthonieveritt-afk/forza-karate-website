// Signed post-trial Join now link (approved 29 Oct 2026). Token is minted by Club Honbu when a trialist
// is marked Attended: base64url("<trialId>.<expUnix>") + "." + base64url(HMAC-SHA256). No personal data.
// Env TRIAL_JOIN_SECRET must match Club Honbu's.
import { createHmac, timingSafeEqual } from 'crypto'
import { honbuBase, honbuSecret } from '@/lib/honbu'

export function verifyTrialJoinToken(t: unknown, now = Date.now(), key = (process.env.TRIAL_JOIN_SECRET || '').trim()): number | null {
  if (key.length < 16 || typeof t !== 'string' || t.length > 200) return null
  const [p, sig] = t.split('.')
  if (!p || !sig) return null
  const payload = Buffer.from(p, 'base64url').toString()
  const want = createHmac('sha256', key).update(payload).digest()
  const got = Buffer.from(sig, 'base64url')
  if (got.length !== want.length || !timingSafeEqual(got, want)) return null
  const [id, exp] = payload.split('.').map(Number)
  if (!Number.isInteger(id) || id <= 0 || !(exp * 1000 > now)) return null
  return id
}

export type TrialPrefill = {
  trialMemberId: number; converted: boolean
  student: { firstName: string; surname: string; dateOfBirth: string | null }
  email: string; phone: string; trialDate: string | null; session: string | null
}

export async function fetchTrialPrefill(id: number): Promise<TrialPrefill | null> {
  const secret = honbuSecret()
  if (!secret) return null
  try {
    const r = await fetch(`${honbuBase()}/api/enrolment/trial-prefill/${id}`, {
      headers: { 'X-Website-Signup-Secret': secret }, cache: 'no-store', signal: AbortSignal.timeout(6000),
    })
    return r.ok ? ((await r.json()) as TrialPrefill) : null
  } catch { return null }
}
