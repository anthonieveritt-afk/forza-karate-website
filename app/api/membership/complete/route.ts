import { NextResponse } from 'next/server'
import { processBillingRequest } from '@/lib/gocardless/fulfil'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  const { billingRequestId } = await req.json().catch(() => ({}))
  if (typeof billingRequestId !== 'string' || !/^BRQ[0-9A-Z]+$/.test(billingRequestId))
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  try {
    const r = await processBillingRequest(billingRequestId)
    if (r.state === 'done')
      return NextResponse.json({ state: 'done', subscriptionStart: r.outcome.subscriptionStart, recorded: r.outcome.honbu.ok })
    if (r.state === 'pending') return NextResponse.json({ state: 'pending', status: r.status })
    return NextResponse.json({ state: 'unknown' }, { status: 404 })
  } catch (e) {
    console.error('membership complete error', e)
    return NextResponse.json({ error: 'Could not confirm yet' }, { status: 502 })
  }
}
