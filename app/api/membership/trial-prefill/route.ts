import { NextResponse } from 'next/server'
import { verifyTrialJoinToken, fetchTrialPrefill } from '@/lib/trialJoin'

export const dynamic = 'force-dynamic'

/** GET ?t=<signed token> → prefill for /join/membership. Invalid/expired → 400 (page falls back to a blank form). */
export async function GET(req: Request) {
  const id = verifyTrialJoinToken(new URL(req.url).searchParams.get('t'))
  if (!id) return NextResponse.json({ error: 'This join link has expired or is not valid. You can still fill in the form below.' }, { status: 400 })
  const p = await fetchTrialPrefill(id)
  if (!p) return NextResponse.json({ error: 'We couldn\u2019t load your trial details just now. You can still fill in the form below.' }, { status: 502 })
  if (p.converted) return NextResponse.json({ error: 'It looks like this membership is already set up. Any questions, email sensei.everitt@forzakarate.co.uk.', converted: true }, { status: 409 })
  const s = (p.session || '').toLowerCase()
  const dojo = s.includes('upminster') ? 'upminster' : s.includes('rayleigh') ? 'rayleigh' : ''
  return NextResponse.json({ student: p.student, email: p.email, phone: p.phone, trialDate: p.trialDate, dojo },
    { headers: { 'Cache-Control': 'no-store' } })
}
