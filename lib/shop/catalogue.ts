// Shop catalogue: the single source of truth for shop products and prices.
//
// The shop page imports this to show products, and app/api/checkout/route.ts
// imports it to price the order on the server. The browser only ever sends a
// product key, a size and a quantity; it never decides the price.

// ─── PRICES ── edit here to update shop prices ──────────────────────────────
export const PRICES: Record<string, number> = {
  // values in pence (£65.00 = 6500)
  'smai-shin-red':               6500,
  'chest-guard':                 3500,
  'mouthguards':                  500,
  'smai-mitts':                  4500,
  'forza-tshirt':                2000,
  'blitz-shin-blue':             4500,
  'blitz-gi':                    4000,
}

// Per-size prices (overrides PRICES when a size is selected)
export const SIZE_PRICES: Record<string, Record<string, number>> = {}
// ────────────────────────────────────────────────────────────────────────────

export type Product = {
  key: string
  name: string
  category: string
  colour?: string
  sizes: string[]
  img: string
  badge?: string
  desc?: string
  priceOnRequest?: boolean
}

export const products: Product[] = [
  {
    key: 'smai-shin-red',
    name: 'SMAI WKF Shin & Instep Guards',
    category: 'Equipment',
    colour: 'Red',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    img: '/shop/smai-shin-red.jpg',
    badge: 'WKF Approved',
  },
  {
    key: 'chest-guard',
    name: 'Chest Guard / Body Protector',
    category: 'Equipment',
    colour: 'White',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    img: '/shop/chest-guard-white.jpg',
  },
  {
    key: 'mouthguards',
    name: 'Mouthguards',
    category: 'Equipment',
    colour: 'Assorted colours',
    sizes: ['Junior', 'Senior'],
    img: '/shop/mouthguards.jpg',
  },
  {
    key: 'smai-mitts',
    name: 'SMAI WKF Kumite Mitts',
    category: 'Equipment',
    colour: 'Red & Blue pair',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    img: '/shop/smai-mitts.jpg',
    badge: 'WKF Approved',
  },
  {
    key: 'forza-tshirt',
    name: 'Forza Karate T-Shirt',
    category: 'Clothing',
    sizes: ['Age 3–4', 'Age 5–6', 'Age 7–8', 'Age 9–10', 'Age 11–12', 'S', 'M', 'L', 'XL'],
    img: '/shop/forza-tshirt.jpg',
  },
  {
    key: 'blitz-shin-blue',
    name: 'Blitz Shin & Instep Guards',
    category: 'Equipment',
    colour: 'Blue',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    img: '/shop/blitz-shin-blue.jpg',
  },
  {
    key: 'blitz-gi',
    name: 'Blitz Karate Gi',
    category: 'Clothing',
    sizes: ['100cm', '110cm', '120cm', '130cm', '140cm', '150cm', '160cm', '170cm', '180cm', '190cm', '200cm', '210cm'],
    img: '/shop/blitz-gi.jpg',
    desc: 'Sized by height. If between sizes, go up.',
  },
]

/**
 * Server-trusted unit price in pence for a product and size, or null if the
 * product, the size or the price is unknown, or the item isn't sold online.
 */
// Removed 17 Oct 2026 (only the official £40 club gi is sold now): forza-gi-student,
// sport-kumite-gi, sport-kumite-gi-embroidered, sport-kumite-red-blue. Old baskets
// holding these keys are pruned in lib/cart-context.tsx and refused by checkout.
export const REMOVED_PRODUCT_KEYS = ['forza-gi-student', 'sport-kumite-gi', 'sport-kumite-gi-embroidered', 'sport-kumite-red-blue']

export function getUnitPrice(productKey: string, size: string): number | null {
  const product = products.find(p => p.key === productKey)
  if (!product || product.priceOnRequest) return null
  if (!product.sizes.includes(size)) return null
  if (SIZE_PRICES[productKey]) return SIZE_PRICES[productKey][size] ?? null
  return PRICES[productKey] ?? null
}

export function getProduct(productKey: string): Product | undefined {
  return products.find(p => p.key === productKey)
}
