import type { Metadata } from 'next'
import Link from 'next/link'
import { allPosts, allCategories, formatDate } from '@/lib/news'

export const metadata: Metadata = {
  title: 'News',
  description: 'Latest news from Forza Karate Club — competition results, grading updates, and club announcements.',
  alternates: { canonical: '/news' },
}

const PER_PAGE = 12

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ category?: string; page?: string }> }) {
  const sp = await searchParams
  const cats = allCategories()
  const active = cats.find((c) => c.slug === sp.category)
  const list = active ? allPosts.filter((p) => p.categories.some((c) => c.slug === active.slug)) : allPosts
  const pages = Math.max(1, Math.ceil(list.length / PER_PAGE))
  const page = Math.min(pages, Math.max(1, parseInt(sp.page ?? '1', 10) || 1))
  const shown = list.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const href = (p: number, c = active?.slug) => {
    const q = new URLSearchParams()
    if (c) q.set('category', c)
    if (p > 1) q.set('page', String(p))
    const s = q.toString()
    return s ? `/news?${s}` : '/news'
  }
  const chip = (on: boolean) =>
    `px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${on ? 'bg-[#111111] text-white border-[#111111]' : 'bg-white text-gray-600 border-black/12 hover:border-black/25'}`

  return (
    <div className="bg-white">
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">News</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#111111] mb-4">{active ? active.name : 'News'}</h1>
          <p className="text-xl text-gray-500 max-w-2xl">Club announcements, competition results, and updates from the dojo.</p>
        </div>
      </section>

      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <nav aria-label="Filter news by category" className="max-w-7xl mx-auto flex gap-2 flex-wrap">
          <Link href="/news" className={chip(!active)} aria-current={!active ? 'page' : undefined}>All</Link>
          {cats.filter((c) => c.count >= 3).map((c) => (
            <Link key={c.slug} href={href(1, c.slug)} className={chip(active?.slug === c.slug)} aria-current={active?.slug === c.slug ? 'page' : undefined}>
              {c.name} <span className="opacity-60">({c.count})</span>
            </Link>
          ))}
        </nav>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => (
              <article key={p.slug} className="group rounded-2xl border border-black/5 overflow-hidden bg-white hover:shadow-md transition-shadow">
                <Link href={`/news/${p.slug}`} className="block">
                  <div className="aspect-[16/10] bg-[#fafaf9] overflow-hidden">
                    {p.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={p.image} alt={p.imageAlt} loading="lazy" className="h-full w-full object-cover group-hover:scale-[1.02] transition-transform" />
                    ) : <div className="h-full w-full flex items-center justify-center text-[#dc2626] font-bold">FORZA</div>}
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-gray-400 mb-2"><time dateTime={p.date}>{formatDate(p.date)}</time>{p.categories[0] ? ` · ${p.categories[0].name}` : ''}</p>
                    <h2 className="font-bold text-[#111111] leading-snug mb-2 group-hover:text-[#dc2626]">{p.title}</h2>
                    <p className="text-sm text-gray-500 line-clamp-3">{p.excerpt}</p>
                  </div>
                </Link>
              </article>
            ))}
          </div>

          {pages > 1 && (
            <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2 flex-wrap text-sm">
              {page > 1 && <Link href={href(page - 1)} className={chip(false)}>← Newer</Link>}
              <span className="px-3 text-gray-500">Page {page} of {pages}</span>
              {page < pages && <Link href={href(page + 1)} className={chip(false)}>Older →</Link>}
            </nav>
          )}
        </div>
      </section>
    </div>
  )
}
