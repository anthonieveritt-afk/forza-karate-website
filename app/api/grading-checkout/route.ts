import { NextRequest, NextResponse } from 'next/server'
import { getForzaStripe, SITE_URL, UNAVAILABLE_MSG } from '@/lib/paid/stripe'
import { gradingFee, GRADING_VENUES } from '@/lib/gradings'

// Grading registration = Stripe only. Nothing is saved in Club Honbu until Stripe confirms payment
// (webhook kind 'grading' -> Honbu /webhooks/website/grading-paid, status "paid").
const clip = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '')

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
  const fee = gradingFee(d.grade)
  const venue = GRADING_VENUES.find(v => v.value === d.venue)
  if (fee == null || !venue) return NextResponse.json({ error: 'Please choose the grade and venue.' }, { status: 400 })

  const stripe = getForzaStripe()
  if (!stripe) return NextResponse.json({ error: UNAVAILABLE_MSG, unavailable: true }, { status: 503 })
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: d.email,
      line_items: [{ quantity: 1, price_data: { currency: 'gbp', unit_amount: fee * 100, product_data: {
        name: `Grading fee — ${d.grade.split('–')[0].trim()}`,
        description: `${d.memberName} · ${d.gradingName} · ${venue.value}`,
      } } }],
      metadata: { source: 'forza-karate-website', kind: 'grading', ...d, dojo: venue.dojo, fee: String(fee) },
      success_url: `${SITE_URL}/members/grading/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/members/grading?cancelled=1`,
    })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Grading checkout error:', err)
    return NextResponse.json({ error: UNAVAILABLE_MSG, unavailable: true }, { status: 503 })
  }
}
