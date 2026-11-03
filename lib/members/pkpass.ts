import { inflateRawSync } from 'node:zlib'

/** Minimal ZIP reader for Apple Wallet .pkpass files (unsigned read; no crypto needed). */
export function unzip(buf: Buffer): Map<string, Buffer> {
  const out = new Map<string, Buffer>()
  let eocd = -1
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break }
  }
  if (eocd < 0) throw new Error('Not a zip')
  const count = buf.readUInt16LE(eocd + 10)
  let p = buf.readUInt32LE(eocd + 16)
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) break
    const method = buf.readUInt16LE(p + 10)
    const csize = buf.readUInt32LE(p + 20)
    const nlen = buf.readUInt16LE(p + 28), elen = buf.readUInt16LE(p + 30), clen = buf.readUInt16LE(p + 32)
    const lho = buf.readUInt32LE(p + 42)
    const name = buf.subarray(p + 46, p + 46 + nlen).toString('utf8')
    const start = lho + 30 + buf.readUInt16LE(lho + 26) + buf.readUInt16LE(lho + 28)
    const data = buf.subarray(start, start + csize)
    try { out.set(name, method === 8 ? inflateRawSync(data) : Buffer.from(data)) } catch { /* skip */ }
    p += 46 + nlen + elen + clen
  }
  return out
}

export type PassField = { label: string; value: string }
export type PassCard = {
  org: string; logoText: string; description: string
  bg: string; fg: string; label: string
  logo?: string; strip?: string; thumbnail?: string
  header: PassField[]; primary: PassField[]; secondary: PassField[]; auxiliary: PassField[]
  barcode?: string
}

function colour(c: unknown, d: string): string {
  return typeof c === 'string' && c.trim() ? c.trim() : d
}
function img(files: Map<string, Buffer>, base: string): string | undefined {
  const b = files.get(`${base}@2x.png`) ?? files.get(`${base}.png`) ?? files.get(`${base}@3x.png`)
  return b ? `data:image/png;base64,${b.toString('base64')}` : undefined
}

export function parsePass(buf: Buffer): PassCard {
  const files = unzip(buf)
  const raw = files.get('pass.json')
  if (!raw) throw new Error('No pass.json')
  const j = JSON.parse(raw.toString('utf8').replace(/^\uFEFF/, ''))
  const style = ['generic', 'storeCard', 'eventTicket', 'coupon', 'boardingPass'].map((k) => j[k]).find(Boolean) ?? {}
  const f = (arr: unknown): PassField[] =>
    (Array.isArray(arr) ? arr : []).map((x: any) => ({ label: String(x?.label ?? ''), value: String(x?.value ?? '') })).filter((x) => x.value)
  const bc = j.barcodes?.[0] ?? j.barcode
  return {
    org: String(j.organizationName ?? ''), logoText: String(j.logoText ?? ''), description: String(j.description ?? ''),
    bg: colour(j.backgroundColor, 'rgb(17,17,17)'), fg: colour(j.foregroundColor, 'rgb(255,255,255)'), label: colour(j.labelColor, 'rgb(200,200,200)'),
    logo: img(files, 'logo'), strip: img(files, 'strip'), thumbnail: img(files, 'thumbnail'),
    header: f(style.headerFields), primary: f(style.primaryFields), secondary: f(style.secondaryFields), auxiliary: f(style.auxiliaryFields),
    barcode: bc?.altText ?? bc?.message,
  }
}
