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
