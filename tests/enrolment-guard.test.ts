import { describe, it, expect } from 'vitest'
import {
  enrolmentGuardDecision,
  issueEnrolmentToken,
  verifyEnrolmentToken,
  MIN_FILL_MS,
  MAX_TOKEN_AGE_MS,
} from '../lib/enrolment-guard'

const SECRET = 'test-secret-not-for-production'

describe('enrolment token', () => {
  it('accepts a token after the minimum fill time', () => {
    const issuedAt = 1_000_000
    const token = issueEnrolmentToken(SECRET, issuedAt)
    const v = verifyEnrolmentToken(token, SECRET, issuedAt + MIN_FILL_MS)
    expect(v).toEqual({ ok: true })
  })

  it('rejects a submit faster than 3 seconds', () => {
    const issuedAt = 1_000_000
    const token = issueEnrolmentToken(SECRET, issuedAt)
    const v = verifyEnrolmentToken(token, SECRET, issuedAt + 500)
    expect(v).toEqual({ ok: false, reason: 'too_fast' })
  })

  it('rejects a forged or tampered token', () => {
    const token = issueEnrolmentToken(SECRET, 1_000_000)
    expect(verifyEnrolmentToken(token + 'x', SECRET, 1_000_000 + MIN_FILL_MS).ok).toBe(false)
    expect(verifyEnrolmentToken(token, 'other-secret', 1_000_000 + MIN_FILL_MS).ok).toBe(false)
    expect(verifyEnrolmentToken('', SECRET, 1_000_000 + MIN_FILL_MS)).toEqual({ ok: false, reason: 'missing' })
  })

  it('rejects an expired token', () => {
    const issuedAt = 1_000_000
    const token = issueEnrolmentToken(SECRET, issuedAt)
    const v = verifyEnrolmentToken(token, SECRET, issuedAt + MAX_TOKEN_AGE_MS + 1)
    expect(v).toEqual({ ok: false, reason: 'expired' })
  })
})

describe('enrolmentGuardDecision', () => {
  it('silently drops a filled honeypot, even with a valid token', () => {
    const issuedAt = 1_000_000
    const token = issueEnrolmentToken(SECRET, issuedAt)
    expect(enrolmentGuardDecision({
      honeypot: 'http://spam.example',
      token,
      secret: SECRET,
      now: issuedAt + MIN_FILL_MS,
    })).toBe('silent_drop')
  })

  it('silently drops a too-fast submit', () => {
    const issuedAt = 1_000_000
    const token = issueEnrolmentToken(SECRET, issuedAt)
    expect(enrolmentGuardDecision({
      honeypot: '',
      token,
      secret: SECRET,
      now: issuedAt + 200,
    })).toBe('silent_drop')
  })

  it('accepts a real-looking slow submit with an empty honeypot', () => {
    const issuedAt = 1_000_000
    const token = issueEnrolmentToken(SECRET, issuedAt)
    expect(enrolmentGuardDecision({
      honeypot: '  ',
      token,
      secret: SECRET,
      now: issuedAt + 8_000,
    })).toBe('accept')
  })

  it('asks a stale tab to refresh rather than fake-succeed', () => {
    const issuedAt = 1_000_000
    const token = issueEnrolmentToken(SECRET, issuedAt)
    expect(enrolmentGuardDecision({
      honeypot: '',
      token,
      secret: SECRET,
      now: issuedAt + MAX_TOKEN_AGE_MS + 5_000,
    })).toBe('refresh')
  })
})
