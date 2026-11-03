// Offline tests for the join-form trial lookup (CLUB_HONBU_TRIAL_LOOKUP_URL flag).
// Mocked: Club Honbu (lookup + by-ref), Upstash REST (in-memory, with a fake clock for expiry),
// Resend, Stripe + Blob (local HTTP mock). Any other outbound request fails the test.
// Placeholder data only ("Student A"...). Run with real keys unset:
//   env -u FORZA_STRIPE_SECRET_KEY -u GOCARDLESS_RW_TOKEN -u GOCARDLESS_ACCESS_TOKEN -u RESEND_API_KEY \
//     -u FORZA_RESEND_API_KEY -u FORZA_STRIPE_WEBHOOK_SECRET npx tsx --conditions=react-server scripts/test-trial-lookup.mts
import http from 'node:http'
import assert from 'node:assert/strict'

for (const k of ['FORZA_STRIPE_SECRET_KEY', 'GOCARDLESS_RW_TOKEN', 'GOCARDLESS_ACCESS_TOKEN', 'RESEND_API_KEY', 'FORZA_RESEND_API_KEY', 'FORZA_STRIPE_WEBHOOK_SECRET'])
  if (process.env[k]) { console.error(`Refusing to run: ${k} is set. Unset real keys first.`); process.exit(2) }

// ── Stripe + Blob mock (just what signup needs) ─────────────────────────────────
const blobs = new Map<string, string>()
const stripeCreates: Record<string, string>[] = []
let seq = 0
const server = http.createServer(async (req, res) => {
  const chunks: Buffer[] = []
  for await (const c of req) chunks.push(c as Buffer)
  const body = Buffer.concat(chunks).toString('utf8')
  const u = new URL(req.url!, 'http://x')
  const json = (code: number, o: unknown) => { res.writeHead(code, { 'content-type': 'application/json' }); res.end(JSON.stringify(o)) }
  if (u.pathname === '/v1/checkout/sessions' && req.method === 'POST') {
    const o: Record<string, string> = {}; new URLSearchParams(body).forEach((v, k) => (o[k] = v)); stripeCreates.push(o)
    const id = `cs_test_mock${++seq}`
    return json(200, { id, object: 'checkout.session', url: `https://checkout.stripe.test/${id}`, payment_status: 'unpaid', livemode: false })
  }
  if (u.pathname === '/api/blob/' && req.method === 'PUT') {
    const pathname = u.searchParams.get('pathname')!; blobs.set(pathname, body)
    const url = `http://127.0.0.1:${port}/content/${pathname}`
    return json(200, { url, downloadUrl: url, pathname, contentType: 'text/plain', contentDisposition: 'inline' })
  }
  if ((u.pathname === '/api/blob/' || u.pathname === '/api/blob') && req.method === 'GET') {
    const prefix = u.searchParams.get('prefix') ?? ''
    const list = [...blobs.entries()].filter(([k]) => k.startsWith(prefix)).map(([k, v]) => ({ url: `http://127.0.0.1:${port}/content/${k}`, downloadUrl: `http://127.0.0.1:${port}/content/${k}`, pathname: k, size: v.length, uploadedAt: new Date().toISOString() }))
    return json(200, { blobs: list, hasMore: false })
  }
  if (u.pathname.startsWith('/content/')) { const b = blobs.get(decodeURIComponent(u.pathname.slice(9))); if (b === undefined) { res.writeHead(404); return res.end() } res.writeHead(200, { 'content-type': 'text/plain' }); return res.end(b) }
  json(404, { error: 'mock: unhandled ' + req.method + ' ' + u.pathname })
})
await new Promise<void>((r) => server.listen(0, '127.0.0.1', () => r()))
const port = (server.address() as { port: number }).port

const HONBU = 'https://honbu.mock/api/website/trial-lookup'
const LOOKUP_SECRET = 'FAKE-lookup-secret-for-tests'
Object.assign(process.env, {
  FORZA_STRIPE_SECRET_KEY: 'rk_test_FAKE_for_local_mock_only',
  STRIPE_API_HOST: '127.0.0.1', STRIPE_API_PORT: String(port), STRIPE_API_PROTOCOL: 'http',
  BLOB_READ_WRITE_TOKEN: 'vercel_blob_rw_mockstore_FAKE', VERCEL_BLOB_API_URL: `http://127.0.0.1:${port}/api/blob`,
  SIGNUP_ENCRYPTION_KEY: 'fake-local-test-key',
  RESEND_API_KEY: 're_FAKE', RESEND_FROM: 'Forza Karate <test@example.test>', CONTACT_TO_EMAIL: 'club@example.test',
  KV_REST_API_URL: 'https://kv.mock', KV_REST_API_TOKEN: 'FAKE_kv',
  CLUB_HONBU_LOOKUP_SECRET: LOOKUP_SECRET,
  CLUB_HONBU_SIGNUP_URL: 'https://honbu.mock/api/enrolment/website-signup', CLUB_HONBU_SIGNUP_SECRET: 'FAKE',
  NEXT_PUBLIC_SITE_URL: 'https://preview.example.test',
})

// ── Club Honbu data (placeholders) ──────────────────────────────────────────────
const FAMILY = { email: 'family@example.test', mobile: '07700900001' }
const ref = (n: number) => `wt_${n}_${String(n).repeat(32).slice(0, 32).replace(/[^0-9a-f]/g, 'a')}`
const trial = (n: number, first: string, o: Record<string, unknown>) => ({ trialRef: ref(n), firstName: first, surname: 'Family', dateOfBirth: '2017-05-01', club: 'Rayleigh', preferredClass: 'Tuesday 6:15', attendedDate: null, trialDate: null, trialStatus: 'pending', ...o })
const trials = new Map<string, Record<string, unknown>>([
  [ref(1), trial(1, 'Student A', { attendedDate: '2026-10-03', trialDate: '2026-10-03', trialStatus: 'attended' })], // start 10 Oct -> 8th–14th
  [ref(2), trial(2, 'Student B', { dateOfBirth: '2019-02-02', attendedDate: '2026-10-08', trialDate: '2026-10-08', trialStatus: 'attended' })], // start 15 Oct -> 15th–22nd
  [ref(3), trial(3, 'Student C', { trialDate: '2026-10-10', trialStatus: 'booked' })], // booked, date passed, no register entry -> eligible
  [ref(4), trial(4, 'Student D', { trialDate: '2026-11-01', trialStatus: 'booked' })], // not yet -> not eligible
  [ref(5), trial(5, 'Student E', {})], // pending, no date -> not eligible
])
const byContact = new Map<string, string[]>([[`${FAMILY.email}|${FAMILY.mobile}`, [ref(1), ref(2), ref(3), ref(4)]], ['later@example.test|07700900002', [ref(5)]]])

// ── Upstash mock with a fake clock ──────────────────────────────────────────────
let clock = 0
const kvStore = new Map<string, { v: string; exp: number | null }>()
const kvGet = (k: string) => { const e = kvStore.get(k); if (!e) return null; if (e.exp !== null && e.exp <= clock) { kvStore.delete(k); return null } return e }
function kvRun(cmd: (string | number)[]): unknown {
  const [op, k, ...a] = cmd.map(String)
  switch (op) {
    case 'SET': { const ex = a.indexOf('EX'); kvStore.set(k, { v: a[0], exp: ex >= 0 ? clock + Number(a[ex + 1]) : null }); return 'OK' }
    case 'GET': return kvGet(k)?.v ?? null
    case 'DEL': return kvStore.delete(k) ? 1 : 0
    case 'TTL': { const e = kvGet(k); return !e ? -2 : e.exp === null ? -1 : e.exp - clock }
    case 'INCR': { const e = kvGet(k); const n = Number(e?.v ?? 0) + 1; kvStore.set(k, { v: String(n), exp: e?.exp ?? null }); return n }
    case 'EXPIRE': { const e = kvGet(k); if (!e) return 0; if (a[1] === 'NX' && e.exp !== null) return 0; e.exp = clock + Number(a[0]); return 1 }
  }
  throw new Error('kv mock: ' + op)
}

// ── fetch interceptor ───────────────────────────────────────────────────────────
const emails: { to: string; subject: string; text: string }[] = []
const honbuCalls: { method: string; path: string; secret: string | null; ip: string | null; body: unknown }[] = []
let honbuGone = new Set<string>()
const handOffs: { trial?: unknown }[] = []
const realFetch = globalThis.fetch
globalThis.fetch = (async (input: string | URL | Request, init: RequestInit = {}) => {
  const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input.href : input.url)
  const method = (init.method ?? 'GET').toUpperCase()
  const body = init.body ? JSON.parse(String(init.body)) : null
  const hdr = new Headers(init.headers)
  const ok = (o: unknown, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json' } })
  if (url.hostname === '127.0.0.1') return realFetch(input, init)
  if (url.hostname === 'kv.mock') { assert.equal(hdr.get('authorization'), 'Bearer FAKE_kv'); return ok((body as (string | number)[][]).map((c) => ({ result: kvRun(c) }))) }
  if (url.hostname === 'api.resend.com') { emails.push(body); return ok({ id: 'em_' + emails.length }) }
  if (url.hostname === 'honbu.mock') {
    honbuCalls.push({ method, path: url.pathname, secret: hdr.get('x-website-secret'), ip: hdr.get('x-website-client-ip'), body })
    if (url.pathname === '/api/enrolment/website-signup') { handOffs.push(body); return ok({ ok: true }) }
    if (hdr.get('x-website-secret') !== LOOKUP_SECRET) return ok({ error: 'unauthorised' }, 401)
    if (method === 'POST' && url.pathname === '/api/website/trial-lookup') {
      const refs = byContact.get(`${body.email}|${body.mobile}`) ?? []
      return ok({ matches: refs.filter((r) => !honbuGone.has(r)).map((r) => trials.get(r)) })
    }
    const m = url.pathname.match(/^\/api\/website\/trial-lookup\/(wt_[^/]+)$/)
    if (method === 'GET' && m) { const t = trials.get(decodeURIComponent(m[1])); return t && !honbuGone.has(t.trialRef as string) ? ok({ trial: t }) : ok({ error: 'not found' }, 404) }
    return ok({ error: 'mock honbu unhandled' }, 404)
  }
  throw new Error(`BLOCKED outbound request in test: ${url.origin}`)
}) as typeof fetch

// Capture logs to prove no personal data is logged.
const logs: string[] = []
for (const k of ['log', 'error', 'warn', 'info'] as const) { const orig = console[k]; console[k] = (...a: unknown[]) => { logs.push(a.map(String).join(' ')); if (k === 'log' && String(a[0]).startsWith('  ✓')) orig(...a) } }

const lib = await import('../lib/membership/trial-lookup')
const startRoute = await import('../app/api/membership/trial/start/route')
const verifyRoute = await import('../app/api/membership/trial/verify/route')
const signupRoute = await import('../app/api/membership/signup/route')

let passed = 0
const t = async (name: string, fn: () => Promise<void> | void) => { await fn(); passed++; console.log('  ✓', name) }
let ipSeq = 0
const post = (handler: (r: Request) => Promise<Response>, body: unknown, ip = `10.1.0.${++ipSeq % 250}`) =>
  handler(new Request('https://preview.example.test/api/x', { method: 'POST', headers: { 'content-type': 'application/json', 'x-forwarded-for': ip }, body: JSON.stringify(body) }))
const codeFrom = (i = emails.length - 1) => emails[i].text.match(/\b(\d{6})\b/)![1]
const flagOn = () => { process.env.CLUB_HONBU_TRIAL_LOOKUP_URL = HONBU }
const freshKv = () => { kvStore.clear(); clock = 0 }

async function verified(contact = FAMILY) {
  freshKv()
  const s = await (await post(startRoute.POST, contact)).json()
  const v = await post(verifyRoute.POST, { lookupId: s.lookupId, code: codeFrom() })
  assert.equal(v.status, 200)
  return (await v.json()) as { token: string; trials: { trialRef: string; eligible: boolean; trialDate: string | null; startDate: string | null; status: string; reason: string | null; firstName: string }[] }
}
const student = (o: Record<string, unknown> = {}) => ({ firstName: 'Browser', surname: 'Edited', dateOfBirth: '2000-01-01', belt: 'White', medical: '', suitSize: '140cm', suit: { key: 'blitz-gi', size: '140cm' }, licence: { type: 'first_time' }, ...o })
const signupBody = (o: Record<string, unknown>) => ({
  plan: 'monthly_single', dojo: 'rayleigh', classTime: 'Tuesday 6:15–7pm', trialDate: '2026-10-25', firstMonthBand: '8-14',
  parent: { givenName: 'Parent', familyName: 'Family', email: FAMILY.email, phone: FAMILY.mobile, address: '1 Test Road', city: 'Rayleigh', postCode: 'ss6 1aa' },
  emergency: { name: 'Contact', phone: '07700900009' }, consent: { terms: true, photos: false }, students: [student()], ...o,
})
const items = (o: Record<string, string>) => { const r: { name: string; amount: number }[] = []; for (let i = 0; o[`line_items[${i}][quantity]`]; i++) r.push({ name: o[`line_items[${i}][price_data][product_data][name]`], amount: Number(o[`line_items[${i}][price_data][unit_amount]`]) }); return r }

console.log('Flag')
await t('flag off: lookup routes 404, signup unchanged (browser trial date used)', async () => {
  delete process.env.CLUB_HONBU_TRIAL_LOOKUP_URL
  assert.equal(lib.trialLookupEnabled(), false)
  assert.equal((await post(startRoute.POST, FAMILY)).status, 404)
  assert.equal((await post(verifyRoute.POST, { lookupId: 'x', code: '123456' })).status, 404)
  const r = await post(signupRoute.POST, signupBody({ trialDate: '2026-10-25', firstMonthBand: '1-7' }))
  assert.equal(r.status, 200)
  assert.equal(honbuCalls.length, 0)
})
await t('flag on but secret / Upstash missing: 503 (fails closed)', async () => {
  flagOn(); const s = process.env.CLUB_HONBU_LOOKUP_SECRET; delete process.env.CLUB_HONBU_LOOKUP_SECRET
  assert.equal((await post(startRoute.POST, FAMILY)).status, 503)
  assert.equal((await post(signupRoute.POST, signupBody({}))).status, 503)
  process.env.CLUB_HONBU_LOOKUP_SECRET = s
})

console.log('Start (email + mobile)')
await t('match and no match give the identical answer; code emailed only on a match, to that address', async () => {
  flagOn(); freshKv(); emails.length = 0
  const a = await (await post(startRoute.POST, { email: ' Family@Example.test ', mobile: '+44 7700 900001' })).json()
  const b = await (await post(startRoute.POST, { email: 'nobody@example.test', mobile: '07700900999' })).json()
  assert.equal(a.message, startRoute.SAME_ANSWER); assert.equal(b.message, a.message)
  assert.deepEqual(Object.keys(a).sort(), Object.keys(b).sort())
  assert.match(a.lookupId, /^[0-9a-f]{32}$/); assert.match(b.lookupId, /^[0-9a-f]{32}$/)
  assert.equal(emails.length, 1); assert.equal(emails[0].to, FAMILY.email)
  assert.match(emails[0].text, /\b\d{6}\b/); assert.match(emails[0].text, /10 minutes/)
  assert.ok(!/Student [A-E]/.test(emails[0].text), 'email names no child')
})
await t('Club Honbu called server-to-server with X-Website-Secret and the visitor IP; normalised email + mobile', async () => {
  const c = honbuCalls.at(-2)!
  assert.equal(c.method, 'POST'); assert.equal(c.secret, LOOKUP_SECRET); assert.ok(c.ip)
  assert.deepEqual(c.body, { email: FAMILY.email, mobile: FAMILY.mobile })
})
await t('the code is stored hashed in Upstash (never in clear) with a 10-minute expiry', async () => {
  const code = codeFrom(0)
  const [k, e] = [...kvStore.entries()].find(([k]) => k.startsWith('tl:s:') && kvStore.get(k)!.v.includes('wt_'))!
  assert.ok(!e.v.includes(code)); assert.ok(!e.v.includes(FAMILY.email)); assert.equal(e.exp, 600); assert.ok(k)
})
await t('bad input rejected (400)', async () => {
  assert.equal((await post(startRoute.POST, { email: 'nope', mobile: FAMILY.mobile })).status, 400)
  assert.equal((await post(startRoute.POST, { email: FAMILY.email, mobile: '123' })).status, 400)
})
await t('rate limits: 3 per email and 10 per IP per 10 minutes (Upstash)', async () => {
  freshKv()
  for (let i = 0; i < 3; i++) assert.equal((await post(startRoute.POST, FAMILY)).status, 200)
  assert.equal((await post(startRoute.POST, FAMILY)).status, 429)
  clock += 601; assert.equal((await post(startRoute.POST, FAMILY)).status, 200)
  freshKv()
  for (let i = 0; i < 10; i++) assert.equal((await post(startRoute.POST, { email: `p${i}@example.test`, mobile: '07700900111' }, '10.9.9.9')).status, 200)
  assert.equal((await post(startRoute.POST, { email: 'p99@example.test', mobile: '07700900111' }, '10.9.9.9')).status, 429)
})

console.log('Verify (6-digit code)')
await t('wrong code counts down; 5 wrong tries locks the code even if the right one follows', async () => {
  freshKv()
  const s = await (await post(startRoute.POST, FAMILY)).json(); const good = codeFrom()
  const bad = good === '000000' ? '111111' : '000000'
  for (let left = 4; left >= 1; left--) { const r = await post(verifyRoute.POST, { lookupId: s.lookupId, code: bad }); assert.equal(r.status, 400); assert.equal((await r.json()).triesLeft, left) }
  assert.equal((await post(verifyRoute.POST, { lookupId: s.lookupId, code: bad })).status, 429)
  assert.equal((await post(verifyRoute.POST, { lookupId: s.lookupId, code: good })).status, 429)
})
await t('code expires after 10 minutes', async () => {
  freshKv()
  const s = await (await post(startRoute.POST, FAMILY)).json(); clock += 601
  const r = await post(verifyRoute.POST, { lookupId: s.lookupId, code: codeFrom() })
  assert.equal(r.status, 400); assert.match((await r.json()).error, /expired/)
})
await t('no-match lookups can never be verified', async () => {
  freshKv()
  const s = await (await post(startRoute.POST, { email: 'nobody@example.test', mobile: '07700900999' })).json()
  for (let i = 0; i < 3; i++) assert.equal((await post(verifyRoute.POST, { lookupId: s.lookupId, code: String(100000 + i) })).status, 400)
})
await t('right code: siblings returned with eligibility, trial date and start date (attended + 7); one use only', async () => {
  freshKv()
  const s = await (await post(startRoute.POST, FAMILY)).json(); const code = codeFrom()
  const r = await post(verifyRoute.POST, { lookupId: s.lookupId, code }); assert.equal(r.status, 200)
  const d = await r.json()
  assert.match(d.token, /^[0-9a-f]{48}$/)
  const by = Object.fromEntries(d.trials.map((x: { firstName: string }) => [x.firstName, x]))
  assert.deepEqual([by['Student A'].eligible, by['Student A'].trialDate, by['Student A'].startDate, by['Student A'].status], [true, '2026-10-03', '2026-10-10', 'attended'])
  assert.deepEqual([by['Student B'].eligible, by['Student B'].startDate], [true, '2026-10-15'])
  assert.deepEqual([by['Student C'].eligible, by['Student C'].status, by['Student C'].startDate], [true, 'booked', '2026-10-17'])
  assert.equal(by['Student D'].eligible, false); assert.match(by['Student D'].reason, /hasn't happened yet/)
  assert.equal((await post(verifyRoute.POST, { lookupId: s.lookupId, code })).status, 400)
})
await t('eligibility rule: attended, or booked with a past date; future/undated trials refused', () => {
  const base = { trialRef: ref(9), firstName: 'Student Z', surname: 'X', dateOfBirth: null, club: null, preferredClass: null }
  assert.equal(lib.forForm({ ...base, attendedDate: '2026-10-17', trialDate: '2026-10-17', trialStatus: 'attended' }, '2026-10-18').eligible, true)
  assert.equal(lib.forForm({ ...base, attendedDate: null, trialDate: '2026-10-17', trialStatus: 'booked' }, '2026-10-18').eligible, true)
  assert.equal(lib.forForm({ ...base, attendedDate: null, trialDate: '2026-10-18', trialStatus: 'booked' }, '2026-10-18').eligible, false) // today: not until it's happened
  assert.equal(lib.forForm({ ...base, attendedDate: null, trialDate: null, trialStatus: 'pending' }, '2026-10-18').eligible, false)
})

console.log('Signup re-checks Club Honbu')
await t('names, DOB and trial date come from Club Honbu, not the browser; band computed server-side', async () => {
  freshKv(); stripeCreates.length = 0
  const v = await verified(); const calls = honbuCalls.length
  const r = await post(signupRoute.POST, signupBody({ trialToken: v.token, trialRefs: [ref(1)], trialDate: '2026-10-25', firstMonthBand: '8-14', students: [student()] }))
  assert.equal(r.status, 200, JSON.stringify(await r.clone().json()))
  assert.ok(honbuCalls.slice(calls).some((c) => c.method === 'GET' && c.path.endsWith(ref(1))), 'trial re-read by ref')
  const it = items(stripeCreates.at(-1)!)
  assert.ok(it.some((x) => /First month of training \(joining 8th–14th, 75%\)/.test(x.name) && x.amount === 3750), JSON.stringify(it))
  const body = await r.json(); assert.equal(body.directDebitStart, '2026-11-01')
  const { loadSignupById } = await import('../lib/gocardless/store')
  const saved = (await loadSignupById(body.signupId))!
  assert.deepEqual([saved.students[0].firstName, saved.students[0].surname, saved.students[0].dateOfBirth], ['Student A', 'Family', '2017-05-01'])
  assert.equal(saved.trialDate, '2026-10-03')
})
await t('band must match the Club Honbu start date (clear 400 naming the right option)', async () => {
  const v = await verified()
  const r = await post(signupRoute.POST, signupBody({ trialToken: v.token, trialRefs: [ref(1)], firstMonthBand: '1-7', students: [student()] }))
  assert.equal(r.status, 400); assert.match((await r.json()).error, /8th – 14th/)
})
await t('siblings: package from the number ticked, start = most recent trial + 7', async () => {
  stripeCreates.length = 0
  const v = await verified()
  const r = await post(signupRoute.POST, signupBody({ plan: 'monthly_two', trialToken: v.token, trialRefs: [ref(1), ref(2)], firstMonthBand: '15-22', students: [student(), student()] }))
  assert.equal(r.status, 200, JSON.stringify(await r.clone().json()))
  assert.ok(items(stripeCreates.at(-1)!).some((x) => /joining 15th–22nd, 50%\) - Siblings package/.test(x.name) && x.amount === 4500))
  const bad = await post(signupRoute.POST, signupBody({ plan: 'monthly_single', trialToken: v.token, trialRefs: [ref(1), ref(2)], firstMonthBand: '15-22', students: [student(), student()] }))
  assert.equal(bad.status, 400)
})
await t('refused: no token, a ref not from this lookup, an ineligible trial, a trial gone/converted in Club Honbu', async () => {
  const v = await verified()
  assert.equal((await post(signupRoute.POST, signupBody({ trialRefs: [ref(1)] }))).status, 400)
  assert.equal((await post(signupRoute.POST, signupBody({ trialToken: v.token, trialRefs: [ref(5)] }))).status, 400)
  const r4 = await post(signupRoute.POST, signupBody({ trialToken: v.token, trialRefs: [ref(4)] }))
  assert.equal(r4.status, 400); assert.match((await r4.json()).error, /hasn't happened yet/)
  honbuGone = new Set([ref(1)])
  assert.equal((await post(signupRoute.POST, signupBody({ trialToken: v.token, trialRefs: [ref(1)] }))).status, 400)
  honbuGone = new Set()
})
await t('the sign-up records the trial refs for the Club Honbu hand-off', async () => {
  const { loadSignupById } = await import('../lib/gocardless/store')
  stripeCreates.length = 0
  const v = await verified()
  const r = await (await post(signupRoute.POST, signupBody({ trialToken: v.token, trialRefs: [ref(3)], firstMonthBand: '15-22', students: [student()] }))).json()
  assert.ok(r.signupId, JSON.stringify(r))
  const saved = (await loadSignupById(r.signupId))!
  assert.deepEqual(saved.trial, { refs: [ref(3)], trialDate: '2026-10-10', statuses: ['booked'] })
  const { honbuHandOff } = await import('../lib/membership/flow')
  await honbuHandOff(saved, 'card_paid_awaiting_direct_debit', undefined, null)
  assert.deepEqual(handOffs.at(-1)!.trial, saved.trial)
})

console.log('Privacy')
await t('no email, mobile, child name or code in any log line', () => {
  const all = logs.join('\n')
  for (const s of [FAMILY.email, FAMILY.mobile, 'Student A', 'Student B', ...emails.map((e) => e.text.match(/\b\d{6}\b/)![0])]) assert.ok(!all.includes(s), 'leaked: ' + s.slice(0, 3))
})

server.close()
process.stdout.write(`\n${passed} tests passed\n`)
