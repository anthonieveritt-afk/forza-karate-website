import { describe, it, expect, vi } from 'vitest'
import { createHmac } from 'crypto'
const handled: unknown[] = []
vi.mock('@/lib/gocardless/fulfil', () => ({ handleGcEvent: async (ev: unknown) => { handled.push(ev); return [] } }))
const { POST } = await import('@/app/api/gocardless/webhook/route')
const body = JSON.stringify({ events: [{ id: 'EV1', resource_type: 'billing_requests', action: 'fulfilled', links: { billing_request: 'BRQTEST1' } }] })

describe('GoCardless webhook route', () => {
  it('503 when secret missing', async () => {
    delete process.env.GOCARDLESS_WEBHOOK_SECRET
    expect((await POST(new Request('http://x', { method: 'POST', body }))).status).toBe(503)
  })
  it('rejects bad signature', async () => {
    process.env.GOCARDLESS_WEBHOOK_SECRET = 'sec'
    expect((await POST(new Request('http://x', { method: 'POST', body, headers: { 'webhook-signature': 'bad' } }))).status).toBe(498)
  })
  it('valid signature → event handled', async () => {
    process.env.GOCARDLESS_WEBHOOK_SECRET = 'sec'
    const sig = createHmac('sha256', 'sec').update(body).digest('hex')
    const r = await POST(new Request('http://x', { method: 'POST', body, headers: { 'webhook-signature': sig } }))
    expect(r.status).toBe(200)
    expect(handled).toHaveLength(1)
  })
})
