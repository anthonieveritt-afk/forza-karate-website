/* eslint-disable @typescript-eslint/no-explicit-any -- offline test with hand-rolled mocks of untyped HTTP payloads */
// Offline tests for the join form: discount codes + card-at-sign-up / Direct Debit split.
// Everything external is mocked: Stripe (local HTTP mock via STRIPE_API_HOST), Vercel Blob
// (VERCEL_BLOB_API_URL -> local mock), GoCardless, Resend and Club Honbu (fetch interceptor).
// Any other outbound request fails the test. Uses FAKE keys only; run with real keys unset:
//   env -u FORZA_STRIPE_SECRET_KEY -u GOCARDLESS_RW_TOKEN -u GOCARDLESS_ACCESS_TOKEN -u RESEND_API_KEY \
//     -u FORZA_RESEND_API_KEY -u FORZA_STRIPE_WEBHOOK_SECRET npx tsx --conditions=react-server scripts/test-membership-payments.mts
import http from 'node:http'
import assert from 'node:assert/strict'

for (const k of ['FORZA_STRIPE_SECRET_KEY', 'GOCARDLESS_RW_TOKEN', 'GOCARDLESS_ACCESS_TOKEN', 'RESEND_API_KEY', 'FORZA_RESEND_API_KEY', 'FORZA_STRIPE_WEBHOOK_SECRET'])
  if (process.env[k]) { console.error(`Refusing to run: ${k} is set. Unset real keys first.`); process.exit(2) }

// ── Local mock server: Stripe + Blob ────────────────────────────────────────────────
const blobs = new Map<string, { body: string; uploadedAt: string }>()
const stripeCreates: Record<string, any>[] = []
const sessions = new Map<string, any>()
let stripePaid = true
let seq = 0
const server = http.createServer(async (req, res) => {
  const chunks: Buffer[] = []
  for await (const c of req) chunks.push(c as Buffer)
  const body = Buffer.concat(chunks).toString('utf8')
  const u = new URL(req.url!, 'http://x')
  if (process.env.MOCK_DEBUG) console.log('[mock]', req.method, req.url)
  const json = (code: number, o: unknown) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(o)) }
  if (u.pathname === '/v1/checkout/sessions' && req.method === 'POST') {
    const p = new URLSearchParams(body)
    const o: Record<string, string> = {}; p.forEach((v, k) => (o[k] = v))
    stripeCreates.push(o)
    const id = `cs_test_mock${++seq}`
    const meta: Record<string, string> = {}
    for (const [k, v] of Object.entries(o)) { const m = k.match(/^metadata\[(.+)\]$/); if (m) meta[m[1]] = v }
    let total = 0; for (let i = 0; o[`line_items[${i}][quantity]`]; i++) total += Number(o[`line_items[${i}][price_data][unit_amount]`]) * Number(o[`line_items[${i}][quantity]`])
    sessions.set(id, { id, object: 'checkout.session', metadata: meta, amount_total: total, livemode: false, payment_intent: `pi_test_${seq}`, created: Math.floor(Date.now() / 1000), url: `https://checkout.stripe.test/${id}` })
    return json(200, { ...sessions.get(id), payment_status: 'unpaid' })
  }
  const sm = u.pathname.match(/^\/v1\/checkout\/sessions\/(cs_[A-Za-z0-9_]+)$/)
  if (sm && req.method === 'GET') { const s = sessions.get(sm[1]); return s ? json(200, { ...s, payment_status: stripePaid ? 'paid' : 'unpaid' }) : json(404, { error: { message: 'No such session' } }) }
  if (u.pathname === '/api/blob/' && req.method === 'PUT') {
    let pathname = u.searchParams.get('pathname')!
    if (req.headers['x-add-random-suffix'] === '1') pathname = process.env.MOCK_SUFFIX_END ? `${pathname}-${Math.random().toString(36).slice(2, 10)}` : pathname.replace(/(\.[a-z]+)?$/, (e) => `-${Math.random().toString(36).slice(2, 10)}${e}`)
    if (req.headers['x-allow-overwrite'] === '0' && blobs.has(pathname)) return json(400, { error: { code: 'bad_request', message: 'This blob already exists' } })
    blobs.set(pathname, { body, uploadedAt: new Date(Date.now() + seq++).toISOString() })
    const url = `http://127.0.0.1:${port}/content/${pathname}`
    return json(200, { url, downloadUrl: url, pathname, contentType: 'text/plain', contentDisposition: 'inline' })
  }
  if ((u.pathname === '/api/blob/' || u.pathname === '/api/blob') && req.method === 'GET') {
    const prefix = u.searchParams.get('prefix') ?? ''
    const list = [...blobs.entries()].filter(([k]) => k.startsWith(prefix)).map(([k, v]) => ({ url: `http://127.0.0.1:${port}/content/${k}`, downloadUrl: `http://127.0.0.1:${port}/content/${k}`, pathname: k, size: v.body.length, uploadedAt: v.uploadedAt }))
    return json(200, { blobs: list, hasMore: false })
  }
  if (u.pathname === '/api/blob/delete' || (u.pathname === '/api/blob/' && req.method === 'POST')) {
    const { urls } = JSON.parse(body || '{}'); for (const x of urls ?? []) blobs.delete(new URL(x).pathname.replace(/^\/content\//, '')); return json(200, {})
  }
  if (u.pathname.startsWith('/content/')) { const b = blobs.get(decodeURIComponent(u.pathname.slice(9))); if (!b) { res.writeHead(404); return res.end() } res.writeHead(200, { 'content-type': 'text/plain' }); return res.end(b.body) }
  json(404, { error: 'mock: unhandled ' + req.method + ' ' + u.pathname })
})
await new Promise<void>((r) => server.listen(0, '127.0.0.1', () => r()))
const port = (server.address() as any).port

Object.assign(process.env, {
  FORZA_STRIPE_SECRET_KEY: 'rk_test_FAKE_for_local_mock_only',
  STRIPE_API_HOST: '127.0.0.1', STRIPE_API_PORT: String(port), STRIPE_API_PROTOCOL: 'http',
  FORZA_STRIPE_WEBHOOK_SECRET: 'whsec_FAKE_local',
  BLOB_READ_WRITE_TOKEN: 'vercel_blob_rw_mockstore_FAKE', VERCEL_BLOB_API_URL: `http://127.0.0.1:${port}/api/blob`,
  SIGNUP_ENCRYPTION_KEY: 'fake-local-test-key',
  GOCARDLESS_RW_TOKEN: 'FAKE_sandbox_token', GOCARDLESS_ENV: 'sandbox',
  RESEND_API_KEY: 're_FAKE', RESEND_FROM: 'Forza Karate <test@example.test>', CONTACT_TO_EMAIL: 'club@example.test',
  CLUB_HONBU_SIGNUP_URL: 'https://honbu.mock/api/enrolment/website-signup', CLUB_HONBU_SIGNUP_SECRET: 'FAKE',
  NEXT_PUBLIC_SITE_URL: 'https://preview.example.test',
  KV_REST_API_URL: 'https://kv.mock', KV_REST_API_TOKEN: 'FAKE_kv',
  FORZA_APPROVAL_SECRET: 'FAKE_approval_secret',
})
// Fake tester code for these tests only (the real one is never in the repo).
const FAKE_TESTER = 'Fake!Tester-Code9'

// ── Upstash mock (REST /pipeline): SET [EX n] [NX], GET, DEL, INCR, EXPIRE [NX] ─────────
const kvStore = new Map<string, string>()
const kvCmds: (string | number)[][] = []
function kvRun(c: (string | number)[]): unknown {
  const [op, k, ...rest] = c.map(String) as string[]
  switch (op.toUpperCase()) {
    case 'SET': { const nx = rest.slice(1).map((x) => x.toUpperCase()).includes('NX'); if (nx && kvStore.has(k)) return null; kvStore.set(k, rest[0]); return 'OK' }
    case 'GET': return kvStore.get(k) ?? null
    case 'DEL': return kvStore.delete(k) ? 1 : 0
    case 'INCR': { const n = Number(kvStore.get(k) ?? 0) + 1; kvStore.set(k, String(n)); return n }
    case 'EXPIRE': return 1
    default: throw new Error('kv mock: unhandled ' + op)
  }
}
let failEmail = false

// ── fetch interceptor: GoCardless, Resend, Club Honbu; blocks everything else ──────
const gcCalls: { method: string; path: string; body: any }[] = []
const emails: any[] = []
const honbu: any[] = []
const realFetch = globalThis.fetch
globalThis.fetch = (async (input: any, init: any = {}) => {
  const url = new URL(typeof input === 'string' ? input : input.url ?? String(input))
  if (process.env.MOCK_DEBUG) console.log('[fetch]', init.method ?? 'GET', url.href)
  const method = (init.method ?? 'GET').toUpperCase()
  const body = init.body ? JSON.parse(init.body) : null
  const ok = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json' } })
  if (url.hostname === '127.0.0.1') return realFetch(input, init)
  if (url.hostname === 'api-sandbox.gocardless.com') {
    gcCalls.push({ method, path: url.pathname, body })
    if (method === 'POST' && url.pathname === '/billing_requests') return ok({ billing_requests: { id: 'BRQ000TEST1' } }, 201)
    if (method === 'POST' && url.pathname === '/billing_request_flows') return ok({ billing_request_flows: { id: 'BRF000TEST1' } }, 201)
    if (method === 'GET' && url.pathname === '/billing_requests/BRQ000TEST1') return ok({ billing_requests: { id: 'BRQ000TEST1', status: 'fulfilled', links: { customer: 'CU1', mandate_request_mandate: 'MD1' } } })
    if (method === 'GET' && url.pathname === '/mandates/MD1') return ok({ mandates: { id: 'MD1', next_possible_charge_date: '2026-10-23' } })
    if (method === 'POST' && url.pathname === '/subscriptions') return ok({ subscriptions: { id: 'SB1', start_date: body.subscriptions.start_date } }, 201)
    if (method === 'POST' && url.pathname === '/payments') return ok({ payments: { id: 'PM1', charge_date: body.payments.charge_date } }, 201)
    return ok({ error: 'mock gc unhandled' }, 404)
  }
  if (url.hostname === 'api.resend.com') { if (failEmail) return ok({ message: 'mock failure' }, 500); emails.push(body); return ok({ id: 'em_' + emails.length }) }
  if (url.hostname === 'kv.mock') {
    assert.equal(init.headers?.Authorization, 'Bearer FAKE_kv')
    const cmds = body as (string | number)[][]; kvCmds.push(...cmds)
    return ok(cmds.map((c) => ({ result: kvRun(c) })))
  }
  if (url.hostname === 'honbu.mock') { honbu.push(body); return ok({ ok: true, memberIds: [1] }) }
  throw new Error(`BLOCKED outbound request in test: ${url.origin}`)
}) as typeof fetch

// ── modules under test ──────────────────────────────────────────────────────────────
const { findDiscount, normaliseCode, discountCodes } = await import('../lib/gocardless/discounts')
const { applyDiscount } = await import('../lib/gocardless/plans')
const discountRoute = await import('../app/api/membership/discount-code/route')
const signupRoute = await import('../app/api/membership/signup/route')
const cardRoute = await import('../app/api/membership/card-status/route')
const brRoute = await import('../app/api/membership/billing-request/route')
const completeRoute = await import('../app/api/membership/complete/route')
const webhook = await import('../app/api/stripe/webhook/route')
const Stripe = (await import('stripe')).default

let passed = 0
const t = async (name: string, fn: () => Promise<void> | void) => { await fn(); passed++; console.log('  ✓', name) }
const post = (handler: (r: any) => Promise<Response>, body: unknown, headers: Record<string, string> = {}) =>
  handler(new Request('https://preview.example.test/api/x', { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': `10.0.0.${++seq % 250}`, ...headers }, body: typeof body === 'string' ? body : JSON.stringify(body) }) as any)

const child = (n: number, size = '140cm') => ({ firstName: `Kid${n}`, surname: 'Test', dateOfBirth: '2017-05-01', belt: 'White', medical: '', suitSize: size, suit: { key: 'blitz-gi', size }, licence: { type: 'first_time' } })
const adult = { firstName: 'Adult', surname: 'Test', dateOfBirth: '1990-01-01', belt: 'White', medical: '', suit: { key: 'blitz-gi', size: '180cm' }, licence: { type: 'renewal' } }
// Default trial 25 Oct -> membership starts 1 Nov (band 1st–7th, full month), DD from 1 Dec.
const form = (plan: string, students: any[], discountCode?: string, trialDate = '2026-10-25', firstMonthBand: string | undefined = '1-7') => ({
  plan, dojo: 'rayleigh', classTime: 'Tuesday 6:15–7pm', trialDate, ...(firstMonthBand ? { firstMonthBand } : {}),
  parent: { givenName: 'Pat', familyName: 'Tester', email: 'pat@example.test', phone: '07000000000', address: '1 Test Road', city: 'Rayleigh', postCode: 'ss6 1aa' },
  emergency: { name: 'Sam', phone: '07000000001' }, consent: { terms: true, photos: false }, students, ...(discountCode !== undefined ? { discountCode } : {}),
})
const items = (o: Record<string, string>) => { const r: { name: string; amount: number }[] = []; for (let i = 0; o[`line_items[${i}][quantity]`]; i++) r.push({ name: o[`line_items[${i}][price_data][product_data][name]`], amount: Number(o[`line_items[${i}][price_data][unit_amount]`]) }); return r }

console.log('Discount codes')
await t('codes are FORZA5 5%, BLUELIGHT10 10%, FAMILY100 100%', () => {
  assert.deepEqual(discountCodes().map((c) => [c.code, c.percent]), [['FORZA5', 5], ['BLUELIGHT10', 10], ['FAMILY100', 100]])
})
await t('case-insensitive and whitespace-tolerant', () => {
  for (const c of ['forza5', ' Forza5 ', 'FORZA 5', 'bluelight10', 'Family100']) assert.ok(findDiscount(c), c)
  assert.equal(normaliseCode(' blue light10 '), 'BLUELIGHT10')
})
await t('unknown codes rejected', () => { for (const c of ['FORZA50', 'FAMILY', 'NOPE', '', 'FORZA5X']) assert.equal(findDiscount(c), null, c) })
await t('applyDiscount never below 0, rounds in member\'s favour', () => {
  assert.equal(applyDiscount(5000, 5), 4750); assert.equal(applyDiscount(9000, 10), 8100); assert.equal(applyDiscount(12000, 100), 0)
  assert.equal(applyDiscount(999, 5), 949); assert.equal(applyDiscount(5000, 150), 0)
})
await t('FORZA_DISCOUNT_CODES env override (and invalid JSON ignored)', () => {
  process.env.FORZA_DISCOUNT_CODES = JSON.stringify([{ code: 'SPRING20', percent: 20, label: 'Spring' }])
  assert.equal(findDiscount('spring20')?.percent, 20); assert.equal(findDiscount('FORZA5'), null)
  process.env.FORZA_DISCOUNT_CODES = '{not json'
  assert.equal(findDiscount('FORZA5')?.percent, 5)
  delete process.env.FORZA_DISCOUNT_CODES
})
await t('POST /api/membership/discount-code: valid, case, invalid 400, empty 400', async () => {
  for (const [c, p] of [['forza5', 5], ['BLUELIGHT10', 10], ['family100', 100]] as const) {
    const r = await post(discountRoute.POST, { code: c }); const d = await r.json()
    assert.equal(r.status, 200); assert.equal(d.valid, true); assert.equal(d.percent, p); assert.equal(d.code, c.toUpperCase())
    assert.equal(JSON.stringify(d).includes('BLUELIGHT10') && c !== 'BLUELIGHT10', false, 'must not leak other codes')
  }
  const bad = await post(discountRoute.POST, { code: 'WRONG1' }); assert.equal(bad.status, 400); assert.match((await bad.json()).error, /isn't valid/)
  assert.equal((await post(discountRoute.POST, { code: '' })).status, 400)
})

console.log('Sign-up -> Stripe Checkout (mocked)')
await t('unknown code on sign-up -> 400 and NO Stripe session', async () => {
  const before = stripeCreates.length
  const r = await post(signupRoute.POST, form('monthly_single', [child(1)], 'FREEBIE'))
  assert.equal(r.status, 400); assert.match((await r.json()).error, /isn't valid/); assert.equal(stripeCreates.length, before)
})
await t('no code: gi £40 + licence £50 + first month £50 = £140 today; monthly £50 from 1 Dec', async () => {
  const r = await post(signupRoute.POST, form('monthly_single', [child(1)], ''))
  const d = await r.json(); assert.equal(r.status, 200, JSON.stringify(d))
  const o = stripeCreates.at(-1)!
  assert.deepEqual(items(o), [
    { name: 'Official Forza Karate Club Gi - Student 1 (140cm)', amount: 4000 },
    { name: 'FKA licence & insurance - Student 1', amount: 5000 },
    { name: 'First month of training (joining 1st–7th, 100%) - Single package', amount: 5000 },
  ])
  assert.equal(o.mode, 'payment'); assert.equal(o['metadata[kind]'], 'membership'); assert.equal(o['line_items[0][price_data][currency]'], 'gbp')
  assert.equal(d.upfrontPence, 14000); assert.equal(d.monthlyFeePence, 5000); assert.equal(d.directDebitStart, '2026-12-01')
  assert.ok(!JSON.stringify(o).includes('Kid1'), 'no student names sent to Stripe')
  assert.match(o.success_url, /^https:\/\/preview\.example\.test\/join\/membership\/paid\?signup=SU[0-9A-F]{24}&session_id=\{CHECKOUT_SESSION_ID\}$/)
})
await t('suit and licence unchanged by every code', async () => {
  for (const code of ['FORZA5', 'bluelight10', 'FAMILY100']) {
    await post(signupRoute.POST, form('monthly_two', [child(1), adult], code))
    const it = items(stripeCreates.at(-1)!)
    assert.deepEqual(it.filter((i) => /Gi|licence/.test(i.name)).map((i) => i.amount), [4000, 5000, 4000, 5500], code)
  }
})

let forzaId = '', forzaSession = ''
await t('FORZA5 (lower case): first month £47.50 on card, monthly £47.50 DD', async () => {
  const r = await post(signupRoute.POST, form('monthly_single', [child(1)], ' forza5 ')); const d = await r.json()
  assert.equal(r.status, 200)
  const o = stripeCreates.at(-1)!
  assert.deepEqual(items(o).map((i) => i.amount), [4000, 5000, 4750])
  assert.equal(items(o)[2].name, 'First month of training (joining 1st–7th, 100%) - Single package (code FORZA5, 5% off)')
  assert.equal(o['metadata[discountCode]'], 'FORZA5'); assert.equal(o['metadata[monthlyPence]'], '4750')
  assert.equal(d.upfrontPence, 13750); assert.equal(d.monthlyFeePence, 4750)
  forzaId = d.signupId; forzaSession = [...sessions.keys()].at(-1)!
})
await t('BLUELIGHT10 siblings (child + adult): first month £81 + gi £80 + licences £105', async () => {
  const r = await post(signupRoute.POST, form('monthly_two', [child(1), adult], 'BLUELIGHT10')); const d = await r.json()
  assert.deepEqual(items(stripeCreates.at(-1)!).map((i) => i.amount), [4000, 5000, 4000, 5500, 8100])
  assert.equal(d.upfrontPence, 26600); assert.equal(d.monthlyFeePence, 8100)
})

console.log('Card paid -> Direct Debit (FORZA5)')
await t('Direct Debit refused (402) until the card is paid', async () => {
  stripePaid = false
  const r = await post(brRoute.POST, { signupId: forzaId }); assert.equal(r.status, 402)
  assert.equal(gcCalls.length, 0, 'no GoCardless call before the card is paid')
  const c = await (await post(cardRoute.POST, { signupId: forzaId, sessionId: forzaSession })).json(); assert.equal(c.paid, false)
  stripePaid = true
})
await t('card-status confirms the card, records it, Club Honbu stage card_paid_awaiting_direct_debit + club email', async () => {
  const c = await (await post(cardRoute.POST, { signupId: forzaId, sessionId: forzaSession })).json()
  assert.equal(c.paid, true); assert.equal(c.needsDirectDebit, true); assert.equal(c.amountPence, 13750); assert.equal(c.directDebitStart, '2026-12-01')
  const h = honbu.at(-1); assert.equal(h.stage, 'card_paid_awaiting_direct_debit'); assert.equal(h.signupId, forzaId)
  assert.equal(h.payments.card.amountPence, 13750); assert.equal(h.payments.directDebit, null); assert.equal(h.discount.code, 'FORZA5')
  assert.equal(emails.length, 1); assert.match(emails[0].subject, /Card paid, Direct Debit pending/); assert.match(emails[0].text, /FORZA5/)
})
await t('Stripe webhook (kind membership) for the same session: accepted, no duplicate emails or hand-off', async () => {
  const stripe = new Stripe('rk_test_FAKE_for_local_mock_only')
  const ev = JSON.stringify({ id: 'evt_test_1', object: 'event', type: 'checkout.session.completed', data: { object: { ...sessions.get(forzaSession), payment_status: 'paid', customer_details: { email: 'pat@example.test' } } } })
  const sig = stripe.webhooks.generateTestHeaderString({ payload: ev, secret: 'whsec_FAKE_local' })
  const nH = honbu.length, nE = emails.length
  const r = await webhook.POST(new Request('https://x/api/stripe/webhook', { method: 'POST', headers: { 'stripe-signature': sig }, body: ev }) as any)
  const d = await r.json(); assert.equal(r.status, 200); assert.notEqual(d.skipped, 'not ours')
  assert.equal(honbu.length, nH); assert.equal(emails.length, nE)
  const r2 = await webhook.POST(new Request('https://x/api/stripe/webhook', { method: 'POST', headers: { 'stripe-signature': sig }, body: ev }) as any)
  assert.equal((await r2.json()).duplicate, true)
})
await t('billing-request: mandate only, then subscription £47.50 from 1 Dec; NO one-off DD payments', async () => {
  const r = await post(brRoute.POST, { signupId: forzaId }); const d = await r.json()
  assert.equal(r.status, 200); assert.equal(d.billingRequestId, 'BRQ000TEST1'); assert.equal(d.monthlyFeePence, 4750)
  const br = gcCalls.find((c) => c.path === '/billing_requests' && c.method === 'POST')!.body.billing_requests
  assert.ok(br.mandate_request && !br.payment_request, 'mandate only'); assert.equal(br.metadata.discount, 'FORZA5'); assert.equal(br.metadata.signup, forzaId)
  const done = await (await post(completeRoute.POST, { billingRequestId: 'BRQ000TEST1' })).json()
  assert.equal(done.state, 'done'); assert.equal(done.recorded, true)
  const subs = gcCalls.filter((c) => c.path === '/subscriptions'); assert.equal(subs.length, 1)
  assert.equal(subs[0].body.subscriptions.amount, 4750); assert.equal(subs[0].body.subscriptions.start_date, '2026-12-01'); assert.equal(subs[0].body.subscriptions.metadata.discount, 'FORZA5')
  assert.equal(gcCalls.filter((c) => c.path === '/payments').length, 0, 'no kit/licence or first-month DD payment')
  const h = honbu.at(-1); assert.equal(h.stage, 'complete'); assert.equal(h.payments.card.amountPence, 13750)
  assert.equal(h.payments.directDebit.subscriptionId, 'SB1'); assert.equal(h.payments.directDebit.monthlyPence, 4750); assert.equal(h.discount.monthlyDiscountPence, 250)
  const member = emails.find((e) => e.to?.includes?.('pat@example.test') || e.to === 'pat@example.test')
  const club = emails.filter((e) => /New member sign-up \[code FORZA5\]/.test(e.subject))
  assert.ok(member, 'member email'); assert.equal(club.length, 1)
  for (const e of [member, club[0]]) { assert.match(e.text, /Paid today by card: £137\.50/); assert.match(e.text, /£47\.50 by Direct Debit on the 1st/); assert.match(e.text, /FORZA5/); assert.match(e.text, /First month: joining 1st–7th, 100% of £50 = £50, £47\.50 after code FORZA5/) }
  assert.equal(h.firstMonth.band, '1-7'); assert.equal(h.firstMonth.bandedPence, 5000); assert.equal(h.firstMonth.pence, 4750)
  assert.match(member.text, /First month of training/)
  const n = emails.length; await post(completeRoute.POST, { billingRequestId: 'BRQ000TEST1' }); assert.equal(emails.length, n, 'idempotent')
})

console.log('FAMILY100')
await t('family of 3 with FAMILY100: card = 3 gi + 3 licences only, no DD, no GoCardless at all', async () => {
  const gcBefore = gcCalls.length, eBefore = emails.length
  const r = await post(signupRoute.POST, form('monthly_family', [child(1), child(2, '120cm'), child(3, '100cm')], 'family100')); const d = await r.json()
  assert.equal(r.status, 200)
  const it = items(stripeCreates.at(-1)!)
  assert.deepEqual(it.map((i) => i.amount), [4000, 5000, 4000, 5000, 4000, 5000]); assert.ok(!it.some((i) => /First month/.test(i.name)))
  assert.equal(d.upfrontPence, 27000); assert.equal(d.monthlyFeePence, 0); assert.equal(d.directDebitStart, null)
  const sid = [...sessions.keys()].at(-1)!
  const c = await (await post(cardRoute.POST, { signupId: d.signupId, sessionId: sid })).json()
  assert.equal(c.paid, true); assert.equal(c.needsDirectDebit, false)
  const h = honbu.at(-1); assert.equal(h.stage, 'complete'); assert.equal(h.payments.directDebit, null); assert.equal(h.monthlyFeePence, 0); assert.equal(h.discount.code, 'FAMILY100')
  assert.equal(emails.length - eBefore, 2, 'member + club'); assert.ok(emails.slice(eBefore).every((e) => /no Direct Debit/.test(e.text)))
  const br = await post(brRoute.POST, { signupId: d.signupId }); assert.equal(br.status, 409)
  assert.equal(gcCalls.length, gcBefore, 'no mandate, no subscription')
})

console.log('First-month weekly bands (start-date boundaries x packages x codes)')
const { parseSignupBody } = await import('../lib/membership/signup')
const { FIRST_MONTH_BANDS } = await import('../lib/gocardless/plans')
const minus7 = (iso: string) => { const d = new Date(iso + 'T12:00:00Z'); d.setUTCDate(d.getUTCDate() - 7); return d.toISOString().slice(0, 10) }
const BOUNDARIES: [string, string, number][] = [
  ['2026-10-01', '1-7', 100], ['2026-10-07', '1-7', 100], ['2026-10-08', '8-14', 75], ['2026-10-14', '8-14', 75],
  ['2026-10-15', '15-22', 50], ['2026-10-22', '15-22', 50], ['2026-10-23', '23+', 25], ['2026-10-31', '23+', 25],
]
const PKG: [string, any[], number][] = [['monthly_single', [child(1)], 5000], ['monthly_two', [child(1), child(2)], 9000], ['monthly_family', [child(1), child(2), child(3)], 12000]]
const CODES: [string, number][] = [['', 0], ['FORZA5', 5], ['bluelight10', 10], ['Family100', 100]]
const bandTable: string[] = []
await t(`${BOUNDARIES.length} start dates x ${PKG.length} packages x ${CODES.length} codes: band amount, then code, never below 0`, () => {
  for (const [start, key, pct] of BOUNDARIES) for (const [plan, studs, fee] of PKG) for (const [code, cp] of CODES) {
    const r = parseSignupBody(form(plan, studs, code, minus7(start), key))
    assert.ok(r.ok, `${start} ${plan} ${code}: ${!r.ok && r.error}`)
    if (!r.ok) continue
    const banded = Math.floor((fee * pct) / 100)
    const expected = Math.max(0, banded - Math.ceil((banded * cp) / 100 - 1e-9))
    const sg = r.signup
    assert.equal(sg.startDate, start)
    assert.equal(sg.firstMonth?.band, key); assert.equal(sg.firstMonth?.bandedPence, banded); assert.equal(sg.firstPaymentPence, expected, `${start} ${plan} ${code}`)
    assert.equal(sg.monthlyFeePence, Math.max(0, fee - Math.ceil((fee * cp) / 100 - 1e-9)), 'monthly DD is not banded')
    assert.equal(sg.directDebitStart, cp === 100 ? null : '2026-11-01', 'DD from the 1st of the following month')
    assert.equal(sg.upfrontPence, studs.length * (4000 + 5000) + expected, 'gi + licence unchanged')
    if (!code && start.endsWith(['01', '08', '15', '23'][FIRST_MONTH_BANDS.findIndex((b) => b.key === key)])) bandTable.push(`${plan} ${key}: ${(banded / 100).toFixed(2)}`)
  }
})
await t('the boundary amounts for the default fees', () => {
  assert.deepEqual(bandTable, [
    'monthly_single 1-7: 50.00', 'monthly_two 1-7: 90.00', 'monthly_family 1-7: 120.00',
    'monthly_single 8-14: 37.50', 'monthly_two 8-14: 67.50', 'monthly_family 8-14: 90.00',
    'monthly_single 15-22: 25.00', 'monthly_two 15-22: 45.00', 'monthly_family 15-22: 60.00',
    'monthly_single 23+: 12.50', 'monthly_two 23+: 22.50', 'monthly_family 23+: 30.00',
  ])
})
await t('wrong band for the start date -> 400 with the right option named; missing band -> 400', () => {
  for (const [start, key] of [['2026-10-07', '8-14'], ['2026-10-08', '1-7'], ['2026-10-14', '15-22'], ['2026-10-15', '8-14'], ['2026-10-22', '23+'], ['2026-10-23', '15-22'], ['2026-10-31', '1-7']]) {
    const r = parseSignupBody(form('monthly_single', [child(1)], '', minus7(start), key))
    assert.equal(r.ok, false, `${start} ${key}`)
    if (!r.ok) { assert.equal(r.status, 400); assert.match(r.error, /so the first month's payment is ".+ \(£[0-9.]+\)"/) }
  }
  const m = parseSignupBody(form('monthly_single', [child(1)], '', '2026-10-01', undefined)); assert.equal(m.ok, false)
  const x = parseSignupBody(form('monthly_single', [child(1)], '', '2026-10-01', 'cheap')); assert.equal(x.ok, false)
})
await t('band in the Stripe line item, and a cheaper band is rejected before any Stripe call', async () => {
  const r = await post(signupRoute.POST, form('monthly_two', [child(1), child(2)], 'FORZA5', minus7('2026-10-10'), '8-14'))
  assert.equal(r.status, 200)
  const fm = items(stripeCreates.at(-1)!).at(-1)!
  assert.equal(fm.name, 'First month of training (joining 8th–14th, 75%) - Siblings package (code FORZA5, 5% off)')
  assert.equal(fm.amount, 6412) // 75% of £90 = £67.50, less 5% (£3.38, rounded up for the member) = £64.12
  const n = stripeCreates.length
  const bad = await post(signupRoute.POST, form('monthly_two', [child(1), child(2)], '', minus7('2026-10-10'), '23+'))
  assert.equal(bad.status, 400); assert.equal(stripeCreates.length, n)
})

console.log('Validation')
await t('gi still required; no Stripe session when invalid', async () => {
  const before = stripeCreates.length
  const r = await post(signupRoute.POST, form('monthly_single', [{ ...child(1), suit: null, suitSize: '' }], 'FORZA5'))
  assert.equal(r.status, 400); assert.equal(stripeCreates.length, before)
})
await t('billing-request rejects bad signupId (400)', async () => { assert.equal((await post(brRoute.POST, { signupId: 'x' })).status, 400) })

console.log('Approval-gated tester code (FORZA_TESTER_CODE)')
const tester = await import('../lib/membership/tester')
const approvalRoute = await import('../app/api/membership/tester-approval/route')
const sameIp = (ip: string) => ({ 'x-forwarded-for': ip })
// Capture logs during the tester tests: no children's names or code value may be logged.
const logged: string[] = []
const origLog = console.log, origErr = console.error
const capture = (orig: typeof console.log) => (...a: unknown[]) => { logged.push(a.map(String).join(' ')); orig(...a) }
console.log = capture(origLog); console.error = capture(origErr)

await t('code unset -> it does not exist (discount box and sign-up both say "isn\'t valid")', async () => {
  delete process.env.FORZA_TESTER_CODE
  assert.equal(tester.isTesterCode(FAKE_TESTER), false)
  const r = await post(discountRoute.POST, { code: FAKE_TESTER }); assert.equal(r.status, 400); assert.match((await r.json()).error, /isn't valid/)
  const n = stripeCreates.length, e = emails.length
  const s2 = await post(signupRoute.POST, form('monthly_single', [child(1)], FAKE_TESTER)); assert.equal(s2.status, 400)
  assert.equal(stripeCreates.length, n); assert.equal(emails.length, e)
  process.env.FORZA_TESTER_CODE = `  ${FAKE_TESTER}\n` // trimmed when read
})
await t('exact match only: trimmed, case-sensitive, no partials', () => {
  assert.equal(tester.isTesterCode(FAKE_TESTER), true); assert.equal(tester.isTesterCode(`  ${FAKE_TESTER} `), true)
  for (const c of [FAKE_TESTER.toUpperCase(), FAKE_TESTER.toLowerCase(), FAKE_TESTER.slice(0, -1), FAKE_TESTER + 'x', '', 'FAMILY100', null, 42]) assert.equal(tester.isTesterCode(c), false, String(c))
})
await t('discount box: "Code accepted – needs approval", 100%, code value never echoed', async () => {
  const r = await post(discountRoute.POST, { code: ` ${FAKE_TESTER} ` }); const txt = await r.text(); const d = JSON.parse(txt)
  assert.equal(r.status, 200); assert.equal(d.valid, true); assert.equal(d.tester, true); assert.equal(d.percent, 100); assert.equal(d.code, 'TESTER')
  assert.equal(d.message, "Code accepted – this sign-up needs approval before it's confirmed")
  assert.ok(!txt.includes(FAKE_TESTER) && !txt.toLowerCase().includes(FAKE_TESTER.toLowerCase()))
  const w = await post(discountRoute.POST, { code: FAKE_TESTER.toLowerCase() }); assert.equal(w.status, 400); assert.match((await w.json()).error, /isn't valid/)
})
await t('rate limit: 10 code attempts / 10 min per IP (then even the right code gets 429); other IPs unaffected', async () => {
  const ip = sameIp('203.0.113.7')
  for (let i = 0; i < 10; i++) assert.equal((await post(discountRoute.POST, { code: `WRONG${i}X` }, ip)).status, 400)
  const r = await post(discountRoute.POST, { code: FAKE_TESTER }, ip); assert.equal(r.status, 429); assert.match((await r.json()).error, /Too many/)
  const s2 = await post(signupRoute.POST, form('monthly_single', [child(1)], FAKE_TESTER), ip); assert.equal(s2.status, 429, 'sign-up submit shares the limit')
  assert.equal((await post(discountRoute.POST, { code: FAKE_TESTER }, sameIp('203.0.113.8'))).status, 200)
  assert.ok(kvCmds.some((c) => c[0] === 'INCR' && String(c[1]).startsWith('fz:code-rl:') && !String(c[1]).includes('203.0.113')), 'IP hashed in the key')
})
await t('a sign-up with no code is not counted', async () => {
  const before = kvCmds.filter((c) => c[0] === 'INCR').length
  await post(signupRoute.POST, form('monthly_single', [child(1)], ''))
  assert.equal(kvCmds.filter((c) => c[0] === 'INCR').length, before)
})
await t('tester code with an invalid form -> 400, nothing saved, no email', async () => {
  const e = emails.length, recs = () => [...kvStore.keys()].filter((x) => x.startsWith('fz:tester:')).length, k = recs()
  const r = await post(signupRoute.POST, form('monthly_single', [{ ...child(1), suit: null }], FAKE_TESTER)); assert.equal(r.status, 400)
  assert.equal(emails.length, e); assert.equal(recs(), k)
})

let approveUrl = '', rejectUrl = '', testerId = ''
await t('submit: PENDING in Upstash (encrypted), £0, NO Stripe, NO GoCardless, NO Club Honbu; Anthoni emailed at both addresses', async () => {
  const nS = stripeCreates.length, nG = gcCalls.length, nH = honbu.length, nE = emails.length
  const body = form('monthly_two', [child(1), adult], FAKE_TESTER, '2026-10-25', '1-7')
  const r = await post(signupRoute.POST, { ...body, upfrontPence: 99999, monthlyFeePence: 5 }); const d = await r.json()
  assert.equal(r.status, 200, JSON.stringify(d)); assert.equal(d.pending, true); assert.equal(d.message, 'Thanks, your sign-up is waiting for approval by the club.')
  assert.equal(d.upfrontPence, 0); assert.equal(d.monthlyFeePence, 0); assert.equal(d.url, undefined)
  assert.equal(stripeCreates.length, nS); assert.equal(gcCalls.length, nG); assert.equal(honbu.length, nH)
  assert.equal(emails.length - nE, 1)
  const mail = emails.at(-1)
  assert.deepEqual(mail.to, ['sensei.everitt@forzakarate.co.uk', 'anthonieveritt@gmail.com'])
  assert.match(mail.subject, /Approval needed: tester code sign-up \(Tester\)/)
  for (const x of ['Pat Tester', 'pat@example.test', 'Siblings', '1 November 2026', 'Kid1 Test', 'Adult Test']) assert.ok(mail.text.includes(x), x)
  assert.ok(!JSON.stringify(mail).includes(FAKE_TESTER), 'code value not in the email')
  approveUrl = mail.text.match(/https:\/\/preview\.example\.test\/api\/membership\/tester-approval\?[^\s]*a=approve[^\s]*/)![0]
  rejectUrl = mail.text.match(/https:\/\/preview\.example\.test\/api\/membership\/tester-approval\?[^\s]*a=reject[^\s]*/)![0]
  testerId = new URL(approveUrl).searchParams.get('id')!
  assert.match(testerId, /^TS[0-9A-F]{32}$/)
  const raw = kvStore.get(`fz:tester:${testerId}`)!; assert.ok(raw)
  for (const x of ['Kid1', 'Pat', 'pat@example.test', FAKE_TESTER]) assert.ok(!raw.includes(x), `stored encrypted (${x})`)
  const rec = await tester.loadRecord(testerId); assert.equal(rec!.status, 'pending')
  assert.equal(rec!.signup.upfrontPence, 0); assert.equal(rec!.signup.monthlyFeePence, 0); assert.equal(rec!.signup.firstPaymentPence, 0); assert.equal(rec!.signup.directDebitStart, null)
  assert.equal(rec!.signup.discount!.code, 'TESTER'); assert.equal(rec!.signup.tester, true)
  const exp = Number(new URL(approveUrl).searchParams.get('exp')); const days = (exp - Date.now()) / 86400_000
  assert.ok(days > 13.99 && days <= 14, 'links expire after 14 days')
})
const linkReq = (u: string, method = 'GET', override: Record<string, string> = {}) => {
  const url = new URL(u); for (const [k, v] of Object.entries(override)) url.searchParams.set(k, v)
  if (method === 'GET') return approvalRoute.GET(new Request(url.href) as any)
  return approvalRoute.POST(new Request(url.origin + url.pathname, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: url.searchParams.toString() }) as any)
}
await t('opening the link (GET, as an email scanner would) only shows a confirm page; nothing is decided', async () => {
  const nH = honbu.length, nE = emails.length
  const r = await linkReq(approveUrl); const html = await r.text()
  assert.equal(r.status, 200); assert.match(html, /Approve this tester sign-up\?/); assert.match(html, /<form method="post">/); assert.match(html, /noindex/)
  assert.equal(r.headers.get('x-robots-tag'), 'noindex, nofollow')
  assert.equal(honbu.length, nH); assert.equal(emails.length, nE); assert.equal((await tester.loadRecord(testerId))!.status, 'pending')
})
await t('tampered, swapped or expired links are refused', async () => {
  const sig = new URL(approveUrl).searchParams.get('sig')!
  assert.equal((await linkReq(approveUrl, 'POST', { sig: sig.slice(0, -2) + (sig.endsWith('AA') ? 'BB' : 'AA') })).status, 400)
  assert.equal((await linkReq(rejectUrl, 'POST', { a: 'approve' })).status, 400, 'reject signature cannot approve')
  assert.equal((await linkReq(approveUrl, 'POST', { id: 'TS' + '0'.repeat(32) })).status, 400)
  assert.equal((await linkReq(approveUrl, 'POST', { exp: String(Date.now() + 30 * 86400_000) })).status, 400, 'cannot extend expiry')
  const past = Date.now() - 1000
  assert.equal((await linkReq(approveUrl, 'POST', { exp: String(past), sig: tester.sign(testerId, 'approve', past) })).status, 410)
  assert.equal(tester.verify(testerId, 'approve', Date.now() + 1000, tester.sign(testerId, 'approve', Date.now() + 1000), Date.now() + 15 * 86400_000), 'expired')
  assert.equal((await tester.loadRecord(testerId))!.status, 'pending')
})
await t('approve: Club Honbu hand-off like a paid sign-up, tester / £0 / TESTER-APPROVED; member gets the normal confirmation', async () => {
  const nH = honbu.length, nE = emails.length
  const r = await linkReq(approveUrl, 'POST'); const html = await r.text()
  assert.equal(r.status, 200, html); assert.match(html, /Sign-up approved/)
  assert.equal(honbu.length - nH, 1)
  const h = honbu.at(-1)
  assert.equal(h.model, 'card-then-dd'); assert.equal(h.stage, 'complete'); assert.equal(h.signupId, testerId)
  assert.equal(h.tester, true); assert.equal(h.paymentReference, 'TESTER-APPROVED')
  assert.equal(h.payments.card.provider, 'tester'); assert.equal(h.payments.card.amountPence, 0); assert.equal(h.payments.card.sessionId, 'TESTER-APPROVED')
  assert.ok(h.payments.card.items.length >= 5 && h.payments.card.items.every((i: any) => i.pricePence === 0), 'gi, licences, first month all £0')
  assert.deepEqual(h.payments.card.items.map((i: any) => i.kind), ['suit', 'licence', 'suit', 'licence', 'first_month'])
  assert.equal(h.payments.directDebit, null); assert.equal(h.gocardless, null); assert.equal(h.monthlyFeePence, 0); assert.equal(h.upfrontPence, 0); assert.equal(h.firstPaymentPence, 0)
  assert.equal(h.discount.code, 'TESTER'); assert.match(h.notes, /TESTER-APPROVED/); assert.equal(h.students.length, 2); assert.equal(h.parent.email, 'pat@example.test')
  assert.ok(!JSON.stringify(h).includes(FAKE_TESTER))
  const member = emails.slice(nE).find((e) => e.to === 'pat@example.test')
  assert.ok(member, 'member confirmation'); assert.match(member.subject, /Welcome to Forza Karate Club/); assert.match(member.text, /Paid today: £0\.00/); assert.match(member.text, /no Direct Debit/); assert.ok(!/Stripe emails a receipt/.test(member.text))
  assert.ok(emails.slice(nE).some((e) => /tester code, approved/.test(e.subject)), 'club email')
  assert.equal(gcCalls.filter((c) => JSON.stringify(c).includes(testerId)).length, 0)
  const rec = await tester.loadRecord(testerId); assert.equal(rec!.status, 'approved'); assert.equal(rec!.honbu!.ok, true)
})
await t('links are one-time: approve again = no-op; reject after approve = 409', async () => {
  const nH = honbu.length, nE = emails.length
  const again = await linkReq(approveUrl, 'POST'); assert.equal(again.status, 200); assert.match(await again.text(), /already approved/)
  assert.equal((await linkReq(rejectUrl, 'POST')).status, 409)
  assert.match(await (await linkReq(rejectUrl)).text(), /Already approved/)
  assert.equal(honbu.length, nH); assert.equal(emails.length, nE)
})
await t('reject: no hand-off, polite email to the member, approve afterwards refused', async () => {
  const r0 = await post(signupRoute.POST, form('monthly_single', [child(4)], FAKE_TESTER)); assert.equal(r0.status, 200)
  const mail = emails.at(-1)
  const rej = mail.text.match(/https:\/\/\S*a=reject\S*/)![0], app = mail.text.match(/https:\/\/\S*a=approve\S*/)![0]
  const id = new URL(rej).searchParams.get('id')!
  const nH = honbu.length, nE = emails.length
  const r = await linkReq(rej, 'POST'); assert.equal(r.status, 200); assert.match(await r.text(), /Sign-up rejected/)
  assert.equal(honbu.length, nH)
  assert.equal(emails.length - nE, 1); assert.equal(emails.at(-1).to, 'pat@example.test'); assert.match(emails.at(-1).text, /couldn't be applied/)
  assert.equal((await tester.loadRecord(id))!.status, 'rejected')
  assert.equal((await linkReq(app, 'POST')).status, 409); assert.equal(honbu.length, nH)
})
await t('Club Honbu down on approve: approved but flagged; the same link retries the hand-off once it is back', async () => {
  await post(signupRoute.POST, form('monthly_single', [child(5)], FAKE_TESTER))
  const app = emails.at(-1).text.match(/https:\/\/\S*a=approve\S*/)![0]
  const saved = process.env.CLUB_HONBU_SIGNUP_URL; delete process.env.CLUB_HONBU_SIGNUP_URL
  const r = await linkReq(app, 'POST'); assert.equal(r.status, 502); assert.match(await r.text(), /couldn't be sent to Club Honbu/)
  process.env.CLUB_HONBU_SIGNUP_URL = saved
  const members = () => emails.filter((e) => e.to === 'pat@example.test' && /Welcome/.test(e.subject)).length
  const m0 = members(), nH = honbu.length
  assert.match(await (await linkReq(app)).text(), /Approve this tester sign-up\?/, 'confirm page offered again for the retry')
  const r2 = await linkReq(app, 'POST'); assert.equal(r2.status, 200); assert.equal(honbu.length - nH, 1); assert.equal(honbu.at(-1).paymentReference, 'TESTER-APPROVED')
  assert.equal(members(), m0, 'member confirmation not sent twice')
})
await t('approval email fails -> 502, pending record removed (nothing left un-approvable)', async () => {
  const before = [...kvStore.keys()].filter((k) => /^fz:tester:TS[0-9A-F]{32}$/.test(k)).length
  failEmail = true
  const r = await post(signupRoute.POST, form('monthly_single', [child(6)], FAKE_TESTER)); failEmail = false
  assert.equal(r.status, 502)
  assert.equal([...kvStore.keys()].filter((k) => /^fz:tester:TS[0-9A-F]{32}$/.test(k)).length, before)
})
await t('Upstash not configured -> the code is treated as not valid (never a free paid-path sign-up)', async () => {
  const u = process.env.KV_REST_API_URL; delete process.env.KV_REST_API_URL
  const n = stripeCreates.length
  assert.equal((await post(discountRoute.POST, { code: FAKE_TESTER })).status, 400)
  assert.equal((await post(signupRoute.POST, form('monthly_single', [child(1)], FAKE_TESTER))).status, 400)
  assert.equal(stripeCreates.length, n)
  process.env.KV_REST_API_URL = u
})
await t('logs never contain the code value or children\'s names', () => {
  const all = logged.join('\n')
  for (const x of [FAKE_TESTER, 'Kid1', 'Kid4', 'Kid5', 'Kid6', 'Adult Test']) assert.ok(!all.includes(x), x)
})
console.log = origLog; console.error = origErr

server.close()
console.log(`\n${passed} passed`)
