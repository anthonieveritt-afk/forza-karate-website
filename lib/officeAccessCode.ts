/**
 * Validate a join-form code against the same store Forza Club Honbu Office uses:
 * GET /api/access-codes/validate, which reads the Office Access Codes JSON file.
 * The valid code itself is never shipped in client bundles.
 */

export const DEFAULT_HONBU_URL = 'https://forza-club-honbu-production.up.railway.app'

export type OfficeAccessCodeResult =
  | { valid: true; discountPercent: number; discountLabel: string }
  | { valid: false; message: string }

function honbuBase(): string {
  const fromUrl = (process.env.CLUB_HONBU_URL || '').trim()
  const fromApi = (process.env.NEXT_PUBLIC_CLUB_HONBU_API || '').trim().replace(/\/api\/?$/, '')
  const raw = fromUrl || fromApi || DEFAULT_HONBU_URL
  return raw.replace(/\/$/, '')
}

export function accessCodesValidateUrl(code: string): string {
  return `${honbuBase()}/api/access-codes/validate?code=${encodeURIComponent(code)}`
}

export function normalizeJoinCode(raw: string | null | undefined): string {
  return (raw ?? '').trim().toUpperCase()
}

export function discountLabelFor(percent: number): string {
  const p = Math.min(100, Math.max(0, Math.round(Number(percent) || 0)))
  return `${p}% off`
}

export function parseOfficeValidateResponse(data: unknown): OfficeAccessCodeResult {
  if (!data || typeof data !== 'object') {
    return { valid: false, message: "That code isn't valid" }
  }
  const row = data as { valid?: unknown; discount_percent?: unknown; reason?: unknown; message?: unknown }
  if (row.valid === true) {
    const percent = Number(row.discount_percent)
    if (!Number.isFinite(percent)) {
      return { valid: false, message: "That code isn't valid" }
    }
    return { valid: true, discountPercent: percent, discountLabel: discountLabelFor(percent) }
  }
  const reason = typeof row.reason === 'string' ? row.reason : typeof row.message === 'string' ? row.message : ''
  if (/limit reached/i.test(reason)) return { valid: false, message: 'This code has reached its use limit' }
  return { valid: false, message: "That code isn't valid" }
}

export async function validateOfficeAccessCode(raw: string | null | undefined, fetchImpl: typeof fetch = fetch): Promise<OfficeAccessCodeResult> {
  const code = normalizeJoinCode(raw)
  if (!code) return { valid: false, message: 'Enter a code to apply it' }
  try {
    const res = await fetchImpl(accessCodesValidateUrl(code), { cache: 'no-store' })
    if (!res.ok) return { valid: false, message: "That code isn't valid" }
    const data = await res.json().catch(() => null)
    return parseOfficeValidateResponse(data)
  } catch {
    return { valid: false, message: "We couldn't check that code just now. Please try again." }
  }
}
