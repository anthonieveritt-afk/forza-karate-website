import { NextRequest, NextResponse } from 'next/server'
import { getForzaStripe, SITE_URL } from '@/lib/paid/stripe'
import { hasActiveVideoSub, signAccess } from '@/lib/paid/video-access'
import { emailConfigured, sendEmail } from '@/lib/email'

// Emails a sign-in link to a video subscriber. Always answers the same way so
// it can't be used to find out who subscribes.
export async function POST(req: NextRequest) {
  const done = NextResponse.json({ ok: true, message: 'If that email has an active video membership, we’ve sent it a sign-in link.' })
  const { email } = (await req.json().catch(() => ({}))) as { email?: string }
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 })
  const stripe = getForzaStripe()
  if (!stripe || !emailConfigured()) return NextResponse.json({ error: 'Restoring access by email is not available yet. Please contact the club.' }, { status: 503 })
  try {
    const customers = await stripe.customers.list({ email: email.trim().toLowerCase(), limit: 5 })
    for (const c of customers.data) {
      if (await hasActiveVideoSub(stripe, c.id)) {
        const token = signAccess(c.id, 60 * 60 * 24)
        if (!token) break
        await sendEmail({
          to: email,
          subject: 'Your Forza video membership sign-in link',
          text: `Tap to open the Forza members' videos (link valid 24 hours):\n${SITE_URL}/api/video-access?token=${encodeURIComponent(token)}`,
        })
        break
      }
    }
  } catch (err) {
    console.error('video restore error', err)
  }
  return done
}
