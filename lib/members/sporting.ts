// Sport:80 Sporting licence (separate from the EKNGB membership licence).
// Members can only buy one while their EKNGB licence (Honbu licenceExpiryDate) is valid and in date.
export const SPORTING_LICENCE_PENCE = 3300

export type EkngbStatus = { ok: boolean; expiry: string | null; reason: 'missing' | 'expired' | null }

/** Today's date in UK time as YYYY-MM-DD. */
export function ukToday(now = new Date()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now)
}

export function ekngbStatus(licenceExpiryDate: string | null | undefined, now = new Date()): EkngbStatus {
  const expiry = (licenceExpiryDate ?? '').slice(0, 10)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(expiry)) return { ok: false, expiry: null, reason: 'missing' }
  if (expiry < ukToday(now)) return { ok: false, expiry, reason: 'expired' }
  return { ok: true, expiry, reason: null }
}

export function formatUkDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00Z`)
  return isNaN(d.getTime()) ? iso : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}
