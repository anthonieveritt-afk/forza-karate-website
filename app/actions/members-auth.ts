'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const CLUB_HONBU_API = process.env.NEXT_PUBLIC_CLUB_HONBU_API ?? 'https://forza-club-honbu-production.up.railway.app/api'
const COOKIE_NAME    = 'forza-members-auth'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function loginMembers(data: {
  email: string
  password: string
  licenceNumber?: string
}): Promise<{ success: boolean; name?: string; error?: string }> {
  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    let res: Response
    try {
      res = await fetch(`${CLUB_HONBU_API}/portal/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
        signal: controller.signal,
        cache: 'no-store',
      })
    } finally {
      clearTimeout(timeout)
    }

    const body = await res.json()

    if (!res.ok || !body.success) {
      return { success: false, error: body.error ?? 'Invalid credentials. Please check your email, password and licence number.' }
    }

    // Verified — set our own session cookie
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, body.token ?? '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/members',
    })

    return { success: true, name: body.name }
  } catch {
    return { success: false, error: 'Could not connect to the club system. Please try again.' }
  }
}

export async function logoutMembers() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
  redirect('/members')
}

/** Lightweight check for the site nav: is a members session cookie present? */
export async function isMembersLoggedIn(): Promise<boolean> {
  const cookieStore = await cookies()
  return Boolean(cookieStore.get(COOKIE_NAME)?.value)
}
