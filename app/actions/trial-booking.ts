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

export async function submitTrialBooking(data: TrialBookingData): Promise<void> {
  const honbuUrl = process.env.CLUB_HONBU_URL || 'https://club-honbu-production.up.railway.app'
  const honbuSecret = process.env.CLUB_HONBU_WEBHOOK_SECRET

  if (!honbuSecret) {
    throw new Error('Club Honbu webhook secret not configured')
  }

  const res = await fetch(`${honbuUrl}/api/webhooks/formsmarts/trial?token=${honbuSecret}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      'First Name': data.firstName,
      'Last Name': data.lastName || '',
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
