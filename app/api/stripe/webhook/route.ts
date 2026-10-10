import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getForzaStripe } from '@/lib/paid/stripe'
import { postTrialToHonbu } from '@/lib/paid/honbu-trial'
import { emailConfigured, envAddresses, esc, sendEmail } from '@/lib/email'
import { gbp } from '@/lib/paid/catalogue'

// Stripe → POST /api/stripe/webhook, event: checkout.session.completed
// Signing secret: FORZA_STRIPE_WEBHOOK_SECRET (whsec_…)

function clubInbox(): string[] {
  const own = envAddresses('FORZA_BOOKINGS_EMAIL')
  return own.length ? own : envAddresses('CONTACT_TO_EMAIL')
}

async function notifyClub(subject: string, lines: string[]) {
  const to = clubInbox()
  if (!emailConfigured() || to.length === 0) {
    console.log('[stripe-webhook] email not configured; would have sent:', subject, lines.join(' / '))
    return
  }
  const r = await sendEmail({
    to, subject, text: lines.join('\n'),
    html: `<p>${lines.map(esc).join('<br/>')}</p>`,
  })
  if (!r.ok) console.error('[stripe-webhook] club email failed:', r)
}

async function handleTrial(s: Stripe.Checkout.Session) {
  const m = s.metadata || {}
  const paid = `PAID ${gbp(s.amount_total ?? 0)} trial — Stripe ${s.id}${s.livemode ? '' : ' (TEST MODE)'}`
  const honbu = await postTrialToHonbu({
    parentName: m.parentName || '', childName: m.childName, age: m.age, email: m.email || s.customer_details?.email || '',
    phone: m.phone || '', dateOfBirth: m.dateOfBirth, dojo: m.dojo || '', ageGroup: m.ageGroup || '', message: m.message,
  }, paid)
  if (!honbu.ok) console.error('[stripe-webhook] Club Honbu trial post failed:', honbu)

  await notifyClub(`Paid trial booked: ${m.childName || m.parentName} (${m.dojo})${s.livemode ? '' : ' [TEST]'}`, [
    `A ${gbp(s.amount_total ?? 0)} trial class has been paid for online.`,
    `Student: ${m.childName || m.parentName}${m.age ? ` (age ${m.age})` : ''}`,
    `Contact: ${m.parentName} · ${m.email} · ${m.phone}`,
    `Class: ${m.ageGroup} at ${m.dojo}`,
    m.message ? `Notes: ${m.message}` : '',
    `Stripe session: ${s.id}`,
    honbu.ok ? 'Added to Club Honbu trial list.' : '⚠ Could NOT add to Club Honbu automatically — please add by hand.',
  ].filter(Boolean))
}

export async function POST(req: NextRequest) {
  const stripe = getForzaStripe()
  const whsec = process.env.FORZA_STRIPE_WEBHOOK_SECRET?.trim()
  if (!stripe || !whsec) return NextResponse.json({ error: 'Not configured' }, { status: 503 })

  const sig = req.headers.get('stripe-signature')
  const raw = await req.text()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(raw, sig || '', whsec)
  } catch (err) {
    console.error('[stripe-webhook] bad signature:', err instanceof Error ? err.message : err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const s = event.data.object as Stripe.Checkout.Session
    const kind = s.metadata?.kind
    if (s.payment_status !== 'paid' && kind !== 'video') return NextResponse.json({ received: true, skipped: 'unpaid' })
    if (kind === 'trial') await handleTrial(s)
    else if (kind === 'guide') {
      await notifyClub(`Grading guide sold: ${s.metadata?.guides}`, [
        `${gbp(s.amount_total ?? 0)} — ${s.metadata?.guides} — ${s.customer_details?.email || ''}`, `Stripe session: ${s.id}`,
      ])
    } else if (kind === 'video') {
      await notifyClub('New video membership', [`${s.customer_details?.email || ''} subscribed.`, `Stripe session: ${s.id}`])
    }
  }
  return NextResponse.json({ received: true })
}
