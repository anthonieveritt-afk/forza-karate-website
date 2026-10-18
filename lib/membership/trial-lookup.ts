// Join form: find the member's trial in Club Honbu instead of asking for the trial date.
// Flag: off (form unchanged) while CLUB_HONBU_TRIAL_LOOKUP_URL is unset.
//
//  1. start:  email + mobile -> Club Honbu POST /api/website/trial-lookup (server-to-server).
//             If anything matched, a 6-digit code is emailed to that address (the address on the
//             trial record: Club Honbu only matches when email AND mobile both match). The answer
//             is always the same, so nobody can find out whether a family has booked a trial.
//  2. verify: the code (hashed in Upstash, 10 minutes, 5 tries) -> the trials (re-read from Club
//             Honbu by their opaque refs) and a short-lived "verified" token.
//  3. signup: the server re-reads each chosen trial from Club Honbu again and takes the names,
//             DOB and trial date from there (never from the browser).
// Eligible = attended (marked present in the Club Honbu register), or booked with a trial date
// that has passed when no attendance has been recorded.
import 'server-only'
import { createHmac, randomBytes, timingSafeEqual, createHash } from 'crypto'
import { membershipStart } from '@/lib/gocardless/plans'

export const trialLookupEnabled = () => !!process.env.CLUB_HONBU_TRIAL_LOOKUP_URL?.trim()
const lookupUrl = () => process.env.CLUB_HONBU_TRIAL_LOOKUP_URL!.trim().replace(/\/$/, '')
const lookupSecret = () => process.env.CLUB_HONBU_LOOKUP_SECRET?.trim() || ''
const KV_URL = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || ''
const KV_TOKEN = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || ''
export const trialLookupReady = () => trialLookupEnabled() && !!lookupSecret() && !!KV_URL() && !!KV_TOKEN()

export const CODE_TTL_S = 600
export const MAX_TRIES = 5
const VERIFIED_TTL_S = 2 * 3600

export type HonbuTrial = {
  trialRef: string
  firstName: string
  surname: string
  dateOfBirth: string | null
  club: string | null
  preferredClass: string | null
  attendedDate: string | null
  trialDate: string | null
  trialStatus: 'attended' | 'booked' | 'pending'
}
export type TrialForForm = {
  trialRef: string
  firstName: string
  surname: string
  dateOfBirth: string | null
  club: string | null
  status: 'attended' | 'booked' | 'pending'
  /** The trial date used for joining (attended date, else the booked date). */
  trialDate: string | null
  startDate: string | null
  eligible: boolean
  reason: string | null
}

// ── small helpers ────────────────────────────────────────────────────────────
export const normaliseEmail = (v: unknown) => (typeof v === 'string' ? v.trim().toLowerCase() : '')
export function normaliseMobile(v: unknown): string {
  if (typeof v !== 'string') return ''
  let d = v.replace(/\D/g, '')
  if (d.startsWith('0044')) d = d.slice(4)
  if (d.startsWith('44') && d.length >= 12) d = d.slice(2)
  if (!d.startsWith('0') && d.length === 10) d = '0' + d
  return d
}
const h = (s: string) => createHash('sha256').update(s).digest('hex').slice(0, 32)
const codeHash = (lookupId: string, code: string) => createHmac('sha256', lookupSecret() || 'unset').update(`${lookupId}:${code}`).digest('hex')
export const todayLondon = (now = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London' }).format(now)

export function forForm(t: HonbuTrial, today = todayLondon()): TrialForForm {
  const date = t.attendedDate ?? t.trialDate
  let eligible = false
  let reason: string | null = null
  if (t.attendedDate) eligible = true
  else if (t.trialDate && t.trialDate < today) eligible = true // booked, date passed, no register entry
  else reason = t.trialDate ? 'Your trial class hasn\'t happened yet. You can join after it.' : 'We don\'t have a date for this trial class yet.'
  return {
    trialRef: t.trialRef, firstName: t.firstName, surname: t.surname, dateOfBirth: t.dateOfBirth, club: t.club,
    status: t.trialStatus, trialDate: date, startDate: eligible && date ? membershipStart(date) : null, eligible, reason,
  }
}

// ── Upstash (REST) ───────────────────────────────────────────────────────────
async function kv(cmds: (string | number)[][]): Promise<unknown[]> {
  const ctl = new AbortController()
  const timer = setTimeout(() => ctl.abort(), 4000)
  try {
    const r = await fetch(KV_URL() + '/pipeline', {
      method: 'POST', headers: { Authorization: 'Bearer ' + KV_TOKEN(), 'Content-Type': 'application/json' },
      body: JSON.stringify(cmds), signal: ctl.signal, cache: 'no-store',
    })
    if (!r.ok) throw new Error('kv ' + r.status)
    const out = (await r.json()) as { result?: unknown; error?: string }[]
    if (out.some((x) => x.error)) throw new Error('kv command error')
    return out.map((x) => x.result)
  } finally { clearTimeout(timer) }
}
/** Fixed-window rate limit; true = allowed. */
export async function rateOk(key: string, limit: number, windowS: number): Promise<boolean> {
  const [n] = await kv([['INCR', `tl:rl:${key}`], ['EXPIRE', `tl:rl:${key}`, windowS, 'NX']])
  return Number(n) <= limit
}

// ── Club Honbu ───────────────────────────────────────────────────────────────
async function honbu(path: string, init: RequestInit & { clientIp?: string } = {}): Promise<Response> {
  const ctl = new AbortController()
  const timer = setTimeout(() => ctl.abort(), 6000)
  try {
    return await fetch(lookupUrl() + path, {
      ...init, signal: ctl.signal, cache: 'no-store',
      headers: { 'Content-Type': 'application/json', 'X-Website-Secret': lookupSecret(), ...(init.clientIp ? { 'X-Website-Client-IP': init.clientIp } : {}) },
    })
  } finally { clearTimeout(timer) }
}
export async function honbuLookup(email: string, mobile: string, clientIp: string): Promise<HonbuTrial[]> {
  const r = await honbu('', { method: 'POST', body: JSON.stringify({ email, mobile }), clientIp })
  if (r.status === 429) throw new Error('honbu rate limited')
  if (!r.ok) throw new Error('honbu ' + r.status)
  const d = (await r.json()) as { matches?: HonbuTrial[] }
  return Array.isArray(d.matches) ? d.matches : []
}
export async function honbuTrial(ref: string, clientIp = ''): Promise<HonbuTrial | null> {
  if (!/^wt_\d{1,9}_[0-9a-f]{32}$/.test(ref)) return null
  const r = await honbu('/' + encodeURIComponent(ref), { method: 'GET', clientIp })
  if (r.status === 404) return null
  if (!r.ok) throw new Error('honbu ' + r.status)
  return ((await r.json()) as { trial?: HonbuTrial }).trial ?? null
}

// ── lookup sessions ──────────────────────────────────────────────────────────
type Session = { refs: string[]; code: string; tries: number; email: string }
export function newCode(): string {
  // 6 digits, uniform
  let n: number
  do { n = randomBytes(4).readUInt32BE(0) } while (n >= 4294000000)
  return String(n % 1_000_000).padStart(6, '0')
}
export async function createSession(email: string, refs: string[], code: string): Promise<string> {
  const id = randomBytes(16).toString('hex')
  const s: Session = { refs, code: codeHash(id, code), tries: 0, email: h(email) }
  await kv([['SET', `tl:s:${id}`, JSON.stringify(s), 'EX', CODE_TTL_S]])
  return id
}
export type VerifyResult =
  | { ok: true; token: string; refs: string[] }
  | { ok: false; status: 400 | 429; error: string; triesLeft?: number }
export async function verifyCode(lookupId: string, code: string): Promise<VerifyResult> {
  if (!/^[0-9a-f]{32}$/.test(lookupId)) return { ok: false, status: 400, error: 'Please start again.' }
  const [raw, ttl] = await kv([['GET', `tl:s:${lookupId}`], ['TTL', `tl:s:${lookupId}`]])
  if (typeof raw !== 'string') return { ok: false, status: 400, error: 'That code has expired. Please ask for a new one.' }
  const s = JSON.parse(raw) as Session
  if (s.tries >= MAX_TRIES) return { ok: false, status: 429, error: 'Too many tries. Please ask for a new code.' }
  const want = Buffer.from(s.code, 'hex'), got = Buffer.from(codeHash(lookupId, String(code ?? '').replace(/\s/g, '')), 'hex')
  const match = want.length === got.length && timingSafeEqual(want, got) && s.refs.length > 0
  if (!match) {
    s.tries++
    await kv([['SET', `tl:s:${lookupId}`, JSON.stringify(s), 'EX', Math.max(1, Number(ttl) || CODE_TTL_S)]])
    const left = MAX_TRIES - s.tries
    return left > 0
      ? { ok: false, status: 400, error: `That code isn't right. ${left} ${left === 1 ? 'try' : 'tries'} left.`, triesLeft: left }
      : { ok: false, status: 429, error: 'Too many tries. Please ask for a new code.', triesLeft: 0 }
  }
  const token = randomBytes(24).toString('hex')
  await kv([['DEL', `tl:s:${lookupId}`], ['SET', `tl:v:${token}`, JSON.stringify({ refs: s.refs }), 'EX', VERIFIED_TTL_S]])
  return { ok: true, token, refs: s.refs }
}
export async function verifiedRefs(token: unknown): Promise<string[] | null> {
  if (typeof token !== 'string' || !/^[0-9a-f]{48}$/.test(token)) return null
  const [raw] = await kv([['GET', `tl:v:${token}`]])
  if (typeof raw !== 'string') return null
  return (JSON.parse(raw) as { refs: string[] }).refs
}

/**
 * For the signup route: re-read the chosen trials from Club Honbu and return the trusted student
 * identity + trial date. All chosen trials must belong to the verified lookup and be eligible.
 */
export async function trustedTrials(token: unknown, chosen: unknown, clientIp = ''):
  Promise<{ ok: true; trials: TrialForForm[]; trialDate: string } | { ok: false; status: number; error: string }> {
  const refs = await verifiedRefs(token)
  if (!refs) return { ok: false, status: 400, error: 'Please confirm your trial booking again (the code step).' }
  const pick = Array.isArray(chosen) ? chosen.filter((x): x is string => typeof x === 'string') : []
  if (!pick.length || pick.length > 6 || new Set(pick).size !== pick.length || pick.some((r) => !refs.includes(r)))
    return { ok: false, status: 400, error: 'Please choose who is joining from your trial booking.' }
  const trials: TrialForForm[] = []
  for (const ref of pick) {
    const t = await honbuTrial(ref, clientIp)
    if (!t) return { ok: false, status: 400, error: 'We couldn\'t find one of those trial bookings any more. Please contact us.' }
    const f = forForm(t)
    if (!f.eligible || !f.trialDate) return { ok: false, status: 400, error: f.reason ?? 'That trial can\'t be used to join yet.' }
    trials.push(f)
  }
  // Several students: membership starts the week after the most recent trial.
  const trialDate = trials.map((t) => t.trialDate!).sort().pop()!
  return { ok: true, trials, trialDate }
}
