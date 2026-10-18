// Checks one discount code for the become-a-member form. Returns only that code's name and
// percentage, never the list. The billing-request route re-checks the code and recomputes
// every amount itself; this endpoint is just for the "Apply" button.
import { NextResponse } from 'next/server'
import { findDiscount, normaliseCode } from '@/lib/gocardless/discounts'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Light per-instance rate limit to slow down guessing (20 checks / 10 min per client).
const hits = new Map<string, number[]>()
function limited(req: Request): boolean {
  const ip = (req.headers.get('x-forwarded-for') || '').split(',')[0].trim() || req.headers.get('x-real-ip') || 'local'
  const now = Date.now()
  const recent = (hits.get(ip) || []).filter((t) => now - t < 10 * 60_000)
  recent.push(now)
  if (hits.size > 5000) hits.clear()
  hits.set(ip, recent)
  return recent.length > 20
}

export async function POST(req: Request) {
  const headers = { 'Cache-Control': 'no-store' }
  if (limited(req)) return NextResponse.json({ valid: false, error: 'Too many tries. Please wait a few minutes.' }, { status: 429, headers })
  const b = await req.json().catch(() => null)
  const code = normaliseCode(b?.code)
  if (!code) return NextResponse.json({ valid: false, error: 'Please enter a discount code.' }, { status: 400, headers })
  const d = findDiscount(code)
  if (!d) return NextResponse.json({ valid: false, error: "Sorry, that discount code isn't valid." }, { status: 400, headers })
  return NextResponse.json({ valid: true, code: d.code, percent: d.percent, label: d.label }, { headers })
}
