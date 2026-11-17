// Access-code discount on the membership join: the SERVER recomputes every amount; the browser's price is never used.
import { describe, it, expect, vi, beforeEach } from 'vitest'

const stripeCalls: any[] = []
const saved = new Map<string, any>()
let honbuPercent: number | null = 50
vi.mock('@/lib/paid/stripe', () => ({
  getForzaStripe: () => ({ checkout: { sessions: { create: async (p: any) => { stripeCalls.push(p); return { id: 'cs_test_1', url: 'https://stripe.test/pay' } } } } }),
  SITE_URL: 'https://forzakarate.co.uk', UNAVAILABLE_MSG: 'unavailable',
}))
vi.mock('@/lib/trialJoin', () => ({ verifyTrialJoinToken: () => null }))
vi.mock('@/lib/gocardless/store', () => ({ newSignupId: () => 'MSUTEST0001', saveSignup: async (id: string, s: any) => { saved.set(id, s) }, loadSignup: async (id: string) => saved.get(id) ?? null }))
vi.stubGlobal('fetch', vi.fn(async () => new Response(JSON.stringify(honbuPercent == null ? { valid: false } : { valid: true, discount_percent: honbuPercent }), { status: 200 })))

const { POST: checkout } = await import('@/app/api/membership/checkout/route')
const { discountedMonthlyPence, signupMonthlyPence, proRataPence, PLANS, suitOptions } = await import('@/lib/gocardless/plans')
const { honbuBody } = await import('@/lib/gocardless/fulfil')

const size = suitOptions()[0].sizes[0]
const body = (over: Record<string, unknown> = {}) => new Request('https://forzakarate.co.uk/api/membership/checkout', {
  method: 'POST', headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    plan: 'monthly_single', dojo: 'rayleigh', classTime: 'Tuesday', trialDate: '2026-11-03', // start 10 Nov -> 75% band
    students: [{ firstName: 'Sam', surname: 'Test', dateOfBirth: '2015-05-05', belt: 'White', suit: { key: 'blitz-gi', size }, licence: { type: 'first_time' } }],
    parent: { givenName: 'Pat', familyName: 'Test', email: 'pat@example.com', phone: '07000000000', address: '1 Road', city: 'Town', postCode: 'AB1 2CD' },
    consent: { terms: true, photos: false }, ...over }),
})
const lineAmounts = () => stripeCalls.at(-1).line_items.map((l: any) => l.price_data.unit_amount)

beforeEach(() => { stripeCalls.length = 0; saved.clear(); honbuPercent = 50 })

describe('fee maths', () => {
  it('50% of £50 = £25; 25% of £90 = £67.50; rounds to the penny', () => {
    expect(discountedMonthlyPence(5000, 50)).toBe(2500)
    expect(discountedMonthlyPence(9000, 25)).toBe(6750)
    expect(discountedMonthlyPence(5000, 33)).toBe(3350)
    expect(discountedMonthlyPence(5001, 50)).toBe(2501)
  })
  it('100% is £0, over 100 is clamped, negative is ignored', () => {
    expect(discountedMonthlyPence(12000, 100)).toBe(0)
    expect(discountedMonthlyPence(12000, 250)).toBe(0)
    expect(discountedMonthlyPence(5000, -10)).toBe(5000)
  })
  it('signupMonthlyPence uses the discounted fee only when a discount was applied', () => {
    expect(signupMonthlyPence({ plan: 'monthly_single' })).toBe(5000)
    expect(signupMonthlyPence({ plan: 'monthly_single', discount: { monthlyPence: 2500 } })).toBe(2500)
  })
})

describe('checkout (server recomputes everything)', () => {
  it('no code: unchanged — pro-rata of £50 (75% = £37.50) + suit + licence', async () => {
    const r = await checkout(body())
    expect(r.status).toBe(200)
    expect((await r.json()).monthlyPence).toBe(5000)
    expect(lineAmounts()[0]).toBe(proRataPence(5000, '2026-11-10'))
    expect(saved.get('MSUTEST0001').discount).toBeNull()
  })
  it('50% code: pro-rata is worked out on £25, monthly is £25, suit/licence are full price', async () => {
    const full = lineAmounts
    const r = await checkout(body({ discountCode: 'half' }))
    const d = await r.json()
    expect(d.monthlyPence).toBe(2500)
    expect(lineAmounts()[0]).toBe(proRataPence(2500, '2026-11-10'))
    expect(saved.get('MSUTEST0001').discount).toMatchObject({ code: 'HALF', percent: 50, fullMonthlyPence: 5000, monthlyPence: 2500 })
    expect(saved.get('MSUTEST0001').proRataPence).toBe(proRataPence(2500, '2026-11-10'))
    expect(stripeCalls.at(-1).metadata.discountCode).toBe('HALF')
    void full
  })
  it('ignores any price/percent the browser sends', async () => {
    await checkout(body({ discountCode: 'HALF', discountPercent: 100, monthlyPence: 1, proRataPence: 1, discount: { percent: 100, monthlyPence: 0 } }))
    expect(saved.get('MSUTEST0001').discount.percent).toBe(50)
    expect(saved.get('MSUTEST0001').discount.monthlyPence).toBe(2500)
    expect(lineAmounts()[0]).toBe(proRataPence(2500, '2026-11-10'))
  })
  it('an invalid or used-up code is refused with a clear message and nothing is charged', async () => {
    honbuPercent = null
    const r = await checkout(body({ discountCode: 'NOPE' }))
    expect(r.status).toBe(400)
    expect((await r.json()).error).toMatch(/isn't valid/)
    expect(stripeCalls.length).toBe(0)
  })
  it('100% code: £0 monthly, no pro-rata line, only suit + licence on the card', async () => {
    honbuPercent = 100
    const r = await checkout(body({ discountCode: 'FREE' }))
    expect(r.status).toBe(200)
    expect((await r.json()).monthlyPence).toBe(0)
    expect(stripeCalls.at(-1).line_items.length).toBe(1)
    expect(lineAmounts()[0]).toBe(saved.get('MSUTEST0001').extrasPence)
    expect(saved.get('MSUTEST0001').proRataPence).toBe(0)
  })
})

describe('hand-off to Club Honbu', () => {
  const base = { signupId: 'MSUTEST0001', plan: 'monthly_single' as const, dojo: 'rayleigh' as const, classTime: 'Tue', trialDate: '2026-11-03', startDate: '2026-11-10',
    students: [], parent: { givenName: 'P', familyName: 'T', email: 'p@example.com', phone: '0', address: 'a', city: 'c', postCode: 'p' }, emergency: { name: 'e', phone: '1' },
    consent: { photos: false, terms: true }, extrasPence: 4000, proRataPence: 1875, createdAt: 'x', stripe: { sessionId: 'cs_1', paymentIntentId: 'pi_1', amountPence: 5875, paidAt: 'x' } }
  it('sends the discounted fee, the full fee and the code; waits for Direct Debit', () => {
    const b: any = honbuBody(null, { ...base, discount: { code: 'HALF', percent: 50, fullMonthlyPence: 5000, monthlyPence: 2500 } } as any, null)
    expect(b.monthlyFeePence).toBe(2500); expect(b.fullMonthlyFeePence).toBe(5000)
    expect(b.discount).toEqual({ code: 'HALF', percent: 50 })
    expect(b.stage).toBe('card_paid_awaiting_direct_debit'); expect(b.firstPaymentPence).toBe(1875)
  })
  it('£0 monthly is sent as complete straight away (no Direct Debit to wait for)', () => {
    const b: any = honbuBody(null, { ...base, proRataPence: 0, discount: { code: 'FREE', percent: 100, fullMonthlyPence: 5000, monthlyPence: 0 } } as any, null)
    expect(b.monthlyFeePence).toBe(0); expect(b.stage).toBe('complete'); expect(b.discount.percent).toBe(100)
  })
  it('no code: exactly as before', () => {
    const b: any = honbuBody(null, base as any, null)
    expect(b.monthlyFeePence).toBe(PLANS.monthly_single.price); expect(b.discount).toBeUndefined(); expect(b.stage).toBe('card_paid_awaiting_direct_debit')
  })
})
