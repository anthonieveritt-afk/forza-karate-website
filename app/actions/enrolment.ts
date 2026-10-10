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

const DEFAULT_HONBU = 'https://forza-club-honbu-production.up.railway.app'
const CONTACT = 'hello@forzakarate.co.uk'

export async function submitEnrolment(data: EnrolmentData): Promise<{ memberId: number }> {
  const honbuUrl = (process.env.CLUB_HONBU_URL || DEFAULT_HONBU).replace(/\/$/, '')
  const honbuSecret = process.env.CLUB_HONBU_WEBHOOK_SECRET?.trim()

  if (!honbuSecret) {
    console.error(
      'Enrolment: CLUB_HONBU_WEBHOOK_SECRET is not set in Vercel. Enrolment NOT submitted to Club Honbu.',
    )
    throw new Error(
      `Sorry, online enrolment isn't available just now. Please email ${CONTACT} or speak to your instructor.`,
    )
  }

  const res = await fetch(`${honbuUrl}/api/webhooks/formsmarts/licence?token=${encodeURIComponent(honbuSecret)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      'First Name': data.firstName,
      'Last Name': data.lastName,
      Email: data.email,
      Phone: data.phone,
      'Date of Birth': data.dateOfBirth || '',
      Address: data.addressLine1 || '',
      'Post Code': data.postcode || '',
      'Parent Name': data.parentFirstName
        ? `${data.parentFirstName} ${data.parentLastName ?? ''}`.trim()
        : '',
      'Emergency Contact': data.emergencyName || '',
      'Emergency Phone': data.emergencyPhone || '',
      Medical: data.medicalConditions || '',
      Belt: data.currentBelt || '',
      'Which Club': data.dojo || '',
      'Preferred Class': data.classTime || '',
      'Licence Type': data.membershipType || 'Student',
      Source: 'Forza website join form',
      'Discount Code': data.discountCode || '',
    }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    console.error('Club Honbu licence webhook failed:', res.status, body.slice(0, 300))
    throw new Error(
      `Sorry, we couldn't submit your enrolment just now. Please try again, or email ${CONTACT}.`,
    )
  }

  const json = await res.json().catch(() => ({}))
  return { memberId: json.memberId ?? 0 }
}
