import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import PageHeader from '@/components/sections/PageHeader'
import NewsCard from '@/components/news/NewsCard'
import { getAllPosts, getPage, getPageCount } from '@/lib/news'

function pageHref(n: number) {
  return n === 1 ? '/news' : `/news/page/${n}`
}

export default function NewsList({ page }: { page: number }) {
  const posts = getPage(page)
  const pageCount = getPageCount()
  const total = getAllPosts().length

  return (
    <div className="bg-white">
      <PageHeader
        eyebrow="News"
        title="News"
        intro="Club announcements, competition results, and updates from the dojo."
      />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <p className="text-sm text-gray-400 mb-8">
            {total} stories · page {page} of {pageCount}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post, i) => (
              <NewsCard key={post.slug} post={post} priority={page === 1 && i < 3} />
            ))}
          </div>

          {pageCount > 1 && (
            <nav aria-label="News pages" className="flex flex-wrap items-center justify-center gap-2 mt-14">
              {page > 1 && (
                <Link href={pageHref(page - 1)} className="inline-flex items-center gap-1 h-9 px-4 rounded-full border border-black/12 text-sm text-gray-600 hover:border-black/25">
                  <ChevronLeft className="h-4 w-4" /> Newer
                </Link>
              )}
              {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={pageHref(n)}
                  aria-current={n === page ? 'page' : undefined}
                  className={`inline-flex items-center justify-center h-9 min-w-9 px-3 rounded-full text-sm font-medium border transition-colors ${
                    n === page ? 'bg-[#111111] text-white border-[#111111]' : 'bg-white text-gray-600 border-black/12 hover:border-black/25'
                  }`}
                >
                  {n}
                </Link>
              ))}
              {page < pageCount && (
                <Link href={pageHref(page + 1)} className="inline-flex items-center gap-1 h-9 px-4 rounded-full border border-black/12 text-sm text-gray-600 hover:border-black/25">
                  Older <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </nav>
          )}
        </div>
      </section>
    </div>
  )
}
