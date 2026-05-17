'use server'

import { cookies } from 'next/headers'

const MEMBERS_PASSWORD = process.env.MEMBERS_PASSWORD ?? 'Forza2025'
const COOKIE_NAME = 'forza-members-auth'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function loginMembers(password: string): Promise<{ success: boolean; error?: string }> {
  if (password !== MEMBERS_PASSWORD) {
    return { success: false, error: 'Incorrect password. Please try again.' }
  }
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/members',
  })
  return { success: true }
}

export async function logoutMembers() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
