/** Carries answers from /join (first form) to /join/membership so nothing is asked twice. */
export type JoinPrefill = {
  dojo: string; classTime: string
  firstName: string; surname: string; dateOfBirth: string; belt: string; medical: string
  parent: { givenName: string; familyName: string; email: string; phone: string; address: string; city: string; postCode: string }
  emergency: { name: string; phone: string }
  savedAt: number
}
const KEY = 'forzaJoinPrefill'
const MAX_AGE_MS = 24 * 60 * 60 * 1000

export function saveJoinPrefill(p: Omit<JoinPrefill, 'savedAt'>) {
  try { localStorage.setItem(KEY, JSON.stringify({ ...p, savedAt: Date.now() })) } catch { /* private mode */ }
}
export function loadJoinPrefill(): JoinPrefill | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const p = JSON.parse(raw) as JoinPrefill
    if (!p.savedAt || Date.now() - p.savedAt > MAX_AGE_MS) { localStorage.removeItem(KEY); return null }
    return p
  } catch { return null }
}
export function clearJoinPrefill() { try { localStorage.removeItem(KEY) } catch { /* ignore */ } }
