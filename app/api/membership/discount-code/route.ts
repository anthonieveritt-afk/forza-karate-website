// Checks one discount code for the become-a-member form. Returns only that code's name and
// percentage, never the list. The sign-up route re-checks the code and recomputes every amount
// itself; this endpoint is just for the "Apply" button.
// The approval-gated tester code (lib/membership/tester.ts) is recognised here too, but its value is
// never echoed back: the response just says it's the tester code and needs approval.
import { NextResponse } from 'next/server'
import { findDiscount, normaliseCode } from '@/lib/gocardless/discounts'
import { codeAttemptLimited, isTesterCode, testerAvailable, RATE_LIMITED_MESSAGE, TESTER_ACCEPTED_MESSAGE, TESTER_LABEL } from '@/lib/membership/tester'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const NOT_VALID = "Sorry, that discount code isn't valid."

export async function POST(req: Request) {
  const headers = { 'Cache-Control': 'no-store' }
  // 10 code attempts per 10 minutes per client (shared with the sign-up submit), so codes can't be guessed.
  if (await codeAttemptLimited(req)) return NextResponse.json({ valid: false, error: RATE_LIMITED_MESSAGE }, { status: 429, headers })
  const b = await req.json().catch(() => null)
  const raw = typeof b?.code === 'string' ? b.code : ''
  const code = normaliseCode(raw)
  if (!code) return NextResponse.json({ valid: false, error: 'Please enter a discount code.' }, { status: 400, headers })
  if (isTesterCode(raw)) {
    if (!testerAvailable()) return NextResponse.json({ valid: false, error: NOT_VALID }, { status: 400, headers })
    return NextResponse.json({ valid: true, tester: true, code: TESTER_LABEL, percent: 100, label: 'Club tester code', message: TESTER_ACCEPTED_MESSAGE }, { headers })
  }
  const d = findDiscount(code)
  if (!d) return NextResponse.json({ valid: false, error: NOT_VALID }, { status: 400, headers })
  return NextResponse.json({ valid: true, code: d.code, percent: d.percent, label: d.label }, { headers })
}
