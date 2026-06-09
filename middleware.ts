import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'forza-members-auth'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect everything under /members except the login page and public info pages
  const publicMembersPages = ['/members/licence', '/members/syllabus']
  if (pathname.startsWith('/members') && pathname !== '/members' && !publicMembersPages.includes(pathname)) {
    const auth = request.cookies.get(COOKIE_NAME)
    if (!auth || auth.value !== '1') {
      const loginUrl = new URL('/members', request.url)
      loginUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/members/:path+'],
}
