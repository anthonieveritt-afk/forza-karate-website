import { NextRequest, NextResponse } from 'next/server'

const HONBU_API = process.env.NEXT_PUBLIC_CLUB_HONBU_API ?? 'https://forza-club-honbu-production.up.railway.app/api'
const COOKIE_NAME = 'forza-members-auth'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

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
    const redirectTo = req.nextUrl.searchParams.get('redirect') ?? '/members/portal'
    const res = NextResponse.redirect(new URL(redirectTo, req.url))
    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: '/members',
    })
    return res
  } catch (err: unknown) {
    console.error('Login route error:', err)
    return NextResponse.json(
      { success: false, error: 'Could not connect to the club system. Please try again.' },
      { status: 500 }
    )
  }
}
