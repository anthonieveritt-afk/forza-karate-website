import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'forza-members-auth'

// Middleware only checks that a session cookie exists. The admin gallery page,
// the gallery proxy and the syllabus view also verify the token with Club
// Honbu on the server (see lib/members-auth.ts).
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasSession = Boolean(request.cookies.get(COOKIE_NAME)?.value)

  // Gallery admin API proxy: never usable without a session
  if (pathname.startsWith('/api/gallery-proxy')) {
    if (!hasSession) {
      return NextResponse.json({ error: 'Not signed in.' }, { status: 401 })
    }
    return NextResponse.next()
  }

  // Protect everything under /members except the login page and public info
  // pages, plus the gallery admin.
  const publicMembersPages = ['/members/licence', '/members/syllabus']
  const isProtectedMembersPage =
    pathname.startsWith('/members') && pathname !== '/members' && !publicMembersPages.includes(pathname)
  const isAdminGallery = pathname === '/admin/gallery' || pathname.startsWith('/admin/gallery/')

  if ((isProtectedMembersPage || isAdminGallery) && !hasSession) {
    const loginUrl = new URL('/members', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/members/:path+', '/admin/gallery', '/admin/gallery/:path*', '/api/gallery-proxy/:path*'],
}
