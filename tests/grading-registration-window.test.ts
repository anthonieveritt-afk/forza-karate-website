import { describe, it, expect } from 'vitest'
import {
  EMERGENCY_GRADING_FEE_POUNDS,
  defaultEmergencyClosesOn,
  effectiveEmergencyClosesOn,
  emergencyFeeWording,
  instantFromLondonLocal,
  londonYmd,
  payableFeePounds,
  registrationMode,
  ukDateLabel,
} from '@/lib/grading-registration-window'

const DECEMBER = { registerBy: '2026-12-04T23:59:59', awardStart: '2026-12-14' }
const atLondon = (local: string) => instantFromLondonLocal(local)

describe('December 2026 window (register by 4 Dec, award week from 14 Dec)', () => {
  it('defaults the emergency close to the day before belts are handed out', () => {
    expect(defaultEmergencyClosesOn('2026-12-14')).toBe('2026-12-13')
    expect(effectiveEmergencyClosesOn('2026-12-14', null)).toBe('2026-12-13')
    expect(effectiveEmergencyClosesOn('2026-12-14', '2026-12-10')).toBe('2026-12-10')
    expect(ukDateLabel('2026-12-13')).toBe('Sunday 13th December 2026')
  })

  it('deadline day is still normal, including 23:59:59 UK', () => {
    expect(registrationMode(DECEMBER, atLondon('2026-12-04T12:00:00'))).toBe('normal')
    expect(registrationMode(DECEMBER, atLondon('2026-12-04T23:59:59'))).toBe('normal')
    expect(payableFeePounds(35, 'normal')).toBe(35)
  })

  it('the day after the deadline is the first emergency day', () => {
    expect(registrationMode(DECEMBER, atLondon('2026-12-05T00:00:00'))).toBe('emergency')
    expect(registrationMode(DECEMBER, atLondon('2026-12-05T09:00:00'))).toBe('emergency')
    expect(payableFeePounds(35, 'emergency')).toBe(55)
    expect(payableFeePounds(40, 'emergency')).toBe(60)
  })

  it('the day before belt hand-out is the last emergency day', () => {
    expect(registrationMode(DECEMBER, atLondon('2026-12-13T00:00:00'))).toBe('emergency')
    expect(registrationMode(DECEMBER, atLondon('2026-12-13T23:59:59'))).toBe('emergency')
  })

  it('belt hand-out day is closed', () => {
    expect(registrationMode(DECEMBER, atLondon('2026-12-14T00:00:00'))).toBe('closed')
    expect(registrationMode(DECEMBER, atLondon('2026-12-14T10:00:00'))).toBe('closed')
    expect(payableFeePounds(35, 'closed')).toBeNull()
  })

  it('an Office override shortens the emergency window', () => {
    const ev = { ...DECEMBER, emergencyClosesOn: '2026-12-10' }
    expect(registrationMode(ev, atLondon('2026-12-10T23:59:59'))).toBe('emergency')
    expect(registrationMode(ev, atLondon('2026-12-11T00:00:00'))).toBe('closed')
  })
})

describe('UK timezone (GMT in December, BST in July)', () => {
  it('treats 4 Dec 23:59:59 as midnight GMT (no BST)', () => {
    const d = atLondon('2026-12-04T23:59:59')
    expect(d.toISOString()).toBe('2026-12-04T23:59:59.000Z')
    expect(londonYmd(d)).toBe('2026-12-04')
  })

  it('treats 3 July 23:59:59 as 22:59:59 UTC (BST)', () => {
    const d = atLondon('2026-07-03T23:59:59')
    expect(d.toISOString()).toBe('2026-07-03T22:59:59.000Z')
    const july = { registerBy: '2026-07-03T23:59:59', awardStart: '2026-07-11' }
    expect(registrationMode(july, atLondon('2026-07-03T23:59:59'))).toBe('normal')
    expect(registrationMode(july, atLondon('2026-07-04T00:00:00'))).toBe('emergency')
    expect(atLondon('2026-07-04T00:00:00').toISOString()).toBe('2026-07-03T23:00:00.000Z')
  })
})

describe('wording', () => {
  it('calls it an emergency grading fee and never a surcharge', () => {
    const text = emergencyFeeWording(55)
    expect(text).toBe('Emergency grading fee: £55 (includes £20 late registration)')
    expect(EMERGENCY_GRADING_FEE_POUNDS).toBe(20)
    expect(text.toLowerCase()).not.toContain('surcharge')
  })
})
