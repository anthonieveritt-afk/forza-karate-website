import { NextRequest, NextResponse } from 'next/server'
import { MEMBERS_COOKIE, expiredMembersSetCookieHeaders, forgetMemberSession } from '@/lib/members/session'

export const dynamic = 'force-dynamic'

// POST /api/members/logout — the members "Log out" button is a plain HTML form that posts here.
// It expires the session cookie with the same name/path/attributes it was set with, then sends the
// browser to the login page with a full page load (303), so no cached members page can show.
// Logging out is POST-only so link prefetching or crawlers can never trigger it.
export async function POST(req: NextRequest) {
  // The cookie is Path=/members, so it isn't sent to /api; it's read here only if an old Path=/ copy exists.
  forgetMemberSession(req.cookies.get(MEMBERS_COOKIE)?.value)

  const res = NextResponse.redirect(new URL('/members?loggedOut=1', req.url), 303)
  for (const value of expiredMembersSetCookieHeaders()) res.headers.append('Set-Cookie', value)
  res.headers.set('Cache-Control', 'no-store, max-age=0')
  return res
}

export function GET() {
  return NextResponse.json({ error: 'Use the Log out button.' }, { status: 405, headers: { Allow: 'POST' } })
}
