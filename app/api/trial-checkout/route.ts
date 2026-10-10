import { NextRequest, NextResponse } from 'next/server'
import { getForzaStripe, SITE_URL, UNAVAILABLE_MSG } from '@/lib/paid/stripe'
import { TRIAL_PRICE_PENCE } from '@/lib/paid/catalogue'

const AGE_GROUPS: Record<string, string> = {
  ninjas: 'Forza Ninjas (4–7)', juniors: 'Forza Juniors (8–10)', seniors: 'Forza Seniors (11+)', adult: 'Adult',
}
const DOJOS: Record<string, string> = { rayleigh: 'Rayleigh', upminster: 'Upminster', 'no-preference': 'No preference' }

const clip = (v: unknown, n: number) => (typeof v === 'string' ? v.trim().slice(0, n) : '')

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try { body = await req.json() } catch { return NextResponse.json({ error: 'Invalid request.' }, { status: 400 }) }

  const d = {
    parentName: clip(body.parentName, 80),
    childName: clip(body.childName, 80),
    age: clip(body.age, 3),
    email: clip(body.email, 120),
    phone: clip(body.phone, 30),
    dateOfBirth: clip(body.dateOfBirth, 10),
    ageGroup: clip(body.ageGroup, 20),
    dojo: clip(body.preferredDojo, 20),
    message: clip(body.message, 400),
  }
  if (!d.parentName || !d.phone || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email)) {
    return NextResponse.json({ error: 'Please fill in your name, a valid email and your phone number.' }, { status: 400 })
  }
  if (!AGE_GROUPS[d.ageGroup] || !DOJOS[d.dojo]) {
    return NextResponse.json({ error: 'Please choose an age group and a dojo.' }, { status: 400 })
  }

  const stripe = getForzaStripe()
  if (!stripe) return NextResponse.json({ error: UNAVAILABLE_MSG, unavailable: true }, { status: 503 })

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: d.email,
      line_items: [{
        quantity: 1,
        price_data: {
          currency: 'gbp',
          unit_amount: TRIAL_PRICE_PENCE,
          product_data: {
            name: 'Forza Karate trial class',
            description: `${AGE_GROUPS[d.ageGroup]} · ${DOJOS[d.dojo]} — come and try it out!`,
          },
        },
      }],
      // Booking details travel in metadata so the webhook can record them in Club Honbu.
      metadata: {
        source: 'forza-karate-website', kind: 'trial',
        parentName: d.parentName, childName: d.childName, age: d.age, email: d.email, phone: d.phone,
        dateOfBirth: d.dateOfBirth, ageGroup: AGE_GROUPS[d.ageGroup], dojo: DOJOS[d.dojo], message: d.message,
      },
      success_url: `${SITE_URL}/trial-class/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/trial-class?cancelled=1`,
    })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Trial checkout error:', err)
    return NextResponse.json({ error: UNAVAILABLE_MSG, unavailable: true }, { status: 503 })
  }
}
