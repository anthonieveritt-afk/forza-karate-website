import { NextRequest, NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getForzaStripe } from '@/lib/paid/stripe'
import { postTrialToHonbu } from '@/lib/paid/honbu-trial'
import { emailConfigured, envAddresses, esc, sendEmail } from '@/lib/email'
import { gbp } from '@/lib/paid/catalogue'
import { closedWeek } from '@/lib/paid/closed-weeks'
import { clubNotifyHtml, parentConfirmationHtml, type TrialInfo } from '@/lib/paid/trial-email-html'
import { claimOnce, releaseOnce } from '@/lib/paid/once'
import { recordCardPaid } from '@/lib/gocardless/fulfil'

// Stripe → POST /api/stripe/webhook, event: checkout.session.completed
// Signing secret: FORZA_STRIPE_WEBHOOK_SECRET (whsec_…)

function clubInbox(): string[] {
  const own = envAddresses('FORZA_BOOKINGS_EMAIL')
  return own.length ? own : envAddresses('CONTACT_TO_EMAIL')
}

async function notifyClub(subject: string, lines: string[], html?: string) {
  const to = clubInbox()
  if (!emailConfigured() || to.length === 0) {
    console.log('[stripe-webhook] email not configured; would have sent:', subject, lines.join(' / '))
    return
  }
  const r = await sendEmail({
    to, subject, text: lines.join('\n'),
    html: html ?? `<p>${lines.map(esc).join('<br/>')}</p>`,
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
  // Club Honbu is the record of the booking. If it can't be reached, fail so Stripe retries
  // (the once-marker is released, so the retry runs in full; Club Honbu skips duplicate trials).
  if (!honbu.ok) throw new Error(`Club Honbu trial post failed: ${honbu.status ?? ''} ${honbu.detail ?? ''}`)

  // Confirmation to the customer (Stripe also sends its own receipt if enabled in the dashboard).
  const to = m.email || s.customer_details?.email
  const info: TrialInfo = { parentName: m.parentName, childName: m.childName, age: m.age, email: m.email, phone: m.phone, dojo: m.dojo, ageGroup: m.ageGroup, message: m.message, amount: gbp(s.amount_total ?? 0), sessionId: s.id, test: !s.livemode, honbuOk: honbu.ok, closed: closedWeek() }
  if (to && emailConfigured()) {
    const lines = [
      `Hi ${(m.parentName || '').split(' ')[0] || 'there'},`,
      '',
      `Thanks for booking a trial class at Forza Karate${m.childName ? ` for ${m.childName}` : ''} — your ${gbp(s.amount_total ?? 0)} payment has gone through.`,
      `Class: ${m.ageGroup} at ${m.dojo}.`,
      info.closed
        ? `This week is ${info.closed.label}, so there are no classes. We'll confirm your trial for the week beginning ${info.closed.backMonday} — the first week back.`
        : `We'll be in touch within 72 hours to confirm the time.`,
      'No kit needed — just wear something comfy. Come and try it out, then ask questions!',
      '',
      'Please note: the £10 is for the trial class only and is not taken off membership. If you decide to join, membership starts the week after your trial at the full monthly rate.',
      '',
      'Forza Karate Club',
    ]
    const r = await sendEmail({ to, subject: 'Your Forza Karate trial class is booked', text: lines.join('\n'), html: parentConfirmationHtml(info), replyTo: 'hello@forzakarate.co.uk' })
    if (!r.ok) console.error('[stripe-webhook] customer email failed:', r)
  }

  await notifyClub(`Paid trial booked: ${m.childName || m.parentName} (${m.dojo})${s.livemode ? '' : ' [TEST]'}`, [
    `A ${gbp(s.amount_total ?? 0)} trial class has been paid for online.`,
    info.closed ? `${info.closed.label.toUpperCase()} — first class next teaching week (w/c ${info.closed.backMonday}). Don't book mid-break.` : '',
    `Student: ${m.childName || m.parentName}${m.age ? ` (age ${m.age})` : ''}`,
    `Contact: ${m.parentName} · ${m.email} · ${m.phone}`,
    `Class: ${m.ageGroup} at ${m.dojo}`,
    m.message ? `Notes: ${m.message}` : '',
    `Stripe session: ${s.id}`,
    'Pricing: the £10 is for the trial only (not deducted from membership). If they join, membership starts the week after at the full monthly rate.',
    honbu.ok ? 'Added to Club Honbu trial list.' : '⚠ Could NOT add to Club Honbu automatically — please add by hand.',
  ].filter(Boolean), clubNotifyHtml(info))
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
    if (kind !== 'trial' && kind !== 'guide' && kind !== 'video' && kind !== 'membership') return NextResponse.json({ received: true, skipped: 'not ours' })

    // Idempotency: one checkout session = one set of emails, however often Stripe delivers it.
    const onceKey = `checkout-${s.id}`
    const claim = await claimOnce(onceKey)
    if (claim === 'duplicate') return NextResponse.json({ received: true, duplicate: true })
    if (claim === 'unavailable') console.warn('[stripe-webhook] once-marker unavailable; processing without duplicate protection', s.id)

    try {
      if (kind === 'trial') await handleTrial(s)
      else if (kind === 'guide') {
        await notifyClub(`Grading guide sold: ${s.metadata?.guides}`, [
          `${gbp(s.amount_total ?? 0)} — ${s.metadata?.guides} — ${s.customer_details?.email || ''}`, `Stripe session: ${s.id}`,
        ])
      } else if (kind === 'video') {
        await notifyClub('New video membership', [`${s.customer_details?.email || ''} subscribed.`, `Stripe session: ${s.id}`])
      } else if (kind === 'membership') {
        // Stage 1: card paid → backup (blob + admin email with full details) and create the member in
        // Club Honbu straight away as "awaiting Direct Debit". Idempotent with the pay-done page.
        const signupId = s.metadata?.signupId
        if (signupId && /^MSU[0-9A-F]+$/i.test(signupId)) {
          const pi = typeof s.payment_intent === 'string' ? s.payment_intent : s.payment_intent?.id ?? null
          const r = await recordCardPaid(signupId, { sessionId: s.id, paymentIntentId: pi, amountPence: s.amount_total ?? 0, paidAt: new Date((s.created ?? Date.now() / 1000) * 1000).toISOString() })
          // Honbu down: admin already alerted with the details; fail so Stripe retries (up to 3 days).
          if (r.state === 'honbu-failed') throw new Error(`Club Honbu membership hand-off failed: ${r.outcome?.honbu.detail ?? ''}`)
          if (r.state === 'unknown') await notifyClub(`Membership paid but sign-up details not found (${signupId})`, [`Stripe session: ${s.id}`, `Email: ${s.customer_details?.email || ''}`])
        }
      }
    } catch (err) {
      console.error('[stripe-webhook] processing failed, asking Stripe to retry:', err instanceof Error ? err.message : err)
      if (claim === 'claimed') await releaseOnce(onceKey)
      return NextResponse.json({ error: 'Processing failed' }, { status: 500 })
    }
  }
  return NextResponse.json({ received: true })
}
