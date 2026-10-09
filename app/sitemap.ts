import type { MetadataRoute } from 'next'
import { allPosts } from '@/lib/news'

const BASE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://forzakarate.co.uk').replace(/\/$/, '')

const routes = [
  '/',
  '/classes',
  '/classes/ninjas',
  '/classes/juniors',
  '/classes/seniors',
  '/dojos',
  '/dojos/rayleigh',
  '/dojos/upminster',
  '/gradings',
  '/team',
  '/gallery',
  '/shop',
  '/join',
  '/trial-class',
  '/calendar',
  '/news',
  '/instructors',
  '/hall-of-fame',
  '/safeguarding',
  '/privacy-policy',
  '/contact',
  '/faq',
  '/why-karate',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    ...routes.map((path) => ({
      url: `${BASE}${path}`,
      lastModified: now,
      changeFrequency: (path === '/' || path === '/news' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
      priority: path === '/' ? 1 : 0.7,
    })),
    ...allPosts.map((p) => ({
      url: `${BASE}/news/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    })),
  ]
}
