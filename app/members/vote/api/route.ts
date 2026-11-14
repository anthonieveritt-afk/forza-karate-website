import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { MEMBERS_COOKIE } from '@/lib/members/session'
import { normaliseVoteState, parseVoteBody } from '@/lib/members/karateka-vote'

const HONBU_API = (process.env.NEXT_PUBLIC_CLUB_HONBU_API ?? 'https://forza-club-honbu-production.up.railway.app/api').replace(/\/$/, '')
const NO_STORE = { 'Cache-Control': 'no-store, private' }

/**
 * Karate-ka of the Year vote. Lives under /members so the Path=/members session cookie is sent.
 * GET  → { open, year, canVote, myVote, candidates } for the active profile
 * POST { nomineeMemberId } → records (or changes) this profile's vote in Forza Club Honbu
 */
async function token() {
  return (await cookies()).get(MEMBERS_COOKIE)?.value
}

export async function GET() {
  const t = await token()
  if (!t) return NextResponse.json({ error: 'Please log in to the members area.' }, { status: 401, headers: NO_STORE })
  try {
    const r = await fetch(`${HONBU_API}/portal/karateka-vote`, {
      headers: { Authorization: `Bearer ${t}`, Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })
    const d = await r.json().catch(() => ({}))
    if (!r.ok) return NextResponse.json({ error: d?.error ?? 'Could not load the vote.' }, { status: r.status, headers: NO_STORE })
    return NextResponse.json(normaliseVoteState(d), { headers: NO_STORE })
  } catch {
    return NextResponse.json({ error: 'The members system is not answering. Please try again shortly.' }, { status: 502, headers: NO_STORE })
  }
}

export async function POST(req: NextRequest) {
  const t = await token()
  if (!t) return NextResponse.json({ error: 'Please log in to the members area.' }, { status: 401, headers: NO_STORE })
  const nomineeMemberId = parseVoteBody(await req.json().catch(() => null))
  if (!nomineeMemberId) return NextResponse.json({ error: 'Choose a member to vote for.' }, { status: 400, headers: NO_STORE })
  try {
    const r = await fetch(`${HONBU_API}/portal/karateka-vote`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${t}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ nomineeMemberId }),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })
    const d = await r.json().catch(() => ({}))
    if (!r.ok) return NextResponse.json({ error: d?.error ?? 'Could not save your vote.' }, { status: r.status, headers: NO_STORE })
    return NextResponse.json({ success: true, myVote: d?.myVote ?? null }, { headers: NO_STORE })
  } catch {
    return NextResponse.json({ error: 'The members system is not answering. Please try again shortly.' }, { status: 502, headers: NO_STORE })
  }
}
