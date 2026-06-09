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

function splitName(full: string): { first: string; last: string } {
  const parts = (full || '').trim().split(/\s+/)
  const first = parts[0] || ''
  const last = parts.slice(1).join(' ') || first // fallback: use first name as surname if only one word
  return { first, last }
}

export async function submitTrialBooking(data: TrialBookingData): Promise<void> {
  const honbuUrl = process.env.CLUB_HONBU_URL || 'https://club-honbu-production.up.railway.app'
  const honbuSecret = process.env.CLUB_HONBU_WEBHOOK_SECRET

  if (!honbuSecret) {
    throw new Error('Club Honbu webhook secret not configured')
  }

  // Determine the student name: use childName if provided, else parentName
  const studentFullName = (data.childName || '').trim() || (data.parentName || '').trim() || data.firstName
  const { first, last } = splitName(studentFullName)

  const res = await fetch(`${honbuUrl}/api/webhooks/formsmarts/trial?token=${honbuSecret}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      'First Name': first,
      'Last Name': last,
      'Email': data.email,
      'Phone': data.phone,
      'Date of Birth': data.dateOfBirth || '',
      'Which Club': data.dojo || data.preferredDojo || '',
      'Preferred Class': data.classTime || data.ageGroup || '',
      'Parent Name': data.parentName || '',
      'Medical': data.medicalNotes || data.message || '',
      'Source': 'Forza website trial form',
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    console.error('Club Honbu trial webhook failed:', res.status, body)
    throw new Error('Failed to submit trial booking')
  }
}
