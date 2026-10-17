// Checks that a forza-members-auth cookie is a real, current Club Honbu portal session.
// The cookie holds the JWT that Club Honbu issued at /portal/login. The website does not
// hold Club Honbu's signing secret, so it asks Club Honbu (GET /portal/me with the token
// as a Bearer header). Club Honbu verifies the signature and expiry.
// Fails closed: a bad token, an expired one, or Club Honbu not answering all count as "not logged in".

const HONBU_API = (process.env.NEXT_PUBLIC_CLUB_HONBU_API ?? 'https://forza-club-honbu-production.up.railway.app/api').replace(/\/$/, '')

export const MEMBERS_COOKIE = 'forza-members-auth'

export type SessionCheck = 'valid' | 'invalid' | 'unavailable'

/** Cheap local check: three base64url parts, a JSON payload, and exp (if present) in the future. */
export function looksLikeLiveJwt(token: string | undefined | null, nowMs = Date.now()): boolean {
  if (!token || token.length > 4096) return false
  const parts = token.split('.')
  if (parts.length !== 3 || parts.some((p) => !/^[A-Za-z0-9_-]+$/.test(p))) return false
  try {
    const b64 = parts[1].replace(/-/g, '+').replace(/_/g, '/')
    const payload = JSON.parse(atob(b64 + '='.repeat((4 - (b64.length % 4)) % 4))) as { exp?: unknown }
    if (typeof payload !== 'object' || payload === null) return false
    if (payload.exp !== undefined && (typeof payload.exp !== 'number' || payload.exp * 1000 <= nowMs)) return false
    return true
  } catch {
    return false
  }
}

// Short per-instance cache so moving between members pages doesn't call Club Honbu every time.
const CACHE_MS = 60_000
const cache = new Map<string, number>()

export async function checkMemberSession(token: string | undefined | null, timeoutMs = 5000): Promise<SessionCheck> {
  if (!looksLikeLiveJwt(token)) return 'invalid'
  const t = token as string
  const hit = cache.get(t)
  if (hit && hit > Date.now()) return 'valid'

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch(`${HONBU_API}/portal/me`, {
      headers: { Authorization: `Bearer ${t}` },
      cache: 'no-store',
      signal: controller.signal,
    })
    if (res.ok) {
      if (cache.size > 500) cache.clear()
      cache.set(t, Date.now() + CACHE_MS)
      return 'valid'
    }
    if (res.status === 401 || res.status === 403 || res.status === 404) return 'invalid'
    return 'unavailable'
  } catch {
    return 'unavailable'
  } finally {
    clearTimeout(timer)
  }
}

/** Only allow redirects back into the members area, never to another site or a javascript: URL. */
export function safeMembersRedirect(raw: string | null | undefined, fallback = '/members/portal'): string {
  if (!raw) return fallback
  if (!raw.startsWith('/members') || raw.startsWith('//') || /[\\\s]/.test(raw)) return fallback
  try {
    const u = new URL(raw, 'https://placeholder.invalid')
    if (u.origin !== 'https://placeholder.invalid' || !u.pathname.startsWith('/members')) return fallback
    return u.pathname + u.search
  } catch {
    return fallback
  }
}
