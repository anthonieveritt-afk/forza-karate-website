import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { allPosts, getPost, formatDate, isGradingPost } from '@/lib/news'
import { getAlbums, getAlbumPhotos, matchAlbums } from '@/lib/news-gallery'

export const revalidate = 3600

export function generateStaticParams() {
  return allPosts.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPost((await params).slug)
  if (!p) return {}
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: `/news/${p.slug}` },
    openGraph: { type: 'article', title: p.title, description: p.excerpt, publishedTime: p.date, images: p.image ? [p.image] : undefined },
  }
}

export default async function NewsStory({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug)
  if (!post) notFound()
  const albums = matchAlbums(post, await getAlbums())
  const albumPhotos = await Promise.all(albums.map(async (a) => ({ album: a, photos: (await getAlbumPhotos(a.id)).slice(0, 6) })))
  const grading = isGradingPost(post)
  const ownImages = post.images.filter((i) => i !== post.image).slice(0, 6)
  const showSidebar = albumPhotos.some((x) => x.photos.length) || ownImages.length > 0 || grading
  const showHero = !!post.image && !post.images.includes(post.image)
  const idx = allPosts.findIndex((p) => p.slug === post.slug)
  const newer = allPosts[idx - 1]
  const older = allPosts[idx + 1]
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'NewsArticle', headline: post.title, datePublished: post.date,
    image: post.image ? [post.image] : undefined, author: { '@type': 'Organization', name: 'Forza Karate Club' },
  }

  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <section className="pt-16 pb-10 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <Link href="/news" className="text-sm text-[#dc2626] font-medium">← All news</Link>
          <h1 className="mt-4 text-3xl sm:text-4xl font-bold text-[#111111] max-w-4xl">{post.title}</h1>
          <p className="mt-3 text-sm text-gray-500">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            {post.categories.map((c) => (
              <span key={c.slug}> · <Link href={`/news?category=${c.slug}`} className="hover:text-[#dc2626]">{c.name}</Link></span>
            ))}
          </p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className={`max-w-7xl mx-auto grid gap-12 ${showSidebar ? 'lg:grid-cols-[minmax(0,1fr)_320px]' : ''}`}>
          <article className="min-w-0 max-w-3xl">
            {showHero && post.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={post.image} alt={post.imageAlt} className="w-full rounded-2xl mb-8" />
            )}
            <div className="news-body" dangerouslySetInnerHTML={{ __html: post.body }} />
            <nav className="mt-12 pt-6 border-t border-black/5 grid gap-4 sm:grid-cols-2 text-sm">
              {older ? <Link href={`/news/${older.slug}`} className="hover:text-[#dc2626]">← {older.title}</Link> : <span />}
              {newer && <Link href={`/news/${newer.slug}`} className="sm:text-right hover:text-[#dc2626]">{newer.title} →</Link>}
            </nav>
          </article>

          {showSidebar && (
            <aside aria-label="Related photos" className="space-y-8 lg:sticky lg:top-24 self-start">
              {albumPhotos.filter((x) => x.photos.length).map(({ album, photos }) => (
                <div key={album.id}>
                  <h2 className="font-bold text-[#111111] mb-3">{album.name}</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {photos.map((ph) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={ph.id} src={ph.url} alt={ph.caption ?? album.name} loading="lazy" className="aspect-square w-full object-cover rounded-lg" />
                    ))}
                  </div>
                  <Link href={`/gallery?album=${album.id}`} className="mt-3 inline-block text-sm font-medium text-[#dc2626]">View the album →</Link>
                </div>
              ))}
              {!albumPhotos.some((x) => x.photos.length) && ownImages.length > 0 && (
                <div>
                  <h2 className="font-bold text-[#111111] mb-3">Photos from this story</h2>
                  <div className="grid grid-cols-2 gap-2">
                    {ownImages.map((src) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img key={src} src={src} alt="" loading="lazy" className="aspect-square w-full object-cover rounded-lg" />
                    ))}
                  </div>
                </div>
              )}
              {grading && <Link href="/gallery?tag=grading" className="inline-block text-sm font-medium text-[#dc2626]">See all gradings →</Link>}
            </aside>
          )}
        </div>
      </section>
    </div>
  )
}
