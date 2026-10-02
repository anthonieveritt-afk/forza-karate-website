import { NextRequest, NextResponse } from 'next/server'
import { MEMBERS_COOKIE, membersCookieOptions } from '@/lib/members-auth'

const HONBU_API = process.env.NEXT_PUBLIC_CLUB_HONBU_API ?? 'https://forza-club-honbu-production.up.railway.app/api'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), 8000)
    let upstream: Response
    try {
      upstream = await fetch(`${HONBU_API}/portal/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        signal: controller.signal,
        cache: 'no-store',
      })
    } finally {
      clearTimeout(t)
    }

    const body = await upstream.json()

    if (!upstream.ok || !body.success) {
      return NextResponse.json(
        { success: false, error: body.error ?? 'Invalid credentials.' },
        { status: 401 }
      )
    }

    const token = body.token ?? ''
    const res = NextResponse.json({ success: true, name: body.name })
    res.cookies.set(MEMBERS_COOKIE, token, membersCookieOptions())
    // Clear any older cookie that was scoped to /members only
    res.cookies.set(MEMBERS_COOKIE, '', { path: '/members', maxAge: 0 })
    return res
  } catch (err: unknown) {
    console.error('Login route error:', err)
    return NextResponse.json(
      { success: false, error: 'Could not connect to the club system. Please try again.' },
      { status: 500 }
    )
  }
}
