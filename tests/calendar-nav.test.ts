import { readFileSync } from 'fs'
import { describe, it, expect } from 'vitest'
import { membersCoreLinks } from '@/lib/members/links'

describe('Calendar navigation location', () => {
  it('is listed in the student portal / Members menu links', () => {
    expect(membersCoreLinks.some((l) => l.href === '/calendar' && l.label === 'Calendar')).toBe(true)
  })

  it('is not a public main/header navLinks entry (desktop or mobile)', () => {
    const navbar = readFileSync('components/layout/Navbar.tsx', 'utf8')
    const block = navbar.match(/const navLinks = \[([\s\S]*?)\]/)?.[1] ?? ''
    expect(block).not.toMatch(/\/calendar/)
    expect(block).not.toMatch(/Calendar/)
  })

  it('is removed from the public footer Training menu', () => {
    const footer = readFileSync('components/layout/Footer.tsx', 'utf8')
    expect(footer).not.toMatch(/href=["']\/calendar["']/)
    expect(footer).not.toMatch(/>Calendar</)
  })
})
