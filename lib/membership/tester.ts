// Approval-gated tester code for the become-a-member form (Anthoni, 18 Oct 2026).
//
// One secret code makes EVERYTHING £0: licence & insurance, the gi, the first month and the monthly
// fee (so no Stripe checkout and no GoCardless mandate). Every use is held as PENDING until Anthoni
// approves it from a signed link in an email. Only then is the sign-up handed to Club Honbu (same
// hand-off as a paid sign-up, marked tester / £0 / payment reference TESTER-APPROVED) and the member
// gets the normal confirmation email.
//
// The code value lives ONLY in the env var FORZA_TESTER_CODE (trimmed, case-sensitive, compared in
// constant time). Unset or empty = the code doesn't exist. It is never sent to the browser, stored,
// logged or emailed: stored sign-ups carry the label "TESTER" instead.
//
// Pending sign-ups are kept in Upstash Redis (KV_REST_API_URL / KV_REST_API_TOKEN), AES-256-GCM
// encrypted with SIGNUP_ENCRYPTION_KEY. Approve/Reject links are HMAC-SHA256 signed with
// FORZA_APPROVAL_SECRET (falls back to a key derived from SIGNUP_ENCRYPTION_KEY), expire after 14
// days, and work once (an atomic SET NX decides the first click).
import 'server-only'
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'crypto'
import { PLANS, DOJOS, pounds } from '@/lib/gocardless/plans'
import { enc, dec, type Signup, type CardPayment } from '@/lib/gocardless/store'
import { emailConfigured, esc, sendEmail } from '@/lib/email'
import { honbuHandOff, summaryLines, memberEmail, clubEmail, TESTER_PAYMENT_REFERENCE } from './flow'

export const TESTER_LABEL = 'TESTER'
export const TESTER_ACCEPTED_MESSAGE = "Code accepted – this sign-up needs approval before it's confirmed"
export const TESTER_PENDING_MESSAGE = 'Thanks, your sign-up is waiting for approval by the club.'
export const APPROVAL_TTL_MS = 14 * 86400_000
const DEFAULT_APPROVERS = ['sensei.everitt@forzakarate.co.uk', 'anthonieveritt@gmail.com']
export const TESTER_ID = /^TS[0-9A-F]{32}$/

// ── The code ─────────────────────────────────────────────────────────────────────────────────
/** True only when FORZA_TESTER_CODE is set and `raw` (trimmed) matches it exactly. Constant time. */
export function isTesterCode(raw: unknown): boolean {
  const want = process.env.FORZA_TESTER_CODE?.trim()
  if (!want || typeof raw !== 'string') return false
  const got = raw.trim()
  if (!got || got.length > 200) return false
  // Hash both sides with a per-process random key: equal-length digests, constant-time compare,
  // and nothing about the code's length leaks through timing.
  const a = createHmac('sha256', CMP_KEY).update(got).digest()
  const b = createHmac('sha256', CMP_KEY).update(want).digest()
  return timingSafeEqual(a, b)
}
const CMP_KEY = randomBytes(32)

/** The code needs somewhere to hold the sign-up and a way to tell Anthoni. */
export const testerAvailable = () => kvConfigured() && emailConfigured() && !!process.env.SIGNUP_ENCRYPTION_KEY

// ── Upstash (REST pipeline; env read at call time so tests can set it) ─────────────────────────
const kvUrl = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
const kvToken = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
export const kvConfigured = () => !!(kvUrl() && kvToken())

export async function kv(cmds: (string | number)[][]): Promise<unknown[]> {
  const ctl = new AbortController()
  const timer = setTimeout(() => ctl.abort(), 4000)
  try {
    const r = await fetch(kvUrl() + '/pipeline', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + kvToken(), 'Content-Type': 'application/json' },
      body: JSON.stringify(cmds), signal: ctl.signal, cache: 'no-store',
    })
    if (!r.ok) throw new Error('kv ' + r.status)
    const out = (await r.json()) as { result?: unknown; error?: string }[]
    if (out.some((x) => x.error)) throw new Error('kv command error')
    return out.map((x) => x.result)
  } finally {
    clearTimeout(timer)
  }
}

// ── Rate limit for code attempts (discount box + sign-up submit): 10 per 10 minutes per IP ────
export const CODE_ATTEMPTS = 10
export const CODE_WINDOW_S = 600
const memHits = new Map<string, number[]>()
export function clientIp(req: Request): string {
  return (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'local'
}
/** Counts one code attempt for this client; true when over the limit. Shared across instances via Upstash. */
export async function codeAttemptLimited(req: Request): Promise<boolean> {
  const ipHash = createHash('sha256').update('forza-code-rl:' + clientIp(req)).digest('hex').slice(0, 32)
  if (kvConfigured()) {
    try {
      const key = `fz:code-rl:${ipHash}`
      const [n] = (await kv([['INCR', key], ['EXPIRE', key, CODE_WINDOW_S, 'NX']])) as [number]
      return Number(n) > CODE_ATTEMPTS
    } catch { /* fall back to the per-instance limiter */ }
  }
  const now = Date.now()
  const recent = (memHits.get(ipHash) || []).filter((t) => now - t < CODE_WINDOW_S * 1000)
  recent.push(now)
  if (memHits.size > 5000) memHits.clear()
  memHits.set(ipHash, recent)
  return recent.length > CODE_ATTEMPTS
}
export const RATE_LIMITED_MESSAGE = 'Too many code attempts. Please wait 10 minutes and try again.'

// ── Turning a validated sign-up into a tester sign-up (all amounts £0) ────────────────────────
export function asTesterSignup(s: Signup): Signup {
  const full = PLANS[s.plan].price
  const banded = s.firstMonth?.bandedPence ?? full
  return {
    ...s,
    signupId: 'TS' + randomBytes(16).toString('hex').toUpperCase(),
    tester: true,
    monthlyFeePence: 0, firstPaymentPence: 0, upfrontPence: 0, extrasPence: 0, directDebitStart: null,
    firstMonth: s.firstMonth ? { ...s.firstMonth, pence: 0 } : s.firstMonth,
    discount: {
      code: TESTER_LABEL, label: 'Club tester code (100% off everything, approval required)', percent: 100,
      monthlyFullPence: full, monthlyPence: 0, monthlyDiscountPence: full,
      firstPaymentFullPence: banded, firstPaymentPence: 0,
      note: `Club tester code: 100% off everything (gi, licence & insurance, first month and monthly fee); approved by Anthoni. Payment reference ${TESTER_PAYMENT_REFERENCE}.`,
    },
  }
}

// ── Pending store ─────────────────────────────────────────────────────────────────────────────
export type TesterStatus = 'pending' | 'approved' | 'rejected'
export type TesterRecord = {
  id: string
  status: TesterStatus
  signup: Signup
  createdAt: string
  expiresAt: string
  decidedAt?: string
  honbu?: { ok: boolean; detail?: string; memberIds?: number[] }
  emails?: { member?: boolean; club?: boolean }
}
const recKey = (id: string) => `fz:tester:${id}`
const lockKey = (id: string) => `fz:tester:${id}:decision`
const KEEP_S = 120 * 86400 // records kept 120 days, then Upstash deletes them

export async function saveRecord(r: TesterRecord) { await kv([['SET', recKey(r.id), enc(r), 'EX', KEEP_S]]) }
export async function loadRecord(id: string): Promise<TesterRecord | null> {
  if (!TESTER_ID.test(id)) return null
  const [raw] = (await kv([['GET', recKey(id)]])) as [string | null]
  return raw ? dec<TesterRecord>(raw) : null
}

// ── Signed links ──────────────────────────────────────────────────────────────────────────────
export type Action = 'approve' | 'reject'
function approvalKey(): Buffer {
  const own = process.env.FORZA_APPROVAL_SECRET?.trim()
  if (own) return createHash('sha256').update('forza-approval:' + own).digest()
  const fallback = process.env.SIGNUP_ENCRYPTION_KEY
  if (!fallback) throw new Error('No approval secret (FORZA_APPROVAL_SECRET / SIGNUP_ENCRYPTION_KEY)')
  return createHash('sha256').update('forza-approval-fallback:' + fallback).digest()
}
export function sign(id: string, action: Action, exp: number): string {
  return createHmac('sha256', approvalKey()).update(`tester-approval|${id}|${action}|${exp}`).digest('base64url')
}
export function verify(id: string, action: string, exp: string | number, sig: string, now = Date.now()): 'ok' | 'invalid' | 'expired' {
  if (!TESTER_ID.test(id) || (action !== 'approve' && action !== 'reject') || typeof sig !== 'string') return 'invalid'
  const e = Number(exp)
  if (!Number.isInteger(e) || e <= 0) return 'invalid'
  let good: Buffer, given: Buffer
  try { good = Buffer.from(sign(id, action, e)); given = Buffer.from(sig) } catch { return 'invalid' }
  if (good.length !== given.length || !timingSafeEqual(good, given)) return 'invalid'
  return now > e ? 'expired' : 'ok'
}
export function approvalLink(siteUrl: string, id: string, action: Action, exp: number): string {
  const q = new URLSearchParams({ id, a: action, exp: String(exp), sig: sign(id, action, exp) })
  return `${siteUrl}/api/membership/tester-approval?${q}`
}

// ── Submit: save PENDING + email Anthoni ──────────────────────────────────────────────────────
const ukDate = (iso: string | null | undefined) =>
  iso ? new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : ''

export function approvers(): string[] {
  const o = (process.env.FORZA_APPROVAL_TO || '').split(',').map((x) => x.trim()).filter(Boolean)
  return o.length ? o : DEFAULT_APPROVERS
}

export async function submitTesterSignup(signup: Signup, siteUrl: string, now = Date.now()): Promise<{ ok: true; id: string } | { ok: false; detail: string }> {
  const id = signup.signupId!
  const exp = now + APPROVAL_TTL_MS
  const rec: TesterRecord = { id, status: 'pending', signup, createdAt: new Date(now).toISOString(), expiresAt: new Date(exp).toISOString() }
  await saveRecord(rec)
  const s = signup
  const approve = approvalLink(siteUrl, id, 'approve', exp)
  const reject = approvalLink(siteUrl, id, 'reject', exp)
  const lines = [
    'Someone has used the club tester code on the become-a-member form. Nothing has been charged and nothing has gone to Club Honbu yet.',
    '',
    `Parent/guardian: ${s.parent.givenName} ${s.parent.familyName}, ${s.parent.email}, ${s.parent.phone}`,
    `Address: ${[s.parent.address, s.parent.city, s.parent.postCode].filter(Boolean).join(', ')}`,
    `Students: ${s.students.map((x) => `${x.firstName} ${x.surname} (${x.belt}, gi ${x.suit?.size ?? '?'})`).join('; ')}`,
    `Package: ${PLANS[s.plan].label} (${s.students.length} student${s.students.length > 1 ? 's' : ''}), usually ${pounds(PLANS[s.plan].price)} a month`,
    `Dojo: ${DOJOS[s.dojo]}${s.classTime ? `, ${s.classTime}` : ''}`,
    `Trial: ${ukDate(s.trialDate)}. Membership starts: ${ukDate(s.startDate)}`,
    'With the tester code: gi, licence & insurance, first month and monthly fee all £0. No Direct Debit.',
    '',
    `Approve (sends it to Club Honbu as paid, reference ${TESTER_PAYMENT_REFERENCE}, and emails the member their confirmation):`,
    approve,
    '',
    'Reject (nothing goes to Club Honbu; the member is told the code could not be applied):',
    reject,
    '',
    `Each link opens a page where you confirm. It works once and expires on ${new Date(exp).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/London' })}.`,
    `Sign-up reference: ${id}`,
  ]
  const html = `<p>${lines.map((l) => (l === approve ? `<a href="${esc(approve)}"><strong>Approve this sign-up</strong></a>` : l === reject ? `<a href="${esc(reject)}">Reject this sign-up</a>` : esc(l))).join('<br/>')}</p>`
  const r = await sendEmail({ to: approvers(), subject: `Approval needed: tester code sign-up (${s.parent.familyName})`, text: lines.join('\n'), html, replyTo: s.parent.email })
  if (!r.ok) {
    console.error('[tester] approval email failed', id, r.reason)
    await kv([['DEL', recKey(id)]]).catch(() => {})
    return { ok: false, detail: 'approval email failed' }
  }
  console.log('[tester] sign-up held for approval', id)
  return { ok: true, id }
}

// ── Decide ────────────────────────────────────────────────────────────────────────────────────
export type DecideResult =
  | { state: 'approved'; honbu: { ok: boolean; detail?: string }; already?: boolean }
  | { state: 'rejected'; already?: boolean }
  | { state: 'conflict'; status: TesterStatus }
  | { state: 'not_found' }

function testerCard(s: Signup, at: string): CardPayment {
  return { signupId: s.signupId!, sessionId: TESTER_PAYMENT_REFERENCE, paymentIntentId: TESTER_PAYMENT_REFERENCE, amountPence: 0, livemode: true, paidAt: at }
}

export async function decide(id: string, action: Action, now = Date.now()): Promise<DecideResult> {
  const rec = await loadRecord(id)
  if (!rec) return { state: 'not_found' }
  // First decision wins (atomic). A repeat click of the same action is safe: for approve it retries
  // a Club Honbu hand-off that failed; it never sends a second confirmation email.
  const [claimed] = (await kv([['SET', lockKey(id), action, 'NX', 'EX', KEEP_S]])) as [string | null]
  if (claimed !== 'OK') {
    const [prior] = (await kv([['GET', lockKey(id)]])) as [string | null]
    if (prior !== action) return { state: 'conflict', status: rec.status === 'pending' ? (prior === 'approve' ? 'approved' : 'rejected') : rec.status }
    if (action === 'reject') return { state: 'rejected', already: true }
    if (rec.honbu?.ok) return { state: 'approved', honbu: rec.honbu, already: true }
  }
  const at = new Date(now).toISOString()
  rec.decidedAt = rec.decidedAt ?? at
  const s = rec.signup
  if (action === 'reject') {
    rec.status = 'rejected'
    rec.emails = rec.emails ?? {}
    if (emailConfigured() && s.parent.email) {
      const text = [`Hi ${s.parent.givenName},`, '', 'Thank you for filling in the Forza Karate Club membership form. Unfortunately the code you entered couldn\'t be applied, so your sign-up hasn\'t been confirmed and nothing has been charged.',
        '', 'If you\'d still like to join, please fill in the form again without the code, or just reply to this email and we\'ll help.', '', 'Oss!', 'Forza Karate Club'].join('\n')
      const r = await sendEmail({ to: s.parent.email, subject: 'Your Forza Karate Club sign-up', text, html: `<p>${text.split('\n').map(esc).join('<br/>')}</p>`, replyTo: 'hello@forzakarate.co.uk' })
      rec.emails.member = r.ok
    }
    await saveRecord(rec)
    console.log('[tester] sign-up rejected', id)
    return { state: 'rejected' }
  }
  rec.status = 'approved'
  rec.honbu = await honbuHandOff(s, 'complete', testerCard(s, at), null)
  const lines = summaryLines(s, testerCard(s, at), null, false)
  rec.emails = rec.emails ?? {}
  if (!rec.emails.member) rec.emails.member = await memberEmail(s, lines)
  if (!rec.emails.club) rec.emails.club = await clubEmail(s, `New member sign-up [tester code, approved]: ${s.parent.familyName}`,
    `Tester-code sign-up approved: everything £0, payment reference ${TESTER_PAYMENT_REFERENCE}, no Direct Debit.${rec.honbu.ok ? ' Recorded in Club Honbu.' : ` ⚠ NOT recorded in Club Honbu automatically (${rec.honbu.detail ?? ''}), please add by hand.`}`, lines)
  await saveRecord(rec)
  console.log('[tester] sign-up approved', id, rec.honbu.ok ? 'honbu ok' : 'honbu failed')
  return { state: 'approved', honbu: rec.honbu }
}
