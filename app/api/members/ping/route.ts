import { NextResponse } from 'next/server'

export async function GET() {
  const start = Date.now()
  try {
    const controller = new AbortController()
    const t = setTimeout(() => controller.abort(), 5000)
    const res = await fetch('https://forza-club-honbu-production.up.railway.app/health', {
      signal: controller.signal,
      cache: 'no-store',
    })
    clearTimeout(t)
    return NextResponse.json({ ok: true, status: res.status, ms: Date.now() - start })
  } catch (err: unknown) {
    return NextResponse.json({ ok: false, error: String(err), ms: Date.now() - start })
  }
}
