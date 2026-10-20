'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, FileDown } from 'lucide-react'

export type WallpaperSize = { label: string; res: string; size: string; file: string }
export type WallpaperDesign = { name: string; preview: string; alt: string; sizes: WallpaperSize[] }

const base = '/downloads/backgrounds/'

/** To add a design (e.g. from the v2 set), append one entry here. */
export const wallpaperDesigns: WallpaperDesign[] = [
  {
    name: 'Shonen burst',
    preview: 'forza-01-shonen-burst-preview.webp',
    alt: 'Forza Karate desktop background: Forza Karate logo with red and black manga speed-line burst',
    sizes: [
      { label: 'Mac 4K', res: '3840 × 2160', size: '2.3 MB', file: 'forza-01-shonen-burst-windows-4k-3840x2160.jpg' },
      { label: 'Mac 5K', res: '5120 × 2880', size: '3.4 MB', file: 'forza-01-shonen-burst-mac-5k-5120x2880.jpg' },
      { label: 'Mac 6K', res: '6016 × 3384', size: '4.1 MB', file: 'forza-01-shonen-burst-mac-6k-6016x3384.jpg' },
      { label: 'Windows 4K', res: '3840 × 2160', size: '2.3 MB', file: 'forza-01-shonen-burst-windows-4k-3840x2160.jpg' },
      { label: 'Windows 8K', res: '7680 × 4320', size: '5.4 MB', file: 'forza-01-shonen-burst-windows-8k-7680x4320.jpg' },
    ],
  },
  {
    name: 'Night aura',
    preview: 'forza-02-night-aura-preview.webp',
    alt: 'Forza Karate desktop background: Forza Karate logo with glowing red aura on a dark night background',
    sizes: [
      { label: 'Mac 4K', res: '3840 × 2160', size: '1.5 MB', file: 'forza-02-night-aura-windows-4k-3840x2160.jpg' },
      { label: 'Mac 5K', res: '5120 × 2880', size: '2.2 MB', file: 'forza-02-night-aura-mac-5k-5120x2880.jpg' },
      { label: 'Mac 6K', res: '6016 × 3384', size: '2.8 MB', file: 'forza-02-night-aura-mac-6k-6016x3384.jpg' },
      { label: 'Windows 4K', res: '3840 × 2160', size: '1.5 MB', file: 'forza-02-night-aura-windows-4k-3840x2160.jpg' },
      { label: 'Windows 8K', res: '7680 × 4320', size: '3.9 MB', file: 'forza-02-night-aura-windows-8k-7680x4320.jpg' },
    ],
  },
  {
    name: 'Torn panels',
    preview: 'forza-03-torn-panels-preview.webp',
    alt: 'Forza Karate desktop background: Forza Karate logo with torn manga comic panels with red ink splashes',
    sizes: [
      { label: 'Mac 4K', res: '3840 × 2160', size: '2.0 MB', file: 'forza-03-torn-panels-windows-4k-3840x2160.jpg' },
      { label: 'Mac 5K', res: '5120 × 2880', size: '3.0 MB', file: 'forza-03-torn-panels-mac-5k-5120x2880.jpg' },
      { label: 'Mac 6K', res: '6016 × 3384', size: '3.7 MB', file: 'forza-03-torn-panels-mac-6k-6016x3384.jpg' },
      { label: 'Windows 4K', res: '3840 × 2160', size: '2.0 MB', file: 'forza-03-torn-panels-windows-4k-3840x2160.jpg' },
      { label: 'Windows 8K', res: '7680 × 4320', size: '5.0 MB', file: 'forza-03-torn-panels-windows-8k-7680x4320.jpg' },
    ],
  },
  {
    name: 'Sumi-e red sun',
    preview: 'forza-04-sumie-red-sun-preview.webp',
    alt: 'Forza Karate desktop background: Forza Karate logo with ink-wash brush strokes under a red sun',
    sizes: [
      { label: 'Mac 4K', res: '3840 × 2160', size: '1.2 MB', file: 'forza-04-sumie-red-sun-windows-4k-3840x2160.jpg' },
      { label: 'Mac 5K', res: '5120 × 2880', size: '1.9 MB', file: 'forza-04-sumie-red-sun-mac-5k-5120x2880.jpg' },
      { label: 'Mac 6K', res: '6016 × 3384', size: '2.4 MB', file: 'forza-04-sumie-red-sun-mac-6k-6016x3384.jpg' },
      { label: 'Windows 4K', res: '3840 × 2160', size: '1.2 MB', file: 'forza-04-sumie-red-sun-windows-4k-3840x2160.jpg' },
      { label: 'Windows 8K', res: '7680 × 4320', size: '3.4 MB', file: 'forza-04-sumie-red-sun-windows-8k-7680x4320.jpg' },
    ],
  },
  {
    name: 'Kick trail',
    preview: 'forza-05-kick-trail-preview.webp',
    alt: 'Forza Karate desktop background: Forza Karate logo with sweeping red and black brush-stroke kick trail',
    sizes: [
      { label: 'Mac 4K', res: '3840 × 2160', size: '2.2 MB', file: 'forza-05-kick-trail-windows-4k-3840x2160.jpg' },
      { label: 'Mac 5K', res: '5120 × 2880', size: '3.3 MB', file: 'forza-05-kick-trail-mac-5k-5120x2880.jpg' },
      { label: 'Mac 6K', res: '6016 × 3384', size: '4.0 MB', file: 'forza-05-kick-trail-mac-6k-6016x3384.jpg' },
      { label: 'Windows 4K', res: '3840 × 2160', size: '2.2 MB', file: 'forza-05-kick-trail-windows-4k-3840x2160.jpg' },
      { label: 'Windows 8K', res: '7680 × 4320', size: '5.4 MB', file: 'forza-05-kick-trail-windows-8k-7680x4320.jpg' },
    ],
  },
  {
    name: 'Forza manga (original)',
    preview: 'forza-manga-preview.webp',
    alt: 'Forza Karate manga-style desktop background: Forza Karate logo on a red and black comic burst',
    sizes: [
      { label: 'Mac 4K', res: '3840 × 2160', size: '2.7 MB', file: 'forza-manga-mac-4k-3840x2160.jpg' },
      { label: 'Mac 5K', res: '5120 × 2880', size: '4.4 MB', file: 'forza-manga-mac-5k-5120x2880.jpg' },
      { label: 'Mac 8K', res: '7680 × 4320', size: '7.3 MB', file: 'forza-manga-mac-8k-7680x4320.jpg' },
      { label: 'Windows 4K', res: '3840 × 2160', size: '1.8 MB', file: 'forza-manga-windows-4k-3840x2160.jpg' },
      { label: 'Windows 8K', res: '7680 × 4320', size: '4.8 MB', file: 'forza-manga-windows-8k-7680x4320.jpg' },
    ],
  },
]

export default function WallpaperCarousel({ designs = wallpaperDesigns }: { designs?: WallpaperDesign[] }) {
  const [index, setIndex] = useState(0)
  const [choice, setChoice] = useState(0)
  const touchX = useRef<number | null>(null)
  const count = designs.length
  const design = designs[index]
  const selected = design.sizes[Math.min(choice, design.sizes.length - 1)]

  const go = (i: number) => {
    setIndex((i + count) % count)
    setChoice(0)
  }

  return (
    <div className="rounded-2xl border border-black/10 overflow-hidden bg-white h-full flex flex-col">
      <div
        className="relative px-12 pt-8 pb-4"
        role="region"
        aria-roledescription="carousel"
        aria-label="Desktop background designs"
        onTouchStart={(e) => { touchX.current = e.touches[0].clientX }}
        onTouchEnd={(e) => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1))
          touchX.current = null
        }}
      >
        <div aria-live="polite" aria-atomic="true">
          <Image
            key={design.preview}
            src={base + design.preview}
            alt={design.alt}
            width={1200}
            height={675}
            sizes="(min-width: 1024px) 380px, 80vw"
            className="mx-auto w-full max-w-sm rounded-lg border-[5px] border-white shadow-[0_10px_25px_rgba(0,0,0,0.18)]"
          />
          <p className="sr-only">Design {index + 1} of {count}: {design.name}</p>
        </div>
        {count > 1 && (
          <>
            <button type="button" onClick={() => go(index - 1)} aria-label="Previous design" className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full border border-black/10 bg-white p-2 shadow hover:border-[#dc2626]">
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            </button>
            <button type="button" onClick={() => go(index + 1)} aria-label="Next design" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full border border-black/10 bg-white p-2 shadow hover:border-[#dc2626]">
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            </button>
          </>
        )}
        <div className="mt-4 flex justify-center gap-2">
          {designs.map((d, i) => (
            <button
              key={d.name}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show design ${i + 1}: ${d.name}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all ${i === index ? 'w-6 bg-[#dc2626]' : 'w-2 bg-black/20 hover:bg-black/40'}`}
            />
          ))}
        </div>
      </div>
      <div className="p-6 mt-auto">
        <h3 className="text-lg font-semibold text-[#111111]">Desktop backgrounds</h3>
        <p className="text-gray-500 mt-1">{design.name} wallpaper. Pick your screen size. JPG image.</p>
        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <label htmlFor="wallpaper-size" className="sr-only">Wallpaper size</label>
          <select
            id="wallpaper-size"
            value={choice}
            onChange={(e) => setChoice(Number(e.target.value))}
            className="flex-1 rounded-lg border border-black/15 bg-white px-3 py-3 text-[#111111] focus:border-[#dc2626] focus:outline-none focus:ring-2 focus:ring-[#dc2626]/30"
          >
            {design.sizes.map((s, i) => (
              <option key={s.label} value={i}>{s.label} ({s.res}, {s.size})</option>
            ))}
          </select>
          <a
            href={base + selected.file}
            download
            aria-label={`Download ${design.name} wallpaper, ${selected.label}, ${selected.size}`}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#dc2626] px-5 py-3 font-semibold text-white hover:bg-[#b91c1c] transition-colors"
          >
            <FileDown className="w-5 h-5" aria-hidden="true" />
            Download
          </a>
        </div>
      </div>
    </div>
  )
}
