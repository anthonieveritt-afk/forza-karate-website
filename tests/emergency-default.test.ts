import { describe, it, expect } from 'vitest'
import { parseMembershipBody } from '../lib/gocardless/parse-signup'
const base = { plan: 'monthly_single', dojo: 'rayleigh', trialDate: '2026-10-20', consent: { terms: true },
  parent: { givenName: 'Pat', familyName: 'Doe', email: 'p@x.co', phone: '07700', address: '1 St', city: 'T', postCode: 'ss6 7dd' },
  students: [{ firstName: 'K', surname: 'Doe', dateOfBirth: '2016-01-01', suit: { key: 'gi', size: '140cm' } }] }
describe('emergency contact', () => {
  it('defaults to parent', () => {
    const r = parseMembershipBody(base) as any
    if (!r.ok) return expect(r.error).not.toMatch(/emergency/i)
    expect(r.signup.emergency).toEqual({ name: 'Pat Doe', phone: '07700' }); expect(r.signup.emergency2).toBeUndefined()
  })
  it('keeps optional second contact', () => {
    const r = parseMembershipBody({ ...base, emergency: { name: 'Gran', phone: '0711' } }) as any
    if (r.ok) expect(r.signup.emergency2.name).toBe('Gran')
  })
  it('rejects half-filled extra', () => {
    const r = parseMembershipBody({ ...base, emergency: { name: 'Gran' } }) as any
    expect(r.ok).toBe(false)
  })
})
