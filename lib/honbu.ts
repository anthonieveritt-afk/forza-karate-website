// Club Honbu server-to-server settings (server only).
// The website authenticates to Club Honbu with X-Website-Signup-Secret. It uses CLUB_HONBU_SIGNUP_SECRET
// when set, otherwise the CLUB_HONBU_WEBHOOK_SECRET that trial bookings already use (Club Honbu accepts
// either: WEBSITE_SIGNUP_SECRET or WEBHOOK_SECRET on Railway).
import 'server-only'

export const DEFAULT_HONBU = 'https://forza-club-honbu-production.up.railway.app'
export const honbuBase = () => (process.env.CLUB_HONBU_URL?.trim() || DEFAULT_HONBU).replace(/\/$/, '')
export const honbuSecret = () => process.env.CLUB_HONBU_SIGNUP_SECRET?.trim() || process.env.CLUB_HONBU_WEBHOOK_SECRET?.trim() || ''
export const honbuSignupUrl = () => process.env.CLUB_HONBU_SIGNUP_URL?.trim() || `${honbuBase()}/api/enrolment/website-signup`
export const honbuEventsUrl = () => process.env.CLUB_HONBU_EVENTS_URL?.trim() || `${honbuBase()}/api/website/event-registrations`

type Reg = {
  id: number; sourceId?: string; event: string; firstName: string; lastName: string; email: string; phone: string
  dateOfBirth?: string | null; dojo?: string | null; currentBelt?: string | null; ageGroup?: string | null; parentName?: string | null
  medicalNotes?: string | null; sessionDate?: string | null; paymentStatus?: string | null; stripeSessionId?: string | null; createdAt?: Date | string | null
}

/** Send event registrations to Club Honbu (idempotent there on the website row id). Never throws. */
export async function sendEventRegistrations(rows: Reg[]): Promise<{ ok: boolean; detail?: string; inserted?: number; errors?: number }> {
  const secret = honbuSecret()
  if (!secret) return { ok: false, detail: 'Club Honbu secret not set' }
  try {
    const res = await fetch(honbuEventsUrl(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Website-Signup-Secret': secret },
      body: JSON.stringify({ registrations: rows.map((r) => ({ ...r, sourceId: r.sourceId ?? String(r.id), createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : undefined })) }),
      cache: 'no-store',
    })
    const j = await res.json().catch(() => ({}))
    if (!res.ok) return { ok: false, detail: `Club Honbu ${res.status}: ${String(j?.error ?? '').slice(0, 200)}` }
    return { ok: true, inserted: j.inserted, errors: j.errors }
  } catch {
    return { ok: false, detail: 'Club Honbu unreachable' }
  }
}
