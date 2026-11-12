import { readFileSync, existsSync } from 'fs'
import { describe, it, expect } from 'vitest'

const HERO = 'components/sections/Hero.tsx'

describe('Homepage hero — Commonwealth Elite 2026 photos', () => {
  const source = readFileSync(HERO, 'utf8')

  const newSlides = [
    {
      src: '/hero-commonwealth-2026-team.webp',
      alt: 'Forza Karate Club team at the Commonwealth Elite Karate Championships 2026 in Glasgow',
      file: 'public/hero-commonwealth-2026-team.webp',
    },
    {
      src: '/hero-commonwealth-2026-kobe-kick.webp',
      alt: 'Kobe Yogarajah competing for Forza Karate at the Commonwealth Elite Karate Championships 2026 in Glasgow',
      file: 'public/hero-commonwealth-2026-kobe-kick.webp',
    },
    {
      src: '/hero-commonwealth-2026-medallists.webp',
      alt: 'Forza Karate Club medallists at the Commonwealth Elite Karate Championships 2026 in Glasgow',
      file: 'public/hero-commonwealth-2026-medallists.webp',
    },
    {
      src: '/hero-commonwealth-2026-coaches.webp',
      alt: 'Forza Karate Club coaches and officials at the Commonwealth Elite Karate Championships 2026 in Glasgow',
      file: 'public/hero-commonwealth-2026-coaches.webp',
    },
    {
      src: '/hero-club-juniors-belts.webp',
      alt: 'Forza Karate Club junior students celebrating with belts in the dojo',
      file: 'public/hero-club-juniors-belts.webp',
    },
  ]

  it('keeps the existing trimmed hero slides and trial ad', () => {
    for (const src of [
      '/hero.webp',
      '/hero2.webp',
      '/hero4.jpg',
      '/hero5.jpg',
      '/hero7.jpg',
      '/hero18.jpg',
      '/team/team-group.jpg',
      '/team/team-competition-01.jpg',
      '/hero20.jpg',
      '/hero21.jpg',
      '/hero38.jpg',
    ]) {
      expect(source).toContain(`src: '${src}'`)
    }
    expect(source).toContain("key: 'ad-trial'")
    expect(source).toContain("href: '/trial-class'")
  })

  it('adds the five new hero images with WebP files on disk', () => {
    for (const slide of newSlides) {
      expect(source).toContain(`src: '${slide.src}'`)
      expect(source).toContain(slide.alt)
      expect(existsSync(slide.file)).toBe(true)
    }
  })

  it('names Kobe Yogarajah only on the kick action slide', () => {
    const kick = newSlides.find((s) => s.src.includes('kobe-kick'))!
    expect(kick.alt).toMatch(/Kobe Yogarajah/)
    for (const slide of newSlides) {
      if (slide === kick) continue
      expect(slide.alt.toLowerCase()).not.toContain('kobe')
      expect(source.split(slide.alt).length).toBe(2) // alt appears once
    }
    const kobeCount = source.split('Kobe Yogarajah').length - 1
    expect(kobeCount).toBe(1)
  })

  it('does not describe the dojo juniors photo as a Commonwealth or Glasgow shot', () => {
    const juniors = newSlides.find((s) => s.src.includes('juniors'))!
    expect(juniors.alt.toLowerCase()).not.toMatch(/commonwealth|glasgow/)
    expect(juniors.alt).toMatch(/Forza Karate Club/)
  })
})
