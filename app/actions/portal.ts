'use server'

import { cookies } from 'next/headers'

const HONBU_API = process.env.NEXT_PUBLIC_CLUB_HONBU_API ?? 'https://forza-club-honbu-production.up.railway.app/api'
const COOKIE_NAME = 'forza-members-auth'

export async function getMemberPortalData() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    let res: Response
    try {
      res = await fetch(`${HONBU_API}/portal/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeout)
    }
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

export type LicenceUpdate = {
  licenceNumber: string | null
  licenceStartDate: string | null
  licenceExpiryDate: string | null
}

/** Member updates their own licence number / start / expiry in Club Honbu. */
export async function updateMemberLicence(input: LicenceUpdate): Promise<{ ok: true } | { ok: false; error: string }> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return { ok: false, error: 'Your session has expired. Please log in again.' }
  const clean = (v: unknown) => (typeof v === 'string' && v.trim() !== '' ? v.trim() : null)
  const body = {
    licenceNumber: clean(input?.licenceNumber),
    licenceStartDate: clean(input?.licenceStartDate),
    licenceExpiryDate: clean(input?.licenceExpiryDate),
  }
  try {
    const res = await fetch(`${HONBU_API}/portal/licence`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })
    if (res.ok) return { ok: true }
    const d = await res.json().catch(() => ({}))
    return { ok: false, error: typeof d?.error === 'string' ? d.error : 'Could not save your licence details.' }
  } catch {
    return { ok: false, error: 'Could not reach the club system. Please try again.' }
  }
}
