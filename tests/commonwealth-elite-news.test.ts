import { readFileSync, existsSync } from 'fs'
import { describe, it, expect } from 'vitest'
import { getPost, cardThumbnail } from '@/lib/news'

describe('Commonwealth Elite 2026 Male U21 −60kg news post', () => {
  const slug = 'commonwealth-elite-2026-male-u21-60kg-results'
  const podium = '/news/commonwealth-elite-2026-male-u21-60kg-podium.webp'
  const badge = '/news/commonwealth-elite-2026-england-badge.webp'

  it('is published as the latest news post with podium image and Anthoni\'s congratulations', () => {
    const post = getPost(slug)
    expect(post).toBeTruthy()
    expect(post!.title).toMatch(/Commonwealth Elite 2026/i)
    expect(post!.title).toMatch(/Kobe Yogarajah/i)
    expect(post!.body).toContain('Congratulations to Kobe Yogarajah')
    expect(post!.body).toContain('England Karate Team')
    expect(post!.body).toContain('Male U21 −60kg')
    expect(post!.image).toBe(podium)
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
    expect(raw.cardImageAlt).toMatch(/England Commonwealth Championships shield badge/i)
    expect(raw.cardImageAlt.toLowerCase()).not.toContain('kobe')
  })

  it('uses the England Championships badge on listing cards and keeps the podium for the article and social image', () => {
    const post = getPost(slug)!
    expect(post.cardImage).toBe(badge)
    expect(existsSync('public/news/commonwealth-elite-2026-england-badge.webp')).toBe(true)
    // Hero is shown when the main image is not also in the story gallery array
    expect(post.images).not.toContain(post.image)

    const thumb = cardThumbnail(post)!
    expect(thumb.src).toBe(badge)
    expect(thumb.alt).toMatch(/England Commonwealth Championships shield badge/i)
    expect(thumb.contain).toBe(true)

    const later = getPost('awards-evening-christmas-party-2026')!
    const laterThumb = cardThumbnail(later)!
    expect(laterThumb.src).toBe(later.image)
    expect(laterThumb.contain).toBe(false)

    const article = readFileSync('app/news/[slug]/page.tsx', 'utf8')
    expect(article).toContain('images: p.image ? [p.image] : undefined')
    expect(article).toContain('<img src={post.image} alt={post.imageAlt}')
    expect(article).not.toContain('cardImage')
    expect(article).not.toContain('cardThumbnail')

    const home = readFileSync('app/page.tsx', 'utf8')
    const list = readFileSync('app/news/page.tsx', 'utf8')
    expect(home).toContain('cardThumbnail(p)')
    expect(list).toContain('cardThumbnail(p)')
    expect(home).toContain('NewsCardImage')
    expect(list).toContain('NewsCardImage')

    const card = readFileSync('components/news/NewsCardImage.tsx', 'utf8')
    expect(card).toContain('object-contain')
    expect(card).toContain('bg-white')
    expect(card).toContain('object-cover')
  })

  it('maps the story to Commonwealth Elite gallery album 16 and links to that album', () => {
    const map = JSON.parse(readFileSync('content/news-gallery-map.json', 'utf8'))
    expect(map.posts['commonwealth-elite-2026-male-u21-60kg-results']).toEqual([16])
    const page = readFileSync('app/news/[slug]/page.tsx', 'utf8')
    expect(page).toContain('https://forzakarate.co.uk/gallery?album=${album.id}')
    expect(page).not.toContain('https://forzakarate.co.uk/gallery"')
    expect(page).not.toContain('vercel.app')
  })
})
