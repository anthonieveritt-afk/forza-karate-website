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
  // WKF competition suits (supplier price + £15)
  'wkf-koi-kumite-set':           26500,
  'wkf-sendo-reversible':         16500,
  'wkf-okami-kumite-white':       10500,
  'wkf-okami-kumite-red':         10500,
  'wkf-okami-kumite-blue':        10500,
  'wkf-niwa-white-belt':          6500,
  'wkf-arashi-kata-white':        16500,
  'wkf-arashi-kata-red':          17500,
  'wkf-arashi-kata-blue':         17500,
  'wkf-kaji-kata-set':            30000,
}

// Per-size prices (overrides PRICES when a size is selected)
export const SIZE_PRICES: Record<string, Record<string, number>> = {
  // WKF competition suits whose price depends on size (supplier price + £15)
  'wkf-koi-kumite-red': { '150cm': 18000, '155cm': 18000, '160cm': 18000, '165cm': 18000, '170cm': 19000, '175cm': 19000, '180cm': 19000, '185cm': 19000, '190cm': 19000 },
  'wkf-koi-kumite-blue': { '150cm': 18000, '155cm': 18000, '160cm': 18000, '165cm': 18000, '170cm': 19000, '175cm': 19000, '180cm': 19000, '185cm': 19000, '190cm': 19000 },
  'wkf-niji-kumite-bundle': { '150cm': 20000, '155cm': 20000, '160cm': 21000, '165cm': 21000, '170cm': 21000, '175cm': 21000, '180cm': 21000, '185cm': 21000, '190cm': 21000, '195cm': 21000, '200cm': 21000 },
  'wkf-niji-kumite-white': { '130cm': 13000, '150cm': 13000, '160cm': 13000, '165cm': 13000, '170cm': 13000, '175cm': 14000, '180cm': 14000, '185cm': 14000, '190cm': 14000 },
  'wkf-umi-kumite-white': { '150cm': 10000, '155cm': 10000, '160cm': 10000, '165cm': 10000, '170cm': 10500, '175cm': 10500, '180cm': 10500, '185cm': 10500, '190cm': 10500, '195cm': 10500 },
}
// ────────────────────────────────────────────────────────────────────────────

/** Shop category for the WKF approved competition suits. */
export const WKF_CATEGORY = 'WKF Competition Suits'

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
    name: 'Official Forza Karate Club Gi',
    category: 'Clothing',
    sizes: ['100cm', '110cm', '120cm', '130cm', '140cm', '150cm', '160cm', '170cm', '180cm', '190cm', '200cm', '210cm'],
    img: '/shop/blitz-gi.jpg',
    desc: 'Sized by height. If between sizes, go up.',
  },
  // ── WKF competition suits ── for tournaments; members still train in the club gi above.
  {
    key: 'wkf-koi-kumite-red',
    name: 'KOI Kumite Gi – Platinum',
    category: WKF_CATEGORY,
    colour: 'Red (aka)',
    sizes: ['150cm',  '155cm',  '160cm',  '165cm',  '170cm',  '175cm',  '180cm',  '185cm',  '190cm'],
    img: '/shop/wkf-koi-kumite-red.webp',
    badge: 'WKF Approved',
    desc: 'Kumite competition suit. Slim fit, ultralight 4.3oz polyester, no shrinkage. Breathable inserts. Sized by height.',
  },
  {
    key: 'wkf-koi-kumite-blue',
    name: 'KOI Kumite Gi – Platinum',
    category: WKF_CATEGORY,
    colour: 'Blue (ao)',
    sizes: ['150cm',  '155cm',  '160cm',  '165cm',  '170cm',  '175cm',  '180cm',  '185cm',  '190cm'],
    img: '/shop/wkf-koi-kumite-blue.webp',
    badge: 'WKF Approved',
    desc: 'Kumite competition suit. Slim fit, ultralight 4.3oz polyester, no shrinkage. Breathable inserts. Sized by height.',
  },
  {
    key: 'wkf-koi-kumite-set',
    name: 'KOI Kumite Gi Set – Platinum',
    category: WKF_CATEGORY,
    colour: '1 red + 1 blue gi',
    sizes: ['150cm',  '155cm',  '160cm',  '165cm',  '170cm',  '175cm',  '180cm',  '185cm',  '190cm'],
    img: '/shop/wkf-koi-kumite-set.webp',
    badge: 'WKF Approved',
    desc: 'Kumite competition suit. Two full gis, one red collar and one blue collar. Slim fit, 4.3oz polyester. Sized by height.',
  },
  {
    key: 'wkf-niji-kumite-bundle',
    name: 'NIJI Kumite Gi Bundle – Premium',
    category: WKF_CATEGORY,
    colour: 'Red + blue jacket, 1 trousers',
    sizes: ['150cm',  '155cm',  '160cm',  '165cm',  '170cm',  '175cm',  '180cm',  '185cm',  '190cm',  '195cm',  '200cm'],
    img: '/shop/wkf-niji-kumite-bundle.webp',
    badge: 'WKF Approved',
    desc: 'Kumite competition suit. 2 jackets (red and blue shoulder trim) plus 1 trousers. Slim fit, 4.3oz polyester. Sized by height.',
  },
  {
    key: 'wkf-niji-kumite-white',
    name: 'NIJI Kumite Gi – Premium',
    category: WKF_CATEGORY,
    colour: 'White',
    sizes: ['130cm',  '150cm',  '160cm',  '165cm',  '170cm',  '175cm',  '180cm',  '185cm',  '190cm'],
    img: '/shop/wkf-niji-kumite-white.webp',
    badge: 'WKF Approved',
    desc: 'Kumite competition suit. Slim fit, ultralight 4.3oz polyester, no shrinkage. Breathable inserts. Sized by height.',
  },
  {
    key: 'wkf-sendo-reversible',
    name: 'SENDO Reversible Kumite Gi – Premium',
    category: WKF_CATEGORY,
    colour: 'Reversible red / blue jacket',
    sizes: ['150cm',  '155cm',  '160cm',  '165cm',  '170cm',  '175cm',  '180cm',  '185cm',  '190cm',  '195cm',  '200cm'],
    img: '/shop/wkf-sendo-reversible.webp',
    badge: 'WKF Approved',
    desc: 'Kumite competition suit. Jacket reverses from red to blue, plus trousers. Very light 2.5oz polyester. Sized by height.',
  },
  {
    key: 'wkf-umi-kumite-white',
    name: 'UMI Kumite Gi – Signature',
    category: WKF_CATEGORY,
    colour: 'White',
    sizes: ['150cm',  '155cm',  '160cm',  '165cm',  '170cm',  '175cm',  '180cm',  '185cm',  '190cm',  '195cm'],
    img: '/shop/wkf-umi-kumite-white.webp',
    badge: 'WKF Approved',
    desc: 'Kumite competition suit. Very light 2.5oz polyester, no shrinkage. Breathable inserts. Sized by height.',
  },
  {
    key: 'wkf-okami-kumite-white',
    name: 'OKAMI Kumite Gi – Signature',
    category: WKF_CATEGORY,
    colour: 'White',
    sizes: ['130cm',  '140cm',  '145cm',  '150cm',  '160cm',  '165cm',  '170cm',  '175cm',  '180cm',  '185cm',  '190cm',  '195cm',  '200cm'],
    img: '/shop/wkf-okami-kumite-white.webp',
    badge: 'WKF Approved',
    desc: 'Kumite competition suit. Free cut for any build. 4.3oz polyester, breathable inserts. Sized by height.',
  },
  {
    key: 'wkf-okami-kumite-red',
    name: 'OKAMI Kumite Gi – Signature',
    category: WKF_CATEGORY,
    colour: 'Red (aka)',
    sizes: ['145cm',  '160cm',  '180cm',  '195cm',  '200cm'],
    img: '/shop/wkf-okami-kumite-red.webp',
    badge: 'WKF Approved',
    desc: 'Kumite competition suit. Free cut for any build. 4.3oz polyester, breathable inserts. Sized by height.',
  },
  {
    key: 'wkf-okami-kumite-blue',
    name: 'OKAMI Kumite Gi – Signature',
    category: WKF_CATEGORY,
    colour: 'Blue (ao)',
    sizes: ['145cm',  '160cm',  '180cm',  '200cm'],
    img: '/shop/wkf-okami-kumite-blue.webp',
    badge: 'WKF Approved',
    desc: 'Kumite competition suit. Free cut for any build. 4.3oz polyester, breathable inserts. Sized by height.',
  },
  {
    key: 'wkf-niwa-white-belt',
    name: 'NIWA Gi with Belt – Essential',
    category: WKF_CATEGORY,
    colour: 'White, belt included',
    sizes: ['100cm',  '110cm',  '120cm',  '125cm',  '130cm',  '135cm',  '140cm',  '145cm',  '150cm',  '155cm',  '160cm',  '165cm',  '170cm',  '175cm',  '180cm',  '185cm',  '190cm'],
    img: '/shop/wkf-niwa-white-belt.webp',
    badge: 'WKF Approved',
    desc: 'WKF approved entry-level suit for competition and training. 7oz cotton/polyester ribbed weave. Belt included. Allow 2–3cm for shrinkage. Sized by height.',
  },
  {
    key: 'wkf-arashi-kata-white',
    name: 'ARASHI Kata Gi',
    category: WKF_CATEGORY,
    colour: 'White',
    sizes: ['145cm',  '160cm',  '170cm',  '180cm',  '185cm',  '190cm'],
    img: '/shop/wkf-arashi-kata-white.webp',
    badge: 'WKF Approved',
    desc: 'Kata competition suit. Heavy 13oz canvas (95% cotton) with a sharp snap on fast moves. Sized by height.',
  },
  {
    key: 'wkf-arashi-kata-red',
    name: 'ARASHI Kata Gi K1',
    category: WKF_CATEGORY,
    colour: 'Red (aka)',
    sizes: ['145cm',  '160cm',  '170cm',  '180cm',  '185cm',  '190cm'],
    img: '/shop/wkf-arashi-kata-red.webp',
    badge: 'WKF Approved',
    desc: 'Kata competition suit. Heavy 13oz canvas (95% cotton) with a sharp snap on fast moves. Red shoulder trim. Sized by height.',
  },
  {
    key: 'wkf-arashi-kata-blue',
    name: 'ARASHI Kata Gi K1',
    category: WKF_CATEGORY,
    colour: 'Blue (ao)',
    sizes: ['170cm',  '180cm',  '190cm'],
    img: '/shop/wkf-arashi-kata-blue.webp',
    badge: 'WKF Approved',
    desc: 'Kata competition suit. Heavy 13oz canvas (95% cotton) with a sharp snap on fast moves. Blue shoulder trim. Sized by height.',
  },
  {
    key: 'wkf-kaji-kata-set',
    name: 'KAJI Kata Gi Set',
    category: WKF_CATEGORY,
    colour: 'Red + blue jacket, 1 trousers',
    sizes: ['150cm',  '155cm',  '160cm',  '165cm',  '170cm',  '175cm',  '180cm',  '185cm',  '190cm',  '195cm',  '200cm'],
    img: '/shop/wkf-kaji-kata-set.webp',
    badge: 'WKF Approved',
    desc: 'Kata competition suit. 2 jackets (red and blue trim) plus 1 trousers. Heavy 13oz canvas with a sharp snap. Sized by height.',
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

/** Lowest and highest unit price in pence across a product's sizes. */
export function getPriceRange(productKey: string): { min: number; max: number } | null {
  const product = getProduct(productKey)
  if (!product || product.priceOnRequest) return null
  const all = product.sizes.map(s => getUnitPrice(productKey, s)).filter((p): p is number => p != null)
  if (!all.length) return null
  return { min: Math.min(...all), max: Math.max(...all) }
}

/**
 * Name for baskets, Stripe and order emails. When several products share a model name
 * (e.g. the red and blue KOI), the colour is added to tell them apart.
 */
export function orderName(product: Product): string {
  const shared = products.filter(p => p.name === product.name).length > 1
  return shared && product.colour ? `${product.name}, ${product.colour.split(' (')[0]}` : product.name
}

export function getProduct(productKey: string): Product | undefined {
  return products.find(p => p.key === productKey)
}
