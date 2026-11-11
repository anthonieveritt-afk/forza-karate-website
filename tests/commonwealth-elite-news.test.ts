import { readFileSync, existsSync } from 'fs'
import { describe, it, expect } from 'vitest'
import { getPost } from '@/lib/news'

describe('Commonwealth Elite 2026 Male U21 −60kg news post', () => {
  const slug = 'commonwealth-elite-2026-male-u21-60kg-results'

  it('is published as the latest news post with podium image and Anthoni\'s congratulations', () => {
    const post = getPost(slug)
    expect(post).toBeTruthy()
    expect(post!.title).toMatch(/Commonwealth Elite 2026/i)
    expect(post!.title).toMatch(/Kobe Yogarajah/i)
    expect(post!.body).toContain('Congratulations to Kobe Yogarajah')
    expect(post!.body).toContain('England Karate Team')
    expect(post!.body).toContain('Male U21 −60kg')
    expect(post!.image).toBe('/news/commonwealth-elite-2026-male-u21-60kg-podium.webp')
    expect(existsSync('public/news/commonwealth-elite-2026-male-u21-60kg-podium.webp')).toBe(true)
  })

  it('lists Sportdata-verified Male U21 −60kg podium placings', () => {
    const post = getPost(slug)!
    expect(post.body).toContain('Ethan Craib')
    expect(post.body).toContain('Sonny Reynolds')
    expect(post.body).toContain('Zachariah Skosan')
    expect(post.body).toContain('Kobe Yogarajah')
    expect(post.body).toContain('Gold')
    expect(post.body).toContain('Silver')
    expect(post.body).toMatch(/Bronze[\s\S]*Zachariah Skosan/)
    expect(post.body).toMatch(/Bronze[\s\S]*Kobe Yogarajah/)
    expect(post.body).toContain('vernr=10283')
    expect(post.body).toContain('https://forzakarate.co.uk/news')
    expect(post.body).not.toContain('vercel.app')
  })

  it('keeps neutral image alt text (no guessed identities from the photo)', () => {
    const posts = JSON.parse(readFileSync('content/news/posts.json', 'utf8'))
    const raw = posts.find((p: { slug: string }) => p.slug === slug)
    expect(raw.imageAlt).toMatch(/Medal podium competitors/i)
    expect(raw.imageAlt.toLowerCase()).not.toContain('kobe')
    expect(raw.imageAlt.toLowerCase()).not.toContain('ethan')
  })

  it('maps the story to Commonwealth Elite gallery album 16 and links to production gallery', () => {
    const map = JSON.parse(readFileSync('content/news-gallery-map.json', 'utf8'))
    expect(map.posts['commonwealth-elite-2026-male-u21-60kg-results']).toEqual([16])
    const page = readFileSync('app/news/[slug]/page.tsx', 'utf8')
    expect(page).toContain('https://forzakarate.co.uk/gallery')
    expect(page).not.toContain('vercel.app')
    expect(page).not.toMatch(/href=\{\`\/gallery\?album=/)
  })
})
