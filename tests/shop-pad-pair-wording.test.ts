import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'
import { PAD_COLOUR_NOTE, PAD_PAIR_DESC, products } from '@/lib/shop/catalogue'

const shopPage = readFileSync(resolve(process.cwd(), 'app/shop/page.tsx'), 'utf8')

describe('Shop pad pair wording on the product card', () => {
  it('shows the one-pair note next to the colour picker', () => {
    expect(shopPage).toContain('PAD_COLOUR_NOTE')
    expect(shopPage).toContain('data-testid="pad-colour-note"')
    expect(PAD_COLOUR_NOTE).toMatch(/one pair/i)
    expect(PAD_COLOUR_NOTE).toMatch(/choose red or blue/i)
  })

  it('puts the single-pair description on the three Red/Blue pad products only', () => {
    const padKeys = ['smai-mitts', 'smai-shin-red', 'blitz-shin-blue']
    for (const product of products) {
      if (padKeys.includes(product.key)) {
        expect(product.desc).toBe(PAD_PAIR_DESC)
      } else {
        expect(product.desc ?? '').not.toContain('single pair')
      }
    }
  })
})
