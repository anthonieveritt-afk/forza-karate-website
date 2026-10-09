import map from '@/content/news-gallery-map.json'
import { isGradingPost, type NewsPost } from '@/lib/news'

// Public, read-only Club Honbu gallery endpoints (no credentials).
const API_BASE = 'https://forza-club-honbu-production.up.railway.app'

export type Album = { id: number; name: string; category: string; description: string | null; coverPhotoUrl: string | null; photoCount: number; active: boolean }
export type Photo = { id: number; url: string; caption: string | null }

const GENERIC = new Set(['karate', 'open', 'team', 'club', 'cup', 'dojo', 'the', 'and', 'of', 'at', 'in', 'forza', 'france', 'england', 'championships', 'championship', 'international', 'grading', 'competition'])

type GalleryMap = { albumKeywords: Record<string, string[]>; posts: Record<string, number[]> }
const M = map as unknown as GalleryMap

export async function getAlbums(): Promise<Album[]> {
  try {
    const r = await fetch(`${API_BASE}/api/public/gallery`, { next: { revalidate: 3600 } })
    if (!r.ok) return []
    const d = await r.json()
    return Array.isArray(d) ? d.filter((a: Album) => a.active && a.photoCount > 0) : []
  } catch { return [] }
}

export async function getAlbumPhotos(id: number): Promise<Photo[]> {
  try {
    const r = await fetch(`${API_BASE}/api/public/gallery/${id}`, { next: { revalidate: 3600 } })
    if (!r.ok) return []
    const d = await r.json()
    return Array.isArray(d.photos) ? d.photos : []
  } catch { return [] }
}

export function albumKeywords(a: Album): string[] {
  const manual = M.albumKeywords[String(a.id)]
  if (manual) return manual.map((k) => k.toLowerCase())
  return a.name.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 3 && !GENERIC.has(w) && !/^\d+$/.test(w))
}

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

/** Albums to show beside a story: manual map first, then keyword match, then (for gradings) grading albums. */
export function matchAlbums(post: NewsPost, albums: Album[]): Album[] {
  const manual = M.posts[post.slug]
  if (manual) return albums.filter((a) => manual.includes(a.id))
  const hay = `${post.title} ${post.categories.map((c) => c.name).join(' ')}`.toLowerCase()
  const postYear = Number(post.date.slice(0, 4))
  const hits = albums.filter((a) => {
    // An album named with a year (e.g. "BUCS 2026") only matches stories from that year or the one before.
    const y = Number(a.name.match(/\b(20\d\d)\b/)?.[1])
    if (y && (postYear < y - 1 || postYear > y)) return false
    return albumKeywords(a).some((k) => new RegExp(`\\b${esc(k)}\\b`).test(hay))
  })
  if (hits.length) return hits.slice(0, 2)
  if (isGradingPost(post)) return albums.filter((a) => a.category === 'grading').slice(0, 1)
  return []
}
