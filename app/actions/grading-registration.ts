'use server'

import { db } from '@/lib/db'
import { gradingRegistrations } from '@/lib/db/schema'

export interface GradingRegistrationData {
  memberName: string
  parentName?: string
  email: string
  currentBelt: string
  dojo: string
  gradingDate: string
  notes?: string
}

export interface ActionResult {
  success: boolean
  error?: string
}

export async function submitGradingRegistration(
  data: GradingRegistrationData
): Promise<ActionResult> {
  try {
    await db.insert(gradingRegistrations).values({
      memberName: data.memberName,
      parentName: data.parentName || null,
      email: data.email,
      currentBelt: data.currentBelt,
      dojo: data.dojo,
      gradingDate: data.gradingDate,
      notes: data.notes || null,
      status: 'registered',
    })

    return { success: true }
  } catch (error) {
    console.error('Grading registration error:', error)
    return {
      success: false,
      error: 'Something went wrong. Please try again or contact us directly.',
    }
  }
}
