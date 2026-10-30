// Client-side attribution + Meta Pixel helpers. No personal data is ever sent to Meta.
export const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const
export type Utm = Partial<Record<(typeof UTM_KEYS)[number], string>>
const STORE = 'fk_utm'

/** Save UTMs from the current URL (first touch in this browser session wins unless new UTMs arrive). */
export function captureUtm() {
  if (typeof window === 'undefined') return
  const q = new URLSearchParams(window.location.search)
  const found: Utm = {}
  for (const k of UTM_KEYS) { const v = q.get(k); if (v) found[k] = v.trim().slice(0, 80) }
  if (q.get('fbclid')) found.utm_source ??= 'facebook'
  if (Object.keys(found).length) { try { sessionStorage.setItem(STORE, JSON.stringify(found)) } catch {} }
}

export function getUtm(): Utm {
  try { return JSON.parse(sessionStorage.getItem(STORE) || '{}') as Utm } catch { return {} }
}

type Fbq = (...args: unknown[]) => void
export function track(event: string, params?: Record<string, unknown>, eventID?: string) {
  const fbq = (window as unknown as { fbq?: Fbq }).fbq
  if (!fbq) return
  fbq('track', event, params || {}, eventID ? { eventID } : undefined)
}
