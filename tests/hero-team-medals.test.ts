import { existsSync, readFileSync, statSync } from 'fs'
import { describe, expect, it } from 'vitest'

describe('homepage hero lead slide', () => {
  const hero = readFileSync('components/sections/Hero.tsx', 'utf8')

  it('leads with the team medals photo, with alt text that names nobody', () => {
    const firstPhoto = hero.slice(hero.indexOf('const photos = ['))
    expect(firstPhoto.indexOf('/images/hero/team-medals.webp')).toBeGreaterThan(-1)
    expect(firstPhoto.indexOf('/images/hero/team-medals.webp')).toBeLessThan(firstPhoto.indexOf("'/hero.webp'"))
    expect(hero).toContain('Forza Karate students celebrating with medals and trophies')
  })

  it('keeps the existing slides and the trial ad', () => {
    for (const src of ['/hero.webp', '/hero2.webp', '/hero4.jpg', '/hero38.jpg']) expect(hero).toContain(src)
    expect(hero).toContain('adTrial')
  })

  it('ships a small webp (images are served unoptimized)', () => {
    expect(existsSync('public/images/hero/team-medals.webp')).toBe(true)
    expect(statSync('public/images/hero/team-medals.webp').size).toBeLessThan(300_000)
  })
})
