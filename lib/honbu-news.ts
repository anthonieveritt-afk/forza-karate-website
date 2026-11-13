import { HIDDEN_SLUGS, allPosts, type NewsPost } from '@/lib/news'
import previewDemo from '@/content/news/honbu-preview-demo.json'
import { honbuBase } from '@/lib/honbu'

const REVALIDATE_SECONDS = 300

export type HonbuNewsPhoto = { url: string; caption?: string | null; isCover?: boolean }

export function newsApiBase() {
  const explicit = process.env.CLUB_HONBU_NEWS_URL?.trim()
  if (explicit) return explicit.replace(/\/$/, '')
  return honbuBase()
}

export function shouldIncludePreviewDemo() {
  if (process.env.VERCEL_ENV === 'production' || process.env.HONBU_NEWS_DEMO === '0') return false
  return process.env.HONBU_NEWS_DEMO === 'true' || process.env.HONBU_NEWS_DEMO === '1' || process.env.VERCEL_ENV === 'preview'
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === 'object' && !Array.isArray(v)
}

function asString(v: unknown) {
  return typeof v === 'string' ? v : ''
}

function normaliseDate(date: string) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return `${date}T12:00:00`
  return date
}

export function honbuPayloadToPost(raw: unknown): NewsPost | null {
  if (!isRecord(raw)) return null
  const slug = asString(raw.slug).trim()
  const title = asString(raw.title).trim()
  if (!slug || !title) return null
  const date = normaliseDate(asString(raw.date).trim() || '1970-01-01')
  const image = typeof raw.image === 'string' && raw.image ? raw.image : null
  const cardImage = typeof raw.cardImage === 'string' && raw.cardImage ? raw.cardImage : image
  const categories = Array.isArray(raw.categories)
    ? raw.categories.flatMap((c) => {
        if (!isRecord(c) || !asString(c.slug) || !asString(c.name)) return []
        return [{ name: asString(c.name), slug: asString(c.slug) }]
      })
    : [{ name: 'Club news', slug: 'club-news' }]
  const photos: HonbuNewsPhoto[] = Array.isArray(raw.photos)
    ? raw.photos.flatMap((p) => {
        if (!isRecord(p) || !asString(p.url)) return []
        return [{ url: asString(p.url), caption: typeof p.caption === 'string' ? p.caption : null, isCover: p.isCover === true }]
      })
    : []
  const images = photos.length ? photos.map((p) => p.url) : Array.isArray(raw.images) ? raw.images.filter((u): u is string => typeof u === 'string') : image ? [image] : []
  const bodyRaw = asString(raw.body)
  const body = /<\/?[a-z][\s\S]*>/i.test(bodyRaw) ? bodyRaw : plainBodyToHtml(bodyRaw)
  return {
    slug,
    title,
    date,
    excerpt: asString(raw.excerpt),
    categories: categories.length ? categories : [{ name: 'Club news', slug: 'club-news' }],
    tags: Array.isArray(raw.tags) ? raw.tags.filter((t): t is string => typeof t === 'string') : [],
    image,
    imageAlt: asString(raw.imageAlt) || title,
    cardImage,
    cardImageAlt: asString(raw.cardImageAlt) || asString(raw.imageAlt) || title,
    body,
    images,
    photos,
    source: 'honbu',
  }
}

export function plainBodyToHtml(body: string): string {
  const escaped = (body || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
  const parts = escaped.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)
  if (!parts.length) return ''
  return parts.map((p) => `<p>${p.replace(/\n/g, '<br />')}</p>`).join('')
}

export function mergeNewsPosts(jsonPosts: NewsPost[], honbuPosts: NewsPost[]): NewsPost[] {
  const honbuSlugs = new Set(honbuPosts.map((p) => p.slug))
  const kept = jsonPosts.filter((p) => !HIDDEN_SLUGS.has(p.slug) && !honbuSlugs.has(p.slug))
  return [...kept, ...honbuPosts].sort((a, b) => b.date.localeCompare(a.date))
}

type FetchLike = (input: string, init?: { next?: { revalidate: number }; signal?: AbortSignal }) => Promise<{ ok: boolean; json: () => Promise<unknown> }>

export async function fetchHonbuPublishedNews(fetcher: FetchLike = fetch as FetchLike): Promise<{ posts: NewsPost[]; ok: boolean }> {
  try {
    const r = await fetcher(`${newsApiBase()}/api/public/news`, { next: { revalidate: REVALIDATE_SECONDS }, signal: AbortSignal.timeout(5000) })
    if (!r.ok) return { posts: [], ok: false }
    const data = await r.json()
    if (!Array.isArray(data)) return { posts: [], ok: false }
    const posts = data.map(honbuPayloadToPost).filter((p): p is NewsPost => !!p)
    return { posts, ok: true }
  } catch {
    return { posts: [], ok: false }
  }
}

export function previewDemoPost(): NewsPost {
  return previewDemo as NewsPost
}

export async function loadMergedNews(jsonPosts: NewsPost[], opts?: { fetcher?: FetchLike; includeDemo?: boolean }): Promise<NewsPost[]> {
  const { posts: honbu, ok } = await fetchHonbuPublishedNews(opts?.fetcher)
  let merged = mergeNewsPosts(jsonPosts, honbu)
  const includeDemo = opts?.includeDemo ?? shouldIncludePreviewDemo()
  if (includeDemo) {
    const demo = previewDemoPost()
    if (!merged.some((p) => p.slug === demo.slug)) {
      // Only add the demo when Honbu did not already supply this slug.
      // Still show it when the Honbu request failed or returned nothing, so previews have something to click.
      if (!ok || honbu.length === 0 || process.env.HONBU_NEWS_DEMO === 'true' || process.env.HONBU_NEWS_DEMO === '1') {
        merged = mergeNewsPosts(merged, [demo])
      }
    }
  }
  return merged
}


export async function getAllPosts(): Promise<NewsPost[]> {
  return loadMergedNews(allPosts)
}

export async function getPostBySlug(slug: string): Promise<NewsPost | undefined> {
  const posts = await getAllPosts()
  return posts.find((p) => p.slug === slug)
}
