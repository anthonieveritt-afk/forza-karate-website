// Shared helpers for the members area session.
//
// The `forza-members-auth` cookie holds the Club Honbu portal token issued at
// login. Middleware only checks the cookie exists (it runs on the edge and
// should stay fast); anything sensitive must also call verifyMemberToken(),
// which asks Club Honbu whether the token is still valid.

export const MEMBERS_COOKIE = 'forza-members-auth'
export const MEMBERS_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

const HONBU_API =
  process.env.NEXT_PUBLIC_CLUB_HONBU_API ?? 'https://forza-club-honbu-production.up.railway.app/api'

export function membersCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: MEMBERS_COOKIE_MAX_AGE,
    // Site-wide so the cookie also reaches /admin/gallery and the gallery proxy.
    path: '/',
  }
}

/** Returns true only if Club Honbu confirms the portal token is valid. */
export async function verifyMemberToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false
  const controller = new AbortController()
  const t = setTimeout(() => controller.abort(), 8000)
  try {
    const res = await fetch(`${HONBU_API}/portal/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
      signal: controller.signal,
    })
    return res.ok
  } catch {
    return false
  } finally {
    clearTimeout(t)
  }
}
