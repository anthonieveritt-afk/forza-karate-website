'use server'

import { db } from '@/lib/db'
import { eventRegistrations } from '@/lib/db/schema'

export interface EventRegData {
  event: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth?: string
  dojo?: string
  currentBelt?: string
  ageGroup?: string
  parentName?: string
  medicalNotes?: string
  sessionDate?: string
}

export async function submitEventRegistration(data: EventRegData): Promise<void> {
  await db.insert(eventRegistrations).values({
    event: data.event,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    dateOfBirth: data.dateOfBirth || null,
    dojo: data.dojo || null,
    currentBelt: data.currentBelt || null,
    ageGroup: data.ageGroup || null,
    parentName: data.parentName || null,
    medicalNotes: data.medicalNotes || null,
    sessionDate: data.sessionDate || null,
    paymentStatus: 'unpaid',
  })
}
