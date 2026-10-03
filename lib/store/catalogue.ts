// The one place the store reads its products from.
//
// Today the catalogue is the static file lib/store/products.ts. To switch to
// Club Honbu later, change these two functions to fetch
// `${CLUB_HONBU_API}/store/public/products` (cached, e.g. `next: { revalidate: 300 }`),
// map each row to a StoreProduct, and fall back to the static file if Club
// Honbu can't be reached. Nothing else in the store needs to change.

import { STORE_PRODUCTS } from './products'
import type { StoreProduct } from './types'

export async function getStoreProducts(): Promise<StoreProduct[]> {
  return STORE_PRODUCTS
}

export async function getStoreProduct(slug: string): Promise<StoreProduct | undefined> {
  return STORE_PRODUCTS.find(p => p.slug === slug)
}
