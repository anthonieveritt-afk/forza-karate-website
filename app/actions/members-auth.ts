'use server'

import { cookies } from 'next/headers'
import { MEMBERS_COOKIE as COOKIE_NAME, membersCookieOptions } from '@/lib/members-auth'

const CLUB_HONBU_API = process.env.NEXT_PUBLIC_CLUB_HONBU_API ?? 'https://forza-club-honbu-production.up.railway.app/api'

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
    cookieStore.set(COOKIE_NAME, body.token ?? '', membersCookieOptions())
    // Clear any older cookie that was scoped to /members only
    cookieStore.set(COOKIE_NAME, '', { path: '/members', maxAge: 0 })

    return { success: true, name: body.name }
  } catch {
    return { success: false, error: 'Could not connect to the club system. Please try again.' }
  }
}

export async function logoutMembers() {
  const cookieStore = await cookies()
  // Remove both the current site-wide cookie and any older /members-scoped one
  cookieStore.set(COOKIE_NAME, '', { path: '/', maxAge: 0 })
  cookieStore.set(COOKIE_NAME, '', { path: '/members', maxAge: 0 })
}
