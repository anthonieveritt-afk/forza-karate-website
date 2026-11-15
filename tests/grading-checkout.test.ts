import { describe, it, expect } from 'vitest'
import { instantFromLondonLocal } from '@/lib/grading-registration-window'
import {
  isPreviewDeployment,
  localEvents,
  resolveGradingCharge,
  stripeKeyAllowedForEnv,
} from '@/lib/grading-checkout'

const events = localEvents()
const grade = '17th Kyu – White Belt / Red Stripe'
const at = (local: string) => instantFromLondonLocal(local)

describe('resolveGradingCharge', () => {
  it('charges the usual fee on deadline day', () => {
    const r = resolveGradingCharge({ grade, gradingName: 'December Grading', events, now: at('2026-12-04T23:59:59') })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.mode).toBe('normal')
      expect(r.fee).toBe(35)
      expect(r.lineItemName).toBe('Grading fee — 17th Kyu')
      expect(r.wording).toBeNull()
    }
  })

  it('adds £20 on the day after the deadline and names the Stripe line item Emergency grading fee', () => {
    const r = resolveGradingCharge({ grade, gradingName: 'December Grading', events, now: at('2026-12-05T00:00:00') })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.mode).toBe('emergency')
      expect(r.fee).toBe(55)
      expect(r.baseFee).toBe(35)
      expect(r.lineItemName).toBe('Emergency grading fee')
      expect(r.wording).toBe('Emergency grading fee: £55 (includes £20 late registration)')
      expect(r.wording?.toLowerCase()).not.toContain('surcharge')
    }
  })

  it('still charges the emergency fee on the day before belts are handed out', () => {
    const r = resolveGradingCharge({ grade, gradingName: 'December Grading', events, now: at('2026-12-13T23:59:59') })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.fee).toBe(55)
  })

  it('refuses checkout on belt hand-out day', () => {
    const r = resolveGradingCharge({ grade, gradingName: 'December Grading', events, now: at('2026-12-14T00:00:00') })
    expect(r.ok).toBe(false)
    if (!r.ok) expect(r.error.toLowerCase()).toContain('closed')
  })

  it('ignores a client-supplied fee or emergency flag and uses the server price', () => {
    const r = resolveGradingCharge({
      grade, gradingName: 'December Grading', events, now: at('2026-12-05T12:00:00'),
      clientFee: 1, clientIsEmergency: false,
    })
    expect(r.ok).toBe(true)
    if (r.ok) expect(r.fee).toBe(55)
    const normal = resolveGradingCharge({
      grade, gradingName: 'December Grading', events, now: at('2026-11-15T12:00:00'),
      clientFee: 999, clientIsEmergency: true,
    })
    expect(normal.ok).toBe(true)
    if (normal.ok) {
      expect(normal.mode).toBe('normal')
      expect(normal.fee).toBe(35)
    }
  })

  it('honours previewWindow only on preview deployments', () => {
    const live = resolveGradingCharge({
      grade, gradingName: 'December Grading', events, now: at('2026-11-15T12:00:00'),
      previewWindow: 'emergency', isPreview: false,
    })
    expect(live.ok).toBe(true)
    if (live.ok) expect(live.mode).toBe('normal')

    const preview = resolveGradingCharge({
      grade, gradingName: 'December Grading', events, now: at('2026-11-15T12:00:00'),
      previewWindow: 'emergency', isPreview: true,
    })
    expect(preview.ok).toBe(true)
    if (preview.ok) expect(preview.fee).toBe(55)

    const closed = resolveGradingCharge({
      grade, gradingName: 'December Grading', events, now: at('2026-11-15T12:00:00'),
      previewWindow: 'closed', isPreview: true,
    })
    expect(closed.ok).toBe(false)
  })
})

describe('preview Stripe safety', () => {
  it('blocks live keys on preview and allows test keys', () => {
    expect(isPreviewDeployment({ VERCEL_ENV: 'production' })).toBe(false)
    expect(isPreviewDeployment({ VERCEL_ENV: 'preview' })).toBe(true)
    expect(stripeKeyAllowedForEnv('sk_live_example', { VERCEL_ENV: 'preview' })).toBe(false)
    expect(stripeKeyAllowedForEnv('sk_test_example', { VERCEL_ENV: 'preview' })).toBe(true)
    expect(stripeKeyAllowedForEnv('sk_live_example', { VERCEL_ENV: 'production' })).toBe(true)
  })
})
