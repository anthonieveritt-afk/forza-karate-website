/** Public R2 bucket that serves Forza Club Honbu gallery and news photos. */
export const R2_IMAGE_HOST = 'pub-119c569153c84794919525fc33906a2c.r2.dev'

export const OPT_IMAGE_MAX_WIDTH = 1920

export function isAllowedImageHost(hostname: string): boolean {
  return hostname === R2_IMAGE_HOST || hostname.endsWith('.r2.dev')
}

export function isHeicUrl(src: string): boolean {
  try {
    const path = new URL(src, 'https://forzakarate.co.uk').pathname
    return /\.hei[cf]$/i.test(path)
  } catch {
    return /\.hei[cf]($|\?)/i.test(src)
  }
}

/** Proxy path for iPhone HEIC photos, which next/image / sharp cannot decode. */
export function heicProxySrc(src: string, width = 1200): string {
  const w = Math.min(OPT_IMAGE_MAX_WIDTH, Math.max(1, Math.round(width)))
  return `/api/opt-image?url=${encodeURIComponent(src)}&w=${w}`
}

/** Nearby carousel slides only. All slides share one viewport box, so loading="lazy" would still fetch every photo. */
export function nearbySlideIndices(current: number, length: number): Set<number> {
  if (length <= 0) return new Set()
  const next = (current + 1) % length
  const prev = (current - 1 + length) % length
  return new Set([current, next, prev])
}
