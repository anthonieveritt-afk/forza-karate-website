import { NextRequest, NextResponse } from 'next/server'
import { getForzaStripe, SITE_URL, UNAVAILABLE_MSG, forzaStripeKey } from '@/lib/paid/stripe'
import { GRADING_VENUES } from '@/lib/gradings'
import {
  findEvent,
  isPreviewDeployment,
  localEvents,
  parsePreviewWindow,
  resolveGradingCharge,
  stripeKeyAllowedForEnv,
  type PublicGradingEvent,
} from '@/lib/grading-checkout'

// Grading registration = Stripe only. Nothing is saved in Forza Club Honbu until Stripe confirms payment
// (webhook kind 'grading' -> Honbu /webhooks/website/grading-paid, status "paid").
const clip = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '')

const HONBU_API = (process.env.NEXT_PUBLIC_CLUB_HONBU_API ?? 'https://forza-club-honbu-production.up.railway.app/api').replace(/\/$/, '')

async function loadEvents(gradingName: string): Promise<PublicGradingEvent[]> {
  try {
    const one = await fetch(`${HONBU_API}/public/grading-event?name=${encodeURIComponent(gradingName)}`, { cache: 'no-store' })
    if (one.ok) return [await one.json() as PublicGradingEvent]
  } catch { /* fall through */ }
  try {
    const all = await fetch(`${HONBU_API}/public/grading-events`, { cache: 'no-store' })
    if (all.ok) {
      const rows = await all.json()
      if (Array.isArray(rows) && rows.length) return rows as PublicGradingEvent[]
    }
  } catch { /* fall through */ }
  return localEvents()
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }) }
  const d = {
    memberName: clip(body.memberName, 100), parentName: clip(body.parentName, 100), email: clip(body.email, 120),
    grade: clip(body.currentBelt, 80), venue: clip(body.venue, 40), gradingName: clip(body.gradingName, 120), notes: clip(body.notes, 300),
  }
  if (!d.memberName || !d.gradingName || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) {
    return NextResponse.json({ error: "Please fill in the student's name, a valid email and the grading." }, { status: 400 })
  }
  const venue = GRADING_VENUES.find(v => v.value === d.venue)
  if (!venue) return NextResponse.json({ error: 'Please choose the grade and venue.' }, { status: 400 })

  const events = await loadEvents(d.gradingName)
  const charge = resolveGradingCharge({
    grade: d.grade,
    gradingName: d.gradingName,
    events,
    previewWindow: parsePreviewWindow(body.previewWindow),
    isPreview: isPreviewDeployment(),
    clientFee: body.fee,
    clientIsEmergency: body.isEmergency,
  })
  if (!charge.ok) return NextResponse.json({ error: charge.error }, { status: 400 })

  const key = forzaStripeKey()
  if (key && !stripeKeyAllowedForEnv(key)) {
    console.error('Grading checkout refused: live Stripe key on a preview deployment')
    return NextResponse.json({ error: UNAVAILABLE_MSG, unavailable: true }, { status: 503 })
  }

  const stripe = getForzaStripe()
  if (!stripe) return NextResponse.json({ error: UNAVAILABLE_MSG, unavailable: true }, { status: 503 })
  const ev = findEvent(events, d.gradingName) ?? charge.event
  const description = charge.mode === 'emergency'
    ? `${charge.wording} · ${d.memberName} · ${d.gradingName} · ${venue.value}`
    : `${d.memberName} · ${d.gradingName} · ${venue.value}`
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: d.email,
      line_items: [{ quantity: 1, price_data: { currency: 'gbp', unit_amount: charge.fee * 100, product_data: {
        name: charge.lineItemName,
        description,
      } } }],
      metadata: {
        source: 'forza-karate-website', kind: 'grading', ...d, dojo: venue.dojo,
        fee: String(charge.fee), baseFee: String(charge.baseFee),
        isEmergency: charge.mode === 'emergency' ? 'true' : 'false',
        awardStart: ev.awardStart ?? '',
      },
      success_url: `${SITE_URL}/members/grading/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/members/grading?cancelled=1`,
    })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Grading checkout error:', err)
    return NextResponse.json({ error: UNAVAILABLE_MSG, unavailable: true }, { status: 503 })
  }
}
