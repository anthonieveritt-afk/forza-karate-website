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
  body: string
  images: string[]
}

// Imported from the old WordPress site (public REST API), newest first.
export const allPosts: NewsPost[] = (posts as NewsPost[]).slice().sort((a, b) => b.date.localeCompare(a.date))

export function getPost(slug: string) {
  return allPosts.find((p) => p.slug === slug)
}

export function allCategories() {
  const m = new Map<string, { name: string; slug: string; count: number }>()
  for (const p of allPosts) for (const c of p.categories) {
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
