import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'forza-members-auth'

export function middleware(request: NextRequest) {
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
    const auth = request.cookies.get(COOKIE_NAME)
    if (!auth?.value) {
      const loginUrl = new URL('/members', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/members/:path+', '/api/gallery-proxy/:path*'],
}
