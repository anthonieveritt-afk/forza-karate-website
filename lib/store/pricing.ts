// Pure pricing and validation helpers, shared by the browser (to show prices)
// and the server (to charge them). The server never trusts a price from the
// browser: it recalculates every line with these functions.

import type { Personalisation, StoreProduct } from './types'

export type Selections = Record<string, string>

export const MAX_QTY_PER_LINE = 10
export const MAX_LINES = 20

/**
 * Unit price in pence for a product with the chosen options, or null if the
 * product can't be bought online or the options are missing or invalid.
 */
export function unitPrice(product: StoreProduct, selections: Selections): number | null {
  if (!product.availableOnline) return null
  for (const key of Object.keys(selections)) {
    if (!product.options.some(o => o.key === key)) return null
  }
  let base = product.price
  let extra = 0
  for (const option of product.options) {
    const chosen = option.values.find(v => v.value === selections[option.key])
    if (!chosen) return null
    if (chosen.price != null) base = chosen.price
    extra += chosen.extra ?? 0
  }
  return base + extra
}

/** Lowest and highest possible unit price, for "From £x" labels. */
export function priceRange(product: StoreProduct): { min: number; max: number } {
  let combos: Selections[] = [{}]
  for (const option of product.options) {
    combos = combos.flatMap(c => option.values.map(v => ({ ...c, [option.key]: v.value })))
    if (combos.length > 5000) break // safety: never expected with real products
  }
  const prices = combos
    .map(c => unitPrice({ ...product, availableOnline: true }, c))
    .filter((p): p is number => p != null)
  if (prices.length === 0) return { min: product.price, max: product.price }
  return { min: Math.min(...prices), max: Math.max(...prices) }
}

/**
 * Tidies and checks personalisation text (e.g. a name on a belt). Returns the
 * cleaned text, or null if it's empty, too long or has unsupported characters.
 */
export function cleanPersonalisation(text: unknown, p: Personalisation): string | null {
  if (typeof text !== 'string') return null
  const cleaned = text.replace(/\s+/g, ' ').trim()
  if (cleaned.length < 1 || cleaned.length > p.maxLength) return null
  if (!/^[\p{L}\p{M}0-9 '’.\-&]+$/u.test(cleaned)) return null
  return cleaned
}

/** Same product + options + personalisation = same basket line. */
export function lineKey(slug: string, selections: Selections, personalisation?: string): string {
  const opts = Object.keys(selections).sort().map(k => `${k}=${selections[k]}`).join(';')
  return `${slug}|${opts}|${personalisation ?? ''}`
}

/** "Size 140cm · Colour Red", using option labels. */
export function describeSelections(product: StoreProduct, selections: Selections): string {
  return product.options
    .map(o => {
      const v = o.values.find(x => x.value === selections[o.key])
      return v ? `${o.label}: ${v.label ?? v.value}` : null
    })
    .filter(Boolean)
    .join(' · ')
}

export function formatPence(pence: number): string {
  return (pence / 100).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })
}
