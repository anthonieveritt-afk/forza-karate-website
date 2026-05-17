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
}
