import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { MEMBERS_COOKIE, MEMBERS_COOKIE_PATH } from '@/lib/members/session'

const HONBU_API = (process.env.NEXT_PUBLIC_CLUB_HONBU_API ?? 'https://forza-club-honbu-production.up.railway.app/api').replace(/\/$/, '')
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

/**
 * Family profiles (parent + children sharing one login email).
 * Lives under /members so the Path=/members session cookie is sent.
 * GET  → { activeMemberId, profiles } for the "Viewing:" dropdown.
 * POST { memberId } → Forza Club Honbu re-checks the member shares this login's email,
 *       returns a new token for that profile; we rewrite the members cookie.
 */
async function token() {
  return (await cookies()).get(MEMBERS_COOKIE)?.value
}

export async function GET() {
  const t = await token()
  if (!t) return NextResponse.json({ profiles: [] }, { status: 401 })
  try {
    const r = await fetch(`${HONBU_API}/portal/profiles`, {
      headers: { Authorization: `Bearer ${t}`, Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })
    if (!r.ok) return NextResponse.json({ profiles: [] }, { status: r.status })
    const d = await r.json()
    return NextResponse.json(
      { activeMemberId: d.activeMemberId ?? null, profiles: Array.isArray(d.profiles) ? d.profiles : [] },
      { headers: { 'Cache-Control': 'no-store, private' } },
    )
  } catch {
    return NextResponse.json({ profiles: [] }, { status: 502 })
  }
}

export async function POST(req: NextRequest) {
  const t = await token()
  if (!t) return NextResponse.json({ error: 'Please log in to the members area.' }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const memberId = Number(body?.memberId)
  if (!Number.isInteger(memberId) || memberId <= 0) return NextResponse.json({ error: 'Pick a profile.' }, { status: 400 })
  try {
    const r = await fetch(`${HONBU_API}/portal/switch-profile`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })
    const d = await r.json().catch(() => ({}))
    if (!r.ok || !d?.token) return NextResponse.json({ error: d?.error ?? 'Could not switch profile.' }, { status: r.status || 500 })
    const res = NextResponse.json({ success: true, name: d.name, activeMemberId: d.activeMemberId })
    res.cookies.set(MEMBERS_COOKIE, d.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE,
      path: MEMBERS_COOKIE_PATH,
    })
    res.headers.set('Cache-Control', 'no-store, private')
    return res
  } catch {
    return NextResponse.json({ error: 'Could not reach the club system. Please try again.' }, { status: 502 })
  }
}
