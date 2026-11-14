// Browser loader for the award certificate assets in /public/awards (Forza design only).
import { AWARD_FONT_FILES, AWARD_IMAGE_FILES, type AwardAssets } from './award-certificate'
import { COMMONWEALTH_2026, type CommonwealthAssets } from './commonwealth-certificate'

const BASE = '/awards'

async function fetchOk(url: string): Promise<Response> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Could not load ${url.split('/').pop()} (${res.status})`)
  return res
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(r.result as string)
    r.onerror = reject
    r.readAsDataURL(blob)
  })
}

function bufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let bin = ''
  const chunk = 0x8000
  for (let i = 0; i < bytes.length; i += chunk) bin += String.fromCharCode(...bytes.subarray(i, i + chunk))
  return btoa(bin)
}

let cached: Promise<AwardAssets> | null = null

/** Only the Forza (ribbons) design is used in the portal, so only its logo, badge row and fonts are loaded. */
export function loadAwardAssets(): Promise<AwardAssets> {
  if (!cached) {
    cached = (async () => {
      const img = async (f: string) => blobToDataUrl(await (await fetchOk(`${BASE}/${f}`)).blob())
      const files = AWARD_FONT_FILES.filter((f) => f.for.includes('classic'))
      const [wordmark, badges, ...fontData] = await Promise.all([
        img(AWARD_IMAGE_FILES.wordmark),
        img(AWARD_IMAGE_FILES.badges),
        ...files.map(async (f) => bufferToBase64(await (await fetchOk(`${BASE}/fonts/${f.file}`)).arrayBuffer())),
      ])
      const fonts: Record<string, string> = {}
      files.forEach((f, i) => {
        fonts[f.file] = fontData[i]
      })
      return { wordmark, badges, forzaLogo: '', emblem: '', fonts }
    })().catch((err) => {
      cached = null
      throw err
    })
  }
  return cached
}

let cwCached: Promise<CommonwealthAssets> | null = null

/** Background photo + Gelasio Bold for the Commonwealth Championships 2026 certificate. */
export function loadCommonwealthAssets(): Promise<CommonwealthAssets> {
  if (!cwCached) {
    cwCached = (async () => {
      const [background, font] = await Promise.all([
        (async () => blobToDataUrl(await (await fetchOk(`${BASE}/${COMMONWEALTH_2026.background}`)).blob()))(),
        (async () => bufferToBase64(await (await fetchOk(`${BASE}/fonts/${COMMONWEALTH_2026.fontFile}`)).arrayBuffer()))(),
      ])
      return { background, font }
    })().catch((err) => {
      cwCached = null
      throw err
    })
  }
  return cwCached
}
