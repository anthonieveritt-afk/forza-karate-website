import type { Metadata } from 'next'
import Image from 'next/image'
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
            <div key={d.href} className="rounded-2xl border border-black/10 overflow-hidden">
              <a
                href={d.href}
                download
                aria-label={`Download ${d.title} (${d.meta})`}
                className="group block bg-[radial-gradient(ellipse_at_center,#f5f1ea_0%,#e7e0d4_100%)] px-6 pt-10 pb-8 sm:pt-12 sm:pb-10"
              >
                <div className="relative mx-auto h-56 sm:h-72 w-full max-w-md">
                  {[
                    { src: '/downloads/score-sheet-card-2.webp', rot: '-rotate-[8deg] group-hover:-rotate-[13deg] -translate-x-[58%] group-hover:-translate-x-[72%]', z: 'z-0' },
                    { src: '/downloads/score-sheet-card-3.webp', rot: 'rotate-[8deg] group-hover:rotate-[13deg] -translate-x-[42%] group-hover:-translate-x-[28%]', z: 'z-10' },
                    { src: '/downloads/score-sheet-card-1.webp', rot: 'rotate-0 -translate-x-1/2 group-hover:-translate-y-3', z: 'z-20' },
                  ].map((c, i) => (
                    <Image
                      key={c.src}
                      src={c.src}
                      alt={i === 2 ? 'Forza Karate Club kumite individual score sheet' : ''}
                      width={453}
                      height={640}
                      sizes="(min-width: 640px) 204px, 158px"
                      className={`absolute left-1/2 top-0 h-56 sm:h-72 w-auto rounded-lg border-[6px] border-white bg-white shadow-[0_10px_25px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-out motion-reduce:transition-none group-hover:shadow-[0_18px_35px_rgba(0,0,0,0.22)] ${c.rot} ${c.z}`}
                    />
                  ))}
                </div>
              </a>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-6">
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-[#111111]">{d.title}</h2>
                  <p className="text-gray-500 mt-1">{d.description}</p>
                  <p className="text-sm text-gray-400 mt-2">{d.meta}</p>
                </div>
                <a
                  href={d.href}
                  download
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#dc2626] px-5 py-3 font-semibold text-white hover:bg-[#b91c1c] transition-colors"
                >
                  <FileDown className="w-5 h-5" aria-hidden="true" />
                  Download PDF
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
