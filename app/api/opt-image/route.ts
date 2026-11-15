import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import { isAllowedImageHost, isHeicUrl, OPT_IMAGE_MAX_WIDTH } from '@/lib/opt-image'

export const runtime = 'nodejs'

async function heicToJpeg(input: Buffer): Promise<Buffer> {
  const mod = await import('heic-convert')
  const convert = (mod as { default?: (opts: { buffer: Buffer; format: 'JPEG'; quality: number }) => Promise<ArrayBuffer> }).default
    ?? (mod as unknown as (opts: { buffer: Buffer; format: 'JPEG'; quality: number }) => Promise<ArrayBuffer>)
  const out = await convert({ buffer: input, format: 'JPEG', quality: 0.9 })
  return Buffer.from(out)
}

export async function GET(req: NextRequest) {
  const raw = req.nextUrl.searchParams.get('url')
  const widthParam = Number(req.nextUrl.searchParams.get('w') || '1200')
  const width = Math.min(OPT_IMAGE_MAX_WIDTH, Math.max(1, Number.isFinite(widthParam) ? Math.round(widthParam) : 1200))
  if (!raw) return NextResponse.json({ error: 'Missing url' }, { status: 400 })

  let parsed: URL
  try {
    parsed = new URL(raw)
  } catch {
    return NextResponse.json({ error: 'Bad url' }, { status: 400 })
  }
  if (parsed.protocol !== 'https:' || !isAllowedImageHost(parsed.hostname)) {
    return NextResponse.json({ error: 'Host not allowed' }, { status: 400 })
  }

  const upstream = await fetch(parsed.toString(), {
    headers: { 'User-Agent': 'forzakarate.co.uk image optimizer' },
    redirect: 'error',
  })
  if (!upstream.ok) return NextResponse.json({ error: 'Upstream failed' }, { status: 502 })
  const buf = Buffer.from(await upstream.arrayBuffer())
  const contentType = upstream.headers.get('content-type') || ''

  let input: Buffer = Buffer.from(buf)
  if (isHeicUrl(parsed.toString()) || /heic|heif/i.test(contentType)) {
    try {
      input = Buffer.from(await heicToJpeg(buf))
    } catch {
      return NextResponse.json({ error: 'Could not convert this photo' }, { status: 415 })
    }
  }

  const out = await sharp(input, { failOn: 'none' })
    .rotate()
    .resize({ width, height: width, fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 78 })
    .toBuffer()

  return new NextResponse(new Uint8Array(out), {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
