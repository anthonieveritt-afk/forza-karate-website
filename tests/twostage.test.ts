// Two-stage Club Honbu hand-off: member created at card payment, updated (never duplicated) at Direct Debit.
import { describe, it, expect, vi, beforeEach } from 'vitest'

const blobs = new Map<string, any>()
const subs = new Map<string, any>()
let brStatus = 'fulfilled'
vi.mock('@/lib/gocardless/store', () => ({
  loadSignup: async (id: string) => blobs.get(`${id}.signup`) ?? null,
  loadOutcome: async (id: string) => blobs.get(`${id}.done`) ?? null,
  saveOutcome: async (id: string, o: unknown) => { blobs.set(`${id}.done`, o) },
  loadCardOutcome: async (id: string) => blobs.get(`${id}.card`) ?? null,
  saveCardOutcome: async (id: string, o: unknown) => { blobs.set(`${id}.card`, o) },
}))
vi.mock('@/lib/email', () => ({ sendEmail: vi.fn(async () => ({ ok: true })), envAddresses: () => ['admin@example.com'] }))
vi.mock('@/lib/gocardless/client', () => ({
  GcError: class extends Error { status = 0 },
  gc: async (path: string, init?: { method?: string; idempotencyKey?: string }) => {
    if (path.startsWith('/billing_requests?')) return { billing_requests: [{ id: 'BRQTEST2', links: { mandate_request_mandate: 'MD1' } }] }
    if (path.startsWith('/billing_requests/')) return { billing_requests: { id: 'BRQTEST2', status: brStatus, links: { customer: 'CU1', mandate_request_mandate: 'MD1' } } }
    if (path.startsWith('/mandates/')) return { mandates: { id: 'MD1', next_possible_charge_date: '2026-11-03', links: { customer: 'CU1' } } }
    if (path === '/subscriptions') { const k = init!.idempotencyKey!; if (!subs.has(k)) subs.set(k, { id: `SB${subs.size + 1}`, start_date: '2026-12-01' }); return { subscriptions: subs.get(k) } }
    throw new Error('unexpected ' + path)
  },
}))

// In-memory Club Honbu with the real endpoint's rules: upsert on signup key, re-use member by name+DOB,
// stage never goes back from "complete", GoCardless ids COALESCEd in.
type Row = { stage: string; memberIds: number[]; mandateId: string | null; subscriptionId: string | null }
const honbu = { up: true, rows: new Map<string, Row>(), members: [] as { id: number; key: string }[], calls: 0 }
function honbuHandle(b: any) {
  honbu.calls++
  if (!honbu.up) return new Response(JSON.stringify({ error: 'down' }), { status: 503 })
  const key = b.model === 'card-then-dd' ? `signup:${b.signupId}` : `brq:${b.billingRequestId}`
  if (b.model === 'card-then-dd' && !['card_paid_awaiting_direct_debit', 'complete'].includes(b.stage)) return new Response('{"error":"Unknown stage"}', { status: 400 })
  const dd = b.payments?.directDebit ?? b.gocardless
  let row = honbu.rows.get(key)
  if (!row) {
    const ids = b.students.map((st: any) => {
      const k = `${st.firstName}|${st.surname}|${st.dateOfBirth}`
      const ex = honbu.members.find(m => m.key === k)
      if (ex) return ex.id
      const id = honbu.members.length + 1; honbu.members.push({ id, key: k }); return id
    })
    row = { stage: b.stage ?? 'complete', memberIds: ids, mandateId: null, subscriptionId: null }
    honbu.rows.set(key, row)
  }
  if (row.stage !== 'complete') row.stage = b.stage ?? 'complete'
  row.mandateId = dd?.mandateId ?? row.mandateId
  row.subscriptionId = dd?.subscriptionId ?? row.subscriptionId
  return new Response(JSON.stringify({ ok: true, memberIds: row.memberIds }), { status: 200 })
}
vi.stubGlobal('fetch', vi.fn(async (_u: string, init: any) => honbuHandle(JSON.parse(init.body))))
process.env.CLUB_HONBU_SIGNUP_SECRET = 'test'

const { recordCardPaid, processBillingRequest, handleGcEvent, honbuBody } = await import('@/lib/gocardless/fulfil')
const { sendEmail } = await import('@/lib/email')

const stripe = { sessionId: 'cs_test_2', paymentIntentId: 'pi_2', amountPence: 8000, paidAt: '2026-10-24T08:00:00Z' }
const base = {
  signupId: 'MSUABC123', plan: 'monthly_single', dojo: 'rayleigh', classTime: 'Sat', trialDate: '2026-10-31', startDate: '2026-11-07',
  students: [{ firstName: 'Test', surname: 'Adult', dateOfBirth: '1990-01-01', belt: 'White' }],
  parent: { givenName: 'Test', familyName: 'Adult', email: 't@example.com', phone: '0', address: 'a', city: 'c', postCode: 'p' },
  emergency: { name: 'e', phone: '1' }, consent: { photos: false, terms: true }, extrasPence: 7000, proRataPence: 1000, createdAt: '2026-10-24T08:00:00Z',
}
// What start-dd leaves behind once the BR exists: the signup under MSU and BRQ, with stripe + BR id.
const linkBR = () => { const s = { ...base, stripe, billingRequestId: 'BRQTEST2' }; blobs.set('MSUABC123.signup', s); blobs.set('BRQTEST2.signup', s) }

const steps = {
  stripeWebhook: () => recordCardPaid('MSUABC123', stripe, { honbuWaits: [0] }),
  payDone: () => recordCardPaid('MSUABC123', stripe, { honbuWaits: [0] }),
  doneRedirect: () => processBillingRequest('BRQTEST2', { honbuWaits: [0] }),
  gcWebhook: () => handleGcEvent({ resource_type: 'billing_requests', action: 'fulfilled', links: { billing_request: 'BRQTEST2' } }),
  gcMandateWebhook: () => handleGcEvent({ resource_type: 'mandates', action: 'created', links: { mandate: 'MD1' } }),
}
const assertFinal = () => {
  expect(honbu.members).toHaveLength(1)
  expect(honbu.rows.size).toBe(1)
  const row = honbu.rows.get('signup:MSUABC123')!
  expect(row.stage).toBe('complete'); expect(row.mandateId).toBe('MD1'); expect(row.subscriptionId).toBe('SB1')
  expect(subs.size).toBe(1)
  expect(blobs.get('BRQTEST2.done').honbu.ok).toBe(true)
}

beforeEach(() => {
  blobs.clear(); subs.clear(); brStatus = 'fulfilled'
  honbu.up = true; honbu.rows.clear(); honbu.members = []; honbu.calls = 0
  vi.mocked(sendEmail).mockClear()
  blobs.set('MSUABC123.signup', { ...base })
})

describe('stage 1: card paid', () => {
  it('creates the member in Honbu immediately as awaiting Direct Debit, with a backup email', async () => {
    const r = await steps.stripeWebhook()
    expect(r.state).toBe('recorded')
    expect(honbu.rows.get('signup:MSUABC123')).toMatchObject({ stage: 'card_paid_awaiting_direct_debit', memberIds: [1] })
    expect(sendEmail).toHaveBeenCalledTimes(1)
    const mail = vi.mocked(sendEmail).mock.calls[0][0] as any
    expect(mail.text).toContain('DOB 1990-01-01'); expect(mail.text).toContain('Emergency: e 1')
    expect(blobs.get('MSUABC123.card').honbu.ok).toBe(true)
  })
  it('Stripe webhook + pay-done together: one member, one backup email', async () => {
    await Promise.all([steps.stripeWebhook(), steps.payDone()])
    await steps.stripeWebhook() // Stripe redelivery
    expect(honbu.members).toHaveLength(1)
    expect(honbu.rows.size).toBe(1)
  })
  it('payload matches Honbu card-then-dd contract', () => {
    const b: any = honbuBody(null, { ...base, stripe } as never, null)
    expect(b).toMatchObject({ model: 'card-then-dd', signupId: 'MSUABC123', stage: 'card_paid_awaiting_direct_debit', payments: { card: { sessionId: 'cs_test_2' } } })
    expect(b.billingRequestId).toBeUndefined(); expect(b.gocardless).toBeUndefined()
  })
})

describe('stage 2: GoCardless confirms → same member updated', () => {
  it('card then DD: member updated with mandate + subscription, no duplicate', async () => {
    await steps.stripeWebhook(); linkBR()
    await steps.doneRedirect()
    await steps.gcWebhook()
    assertFinal()
  })
  it('DD finishes before stage 1 runs: stage 1 does not downgrade or duplicate', async () => {
    linkBR()
    await steps.doneRedirect()
    await steps.stripeWebhook()
    assertFinal()
  })
  it('legacy sign-up (no Stripe) still uses billingRequestId key', () => {
    const b: any = honbuBody('BRQTEST2', { ...base, signupId: undefined } as never, { customerId: 'CU1', mandateId: 'MD1', subscriptionId: 'SB1', firstPaymentId: null, extrasPaymentId: null })
    expect(b.model).toBeUndefined(); expect(b.billingRequestId).toBe('BRQTEST2')
  })
})

describe('both services up → zero failure paths (every ordering)', () => {
  const names = Object.keys(steps) as (keyof typeof steps)[]
  const perms = (a: string[]): string[][] => a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map(p => [x, ...p]))
  for (const order of perms(names)) {
    it(order.join(' → '), async () => {
      linkBR() // BR exists once the customer reaches GoCardless
      for (const n of order) {
        const r: any = await steps[n as keyof typeof steps]()
        if (n === 'stripeWebhook' || n === 'payDone') expect(r.state).toBe('recorded')
        if (n === 'doneRedirect') expect(r.state === 'done' && r.outcome.honbu.ok).toBe(true)
      }
      assertFinal()
      expect(vi.mocked(sendEmail).mock.calls.filter((c: any) => /Action needed/.test(c[0].subject))).toHaveLength(0)
    })
  }
  it('both stage-1 paths and both stage-2 paths at once', async () => {
    linkBR()
    await Promise.all(Object.values(steps).map(f => f()))
    await steps.doneRedirect()
    assertFinal()
  })
})

describe('Club Honbu down', () => {
  it('details kept (blob + backup email), admin alerted once, retried later with no duplicate', async () => {
    honbu.up = false
    const r = await recordCardPaid('MSUABC123', stripe, { honbuWaits: [0, 1, 1] })
    expect(r.state).toBe('honbu-failed')
    expect(honbu.calls).toBe(3) // retried
    expect(blobs.get('MSUABC123.card')).toMatchObject({ honbu: { ok: false }, stripe: { sessionId: 'cs_test_2' } })
    const subjects = vi.mocked(sendEmail).mock.calls.map((c: any) => c[0].subject)
    expect(subjects.filter(s => /New member paid by card/.test(s))).toHaveLength(1)
    expect(subjects.filter(s => /Action needed/.test(s))).toHaveLength(1)
    await recordCardPaid('MSUABC123', stripe, { honbuWaits: [0] }) // Stripe retry while still down
    expect(vi.mocked(sendEmail)).toHaveBeenCalledTimes(2) // no repeat emails
    honbu.up = true
    expect((await recordCardPaid('MSUABC123', stripe, { honbuWaits: [0] })).state).toBe('recorded') // reconcile / Stripe retry
    linkBR(); await steps.doneRedirect()
    assertFinal()
  })
})
