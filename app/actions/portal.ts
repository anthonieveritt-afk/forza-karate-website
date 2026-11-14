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

/** Awards won: only certificates already released by the club (Forza Club Honbu enforces the release time),
 *  plus the next event's release time for the empty state. */
export async function getMemberAwards() {
  const empty = { awards: [], upcoming: null }
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return empty
  try {
    const res = await fetch(`${HONBU_API}/portal/awards`, {
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return empty
    const { normaliseAwards, normaliseUpcoming } = await import('@/lib/members/awards')
    const d = await res.json()
    return { awards: normaliseAwards(d), upcoming: normaliseUpcoming(d) }
  } catch {
    return empty
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


export type LicenceSlipMeta = {
  slipId: number
  fileName: string | null
  licenceNumber: string | null
  startDate: string | null
  expiryDate: string | null
  status: string | null
  /** Sport:80 Sporting licence slip, if one is on file (separate from EKNGB). */
  sporting?: SportingSlipMeta | null
}

export type SportingSlipMeta = {
  slipId: number
  fileName: string | null
  licenceNumber: string | null
  expiryDate: string | null
  status: string | null
}

/** Latest Sport:80 / EKNGB slip for the logged-in member (from Club Honbu). */
export async function getMemberLicenceSlipMeta(): Promise<LicenceSlipMeta | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  try {
    const res = await fetch(`${HONBU_API}/portal/licence`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })
    if (!res.ok) return null
    const data = await res.json()
    const slips: Array<{ id?: number; fileName?: string; kind?: string }> = Array.isArray(data?.slips) ? data.slips : []
    const str = (v: unknown) => (typeof v === 'string' ? v : null)
    const spId = data?.sporting?.slipId
    const sporting: SportingSlipMeta | null =
      typeof spId === 'number' && Number.isInteger(spId) && spId > 0
        ? {
            slipId: spId,
            fileName: str(slips.find((s) => s.id === spId)?.fileName),
            licenceNumber: str(data.sporting.licenceNumber),
            expiryDate: str(data.sporting.expiryDate),
            status: str(data.sporting.status),
          }
        : null
    const slipId = data?.current?.slipId
    if (typeof slipId !== 'number' || !Number.isInteger(slipId) || slipId <= 0) {
      // No EKNGB slip yet, but a Sporting one may still be on file.
      return sporting
        ? { slipId: 0, fileName: null, licenceNumber: null, startDate: null, expiryDate: null, status: null, sporting }
        : null
    }
    const latest = slips.find((s) => s.id === slipId) ?? null
    return {
      sporting,
      slipId,
      fileName: typeof latest?.fileName === 'string' ? latest.fileName : null,
      licenceNumber: typeof data?.current?.licenceNumber === 'string' ? data.current.licenceNumber : null,
      startDate: typeof data?.current?.startDate === 'string' ? data.current.startDate : null,
      expiryDate: typeof data?.current?.expiryDate === 'string' ? data.current.expiryDate : null,
      status: typeof data?.current?.status === 'string' ? data.current.status : null,
    }
  } catch {
    return null
  }
}
