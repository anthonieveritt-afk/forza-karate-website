import { NextRequest, NextResponse } from 'next/server'
import { getForzaStripe, SITE_URL } from '@/lib/paid/stripe'
import { hasActiveVideoSub, signAccess, verifyAccess, VIDEO_COOKIE, VIDEO_COOKIE_MAX_AGE } from '@/lib/paid/video-access'

// GET /api/video-access?session_id=cs_…  (after subscription Checkout)
// GET /api/video-access?token=…          (magic link from the "restore access" email)
export async function GET(req: NextRequest) {
  const stripe = getForzaStripe()
  const fail = (why: string) => NextResponse.redirect(`${SITE_URL}/members/videos?error=${why}`)
  if (!stripe) return fail('unavailable')

  let customerId: string | null = null
  const sessionId = req.nextUrl.searchParams.get('session_id')
  const token = req.nextUrl.searchParams.get('token')
  try {
    if (sessionId) {
      const s = await stripe.checkout.sessions.retrieve(sessionId)
      if (s.mode === 'subscription' && s.metadata?.kind === 'video' && typeof s.customer === 'string') customerId = s.customer
    } else if (token) {
      customerId = verifyAccess(token)
    }
    if (!customerId || !(await hasActiveVideoSub(stripe, customerId))) return fail('no-subscription')
  } catch {
    return fail('no-subscription')
  }
  const signed = signAccess(customerId)
  if (!signed) return fail('unavailable')
  const res = NextResponse.redirect(`${SITE_URL}/members/videos`)
  res.cookies.set(VIDEO_COOKIE, signed, {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: VIDEO_COOKIE_MAX_AGE, path: '/',
  })
  return res
}
