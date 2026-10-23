import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkMemberSession, MEMBERS_COOKIE } from '@/lib/members/session'
import { isMembersOnlyPath, legacyEventPaths } from '@/lib/members/links'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Defence in depth: gallery-proxy must never act for anonymous callers.
  // The route itself returns 410; this also blocks before the handler if needed.
  if (pathname.startsWith('/api/gallery-proxy')) {
    return NextResponse.json(
      { error: 'This endpoint has been removed. Manage the gallery in Club Honbu.' },
      { status: 410 },
    )
  }

  // Old renew hub — send straight to the renewal form (before members login gate).
  const clean = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  if (clean === '/members/licence') {
    return NextResponse.redirect(new URL('/join/apply-licence?reason=renewal', request.url), 308)
  }

  // Event registration moved into the members area (members only, Oct 2026).
  // Old links (/register/...) keep working: they go to the new page, which asks for login.
  const legacy = legacyEventPaths[pathname.replace(/\/+$/, '')]
  if (legacy) {
    const url = new URL(legacy, request.url)
    url.search = request.nextUrl.search
    return NextResponse.redirect(url, 308)
  }

  // Everything in the Members menu (and everything else under /members except the login page
  // and the listed public pages) needs a genuine, unexpired Club Honbu portal session.
  if (isMembersOnlyPath(pathname)) {
    const token = request.cookies.get(MEMBERS_COOKIE)?.value
    const check = await checkMemberSession(token)
    if (check !== 'valid') {
      // Form posts / server actions get a plain 401 instead of a redirect to the login page.
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        const res = NextResponse.json(
          { error: check === 'unavailable' ? 'Could not check your login. Please try again.' : 'Please log in to the members area.' },
          { status: check === 'unavailable' ? 503 : 401, headers: { 'Cache-Control': 'private, no-store, max-age=0' } },
        )
        if (token && check === 'invalid') res.cookies.set(MEMBERS_COOKIE, '', { path: '/members', maxAge: 0 })
        return res
      }
      // Send them back to the page they asked for after login. The login page only accepts
      // /members... paths (safeMembersRedirect), so this cannot become an open redirect.
      const loginUrl = new URL('/members', request.url)
      loginUrl.searchParams.set('redirect', pathname + request.nextUrl.search)
      if (check === 'unavailable') loginUrl.searchParams.set('error', 'unavailable')
      const res = NextResponse.redirect(loginUrl)
      res.headers.set('Cache-Control', 'private, no-store, max-age=0')
      // A forged or expired cookie is removed so the login page starts clean.
      if (token && check === 'invalid') res.cookies.set(MEMBERS_COOKIE, '', { path: '/members', maxAge: 0 })
      return res
    }
    // Logged-in members pages must never be served from a browser/back-button cache after logout.
    const res = NextResponse.next()
    res.headers.set('Cache-Control', 'private, no-store, max-age=0')
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/members/:path+', '/register/:path*', '/api/gallery-proxy/:path*'],
}
