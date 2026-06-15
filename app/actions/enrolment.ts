'use server'

export interface EnrolmentData {
  firstName: string
  lastName: string
  dateOfBirth: string
  gender: string
  email: string
  phone: string
  addressLine1: string
  addressLine2?: string
  town: string
  postcode: string
  parentFirstName?: string
  parentLastName?: string
  parentEmail?: string
  parentPhone?: string
  parentRelationship?: string
  emergencyName: string
  emergencyPhone: string
  emergencyRelationship: string
  medicalConditions?: string
  dojo: string
  classTime: string
  currentBelt: string
  membershipType: string
  heardAboutUs?: string
  discountCode?: string
}

export async function submitEnrolment(data: EnrolmentData): Promise<void> {
  const honbuUrl = process.env.CLUB_HONBU_URL
  const honbuSecret = process.env.CLUB_HONBU_WEBHOOK_SECRET

  if (!honbuUrl || !honbuSecret) {
    throw new Error('Club Honbu is not configured')
  }

  const res = await fetch(`${honbuUrl}/api/webhooks/formsmarts/licence?token=${honbuSecret}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      'First Name': data.firstName,
      'Last Name': data.lastName,
      'Email': data.email,
      'Phone': data.phone,
      'Date of Birth': data.dateOfBirth || '',
      'Address': data.addressLine1 || '',
      'Post Code': data.postcode || '',
      'Parent Name': data.parentFirstName ? `${data.parentFirstName} ${data.parentLastName ?? ''}`.trim() : '',
      'Emergency Contact': data.emergencyName || '',
      'Emergency Phone': data.emergencyPhone || '',
      'Medical': data.medicalConditions || '',
      'Belt': data.currentBelt || '',
      'Which Club': data.dojo || '',
      'Preferred Class': data.classTime || '',
      'Licence Type': data.membershipType || 'Student',
      'Source': 'Forza website join form',
      'Discount Code': data.discountCode || '',
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Enrolment submission failed: ${res.status} ${body}`)
  }
}
