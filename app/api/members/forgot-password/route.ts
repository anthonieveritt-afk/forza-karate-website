import { NextRequest, NextResponse } from 'next/server'

const HONBU_API = process.env.NEXT_PUBLIC_CLUB_HONBU_API ?? 'https://forza-club-honbu-production.up.railway.app/api'
const GENERIC = "If that email is registered, we've sent a new password. Please check your inbox (and spam)."

// Proxies to Club Honbu. Always the same generic success so we never reveal whether an email is registered.
export async function POST(req: NextRequest) {
  let email = ''
  try {
    const body = await req.json()
    email = String(body?.email ?? '').trim()
  } catch {}
  if (!email || !email.includes('@') || email.length > 254) {
    return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 })
  }
  try {
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), 8000)
    try {
      await fetch(`${HONBU_API}/portal/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Forwarded-For': req.headers.get('x-forwarded-for') ?? '',
        },
        body: JSON.stringify({ email }),
        signal: controller.signal,
        cache: 'no-store',
      })
    } finally {
      clearTimeout(t)
    }
  } catch (err) {
    console.error('Forgot password route error:', err)
    return NextResponse.json(
      { success: false, error: 'Could not connect to the club system. Please try again.' },
      { status: 502 }
    )
  }
  return NextResponse.json({ success: true, message: GENERIC })
}
