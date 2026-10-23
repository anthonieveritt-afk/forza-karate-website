import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkMemberSession, MEMBERS_COOKIE } from '@/lib/members/session'
import { isMembersOnlyPath, legacyEventPaths } from '@/lib/members/links'

function isDojoDashGamePath(pathname: string) {
  const p = pathname.replace(/\/+$/, '') || '/'
  return p === '/games/dojo-dash' || p === '/games/dojo-dash/index.html' || p.startsWith('/games/dojo-dash/')
}

/** Top-level hits to the bare game URL go through the soft parent interstitial on /dojo-dash. Same-origin iframes still load. */
function gateBareDojoDash(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!isDojoDashGamePath(pathname)) return null

  const dest = (request.headers.get('sec-fetch-dest') || '').toLowerCase()
  if (dest === 'iframe' || dest === 'embed') return NextResponse.next()

  if (dest === 'document') {
    const url = request.nextUrl.clone()
    url.pathname = '/dojo-dash'
    url.search = ''
    url.hash = ''
    return NextResponse.redirect(url, 307)
  }

  // Older browsers / odd clients: allow when Referer is same host (iframe/nav from Forza), else redirect.
  const referer = request.headers.get('referer')
  if (referer) {
    try {
      const ref = new URL(referer)
      if (ref.host === request.nextUrl.host) return NextResponse.next()
    } catch {
      /* ignore bad referer */
    }
  }

  const url = request.nextUrl.clone()
  url.pathname = '/dojo-dash'
  url.search = ''
  url.hash = ''
  return NextResponse.redirect(url, 307)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const dojoGate = gateBareDojoDash(request)
  if (dojoGate) return dojoGate

  // Defence in depth: gallery-proxy must never act for anonymous callers.
  // The route itself returns 410; this also blocks before the handler if needed.
  if (pathname.startsWith('/api/gallery-proxy')) {
    return NextResponse.json(
      { error: 'This endpoint has been removed. Manage the gallery in Club Honbu.' },
      { status: 410 },
    )
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
  matcher: [
    '/members/:path+',
    '/register/:path*',
    '/api/gallery-proxy/:path*',
    '/games/dojo-dash',
    '/games/dojo-dash/:path*',
  ],
}
