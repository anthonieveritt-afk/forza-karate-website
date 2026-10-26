// Dojo closed weeks (school holidays / half-terms) for Forza trial emails — PER DOJO.
// Rayleigh (Love Lane Primary) follows Essex CC + Schools for Every Child; Upminster (St Lawrence) follows Havering.
// Kept as separate lists even where dates currently align (Whitsun etc. will differ).
// Sources: /home/box/shared/club-operations/closed-calendar-2026-27.md and
//          /home/box/shared/growth-sales/dojo-holiday-calendars-2026-10-26.md (Club Ops confirmed 26 Oct 2026).
// OWNER: Club Operations — add ranges per dojo as confirmed. No other closed weeks 2 Nov – 18 Dec 2026.
// Dates are UK local, inclusive; `back` = Monday of the next teaching week.
export type DojoKey = 'rayleigh' | 'upminster'
type Range = { from: string; to: string; label: string; back: string }

export const CLOSED_BY_DOJO: Record<DojoKey, Range[]> = {
  rayleigh: [
    { from: '2026-10-26', to: '2026-11-01', label: 'half-term', back: '2026-11-02' }, // Mon 26–Fri 30 Oct + Sat 31/Sun 1
    { from: '2026-12-21', to: '2027-01-03', label: 'Christmas holiday', back: '2027-01-04' }, // 21–31 Dec + 1 Jan BH + weekend
    { from: '2027-05-31', to: '2027-06-13', label: 'Whitsun half-term', back: '2027-06-14' }, // SfEC 2-week Whitsun 31 May–11 Jun + weekend
  ],
  upminster: [
    { from: '2026-10-26', to: '2026-11-01', label: 'half-term', back: '2026-11-02' },
    { from: '2026-12-21', to: '2027-01-03', label: 'Christmas holiday', back: '2027-01-04' }, // 21–31 Dec + 1 Jan BH + weekend
    { from: '2027-05-31', to: '2027-06-06', label: 'Whitsun half-term', back: '2027-06-07' }, // Havering 1-week 31 May–4 Jun + weekend
  ],
}

export function dojoKey(dojo?: string | null): DojoKey | null {
  const d = (dojo || '').toLowerCase()
  if (d.includes('rayleigh')) return 'rayleigh'
  if (d.includes('upminster')) return 'upminster'
  return null
}

const ukDate = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)
const pretty = (iso: string) => new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${iso}T12:00:00Z`))

/** Closed-week info for the booked dojo at `at`. Unknown dojo: closed only if every dojo is closed (never guess). */
export function closedWeek(dojo?: string | null, at: Date = new Date()): { label: string; backMonday: string } | null {
  const today = ukDate(at)
  const k = dojoKey(dojo)
  const keys: DojoKey[] = k ? [k] : ['rayleigh', 'upminster']
  const hits = keys.map((x) => CLOSED_BY_DOJO[x].find((r) => today >= r.from && today <= r.to))
  if (hits.some((h) => !h)) return null
  const r = hits.reduce((a, b) => (b!.back > a!.back ? b : a))!
  return { label: r.label, backMonday: pretty(r.back) }
}
