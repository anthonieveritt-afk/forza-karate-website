'use server'

import { randomUUID } from 'crypto'
import { db } from '@/lib/db'
import { eventRegistrations } from '@/lib/db/schema'
import { hasMemberSession } from '@/lib/members/require'
import { sendEventRegistrations } from '@/lib/honbu'

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
  const values = {
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
  }
  // Club Honbu (Admin → Website) is the club's record. The website database keeps a copy when it is
  // available; if it isn't, the registration still goes to Club Honbu. It only fails if neither works.
  let row: typeof eventRegistrations.$inferSelect | null = null
  try {
    const inserted = await db.insert(eventRegistrations).values(values).returning()
    row = inserted[0] ?? null
  } catch (e) {
    console.error('[event-registration] website DB unavailable, sending to Club Honbu only:', (e as Error).message)
  }
  const r = await sendEventRegistrations([row ?? { ...values, id: 0, sourceId: `web-${randomUUID()}`, createdAt: new Date() }])
  if (!r.ok) {
    console.error('[event-registration] Club Honbu hand-off failed:', r.detail)
    if (!row) throw new Error('Sorry, we could not save your registration. Please try again or contact the club.')
  }
}
