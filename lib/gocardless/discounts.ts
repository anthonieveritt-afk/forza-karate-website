// Discount codes for the become-a-member form (/join/membership). SERVER ONLY: the list is never
// sent to the browser. A code takes a percentage off the TRAINING FEES only (the monthly
// Direct Debit and the first month paid by card at sign-up). It never touches the gi or the licence.
//
// Rename or change codes here, or override the whole list without a deploy-time code change by
// setting the env var FORZA_DISCOUNT_CODES to JSON, e.g.
//   [{"code":"FORZA5","percent":5,"label":"Forza discount"},{"code":"BLUELIGHT10","percent":10,"label":"Blue light"}]
// (codes: 3-24 letters/digits/-/_; percent: 1-100). An invalid override is ignored and logged.
import 'server-only'
import { applyDiscount, bandAmountPence, bandForDate } from './plans'

export type DiscountCode = { code: string; percent: number; label: string }

export const DEFAULT_DISCOUNT_CODES: DiscountCode[] = [
  { code: 'FORZA5', percent: 5, label: 'Forza discount (5%)' },
  { code: 'BLUELIGHT10', percent: 10, label: 'Blue light discount (10%): emergency services, NHS, armed forces' },
  { code: 'FAMILY100', percent: 100, label: 'Family & friends (100% off training fees)' },
]

const CODE_RE = /^[A-Z0-9_-]{3,24}$/

/** Case-insensitive, ignores spaces: " forza 5 " -> "FORZA5". */
export function normaliseCode(raw: unknown): string {
  return typeof raw === 'string' ? raw.replace(/\s+/g, '').toUpperCase().slice(0, 40) : ''
}

function fromEnv(): DiscountCode[] | null {
  const raw = process.env.FORZA_DISCOUNT_CODES?.trim()
  if (!raw) return null
  try {
    const list = JSON.parse(raw)
    if (!Array.isArray(list) || !list.length) throw new Error('not a non-empty array')
    const out = list.map((x: { code?: unknown; percent?: unknown; label?: unknown }) => {
      const code = normaliseCode(x?.code)
      const percent = Number(x?.percent)
      if (!CODE_RE.test(code) || !Number.isInteger(percent) || percent < 1 || percent > 100) throw new Error('bad entry')
      return { code, percent, label: typeof x?.label === 'string' && x.label.trim() ? x.label.trim().slice(0, 120) : `${code} (${percent}%)` }
    })
    return out
  } catch (e) {
    console.error('FORZA_DISCOUNT_CODES ignored:', e instanceof Error ? e.message : 'invalid JSON')
    return null
  }
}

export function discountCodes(): DiscountCode[] {
  return fromEnv() ?? DEFAULT_DISCOUNT_CODES
}

export function findDiscount(raw: unknown): DiscountCode | null {
  const code = normaliseCode(raw)
  if (!code) return null
  return discountCodes().find((d) => d.code === code) ?? null
}

export type AppliedDiscount = {
  code: string
  label: string
  percent: number
  /** Monthly package fee before / after the code, and the monthly saving. */
  monthlyFullPence: number
  monthlyPence: number
  monthlyDiscountPence: number
  /** First month of training (paid by card at sign-up) before / after the code. */
  firstPaymentFullPence: number
  firstPaymentPence: number
  /** Plain-English note for Club Honbu, GoCardless metadata and emails. */
  note: string
}

/** Training fees for a sign-up, with an optional (already validated) code. */
export function trainingFees(monthlyFullPence: number, startDate: string, d: DiscountCode | null) {
  const monthlyPence = d ? applyDiscount(monthlyFullPence, d.percent) : monthlyFullPence
  // First month: Anthoni's weekly band for the start date (1st–7th 100%, 8th–14th 75%, 15th–22nd 50%,
  // 23rd+ 25% of the package fee), then the code's % off the banded amount.
  const band = bandForDate(startDate)
  const firstPaymentFullPence = bandAmountPence(monthlyFullPence, band)
  const firstPaymentPence = d ? applyDiscount(firstPaymentFullPence, d.percent) : firstPaymentFullPence
  const applied: AppliedDiscount | null = d
    ? {
        code: d.code, label: d.label, percent: d.percent,
        monthlyFullPence, monthlyPence, monthlyDiscountPence: monthlyFullPence - monthlyPence,
        firstPaymentFullPence, firstPaymentPence,
        note: `Discount code ${d.code} (${d.percent}% off training fees): monthly £${(monthlyFullPence / 100).toFixed(2)} -> £${(monthlyPence / 100).toFixed(2)}, first month (joining ${band.short}, ${band.percent}%) £${(firstPaymentFullPence / 100).toFixed(2)} -> £${(firstPaymentPence / 100).toFixed(2)}; gi and licence charged in full.`,
      }
    : null
  return { monthlyPence, firstPaymentPence, firstPaymentFullPence, band, applied }
}
