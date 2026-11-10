import { describe, it, expect } from 'vitest'
import { membersCoreLinks } from '@/lib/members/links'

describe('Sporting licence members menu label', () => {
  it('uses plain Sporting licence without £33 in Members dropdown / sidebar links', () => {
    const link = membersCoreLinks.find((l) => l.href === '/members/sporting-licence')
    expect(link).toBeTruthy()
    expect(link!.label).toBe('Sporting licence')
    expect(link!.label).not.toMatch(/£33|\£\s*33/)
  })
})
