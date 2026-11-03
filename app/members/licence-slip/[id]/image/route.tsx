import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { ImageResponse } from 'next/og'
import { parsePass, type PassField } from '@/lib/members/pkpass'

export const runtime = 'nodejs'
const HONBU_API = (process.env.NEXT_PUBLIC_CLUB_HONBU_API ?? 'https://forza-club-honbu-production.up.railway.app/api').replace(/\/$/, '')
const COOKIE_NAME = 'forza-members-auth'

/**
 * PNG "screenshot" of a member's Apple Wallet (.pkpass) licence slip, rendered on demand
 * from pass.json + logo/strip images. Works for every existing slip — no backfill needed.
 * ?download=1 saves it as a file.
 */
export async function GET(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const slipId = Number(id)
  if (!Number.isInteger(slipId) || slipId <= 0) return NextResponse.json({ error: 'Bad slip id' }, { status: 400 })
  const token = (await cookies()).get(COOKIE_NAME)?.value
  if (!token) return NextResponse.json({ error: 'Please log in to the members area.' }, { status: 401 })

  let card
  try {
    const up = await fetch(`${HONBU_API}/portal/licence/slips/${slipId}/file`, {
      headers: { Authorization: `Bearer ${token}` }, cache: 'no-store', signal: AbortSignal.timeout(20000),
    })
    if (!up.ok) return NextResponse.json({ error: 'Could not load your licence.' }, { status: up.status })
    card = parsePass(Buffer.from(await up.arrayBuffer()))
  } catch {
    return NextResponse.json({ error: 'This licence file could not be turned into an image.' }, { status: 422 })
  }

  const Fields = ({ items, big }: { items: PassField[]; big?: boolean }) =>
    items.length ? (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, marginTop: 20 }}>
        {items.map((x, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 20, color: card.label, textTransform: 'uppercase' }}>{x.label || ' '}</div>
            <div style={{ fontSize: big ? 44 : 30, color: card.fg, fontWeight: 700 }}>{x.value}</div>
          </div>
        ))}
      </div>
    ) : null

  const res = new ImageResponse(
    (
      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: card.bg, padding: 40, fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {card.logo && <img src={card.logo} height={60} style={{ objectFit: 'contain' }} />}
            <div style={{ fontSize: 30, color: card.fg, fontWeight: 700 }}>{card.logoText || card.org}</div>
          </div>
          <Fields items={card.header} />
        </div>
        {card.strip && <img src={card.strip} width={670} style={{ marginTop: 24, borderRadius: 8, objectFit: 'cover' }} />}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}><Fields items={card.primary} big /></div>
          {card.thumbnail && <img src={card.thumbnail} height={160} style={{ marginTop: 24, borderRadius: 8 }} />}
        </div>
        <Fields items={card.secondary} />
        <Fields items={card.auxiliary} />
        {card.barcode && <div style={{ marginTop: 'auto', fontSize: 24, color: card.label }}>{card.barcode}</div>}
      </div>
    ),
    { width: 750, height: 1000 },
  )
  const dl = req.nextUrl.searchParams.get('download') === '1'
  const headers = new Headers(res.headers)
  headers.set('Cache-Control', 'private, no-store, max-age=0')
  headers.set('Content-Disposition', `${dl ? 'attachment' : 'inline'}; filename="sporting-licence-${slipId}.png"`)
  return new NextResponse(res.body, { status: 200, headers })
}
