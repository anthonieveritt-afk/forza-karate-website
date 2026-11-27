import { readFileSync } from 'fs'
import { describe, expect, it } from 'vitest'
import { VOTE_POSTER_URL } from '@/components/vote-poster/VotePoster'

describe('vote poster projector page', () => {
  const page = readFileSync('app/vote-poster/page.tsx', 'utf8')
  const poster = readFileSync('components/vote-poster/VotePoster.tsx', 'utf8')
  const layout = readFileSync('app/layout.tsx', 'utf8')
  const nav = readFileSync('components/layout/Navbar.tsx', 'utf8')
  const sitemap = readFileSync('app/sitemap.ts', 'utf8')
  const robots = readFileSync('app/robots.ts', 'utf8')
  const qr = readFileSync('public/awards/karateka-vote-qr.svg', 'utf8')

  it('is a public full-screen poster with a sharp QR to the members vote URL', () => {
    expect(page).toContain("Karate-ka's Karate-ka Student of the Year")
    expect(page).toMatch(/robots:\s*\{\s*index:\s*false/)
    expect(VOTE_POSTER_URL).toBe('https://forzakarate.co.uk/members/vote')
    expect(poster).toContain('https://forzakarate.co.uk/members/vote')
    expect(poster).toContain('/awards/karateka-vote-qr.svg')
    expect(poster).toContain('#C41230')
    expect(poster).toContain('#111')
    expect(poster).toContain('vote-poster-stage')
    expect(qr).toContain('viewBox')
    expect(qr).toContain('fill="#111111"')
  })

  it('is not in the main nav or sitemap, and is hidden from crawlers', () => {
    expect(nav).not.toContain('/vote-poster')
    expect(sitemap).not.toContain('/vote-poster')
    expect(robots).toContain('/vote-poster')
  })

  it('hides site chrome on the poster route', () => {
    expect(layout).toContain('HideOnVotePoster')
    const hide = readFileSync('components/layout/HideOnVotePoster.tsx', 'utf8')
    expect(hide).toContain('/vote-poster')
  })
})
