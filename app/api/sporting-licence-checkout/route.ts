import { NextResponse } from 'next/server'
import { getForzaStripe, SITE_URL, UNAVAILABLE_MSG } from '@/lib/paid/stripe'
import { getMemberPortalData } from '@/app/actions/portal'
import { ekngbStatus, SPORTING_LICENCE_PENCE } from '@/lib/members/sporting'

// Sporting licence (Sport:80) = £33 Stripe Checkout. Server re-checks the member's EKNGB licence
// from Club Honbu, so an out-of-date or missing EKNGB licence can never reach Stripe.
export async function POST() {
  const data = await getMemberPortalData()
  const p = data?.profile
  if (!p) return NextResponse.json({ error: 'Please log in to the members portal again.' }, { status: 401 })
  const ek = ekngbStatus(p.licenceExpiryDate)
  if (!ek.ok) {
    return NextResponse.json({ error: 'A current EKNGB licence must be valid and in date to purchase a Sporting licence. Please renew your EKNGB licence first.', ekngb: ek }, { status: 403 })
  }
  const stripe = getForzaStripe()
  if (!stripe) return NextResponse.json({ error: UNAVAILABLE_MSG, unavailable: true }, { status: 503 })
  const memberName = `${p.firstName ?? ''} ${p.surname ?? ''}`.trim()
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      ...(p.email ? { customer_email: String(p.email) } : {}),
      line_items: [{ quantity: 1, price_data: { currency: 'gbp', unit_amount: SPORTING_LICENCE_PENCE, product_data: {
        name: 'Sporting Licence (Sport:80)',
        description: `${memberName} · EKNGB licence ${p.licenceNumber ?? ''} valid to ${ek.expiry}`.trim(),
      } } }],
      metadata: {
        source: 'forza-karate-website', kind: 'sporting', memberId: String(p.id ?? ''), memberName,
        email: String(p.email ?? ''), ekngbLicence: String(p.licenceNumber ?? ''), ekngbExpiry: ek.expiry ?? '',
      },
      success_url: `${SITE_URL}/members/sporting-licence/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/members/sporting-licence?cancelled=1`,
    })
    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Sporting licence checkout error:', err)
    return NextResponse.json({ error: UNAVAILABLE_MSG, unavailable: true }, { status: 503 })
  }
}
