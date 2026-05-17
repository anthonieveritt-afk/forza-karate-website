'use server'

import { db } from '@/lib/db'
import { trialBookings } from '@/lib/db/schema'

export interface TrialBookingData {
  parentName: string
  childName?: string
  email: string
  phone: string
  ageGroup: string
  preferredDojo: string
  message?: string
}

export interface ActionResult {
  success: boolean
  error?: string
}

export async function submitTrialBooking(data: TrialBookingData): Promise<ActionResult> {
  try {
    await db.insert(trialBookings).values({
      parentName: data.parentName,
      childName: data.childName || null,
      email: data.email,
      phone: data.phone,
      ageGroup: data.ageGroup,
      preferredDojo: data.preferredDojo,
      message: data.message || null,
      status: 'pending',
    })

    return { success: true }
  } catch (error) {
    console.error('Trial booking error:', error)
    return {
      success: false,
      error: 'Something went wrong. Please try again or contact us directly.',
    }
  }
}
