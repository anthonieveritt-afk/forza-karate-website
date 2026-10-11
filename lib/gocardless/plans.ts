// Monthly membership tiers. Must match Club Honbu club_config membershipPrices
// (monthly_single / monthly_two / monthly_family). The annual upfront option is
// deliberately left out until its price is confirmed.
export const PLANS = {
  monthly_single: { label: 'Single', price: 5000, desc: '1 student' },
  monthly_two: { label: 'Siblings', price: 8000, desc: '2 students' },
  monthly_family: { label: 'Family', price: 12000, desc: 'Family (3 or more)' },
} as const

export type PlanKey = keyof typeof PLANS

export const DOJOS = {
  rayleigh: 'Forza Karate — Rayleigh',
  upminster: 'Forza Karate — Upminster',
} as const
export type DojoKey = keyof typeof DOJOS

export function pounds(pence: number) {
  return `£${(pence / 100).toFixed(pence % 100 ? 2 : 0)}`
}

/** Membership starts the week after the trial class (trial date + 7 days). */
export function membershipStart(trialDate: string): string {
  const d = new Date(trialDate + 'T12:00:00Z')
  d.setUTCDate(d.getUTCDate() + 7)
  return d.toISOString().slice(0, 10)
}

/**
 * Pro-rata first payment, same bands as the old enrolment form
 * (Club Honbu routes/enrolment.ts proRataAmount), applied to the membership start day:
 * 1st–7th full month, 8th–14th 75%, 15th–21st 50%, 22nd–end 25%.
 */
export function proRataPence(monthlyPence: number, startDate: string): number {
  const day = Number(startDate.slice(8, 10))
  if (day <= 7) return monthlyPence
  if (day <= 14) return Math.round(monthlyPence * 0.75)
  if (day <= 21) return Math.round(monthlyPence * 0.5)
  return Math.round(monthlyPence * 0.25)
}

export function proRataLabel(startDate: string): string {
  const day = Number(startDate.slice(8, 10))
  return day <= 7 ? 'full month' : day <= 14 ? '75% of a month' : day <= 21 ? '50% of a month' : '25% of a month'
}

/** First 1st of the month strictly after the given date (YYYY-MM-DD). */
export function firstOfNextMonth(date: string): string {
  const d = new Date(date.slice(0, 7) + '-01T12:00:00Z')
  d.setUTCMonth(d.getUTCMonth() + 1)
  return d.toISOString().slice(0, 10)
}
