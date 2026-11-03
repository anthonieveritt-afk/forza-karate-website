// Trial lookup, step 1: email + mobile. Always answers the same way (see lib/membership/trial-lookup.ts).
import { NextResponse, after } from 'next/server'
import { createHash } from 'crypto'
import { trialLookupEnabled, trialLookupReady, normaliseEmail, normaliseMobile, rateOk, honbuLookup, createSession, newCode } from '@/lib/membership/trial-lookup'
import { sendTrialCode } from '@/lib/membership/trial-code-email'
import { clientIp } from '@/lib/membership/client-ip'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const NO_STORE = { 'Cache-Control': 'no-store' }
export const SAME_ANSWER = "If we found your trial booking, we've emailed a code to that address. It can take a minute to arrive."
const keyOf = (s: string) => createHash('sha256').update(s).digest('hex').slice(0, 24)

/** Runs fn after the response where Next supports it (so timing doesn't reveal a match), else now. */
async function later(fn: () => Promise<unknown>) {
  try { after(fn) } catch { await fn() }
}

export async function POST(req: Request) {
  if (!trialLookupEnabled()) return NextResponse.json({ error: 'Not available.' }, { status: 404, headers: NO_STORE })
  if (!trialLookupReady()) return NextResponse.json({ error: 'Finding your trial is not available right now. Please email hello@forzakarate.co.uk.' }, { status: 503, headers: NO_STORE })
  const b = (await req.json().catch(() => null)) as { email?: unknown; mobile?: unknown } | null
  const email = normaliseEmail(b?.email), mobile = normaliseMobile(b?.mobile)
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) return NextResponse.json({ error: 'Please enter the email address you used to book the trial.' }, { status: 400, headers: NO_STORE })
  if (!/^0\d{9,10}$/.test(mobile)) return NextResponse.json({ error: 'Please enter the mobile number you used to book the trial.' }, { status: 400, headers: NO_STORE })
  const ip = clientIp(req)
  try {
    const [ipOk, emailOk] = await Promise.all([rateOk('ip:' + keyOf(ip), 10, 600), rateOk('em:' + keyOf(email), 3, 600)])
    if (!ipOk || !emailOk) return NextResponse.json({ error: 'Too many attempts. Please wait 10 minutes and try again.' }, { status: 429, headers: NO_STORE })
    let refs: string[] = []
    try { refs = (await honbuLookup(email, mobile, ip)).map(m => m.trialRef) }
    catch (e) {
      console.error('[trial-lookup] club honbu lookup failed', e instanceof Error ? e.message : 'error')
      return NextResponse.json({ error: 'We could not check trial bookings just now. Please try again in a few minutes.' }, { status: 502, headers: NO_STORE })
    }
    const code = newCode()
    const lookupId = await createSession(email, refs, code)
    if (refs.length) await later(() => sendTrialCode(email, code))
    return NextResponse.json({ ok: true, lookupId, message: SAME_ANSWER }, { headers: NO_STORE })
  } catch (e) {
    console.error('[trial-lookup] start failed', e instanceof Error ? e.message : 'error')
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500, headers: NO_STORE })
  }
}
