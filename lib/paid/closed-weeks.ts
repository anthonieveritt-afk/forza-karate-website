// Dojo closed weeks (school holidays / half-terms) for trial-booking emails.
// OWNER: Club Operations — extend this list as dates are confirmed. Dates are UK local, inclusive.
export const CLOSED_RANGES: { from: string; to: string; label: string }[] = [
  { from: '2026-10-26', to: '2026-10-30', label: 'half-term' }, // Essex/Havering autumn half-term
]

const ukDate = (d: Date) => new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' }).format(d)

/** If `at` falls in a closed range, return its label and the Monday after it ends (first week back). */
export function closedWeek(at: Date = new Date()): { label: string; backMonday: string } | null {
  const today = ukDate(at)
  const r = CLOSED_RANGES.find((c) => today >= c.from && today <= c.to)
  if (!r) return null
  const d = new Date(`${r.to}T12:00:00Z`)
  do d.setUTCDate(d.getUTCDate() + 1); while (d.getUTCDay() !== 1)
  const back = new Intl.DateTimeFormat('en-GB', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' }).format(d)
  return { label: r.label, backMonday: back }
}
