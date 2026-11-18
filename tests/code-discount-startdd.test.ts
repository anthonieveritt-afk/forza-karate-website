// 100% access code: after the card payment there is no Direct Debit step (no GoCardless billing request is created).
import { describe, it, expect, vi } from 'vitest'

const gcCalls: string[] = []
const recorded: string[] = []
vi.mock('next/server', async () => {
  const actual: any = await vi.importActual('next/server')
  return { ...actual, after: (fn: () => unknown) => { void fn() } }
})
vi.mock('@/lib/paid/stripe', () => ({
  getForzaStripe: () => ({ checkout: { sessions: { retrieve: async () => ({ id: 'cs_test_free', payment_status: 'paid', amount_total: 4000, payment_intent: 'pi_1', metadata: { kind: 'membership', signupId: 'MSUFEED0001' } }) } } }),
}))
vi.mock('@/lib/gocardless/client', () => ({ gc: async (p: string) => { gcCalls.push(p); return {} }, gcEnv: () => 'sandbox', gcConfigured: () => true, GcError: class extends Error {} }))
vi.mock('@/lib/gocardless/fulfil', () => ({ recordCardPaid: async (id: string) => { recorded.push(id) } }))
vi.mock('@/lib/gocardless/store', () => ({
  saveSignup: async () => {},
  loadSignup: async () => ({ plan: 'monthly_single', proRataPence: 0, extrasPence: 4000, discount: { code: 'FREE', percent: 100, fullMonthlyPence: 5000, monthlyPence: 0 } }),
}))

const { POST } = await import('@/app/api/membership/start-dd/route')

describe('start-dd with a 100% code', () => {
  it('records the sign-up with Club Honbu, creates no GoCardless billing request and tells the page there is no Direct Debit', async () => {
    const r = await POST(new Request('https://forzakarate.co.uk/api/membership/start-dd', { method: 'POST', body: JSON.stringify({ session_id: 'cs_test_free' }) }))
    const d = await r.json()
    expect(r.status).toBe(200)
    expect(d.noDirectDebit).toBe(true)
    expect(gcCalls).toEqual([])
    expect(recorded).toEqual(['MSUFEED0001'])
  })
})
