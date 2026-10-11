import { NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { processBillingRequest } from '@/lib/gocardless/fulfil'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GoCardless webhook for the website sign-up. Verifies Webhook-Signature
// (HMAC-SHA256 of the raw body with GOCARDLESS_WEBHOOK_SECRET).
export async function POST(req: Request) {
  const secret = process.env.GOCARDLESS_WEBHOOK_SECRET?.trim()
  if (!secret) return NextResponse.json({ error: 'not configured' }, { status: 503 })
  const raw = await req.text()
  const sig = req.headers.get('webhook-signature') ?? ''
  const expected = createHmac('sha256', secret).update(raw).digest('hex')
  const a = Buffer.from(sig), b = Buffer.from(expected)
  if (a.length !== b.length || !timingSafeEqual(a, b)) return new NextResponse('Invalid signature', { status: 498 })

  let events: any[] = []
  try { events = JSON.parse(raw).events ?? [] } catch { return NextResponse.json({ error: 'bad json' }, { status: 400 }) }
  for (const ev of events) {
    if (ev.resource_type === 'billing_requests' && ev.action === 'fulfilled' && ev.links?.billing_request) {
      try { await processBillingRequest(ev.links.billing_request) } catch (e) { console.error('webhook fulfil failed', ev.id, e) }
    }
  }
  return NextResponse.json({ ok: true })
}
