'use server'

export interface TrialBookingData {
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  dojo: string
  classTime: string
  parentName?: string
  medicalNotes?: string
  ageGroup?: string
  preferredDojo?: string
  message?: string
  childName?: string
}

const DEFAULT_HONBU = 'https://forza-club-honbu-production.up.railway.app'
const CONTACT = 'hello@forzakarate.co.uk'

function splitName(full: string): { first: string; last: string } {
  const parts = (full || '').trim().split(/\s+/)
  const first = parts[0] || ''
  const last = parts.slice(1).join(' ') || first
  return { first, last }
}

export async function submitTrialBooking(data: TrialBookingData): Promise<void> {
  const honbuUrl = (process.env.CLUB_HONBU_URL || DEFAULT_HONBU).replace(/\/$/, '')
  const honbuSecret = process.env.CLUB_HONBU_WEBHOOK_SECRET?.trim()

  if (!honbuSecret) {
    console.error(
      'Trial booking: CLUB_HONBU_WEBHOOK_SECRET is not set in Vercel. Booking NOT submitted to Club Honbu.',
    )
    throw new Error(
      `Sorry, trial bookings aren't available online just now. Please email ${CONTACT} or speak to your instructor.`,
    )
  }

  const studentFullName = (data.childName || '').trim() || (data.parentName || '').trim() || data.firstName
  const { first, last } = splitName(studentFullName)

  const res = await fetch(`${honbuUrl}/api/webhooks/formsmarts/trial?token=${encodeURIComponent(honbuSecret)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      'First Name': first,
      'Last Name': last,
      Email: data.email,
      Phone: data.phone,
      'Date of Birth': data.dateOfBirth || '',
      'Which Club': data.dojo || data.preferredDojo || '',
      'Preferred Class': data.classTime || data.ageGroup || '',
      'Parent Name': data.parentName || '',
      Medical: data.medicalNotes || data.message || '',
      Source: 'Forza website trial form',
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    console.error('Club Honbu trial webhook failed:', res.status, body.slice(0, 300))
    throw new Error(
      `Sorry, we couldn't submit your trial booking just now. Please try again, or email ${CONTACT}.`,
    )
  }
}
