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

const wallpapers = [
  { label: 'Mac 4K', res: '3840 × 2160', size: '2.7 MB', file: 'forza-manga-mac-4k-3840x2160.jpg' },
  { label: 'Mac 5K', res: '5120 × 2880', size: '4.4 MB', file: 'forza-manga-mac-5k-5120x2880.jpg' },
  { label: 'Mac 8K', res: '7680 × 4320', size: '7.3 MB', file: 'forza-manga-mac-8k-7680x4320.jpg' },
  { label: 'Windows 4K', res: '3840 × 2160', size: '1.8 MB', file: 'forza-manga-windows-4k-3840x2160.jpg' },
  { label: 'Windows 8K', res: '7680 × 4320', size: '4.8 MB', file: 'forza-manga-windows-8k-7680x4320.jpg' },
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
                className="group block bg-white px-6 pt-10 pb-8 sm:pt-12 sm:pb-10"
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
      <section className="pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] mb-6">Desktop backgrounds</h2>
          <div className="rounded-2xl border border-black/10 overflow-hidden">
            <a
              href="/downloads/backgrounds/forza-manga-mac-4k-3840x2160.jpg"
              download
              aria-label="Download Forza manga desktop background (Mac 4K, JPG)"
              className="group block bg-white px-6 pt-10 pb-8 sm:px-10"
            >
              <Image
                src="/downloads/backgrounds/forza-manga-preview.webp"
                alt="Forza Karate manga-style desktop background: Forza Karate logo on a red and black comic burst"
                width={1200}
                height={675}
                sizes="(min-width: 768px) 640px, 90vw"
                className="mx-auto w-full rounded-lg border-[6px] border-white shadow-[0_10px_25px_rgba(0,0,0,0.18)] transition-transform duration-300 ease-out motion-reduce:transition-none group-hover:-translate-y-2 group-hover:shadow-[0_18px_35px_rgba(0,0,0,0.22)]"
              />
            </a>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-[#111111]">Forza manga wallpaper</h3>
              <p className="text-gray-500 mt-1">Choose the size that matches your screen. JPG images.</p>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {wallpapers.map((w) => (
                  <a
                    key={w.file}
                    href={`/downloads/backgrounds/${w.file}`}
                    download
                    className="inline-flex items-center gap-3 rounded-lg border border-black/10 px-4 py-3 hover:border-[#dc2626] transition-colors"
                  >
                    <FileDown className="w-5 h-5 text-[#dc2626] shrink-0" aria-hidden="true" />
                    <span>
                      <span className="block font-semibold text-[#111111]">{w.label}</span>
                      <span className="block text-sm text-gray-400">{w.res} · {w.size}</span>
                    </span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
