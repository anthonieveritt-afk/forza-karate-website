// Shared shop-checkout helpers. The API route prices the order on the server;
// these functions keep validation and Stripe naming in one place so tests can
// cover them without calling Stripe.

import { getChosenColour, getProduct, getUnitPrice, lineDescription, orderName, requiresColour } from '@/lib/shop/catalogue'

export const MAX_LINES = 20
export const MAX_QTY_PER_LINE = 10

export type RequestedItem = {
  productKey: string
  size: string
  colour?: string
  quantity: number
}

/**
 * Checks the basket sent by the browser. It may only contain a product key,
 * a size, a colour when the product requires one, and a quantity; any price
 * it sends is ignored. Returns an error message, or the cleaned items with
 * duplicate lines merged.
 */
export function parseItems(body: unknown): { error: string } | { items: RequestedItem[] } {
  const raw = (body as { items?: unknown } | null)?.items
  if (!Array.isArray(raw) || raw.length === 0) return { error: 'Your basket is empty.' }
  if (raw.length > MAX_LINES) return { error: `Please order no more than ${MAX_LINES} different items at once.` }

  const merged = new Map<string, RequestedItem>()
  for (const entry of raw) {
    const { productKey, size, colour: rawColour, quantity } = (entry ?? {}) as Record<string, unknown>
    if (typeof productKey !== 'string' || typeof size !== 'string') {
      return { error: 'Your basket contains an item we don’t recognise. Please clear it and try again.' }
    }
    if (typeof quantity !== 'number' || !Number.isInteger(quantity) || quantity < 1) {
      return { error: 'Please check the quantities in your basket.' }
    }
    if (getUnitPrice(productKey, size) == null) {
      return { error: 'Your basket contains an item that is no longer available. Please clear it and try again.' }
    }
    let colour: string | undefined
    if (requiresColour(productKey)) {
      const chosen = typeof rawColour === 'string' ? getChosenColour(productKey, rawColour.trim()) : null
      if (!chosen) {
        return { error: 'Please choose Red or Blue for each pair of pads in your basket.' }
      }
      colour = chosen
    }
    const id = `${productKey}|${size}|${colour ?? ''}`
    const existing = merged.get(id)
    const total = (existing?.quantity ?? 0) + quantity
    if (total > MAX_QTY_PER_LINE) {
      return { error: `Please order no more than ${MAX_QTY_PER_LINE} of any one item.` }
    }
    merged.set(id, { productKey, size, ...(colour ? { colour } : {}), quantity: total })
  }
  return { items: [...merged.values()] }
}

export function stripeProductName(item: RequestedItem): string {
  const product = getProduct(item.productKey)
  if (!product) return item.productKey
  return lineDescription(product, item.size, item.colour)
}

export function stripeProductMetadata(item: RequestedItem): Record<string, string> {
  const metadata: Record<string, string> = { productKey: item.productKey, size: item.size }
  if (item.colour) metadata.colour = item.colour
  return metadata
}

/** Compact basket summary for the Stripe Checkout session metadata (500-character cap). */
export function sessionItemsSummary(items: RequestedItem[]): string {
  return items
    .map(item => {
      const product = getProduct(item.productKey)
      const name = product ? orderName(product) : item.productKey
      const colour = item.colour ? ` ${item.colour}` : ''
      return `${name}${colour} ${item.size} ×${item.quantity}`
    })
    .join('; ')
    .slice(0, 500)
}
