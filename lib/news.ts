import posts from '@/content/news/posts.json'

export type NewsCategory = { name: string; slug: string }
export type NewsPost = {
  slug: string
  title: string
  date: string
  excerpt: string
  categories: NewsCategory[]
  tags: string[]
  image: string | null
  imageAlt: string
  /** Optional listing-card thumbnail. Falls back to `image` when omitted. */
  cardImage?: string | null
  cardImageAlt?: string
  body: string
  images: string[]
  /** Present on posts written in Forza Club Honbu (and the preview demo). */
  photos?: { url: string; caption?: string | null; isCover?: boolean }[]
  source?: 'honbu' | 'json'
}

export type NewsCardThumbnail = { src: string; alt: string; contain: boolean }

/** Image for news listing cards (homepage + /news). Article pages and OG still use `image`. */
export function cardThumbnail(p: NewsPost): NewsCardThumbnail | null {
  if (p.cardImage) {
    return { src: p.cardImage, alt: p.cardImageAlt || p.imageAlt, contain: true }
  }
  if (p.image) {
    return { src: p.image, alt: p.imageAlt, contain: false }
  }
  return null
}

// Imported from the old WordPress site (public REST API), newest first.
// Unpublished posts (Forza-only branding): kept in posts.json, hidden from listings, sitemap and pages.
export const HIDDEN_SLUGS = new Set([
  'jhka-summer-course-matt-rombeaux-kumite',
  'jhka-5th-open-championships-results',
  'jhka-5th-invitational-open-registrations-are-now-open',
  'jhka-summer-course-special-guest-instructor',
  'jhka-open-collier-row',
  'jhka-3rd-open-championships-romford',
  '5-gold-at-the-jhka-invitational',
  'glasgow-inter-club-training-session',
])

/** JSON posts only (hidden slugs removed). Pages that merge Forza Club Honbu posts should use getAllPosts(). */
export const allPosts: NewsPost[] = (posts as NewsPost[]).filter((p) => !HIDDEN_SLUGS.has(p.slug)).slice().sort((a, b) => b.date.localeCompare(a.date))

export function getPost(slug: string) {
  return allPosts.find((p) => p.slug === slug)
}

export function categoriesFromPosts(posts: NewsPost[]) {
  const m = new Map<string, { name: string; slug: string; count: number }>()
  for (const p of posts) for (const c of p.categories) {
    const e = m.get(c.slug) ?? { ...c, count: 0 }
    e.count++
    m.set(c.slug, e)
  }
  return [...m.values()].sort((a, b) => b.count - a.count)
}

export function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/London' })
}

export function isGradingPost(p: NewsPost) {
  return p.categories.some((c) => /grading/i.test(c.slug)) || /\bgrad(e|ing|es)\b|belt/i.test(p.title)
}

export function allCategories() {
  return categoriesFromPosts(allPosts)
}
