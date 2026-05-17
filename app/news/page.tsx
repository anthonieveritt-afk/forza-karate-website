import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'News',
  description: 'Latest news from Forza Karate Club — competition results, grading updates, and club announcements.',
}

export default function NewsPage() {
  return (
    <div className="bg-white">
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">News</span>
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">News</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Club announcements, competition results, and updates from the dojo.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <div className="rounded-2xl bg-[#fafaf9] border border-black/5 p-10 text-center">
              <p className="text-gray-500">News coming soon. Check back for competition results, grading updates, and club announcements.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
