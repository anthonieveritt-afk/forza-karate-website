import { getUnitPrice, getProduct } from '@/lib/shop/catalogue'
// Monthly membership tiers. Must match Club Honbu club_config membershipPrices
// (monthly_single / monthly_two / monthly_family). The annual upfront option is
// deliberately left out until its price is confirmed.
export const PLANS = {
  monthly_single: { label: 'Single', price: 5000, desc: '1 student' },
  monthly_two: { label: 'Siblings', price: 9000, desc: '2 students' },
  monthly_family: { label: 'Family', price: 12000, desc: '3 or more' },
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

export const SUIT_KEYS = ['blitz-gi'] as const
export type SuitKey = typeof SUIT_KEYS[number]
export function suitOptions() {
  return SUIT_KEYS.map(k => ({ key: k, name: getProduct(k)!.name, sizes: getProduct(k)!.sizes, price: getUnitPrice(k, getProduct(k)!.sizes[0]) ?? 0 }))
}
export function suitPrice(key: string, size: string): number | null {
  return (SUIT_KEYS as readonly string[]).includes(key) ? getUnitPrice(key, size) : null
}

/** Every new member buys the Official Forza Karate Club Gi (Anthoni, 18 Oct 2026): there is no "I already have one". */
export const REQUIRED_SUIT_KEY: SuitKey = 'blitz-gi'
export type ChosenSuit = { key: SuitKey; size: string; pricePence: number }

/**
 * Server-side check of a student's suit from the sign-up form. The suit is compulsory:
 * returns null (reject) for a missing suit, a missing/unknown size, or any other product key
 * (e.g. an old "already have one" / "none" value). The price always comes from the catalogue.
 */
export function requiredSuit(raw: unknown): ChosenSuit | null {
  if (!raw || typeof raw !== 'object') return null
  const r = raw as { key?: unknown; size?: unknown }
  const key = r.key == null || r.key === '' ? REQUIRED_SUIT_KEY : r.key
  if (key !== REQUIRED_SUIT_KEY || typeof r.size !== 'string') return null
  const size = r.size.trim()
  const pricePence = suitPrice(key, size)
  return pricePence == null || pricePence <= 0 ? null : { key: REQUIRED_SUIT_KEY, size, pricePence }
}

/** One-off items (suit + licence) for a sign-up, in the order they are charged. */
export function extrasLineItems(students: { firstName: string; suit?: { size: string; pricePence: number } | null; licence?: { feePence: number } | null }[]) {
  return students.flatMap(x => [
    ...(x.suit ? [{ label: `${x.firstName} suit ${x.suit.size}`, kind: 'suit' as const, pricePence: x.suit.pricePence }] : []),
    ...(x.licence && x.licence.feePence ? [{ label: `${x.firstName} licence`, kind: 'licence' as const, pricePence: x.licence.feePence }] : []),
  ])
}

// FKA licence & insurance: every student pays, first licence and renewal cost the same.
/** Age from which the adult licence fee applies. Under this age = child. */
export const LICENCE_ADULT_AGE = 18
export const LICENCE_FEE_CHILD = 5000 // £50
export const LICENCE_FEE_ADULT = 5500 // £55

export type LicenceType = 'first_time' | 'renewal'
export const LICENCE_TYPES: Record<LicenceType, string> = {
  first_time: 'First licence (new member)',
  renewal: 'Licence renewal',
}
export function ageOn(dob: string, on = new Date()): number | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dob)) return null
  return Math.floor((on.getTime() - new Date(dob + 'T12:00:00Z').getTime()) / (365.25 * 864e5))
}
export function licenceFeeForAge(age: number | null): number {
  return age !== null && age < LICENCE_ADULT_AGE ? LICENCE_FEE_CHILD : LICENCE_FEE_ADULT
}
/** Fee in pence: every student pays; child (under LICENCE_ADULT_AGE) or adult fee. */
export function licenceFeePence(_type: LicenceType, dob: string, on = new Date()): number {
  return licenceFeeForAge(ageOn(dob, on))
}
