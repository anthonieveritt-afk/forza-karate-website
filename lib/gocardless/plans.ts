import { getUnitPrice, getProduct } from '@/lib/shop/catalogue'
// Monthly membership tiers. Must match Club Honbu club_config membershipPrices
// (monthly_single / monthly_two / monthly_family). The annual upfront option is
// deliberately left out until its price is confirmed.
export const PLANS = {
  monthly_single: { label: 'Single', price: 5000, desc: '1 student' },
  monthly_two: { label: 'Siblings', price: 9000, desc: '2 students' },
  monthly_family: { label: 'Family', price: 12000, desc: 'Family (3 or more)' },
} as const

export type PlanKey = keyof typeof PLANS

/** Single = 1 student, Siblings = exactly 2, Family = 3 or more. */
export function planAllowed(plan: PlanKey, students: number): boolean {
  if (plan === 'monthly_single') return students === 1
  if (plan === 'monthly_two') return students === 2
  return students >= 3
}

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

// ─── One-off extras taken in the same Direct Debit flow ─────────────────────

export const SUIT_KEYS = ['forza-gi-student', 'blitz-gi'] as const
export type SuitKey = typeof SUIT_KEYS[number]
export function suitOptions() {
  return SUIT_KEYS.map(k => ({ key: k, name: getProduct(k)!.name, sizes: getProduct(k)!.sizes, price: getUnitPrice(k, getProduct(k)!.sizes[0]) ?? 0 }))
}
export function suitPrice(key: string, size: string): number | null {
  return (SUIT_KEYS as readonly string[]).includes(key) ? getUnitPrice(key, size) : null
}

// FKA licence & insurance: every student pays, first licence and renewal cost the same.
/** Age from which the adult licence fee applies. Under this age = child. */
export const LICENCE_ADULT_AGE = 18
export const LICENCE_FEE_CHILD = 5000 // £50
export const LICENCE_FEE_ADULT = 5500 // £55

export type LicenceType = 'first_time' | 'renewal' | 'valid'
export const LICENCE_TYPES: Record<LicenceType, string> = {
  first_time: 'First licence (new member)',
  renewal: 'Licence renewal',
  valid: 'Already licensed: current licence still valid',
}
export function ageOn(dob: string, on = new Date()): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null
  return Math.floor((on.getTime() - new Date(dob + 'T12:00:00Z').getTime()) / (365.25 * 864e5))
}
export function licenceFeeForAge(age: number | null): number {
  return age !== null && age < LICENCE_ADULT_AGE ? LICENCE_FEE_CHILD : LICENCE_FEE_ADULT
}
/** Fee in pence. 'valid' (current licence not yet expired) pays nothing; everything else pays the child/adult fee. */
export function licenceFeePence(type: LicenceType, dob: string, on = new Date()): number {
  if (type === 'valid') return 0
  return licenceFeeForAge(ageOn(dob, on))
}
