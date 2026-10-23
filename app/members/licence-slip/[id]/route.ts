import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const HONBU_API = (process.env.NEXT_PUBLIC_CLUB_HONBU_API ?? 'https://forza-club-honbu-production.up.railway.app/api').replace(/\/$/, '')
const COOKIE_NAME = 'forza-members-auth'

/**
 * Proxies the member's own EKNGB / Sport:80 licence slip PDF from Club Honbu.
 * Lives under /members so the Path=/members session cookie is included.
 * The browser never sees the Club Honbu Bearer token in a client fetch.
 */
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const slipId = Number(id)
  if (!Number.isInteger(slipId) || slipId <= 0) {
    return NextResponse.json({ error: 'Bad slip id' }, { status: 400 })
  }

  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) {
    return NextResponse.json({ error: 'Please log in to the members area.' }, { status: 401 })
  }

  try {
    const upstream = await fetch(`${HONBU_API}/portal/licence/slips/${slipId}/file`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(20000),
    })
    if (!upstream.ok) {
      const errBody = await upstream.text().catch(() => '')
      let message = 'Could not download your licence slip.'
      try {
        const j = JSON.parse(errBody)
        if (typeof j?.error === 'string') message = j.error
      } catch { /* keep default */ }
      return NextResponse.json({ error: message }, { status: upstream.status === 404 ? 404 : upstream.status })
    }

    const buf = await upstream.arrayBuffer()
    const contentType = upstream.headers.get('content-type') || 'application/pdf'
    const disposition = upstream.headers.get('content-disposition') || 'attachment; filename="licence-slip.pdf"'
    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': disposition,
        'Cache-Control': 'private, no-store, max-age=0',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch {
    return NextResponse.json({ error: 'Could not reach the club system. Please try again.' }, { status: 503 })
  }
}
