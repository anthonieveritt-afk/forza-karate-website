import type { Metadata } from 'next'
import { FileDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Downloads',
  description: 'Downloadable documents from Forza Karate Club, including the competition kumite score sheet.',
  alternates: { canonical: '/downloads' },
}

const downloads = [
  {
    title: 'Competition kumite score sheet',
    description: 'Forza Karate Club individual kumite score sheet for competitions. Printable PDF.',
    href: '/downloads/forza-kumite-score-sheet.pdf',
    meta: 'PDF · 250 KB',
  },
]

export default function DownloadsPage() {
  return (
    <div className="bg-white">
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Downloads</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#111111] mb-4">Downloads</h1>
          <p className="text-xl text-gray-500 max-w-2xl">Useful documents from Forza Karate Club.</p>
        </div>
      </section>

      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-4">
          {downloads.map((d) => (
            <a
              key={d.href}
              href={d.href}
              download
              className="flex items-start gap-4 rounded-xl border border-black/10 p-6 hover:border-[#dc2626] transition-colors"
            >
              <FileDown className="w-6 h-6 text-[#dc2626] shrink-0 mt-1" aria-hidden="true" />
              <div>
                <h2 className="text-lg font-semibold text-[#111111]">{d.title}</h2>
                <p className="text-gray-500 mt-1">{d.description}</p>
                <p className="text-sm text-gray-400 mt-2">{d.meta}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}
