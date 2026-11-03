// Trial lookup, step 2: check the emailed code, then return the trials (re-read from Club Honbu).
import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { trialLookupEnabled, trialLookupReady, verifyCode, honbuTrial, forForm, rateOk, type TrialForForm } from '@/lib/membership/trial-lookup'
import { clientIp } from '@/lib/membership/client-ip'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
const NO_STORE = { 'Cache-Control': 'no-store' }

export async function POST(req: Request) {
  if (!trialLookupEnabled()) return NextResponse.json({ error: 'Not available.' }, { status: 404, headers: NO_STORE })
  if (!trialLookupReady()) return NextResponse.json({ error: 'Finding your trial is not available right now.' }, { status: 503, headers: NO_STORE })
  const b = (await req.json().catch(() => null)) as { lookupId?: unknown; code?: unknown } | null
  const ip = clientIp(req)
  try {
    if (!(await rateOk('vip:' + createHash('sha256').update(ip).digest('hex').slice(0, 24), 30, 600)))
      return NextResponse.json({ error: 'Too many attempts. Please wait 10 minutes and try again.' }, { status: 429, headers: NO_STORE })
    const code = String(b?.code ?? '').replace(/\s/g, '')
    if (!/^\d{6}$/.test(code)) return NextResponse.json({ error: 'Please enter the 6-digit code from the email.' }, { status: 400, headers: NO_STORE })
    const v = await verifyCode(String(b?.lookupId ?? ''), code)
    if (!v.ok) return NextResponse.json({ error: v.error, triesLeft: v.triesLeft }, { status: v.status, headers: NO_STORE })
    const trials: TrialForForm[] = []
    for (const ref of v.refs) {
      const t = await honbuTrial(ref, ip)
      if (t) trials.push(forForm(t))
    }
    return NextResponse.json({ ok: true, token: v.token, trials }, { headers: NO_STORE })
  } catch (e) {
    console.error('[trial-lookup] verify failed', e instanceof Error ? e.message : 'error')
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500, headers: NO_STORE })
  }
}
