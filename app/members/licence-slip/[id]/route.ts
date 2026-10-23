import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

const HONBU_API = (process.env.NEXT_PUBLIC_CLUB_HONBU_API ?? 'https://forza-club-honbu-production.up.railway.app/api').replace(/\/$/, '')
const COOKIE_NAME = 'forza-members-auth'

function filenameFromDisposition(disposition: string | null): string {
  if (!disposition) return 'licence-slip.pdf'
  const star = /filename\*=(?:UTF-8''|utf-8'')([^;]+)/i.exec(disposition)
  if (star?.[1]) {
    try {
      return decodeURIComponent(star[1].trim().replace(/^"+|"+$/g, ''))
    } catch {
      /* fall through */
    }
  }
  const plain = /filename=(?:"((?:\\.|[^"])*)"|([^;]+))/i.exec(disposition)
  const raw = (plain?.[1] ?? plain?.[2] ?? '').trim().replace(/^"+|"+$/g, '')
  return raw || 'licence-slip.pdf'
}

/**
 * Proxies the member's own EKNGB / Sport:80 licence slip PDF from Club Honbu.
 * Lives under /members so the Path=/members session cookie is included.
 * The browser never sees the Club Honbu Bearer token in a client fetch.
 *
 * Default: Content-Disposition inline (iframe / embed preview).
 * ?download=1 or ?attachment=1: Content-Disposition attachment (save to disk).
 */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
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

  const forceDownload =
    req.nextUrl.searchParams.get('download') === '1' ||
    req.nextUrl.searchParams.get('attachment') === '1'

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
    const filename = filenameFromDisposition(upstream.headers.get('content-disposition'))
    const safeName = filename.replace(/[\\"\r\n]/g, '_')
    const disposition = forceDownload
      ? `attachment; filename="${safeName}"`
      : `inline; filename="${safeName}"`

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
