import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import TrialCta from '@/components/sections/TrialCta'
import { formatNewsDate, getAdjacent, getAllPosts, getPost } from '@/lib/news'
import MorePhotos from '@/components/news/MorePhotos'

export const dynamicParams = false

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt || undefined,
    openGraph: {
      title: post.title,
      description: post.excerpt || undefined,
      type: 'article',
      publishedTime: post.date,
      images: post.image ? [{ url: post.image.src, width: post.image.width, height: post.image.height }] : undefined,
    },
  }
}

export default async function NewsPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPost(slug)
  if (!post) notFound()
  const { newer, older } = getAdjacent(slug)

  return (
    <div className="bg-white">
      <article>
        <header className="pt-20 pb-10 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-2 mb-6 text-sm">
              <Link href="/news" className="text-gray-400 hover:text-[#111111] transition-colors">News</Link>
              <span className="text-gray-300">/</span>
              <time dateTime={post.date} className="text-[#111111]">{formatNewsDate(post.date)}</time>
              {post.category && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-red-50 text-[#dc2626] text-xs font-medium">{post.category}</span>
              )}
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#111111] leading-tight">{post.title}</h1>
          </div>
        </header>

        {post.image && (
          <div className="px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <Image
                src={post.image.src}
                alt={post.image.alt}
                width={post.image.width}
                height={post.image.height}
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="w-full h-auto max-h-[80vh] object-contain rounded-2xl bg-[#fafaf9] border border-black/5"
              />
            </div>
          </div>
        )}

        <div className="px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mx-auto">
            {post.html && (
              <div className="news-content" dangerouslySetInnerHTML={{ __html: post.html }} />
            )}

            {post.gallery.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {post.gallery.map((img) => (
                  <Image
                    key={img.src}
                    src={img.src}
                    alt={img.alt}
                    width={img.width}
                    height={img.height}
                    sizes="(max-width: 640px) 100vw, 384px"
                    className="w-full h-auto rounded-2xl border border-black/5"
                  />
                ))}
              </div>
            )}

            <MorePhotos photos={post.bodyPhotos ?? []} title={post.title} />
          </div>
        </div>
      </article>

      <nav aria-label="More news" className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-black/5 pt-10">
          {newer ? (
            <Link href={`/news/${newer.slug}`} className="group p-5 rounded-2xl border border-black/8 hover:border-[#dc2626] transition-colors">
              <span className="flex items-center gap-1 text-xs text-gray-400 mb-1"><ArrowLeft className="h-3 w-3" /> Newer</span>
              <span className="text-sm font-semibold text-[#111111] group-hover:text-[#dc2626] line-clamp-2">{newer.title}</span>
            </Link>
          ) : <span />}
          {older && (
            <Link href={`/news/${older.slug}`} className="group p-5 rounded-2xl border border-black/8 hover:border-[#dc2626] transition-colors sm:text-right">
              <span className="flex items-center gap-1 sm:justify-end text-xs text-gray-400 mb-1">Older <ArrowRight className="h-3 w-3" /></span>
              <span className="text-sm font-semibold text-[#111111] group-hover:text-[#dc2626] line-clamp-2">{older.title}</span>
            </Link>
          )}
        </div>
      </nav>

      <TrialCta title="Want to train with Forza?" text="Your first class is free. No kit or experience needed." />
    </div>
  )
}
