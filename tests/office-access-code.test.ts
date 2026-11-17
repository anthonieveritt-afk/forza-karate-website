import { describe, it, expect, vi } from 'vitest'
import {
  normalizeJoinCode,
  discountLabelFor,
  parseOfficeValidateResponse,
  validateOfficeAccessCode,
  accessCodesValidateUrl,
} from '@/lib/officeAccessCode'

describe('office access code helpers', () => {
  it('normalizes codes without advertising a specific value', () => {
    expect(normalizeJoinCode('  abc-1  ')).toBe('ABC-1')
    expect(normalizeJoinCode('')).toBe('')
  })

  it('builds a percent-off label', () => {
    expect(discountLabelFor(50)).toBe('50% off')
    expect(discountLabelFor(100)).toBe('100% off')
  })

  it('parses a valid Office validate response', () => {
    expect(parseOfficeValidateResponse({ valid: true, discount_percent: 50, code_id: 'x' })).toEqual({
      valid: true,
      discountPercent: 50,
      discountLabel: '50% off',
    })
  })

  it('parses invalid and used-up responses', () => {
    expect(parseOfficeValidateResponse({ valid: false })).toEqual({
      valid: false,
      message: "That code isn't valid",
    })
    expect(parseOfficeValidateResponse({ valid: false, reason: 'Code limit reached' })).toEqual({
      valid: false,
      message: 'This code has reached its use limit',
    })
  })

  it('hits the Office Access Codes validate path, not a client-side code list', async () => {
    const fetchImpl = vi.fn(async (url: string) => {
      expect(String(url)).toContain('/api/access-codes/validate?code=TEST50OFF')
      return { ok: true, json: async () => ({ valid: true, discount_percent: 50 }) } as Response
    })
    const result = await validateOfficeAccessCode('test50off', fetchImpl as unknown as typeof fetch)
    expect(result).toEqual({ valid: true, discountPercent: 50, discountLabel: '50% off' })
    expect(fetchImpl).toHaveBeenCalledOnce()
  })

  it('returns a generic invalid message when Office rejects the code', async () => {
    const fetchImpl = vi.fn(async () => ({ ok: true, json: async () => ({ valid: false }) }) as Response)
    const result = await validateOfficeAccessCode('NOTREAL', fetchImpl as unknown as typeof fetch)
    expect(result.valid).toBe(false)
    if (!result.valid) expect(result.message).toBe("That code isn't valid")
  })

  it('does not embed any access code in the validate URL helper base', () => {
    const url = accessCodesValidateUrl('TEST50OFF')
    expect(url).toMatch(/\/api\/access-codes\/validate\?code=TEST50OFF$/)
    expect(url).not.toContain('vercel.app')
  })
})
