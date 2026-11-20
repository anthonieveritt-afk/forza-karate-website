import { readFileSync } from 'fs'
import { describe, expect, it } from 'vitest'
import { heicProxySrc, isAllowedImageHost, isHeicUrl, nearbySlideIndices, R2_IMAGE_HOST } from '@/lib/opt-image'

describe('image optimization', () => {
  it('allows the Forza Club Honbu R2 bucket and blocks other hosts', () => {
    expect(isAllowedImageHost(R2_IMAGE_HOST)).toBe(true)
    expect(isAllowedImageHost('evil.example.com')).toBe(false)
    expect(isAllowedImageHost('r2.dev.evil.com')).toBe(false)
  })

  it('detects HEIC gallery URLs and builds a same-origin proxy path', () => {
    const src = `https://${R2_IMAGE_HOST}/albums/17/photo.HEIC`
    expect(isHeicUrl(src)).toBe(true)
    expect(isHeicUrl(`https://${R2_IMAGE_HOST}/albums/19/photo.jpeg`)).toBe(false)
    const proxy = heicProxySrc(src, 1200)
    expect(proxy.startsWith('/api/opt-image?url=')).toBe(true)
    expect(proxy).toContain(encodeURIComponent(src))
    expect(proxy).toContain('w=1200')
    expect(proxy).not.toContain('vercel.app')
  })

  it('configures next/image for AVIF/WebP, a 1920 cap, and the R2 host', () => {
    const config = readFileSync('next.config.ts', 'utf8')
    expect(config).toContain("formats: ['image/avif', 'image/webp']")
    expect(config).toContain('deviceSizes:')
    expect(config).toContain('deviceSizes: [640, 750, 828, 1080, 1200, 1920]')
    expect(config).toContain(R2_IMAGE_HOST)
    // Vercel's optimizer returns 402 once the plan limit is hit, which blanks every photo.
    expect(config).toContain('unoptimized: true')
  })

  it('uses next/image on the hero, mounts only nearby slides, and priorities the first photo only', () => {
    const hero = readFileSync('components/sections/Hero.tsx', 'utf8')
    expect(hero).toContain("import Image from 'next/image'")
    expect(hero).toContain('nearbySlideIndices')
    expect(hero).toContain('priority={i === 0}')
    expect(hero).toContain("sizes={HERO_SIZES}")
    expect(hero).toContain('(max-width: 1280px) 100vw, 1280px')
    expect(hero).not.toContain('unoptimized')
    expect(hero).not.toMatch(/<img[\s\S]*slide\.src/)
    expect([...nearbySlideIndices(0, 12)].sort((a, b) => a - b)).toEqual([0, 1, 11])
    expect([...nearbySlideIndices(4, 12)].sort((a, b) => a - b)).toEqual([3, 4, 5])
  })

  it('optimizes gallery, news cards, news stories, and the team banner', () => {
    const gallery = readFileSync('app/gallery/page.tsx', 'utf8')
    expect(gallery).toContain('SmartImage')
    expect(gallery).not.toContain('unoptimized')

    const card = readFileSync('components/news/NewsCardImage.tsx', 'utf8')
    expect(card).toContain('SmartImage')
    expect(card).toContain('sizes=')

    const article = readFileSync('app/news/[slug]/page.tsx', 'utf8')
    expect(article).toContain('SmartImage')
    expect(article).toContain('src={post.image}')
    expect(article).not.toMatch(/<img src=\{post\.image\}/)
    expect(article).not.toContain('vercel.app')

    const galleryBlock = readFileSync('components/news/NewsPhotoGallery.tsx', 'utf8')
    expect(galleryBlock).toContain('SmartImage')
    expect(galleryBlock).not.toMatch(/<img src=\{/)

    const banner = readFileSync('components/sections/TeamBanner.tsx', 'utf8')
    expect(banner).toContain("import Image from 'next/image'")
    expect(banner).toContain('sizes="100vw"')
    expect(banner).not.toMatch(/<img/)
  })
})
