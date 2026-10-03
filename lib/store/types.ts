// Types for the online store catalogue.
//
// The catalogue is a static file for now (lib/store/products.ts). It is shaped
// so it can later be loaded from Club Honbu's store_products table instead:
// see lib/store/catalogue.ts for the single place to swap the source.

export type StoreCategory = 'uniforms' | 'sparring' | 'clothing' | 'belts' | 'bundles'

export const CATEGORY_LABELS: Record<StoreCategory, string> = {
  uniforms: 'Uniforms',
  sparring: 'Sparring kit',
  clothing: 'Clothing',
  belts: 'Belts',
  bundles: 'Bundles',
}

export interface OptionValue {
  value: string
  /** Shown to the customer if different from `value`. */
  label?: string
  /** Replaces the product's base price when chosen (e.g. a size that costs more). Pence. */
  price?: number
  /** Added to the price when chosen (e.g. +£5 for a larger size). Pence. */
  extra?: number
}

export interface ProductOption {
  /** Stable key, e.g. "size" or "colour". */
  key: string
  label: string
  values: OptionValue[]
  help?: string
}

/** Free text the customer types, e.g. the name embroidered on a belt. */
export interface Personalisation {
  key: string
  label: string
  maxLength: number
  help?: string
}

export interface StoreProduct {
  slug: string
  name: string
  category: StoreCategory
  /** One line for product cards. */
  summary: string
  /** Paragraphs for the product page. */
  description: string[]
  /** Path under /public. Belts without a photo show a belt graphic instead. */
  image?: string
  badge?: string
  /** Base price in pence. Options can replace it (`price`) or add to it (`extra`). */
  price: number
  options: ProductOption[]
  personalisation?: Personalisation
  /** "order-in" items are ordered from the supplier after you pay. */
  availability: 'in-stock' | 'order-in'
  leadTime?: string
  /** False: shown in the store but can't be bought online. */
  availableOnline: boolean
  /** Why the 14-day right to cancel doesn't apply (Consumer Contracts Regulations 2013, reg 28). */
  noCancellation?: 'personalised' | 'hygiene'
  sizeGuide?: string
}
