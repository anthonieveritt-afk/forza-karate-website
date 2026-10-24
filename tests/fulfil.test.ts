import { describe, it, expect, vi, beforeEach } from 'vitest'

const blobs = new Map<string, unknown>()
const gcCalls: { path: string; key?: string }[] = []
let brStatus = 'fulfilled'
const created = new Map<string, unknown>() // idempotency key -> resource

vi.mock('@/lib/gocardless/store', () => ({
  loadSignup: async (id: string) => blobs.get(`${id}.signup`) ?? null,
  loadOutcome: async (id: string) => blobs.get(`${id}.done`) ?? null,
  saveOutcome: async (id: string, o: unknown) => { blobs.set(`${id}.done`, o) },
  saveSignup: async (id: string, s: unknown) => { blobs.set(`${id}.signup`, s) },
}))
vi.mock('@/lib/email', () => ({ sendEmail: vi.fn(async () => ({ ok: true })), envAddresses: () => ['admin@example.com'] }))
vi.mock('@/lib/gocardless/client', () => {
  class GcError extends Error { status = 0; body: unknown }
  return {
    GcError,
    gc: async (path: string, init?: { method?: string; idempotencyKey?: string }) => {
      gcCalls.push({ path, key: init?.idempotencyKey })
      if (path.startsWith('/billing_requests?')) return { billing_requests: [{ id: 'BRQTEST1', links: { mandate_request_mandate: 'MD1' } }] }
      if (path.startsWith('/billing_requests/')) return { billing_requests: { id: path.split('/')[2], status: brStatus, links: { customer: 'CU1', mandate_request_mandate: 'MD1' } } }
      if (path.startsWith('/mandates/')) return { mandates: { id: 'MD1', next_possible_charge_date: '2026-11-03', links: { customer: 'CU1' } } }
      if (path === '/subscriptions' && init?.method === 'POST') {
        const k = init.idempotencyKey!
        if (!created.has(k)) created.set(k, { id: `SB${created.size + 1}`, start_date: '2026-12-01' })
        return { subscriptions: created.get(k) }
      }
      throw new Error('unexpected ' + path)
    },
  }
})

const fetchMock = vi.fn()
vi.stubGlobal('fetch', fetchMock)
process.env.CLUB_HONBU_SIGNUP_SECRET = 'test'

const { processBillingRequest, handleGcEvent, handOffToHonbu } = await import('@/lib/gocardless/fulfil')
const { sendEmail } = await import('@/lib/email')

const signup = {
  plan: 'monthly_single', dojo: 'rayleigh', classTime: 'Sat', trialDate: '2026-10-31', startDate: '2026-11-07',
  students: [{ firstName: 'Test', surname: 'Adult', dateOfBirth: '1990-01-01', belt: 'White' }],
  parent: { givenName: 'Test', familyName: 'Adult', email: 't@example.com', phone: '0', address: 'a', city: 'c', postCode: 'p' },
  emergency: { name: 'e', phone: '1' }, consent: { photos: false, terms: true }, extrasPence: 7000, proRataPence: 1000,
  stripe: { sessionId: 'cs_test_1', paymentIntentId: 'pi_1', amountPence: 8000, paidAt: '2026-10-24T08:00:00Z' },
  createdAt: '2026-10-24T08:00:00Z',
}
const honbuOk = () => new Response(JSON.stringify({ ok: true, memberIds: [42] }), { status: 200 })
const honbuDown = () => new Response(JSON.stringify({ error: 'down' }), { status: 503 })

beforeEach(() => {
  blobs.clear(); created.clear(); gcCalls.length = 0; brStatus = 'fulfilled'
  fetchMock.mockReset(); vi.mocked(sendEmail).mockClear()
  blobs.set('BRQTEST1.signup', signup)
})

describe('processBillingRequest', () => {
  it('fulfilled path: creates subscription + Honbu member, no GC one-off payments', async () => {
    fetchMock.mockResolvedValue(honbuOk())
    const r = await processBillingRequest('BRQTEST1')
    expect(r.state).toBe('done')
    if (r.state === 'done') { expect(r.outcome.honbu.ok).toBe(true); expect(r.outcome.subscriptionId).toBe('SB1') }
    expect(gcCalls.some(c => c.path === '/payments')).toBe(false)
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('idempotent: second call does nothing new (no duplicate subscription or member)', async () => {
    fetchMock.mockResolvedValue(honbuOk())
    await processBillingRequest('BRQTEST1')
    const before = gcCalls.length
    const r = await processBillingRequest('BRQTEST1')
    expect(r.state).toBe('done')
    expect(gcCalls.length).toBe(before)
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(created.size).toBe(1)
  })

  it('concurrent page + webhook calls create one subscription (same idempotency key)', async () => {
    fetchMock.mockImplementation(async () => honbuOk())
    await Promise.all([processBillingRequest('BRQTEST1'), handleGcEvent({ resource_type: 'billing_requests', action: 'fulfilled', links: { billing_request: 'BRQTEST1' } })])
    expect(created.size).toBe(1)
    expect(new Set(gcCalls.filter(c => c.path === '/subscriptions').map(c => c.key))).toEqual(new Set(['sub-BRQTEST1']))
  })

  it('pending path: not fulfilled yet → pending, nothing created', async () => {
    brStatus = 'pending'
    const r = await processBillingRequest('BRQTEST1')
    expect(r).toEqual({ state: 'pending', status: 'pending' })
    expect(created.size).toBe(0)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('never touches the excluded test billing request', async () => {
    const r = await processBillingRequest('BRQ01M5N9Y05M4AE2YCQ99JT5F2FT')
    expect(r.state).toBe('unknown')
    expect(gcCalls.length).toBe(0)
  })
})

describe('Honbu retry + alert', () => {
  it('retries until Honbu succeeds', async () => {
    fetchMock.mockResolvedValueOnce(honbuDown()).mockResolvedValueOnce(honbuOk())
    const r = await handOffToHonbu('BRQTEST1', signup as never, { customerId: 'CU1', mandateId: 'MD1', subscriptionId: 'SB1', firstPaymentId: null, extrasPaymentId: null }, { waits: [0, 1] })
    expect(r.ok).toBe(true)
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })

  it('alerts admin once when Honbu keeps failing, then succeeds on a later run', async () => {
    fetchMock.mockImplementation(async () => honbuDown())
    const r1 = await processBillingRequest('BRQTEST1', { honbuWaits: [0, 1] })
    expect(r1.state === 'done' && r1.outcome.honbu.ok).toBe(false)
    expect(sendEmail).toHaveBeenCalledTimes(1)
    await processBillingRequest('BRQTEST1', { honbuWaits: [0] })
    expect(sendEmail).toHaveBeenCalledTimes(1) // not re-alerted
    fetchMock.mockImplementation(async () => honbuOk())
    const r3 = await processBillingRequest('BRQTEST1', { honbuWaits: [0] })
    expect(r3.state === 'done' && r3.outcome.honbu.ok).toBe(true)
    expect(created.size).toBe(1)
  })
})

describe('webhook events', () => {
  it('billing_requests fulfilled → processed', async () => {
    fetchMock.mockResolvedValue(honbuOk())
    expect(await handleGcEvent({ resource_type: 'billing_requests', action: 'fulfilled', links: { billing_request: 'BRQTEST1' } })).toEqual(['BRQTEST1'])
    expect(blobs.has('BRQTEST1.done')).toBe(true)
  })
  it('mandates created → finds the website billing request and processes it', async () => {
    fetchMock.mockResolvedValue(honbuOk())
    expect(await handleGcEvent({ resource_type: 'mandates', action: 'created', links: { mandate: 'MD1' } })).toEqual(['BRQTEST1'])
  })
  it('ignores events for billing requests the website did not create (e.g. Honbu-only)', async () => {
    expect(await handleGcEvent({ resource_type: 'billing_requests', action: 'fulfilled', links: { billing_request: 'BRQOTHER' } })).toEqual([])
    expect(await handleGcEvent({ resource_type: 'payments', action: 'confirmed', links: { payment: 'PM1' } })).toEqual([])
  })
})
