import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const checkoutRoute = readFileSync(resolve(process.cwd(), 'app/api/checkout/route.ts'), 'utf8')
const shopPage = readFileSync(resolve(process.cwd(), 'app/shop/page.tsx'), 'utf8')
const otherCheckouts = [
  'app/api/grading-checkout/route.ts',
  'app/api/guides-checkout/route.ts',
  'app/api/membership/checkout/route.ts',
  'app/api/sporting-licence-checkout/route.ts',
  'app/api/trial-checkout/route.ts',
  'app/api/video-checkout/route.ts',
].map(path => ({ path, source: readFileSync(resolve(process.cwd(), path), 'utf8') }))

describe('Shop checkout offers card and Klarna only', () => {
  it('creates GBP shop sessions with card and Klarna, and no other methods', () => {
    expect(checkoutRoute).toContain("payment_method_types: ['card', 'klarna']")
    expect(checkoutRoute).toContain("currency: 'gbp'")
    expect(checkoutRoute).not.toMatch(/payment_method_types:\s*\['card'\]/)
  })

  it('does not add Klarna to other checkout routes', () => {
    for (const { path, source } of otherCheckouts) {
      expect(source, path).not.toMatch(/klarna/i)
    }
  })

  it('mentions Pay in 3 with Klarna on the shop page', () => {
    expect(shopPage).toContain('data-testid="shop-klarna-note"')
    expect(shopPage).toContain('Pay in 3 with Klarna available at checkout.')
  })
})
