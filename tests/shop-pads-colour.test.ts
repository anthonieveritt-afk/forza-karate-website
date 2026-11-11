import { describe, expect, it } from 'vitest'
import { getChosenColour, getProduct, getUnitPrice, lineDescription, orderName, PAD_COLOURS, requiresColour } from '@/lib/shop/catalogue'
import { parseItems, sessionItemsSummary, stripeProductMetadata, stripeProductName } from '@/lib/shop/checkout'

const PAD_KEYS = ['smai-shin-red', 'smai-mitts', 'blitz-shin-blue'] as const

describe('Pad colour options', () => {
  it('requires a Red or Blue choice on hand pads and both shin/instep pads', () => {
    for (const key of PAD_KEYS) {
      const product = getProduct(key)
      expect(product, key).toBeTruthy()
      expect(product!.colours).toEqual([...PAD_COLOURS])
      expect(requiresColour(key)).toBe(true)
    }
    expect(getProduct('smai-mitts')!.name).toBe('SMAI WKF Kumite Mitts')
    expect(getProduct('smai-shin-red')!.name).toBe('SMAI WKF Shin & Instep Guards')
    expect(getProduct('blitz-shin-blue')!.name).toBe('Blitz Shin & Instep Guards')
  })

  it('does not add a colour choice to other shop products', () => {
    expect(requiresColour('forza-tshirt')).toBe(false)
    expect(requiresColour('chest-guard')).toBe(false)
    expect(requiresColour('blitz-gi')).toBe(false)
    expect(getProduct('forza-tshirt')!.colours).toBeUndefined()
  })

  it('keeps the same unit price for either colour', () => {
    expect(getUnitPrice('smai-shin-red', 'M')).toBe(6500)
    expect(getUnitPrice('smai-mitts', 'S')).toBe(4500)
    expect(getUnitPrice('blitz-shin-blue', 'L')).toBe(4500)
    expect(getChosenColour('smai-mitts', 'Red')).toBe('Red')
    expect(getChosenColour('smai-mitts', 'Blue')).toBe('Blue')
    expect(getChosenColour('smai-mitts', 'Green')).toBeNull()
    expect(getChosenColour('forza-tshirt', 'Red')).toBeNull()
  })
})

describe('Shop checkout colour', () => {
  it('rejects pad lines without a colour', () => {
    const result = parseItems({ items: [{ productKey: 'smai-mitts', size: 'M', quantity: 1 }] })
    expect(result).toEqual({ error: 'Please choose Red or Blue for each pair of pads in your basket.' })
  })

  it('rejects an invalid pad colour', () => {
    const result = parseItems({ items: [{ productKey: 'smai-shin-red', size: 'M', colour: 'Green', quantity: 1 }] })
    expect(result).toEqual({ error: 'Please choose Red or Blue for each pair of pads in your basket.' })
  })

  it('accepts pad lines with Red or Blue and puts the colour on the Stripe line and session', () => {
    const result = parseItems({
      items: [
        { productKey: 'smai-mitts', size: 'M', colour: 'Red', quantity: 1 },
        { productKey: 'blitz-shin-blue', size: 'S', colour: 'Blue', quantity: 2 },
      ],
    })
    expect(result).toEqual({
      items: [
        { productKey: 'smai-mitts', size: 'M', colour: 'Red', quantity: 1 },
        { productKey: 'blitz-shin-blue', size: 'S', colour: 'Blue', quantity: 2 },
      ],
    })
    if ('error' in result) throw new Error(result.error)
    expect(stripeProductName(result.items[0])).toBe('SMAI WKF Kumite Mitts — M — Red')
    expect(stripeProductMetadata(result.items[0])).toEqual({ productKey: 'smai-mitts', size: 'M', colour: 'Red' })
    expect(stripeProductName(result.items[1])).toBe('Blitz Shin & Instep Guards — S — Blue')
    expect(stripeProductMetadata(result.items[1])).toEqual({ productKey: 'blitz-shin-blue', size: 'S', colour: 'Blue' })
    expect(sessionItemsSummary(result.items)).toBe('SMAI WKF Kumite Mitts Red M ×1; Blitz Shin & Instep Guards Blue S ×2')
  })

  it('treats the same pad in two colours as separate lines', () => {
    const result = parseItems({
      items: [
        { productKey: 'smai-shin-red', size: 'M', colour: 'Red', quantity: 1 },
        { productKey: 'smai-shin-red', size: 'M', colour: 'Blue', quantity: 1 },
      ],
    })
    if ('error' in result) throw new Error(result.error)
    expect(result.items).toHaveLength(2)
  })

  it('still accepts clothing without a colour, and keeps colour off the Stripe line', () => {
    const result = parseItems({ items: [{ productKey: 'forza-tshirt', size: 'M', quantity: 1 }] })
    if ('error' in result) throw new Error(result.error)
    expect(result.items).toEqual([{ productKey: 'forza-tshirt', size: 'M', quantity: 1 }])
    expect(stripeProductName(result.items[0])).toBe('Forza Karate T-Shirt — M')
    expect(stripeProductMetadata(result.items[0])).toEqual({ productKey: 'forza-tshirt', size: 'M' })
    expect(lineDescription(getProduct('forza-tshirt')!, 'M')).toBe('Forza Karate T-Shirt — M')
    expect(orderName(getProduct('forza-tshirt')!)).toBe('Forza Karate T-Shirt')
  })
})
