import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { COMMONWEALTH_2026, COMMONWEALTH_SHARE_TEXT, buildCommonwealthCertificatesPdf } from '@/lib/commonwealth-certificate'
import { COMMONWEALTH_AWARD_TYPE, COMMONWEALTH_SHARE_TEXT as PORTAL_TEXT } from '@/lib/members/awards'

describe('Commonwealth certificate (portal copy)', () => {
  it('matches the portal share text and award type', () => {
    expect(PORTAL_TEXT).toBe(COMMONWEALTH_SHARE_TEXT)
    expect(COMMONWEALTH_AWARD_TYPE).toBe(COMMONWEALTH_2026.awardType)
  })
  it('builds an A4 portrait certificate from the public background', () => {
    const dir = join(process.cwd(), 'public/awards')
    const assets = {
      background: 'data:image/jpeg;base64,' + readFileSync(join(dir, COMMONWEALTH_2026.background)).toString('base64'),
      font: readFileSync(join(dir, 'fonts', COMMONWEALTH_2026.fontFile)).toString('base64'),
    }
    const doc = buildCommonwealthCertificatesPdf(assets, ['Kobe Yogarajah'])
    expect(doc.getNumberOfPages()).toBe(1)
    expect(Math.round(doc.internal.pageSize.getWidth())).toBe(210)
    expect(Math.round(doc.internal.pageSize.getHeight())).toBe(297)
  })
})
