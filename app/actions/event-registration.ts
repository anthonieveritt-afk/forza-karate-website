'use server'

import { db } from '@/lib/db'
import { eventRegistrations } from '@/lib/db/schema'
import { hasMemberSession } from '@/lib/members/require'

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
  // Event registration is members only: refuse without a valid portal session.
  if (!(await hasMemberSession())) throw new Error('Please log in to the members area to register.')
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
