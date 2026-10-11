import { NextResponse } from 'next/server'
import { gc } from '@/lib/gocardless/client'

export const runtime = 'nodejs'

// Cancels an unfinished billing request (when the parent closes the drop-in).
export async function POST(req: Request) {
  const { billingRequestId } = await req.json().catch(() => ({}))
  if (typeof billingRequestId !== 'string' || !/^BRQ[0-9A-Z]+$/.test(billingRequestId))
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  try {
    const { billing_requests: br } = await gc(`/billing_requests/${billingRequestId}`)
    if (br.status === 'fulfilled' || br.status === 'cancelled') return NextResponse.json({ status: br.status })
    const { billing_requests: c } = await gc(`/billing_requests/${billingRequestId}/actions/cancel`, { method: 'POST', body: { data: {} } })
    return NextResponse.json({ status: c.status })
  } catch {
    return NextResponse.json({ error: 'Could not cancel' }, { status: 502 })
  }
}
