import { describe, it, expect, vi, beforeEach } from 'vitest'
const recordCardPaid = vi.fn()
let event: any
vi.mock('@/lib/gocardless/fulfil', () => ({ recordCardPaid }))
vi.mock('@/lib/paid/stripe', () => ({ getForzaStripe: () => ({ webhooks: { constructEvent: () => event } }) }))
vi.mock('@/lib/paid/honbu-trial', () => ({ postTrialToHonbu: vi.fn() }))
vi.mock('@/lib/email', () => ({ emailConfigured: () => false, envAddresses: () => [], esc: (s: string) => s, sendEmail: vi.fn() }))
const released: string[] = []
vi.mock('@/lib/paid/once', () => ({ claimOnce: async () => 'claimed', releaseOnce: async (k: string) => { released.push(k) } }))
process.env.FORZA_STRIPE_WEBHOOK_SECRET = 'whsec_x'
const { POST } = await import('@/app/api/stripe/webhook/route')
const req = () => new Request('http://x', { method: 'POST', body: '{}', headers: { 'stripe-signature': 's' } }) as any

beforeEach(() => {
  recordCardPaid.mockReset(); released.length = 0
  event = { type: 'checkout.session.completed', data: { object: { id: 'cs_test_9', payment_status: 'paid', amount_total: 8000, payment_intent: 'pi_9', created: 1_790_000_000, metadata: { kind: 'membership', signupId: 'MSUABC123' } } } }
})

describe('Stripe webhook → stage 1', () => {
  it('membership payment creates the Honbu member straight away', async () => {
    recordCardPaid.mockResolvedValue({ state: 'recorded' })
    expect((await POST(req())).status).toBe(200)
    expect(recordCardPaid).toHaveBeenCalledWith('MSUABC123', expect.objectContaining({ sessionId: 'cs_test_9', paymentIntentId: 'pi_9', amountPence: 8000 }))
  })
  it('Honbu down → 500 so Stripe retries, once-marker released', async () => {
    recordCardPaid.mockResolvedValue({ state: 'honbu-failed', outcome: { honbu: { ok: false, detail: 'down' } } })
    expect((await POST(req())).status).toBe(500)
    expect(released).toEqual(['checkout-cs_test_9'])
  })
})
