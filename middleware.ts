import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { checkMemberSession, MEMBERS_COOKIE } from '@/lib/members/session'

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

  // Protect everything under /members except the login page and public info pages
  // /members/videos does its own access check (portal login OR Stripe video subscriber)
  const publicMembersPages = ['/members/licence', '/members/syllabus', '/members/videos', '/members/videos/welcome']
  if (pathname.startsWith('/members') && pathname !== '/members' && !publicMembersPages.includes(pathname)) {
    // The cookie must be a genuine, unexpired Club Honbu portal session, not just present.
    const token = request.cookies.get(MEMBERS_COOKIE)?.value
    const check = await checkMemberSession(token)
    if (check !== 'valid') {
      const loginUrl = new URL('/members', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      if (check === 'unavailable') loginUrl.searchParams.set('error', 'unavailable')
      const res = NextResponse.redirect(loginUrl)
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
  matcher: ['/members/:path+', '/api/gallery-proxy/:path*'],
}
