import { readFile } from 'node:fs/promises'
import path from 'node:path'
import { NextRequest, NextResponse } from 'next/server'
import { MEMBERS_COOKIE, verifyMemberToken } from '@/lib/members-auth'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// The full syllabus is members-only, so it lives in /private (not /public)
// and is only served to a signed-in member.
export async function GET(req: NextRequest) {
  const token = req.cookies.get(MEMBERS_COOKIE)?.value
  if (!(await verifyMemberToken(token))) {
    const loginUrl = new URL('/members', req.url)
    loginUrl.searchParams.set('redirect', '/members/syllabus/view')
    return NextResponse.redirect(loginUrl)
  }

  const html = await readFile(path.join(process.cwd(), 'private', 'forza-syllabus-template.html'), 'utf8')
  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'private, no-store',
      'X-Robots-Tag': 'noindex, nofollow',
    },
  })
}
