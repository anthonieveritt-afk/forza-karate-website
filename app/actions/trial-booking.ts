'use server'

import { db } from '@/lib/db'
import { trialBookings } from '@/lib/db/schema'

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
  // legacy fields kept for compatibility
  ageGroup?: string
  preferredDojo?: string
  message?: string
  parentNameLegacy?: string
  childName?: string
}

export async function submitTrialBooking(data: TrialBookingData): Promise<void> {
  const fullName = `${data.firstName} ${data.lastName}`

  // Save locally
  await db.insert(trialBookings).values({
    parentName: data.parentName || fullName,
    childName: fullName,
    email: data.email,
    phone: data.phone,
    ageGroup: data.classTime || 'not specified',
    preferredDojo: data.dojo,
    message: [
      data.dateOfBirth ? `DOB: ${data.dateOfBirth}` : null,
      data.classTime ? `Class: ${data.classTime}` : null,
      data.medicalNotes ? `Medical: ${data.medicalNotes}` : null,
    ].filter(Boolean).join(' | ') || null,
    status: 'pending',
  })

  // Forward to Club Honbu
  const honbuUrl = process.env.CLUB_HONBU_URL
  const honbuSecret = process.env.CLUB_HONBU_WEBHOOK_SECRET
  if (honbuUrl && honbuSecret) {
    try {
      await fetch(`${honbuUrl}/api/webhooks/formsmarts/trial?token=${honbuSecret}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'First Name': data.firstName,
          'Last Name': data.lastName,
          'Email': data.email,
          'Phone': data.phone,
          'Date of Birth': data.dateOfBirth || '',
          'Which Club': data.dojo || '',
          'Preferred Class': data.classTime || '',
          'Parent Name': data.parentName || '',
          'Medical': data.medicalNotes || '',
          'How did you hear': '',
          'Source': 'Forza website trial form',
        }),
      })
    } catch (err) {
      console.error('Club Honbu trial forward failed:', err)
    }
  }
}
