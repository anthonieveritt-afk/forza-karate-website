'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { MEMBERS_COOKIE_PATH, expiredMembersCookieOptions, forgetMemberSession } from '@/lib/members/session'

const CLUB_HONBU_API = process.env.NEXT_PUBLIC_CLUB_HONBU_API ?? 'https://forza-club-honbu-production.up.railway.app/api'
const COOKIE_NAME    = 'forza-members-auth'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export async function loginMembers(data: {
  email: string
  password: string
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
      return { success: false, error: body.error ?? 'Invalid credentials. Please check your email and password.' }
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

/**
 * Server-action logout (kept for any caller that still uses it; the members pages post to
 * /api/members/logout instead). Expires the cookie on the same path it was set on (/members),
 * then redirects to the login page.
 */
export async function logoutMembers() {
  const cookieStore = await cookies()
  forgetMemberSession(cookieStore.get(COOKIE_NAME)?.value)
  // Next keeps one pending cookie per name, so only the real (/members) path can be expired here.
  cookieStore.set(COOKIE_NAME, '', expiredMembersCookieOptions(MEMBERS_COOKIE_PATH))
  redirect('/members?loggedOut=1')
}

/**
 * Change the portal password (current + new). Club Honbu verifies the current one, stores only a
 * bcrypt hash and clears the "must change" flag. Passwords are never logged here.
 */
export async function changeMemberPassword(data: {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}): Promise<{ success: boolean; error?: string }> {
  const { currentPassword, newPassword, confirmPassword } = data ?? ({} as typeof data)
  if (!currentPassword || !newPassword) return { success: false, error: 'Please fill in every box.' }
  if (newPassword.length < 8) return { success: false, error: 'Your new password needs at least 8 characters.' }
  if (newPassword !== confirmPassword) return { success: false, error: 'The two new passwords don\'t match.' }
  if (newPassword === currentPassword) return { success: false, error: 'Choose a password different from the temporary one.' }

  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return { success: false, error: 'Your login has expired. Please log in again.' }

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    let res: Response
    try {
      res = await fetch(`${CLUB_HONBU_API}/portal/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
        signal: controller.signal,
        cache: 'no-store',
      })
    } finally {
      clearTimeout(timeout)
    }
    const body = await res.json().catch(() => ({}))
    if (!res.ok || !body.success) return { success: false, error: body.error ?? 'Could not change your password.' }
    // Drop the cached "must change" state and swap to the fresh token so the gate lifts straight away
    // (middleware's cache is per-instance, so a new token is the reliable way).
    forgetMemberSession(token)
    if (typeof body.token === 'string' && body.token) {
      cookieStore.set(COOKIE_NAME, body.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: COOKIE_MAX_AGE,
        path: '/members',
      })
    }
    return { success: true }
  } catch {
    return { success: false, error: 'Could not connect to the club system. Please try again.' }
  }
}
