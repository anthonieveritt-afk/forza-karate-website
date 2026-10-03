// News posts imported from the old WordPress site (see scripts/migration/import_news.py).
// Bodies were sanitised at import time. The featured image of each post is in public/news;
// other in-body photos are listed in `bodyPhotos` and still hosted on the old site (or Vercel Blob).
import postsData from '@/content/news/posts.json'

export interface NewsImage {
  src: string
  width: number
  height: number
  alt: string
}

export interface NewsBodyPhoto {
  /** Original full-size URL on the old WordPress site (forzakarate.co.uk). */
  src: string
  /** Smaller WordPress-generated size (about 300px) used as a thumbnail. */
  thumb: string
  width?: number
  height?: number
  /** Vercel Blob URL once the photo has been copied there. */
  blob?: string
}

export interface NewsPost {
  slug: string
  title: string
  date: string
  modified: string
  category: string | null
  excerpt: string
  image: NewsImage | null
  gallery: NewsImage[]
  html: string
  oldUrl: string
  bodyPhotos?: NewsBodyPhoto[]
}

export const NEWS_PAGE_SIZE = 18

const posts = (postsData as NewsPost[]).slice().sort((a, b) => b.date.localeCompare(a.date))

export function getAllPosts(): NewsPost[] {
  return posts
}

export function getPost(slug: string): NewsPost | undefined {
  return posts.find((p) => p.slug === slug)
}

export function getPageCount(): number {
  return Math.max(1, Math.ceil(posts.length / NEWS_PAGE_SIZE))
}

export function getPage(page: number): NewsPost[] {
  const start = (page - 1) * NEWS_PAGE_SIZE
  return posts.slice(start, start + NEWS_PAGE_SIZE)
}

export function getAdjacent(slug: string): { newer?: NewsPost; older?: NewsPost } {
  const i = posts.findIndex((p) => p.slug === slug)
  return { newer: i > 0 ? posts[i - 1] : undefined, older: i >= 0 ? posts[i + 1] : undefined }
}

export function formatNewsDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/London' })
}
