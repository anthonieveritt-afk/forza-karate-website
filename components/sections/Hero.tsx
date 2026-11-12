'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import AnimatedWord from '@/components/ui/AnimatedWord'

// Stacked layout (photo first, copy below) on all screens. No zoom: photos shown whole.
const HERO_ZOOM = 1.0

// Homepage carousel trimmed 10 Nov 2026 to the live-site positions Anthoni asked to keep.
// Live order was 35 slides (photos + two inserted ads). Kept display positions:
// 1, 2, 3, 4 (Book a Trial ad), 5, 7, 8, 18, 19, 22, 23 and 35 (last).
// Image files for removed slides are left in public/; only this list changed.
const photos = [
  { src: '/hero.webp',                      alt: 'Forza Karate Club members',          position: '50% 40%' }, // live 1
  { src: '/hero2.webp',                     alt: 'Forza Karate Club competition squad', position: '50% 40%' }, // live 2
  { src: '/hero4.jpg',                      alt: 'Forza Karate Club training hall',    position: '50% 40%' }, // live 3
  { src: '/hero5.jpg',                      alt: 'Forza Karate Club competition victory', position: '50% 40%' }, // live 5
  { src: '/hero7.jpg',                      alt: 'Forza Karate Club',                  position: '50% 40%' }, // live 7
  { src: '/hero18.jpg',                     alt: 'Forza Karate Club young student',    position: '50% 40%' }, // live 8
  { src: '/team/team-group.jpg',            alt: 'Forza Karate squad group',           position: '50% 40%' }, // live 18
  { src: '/team/team-competition-01.jpg',   alt: 'Forza Karate competition',           position: '50% 40%' }, // live 19
  { src: '/hero20.jpg',                     alt: 'Forza Karate',                       position: '50% 40%' }, // live 22
  { src: '/hero21.jpg',                     alt: 'Forza Karate',                       position: '50% 40%' }, // live 23
  { src: '/hero38.jpg',                     alt: 'Forza Karate Club group',            position: '50% 40%' }, // live 35 (last)
  // Commonwealth Elite Karate Championships 2026 (Glasgow) — appended 12 Nov 2026. Existing slides unchanged.
  { src: '/hero-commonwealth-2026-team.webp',       alt: 'Forza Karate Club team at the Commonwealth Elite Karate Championships 2026 in Glasgow', position: '50% 72%' },
  { src: '/hero-commonwealth-2026-kobe-kick.webp',  alt: 'Kobe Yogarajah competing for Forza Karate at the Commonwealth Elite Karate Championships 2026 in Glasgow', position: '50% 45%' },
  { src: '/hero-commonwealth-2026-medallists.webp', alt: 'Forza Karate Club medallists at the Commonwealth Elite Karate Championships 2026 in Glasgow', position: '50% 70%' },
  { src: '/hero-commonwealth-2026-coaches.webp',    alt: 'Forza Karate Club coaches and officials at the Commonwealth Elite Karate Championships 2026 in Glasgow', position: '50% 42%' },
  // 0-unseen.heic is a club dojo class photo (juniors with belts), not a Glasgow/Commonwealth image.
  { src: '/hero-club-juniors-belts.webp',           alt: 'Forza Karate Club junior students celebrating with belts in the dojo', position: '50% 48%' },
]

type Slide =
  | { kind: 'photo'; key: string; src: string; alt: string; position: string }
  | { kind: 'ad'; key: string; href: string; eyebrow: string; title: string; sub: string; cta: string; img: string }

const adTrial: Slide = { kind: 'ad', key: 'ad-trial', href: '/trial-class', eyebrow: 'Forza Karate Club', title: 'Beginners welcome — click here for a trial', sub: 'New to karate? All ages, no experience needed.', cta: 'Book a Trial', img: '/hero-ad-trial.webp' } // live 4

const photoSlides: Slide[] = photos.map((p) => ({ kind: 'photo', key: p.src, src: p.src, alt: p.alt, position: p.position }))
// Display order matches kept live positions: 1–3, trial ad (4), then 5, 7, 8, 18, 19, 22, 23, 35.
const slides: Slide[] = [...photoSlides.slice(0, 3), adTrial, ...photoSlides.slice(3)]

export default function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((i) => (i + 1) % slides.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [current])

  return (
    <section className="bg-white overflow-hidden">
      {/* ── Photo first (all screens), shown whole: object-contain, no zoom ── */}
      <div className="mx-auto w-full max-w-[1280px] md:px-6 md:pt-6">
        <div className="relative w-full aspect-[4/3] md:aspect-video bg-white overflow-hidden md:rounded-2xl">
          {slides.map((slide, i) =>
            slide.kind === 'photo' ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={slide.key}
                src={slide.src}
                alt={slide.alt}
                loading={i === 0 ? 'eager' : 'lazy'}
                aria-hidden={i !== current}
                style={{
                  position: 'absolute', inset: 0, width: '100%', height: '100%',
                  objectFit: 'cover', objectPosition: slide.position || '50% 40%',
                  transform: `scale(${HERO_ZOOM})`,
                  opacity: i === current ? 1 : 0,
                  zIndex: i === current ? 2 : 1,
                  pointerEvents: 'none',
                  transition: 'opacity 0.8s ease-in-out',
                }}
              />
            ) : (
              <Link
                key={slide.key}
                href={slide.href}
                aria-label={`${slide.title} — ${slide.cta}`}
                aria-hidden={i !== current}
                tabIndex={i === current ? 0 : -1}
                className="absolute inset-0 block bg-[#111111]"
                style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 3 : 0, cursor: 'pointer', pointerEvents: i === current ? 'auto' : 'none', transition: 'opacity 0.8s ease-in-out' }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={slide.img} alt={`${slide.title} — ${slide.cta}`} loading="lazy" className="w-full h-full object-cover pointer-events-none" draggable={false} />
              </Link>
            )
          )}
        </div>
        {/* Carousel controls under the image */}
        <div className="flex flex-wrap justify-center gap-1.5 py-3 px-4" aria-label="Choose photo">
          {slides.map((slide, i) => (
            <button
              key={slide.key}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={slide.kind === 'ad' ? `Show ${slide.cta} slide` : `Show slide ${i + 1}`}
              aria-current={i === current}
              className={`h-2 rounded-full transition-all ${i === current ? 'w-6 bg-[#C41230]' : 'w-2 bg-black/20 hover:bg-black/40'}`}
            />
          ))}
        </div>
      </div>

      {/* ── Copy + CTAs underneath ── */}
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-6 pt-4 pb-12 md:pb-16">
        <div className="flex flex-col md:flex-row md:items-center gap-8 md:gap-10">
          <div className="md:flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-[#C41230]" />
            <span className="text-sm font-medium text-[#C41230] uppercase tracking-wider">Forza Karate Club</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-[#111111] leading-[1.1] tracking-tight mb-4 md:mb-6">
            This is where<br />our students{' '}<AnimatedWord />
          </h1>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed">
            Traditional Wado Ryu karate for all ages. Two dojos across Essex — Rayleigh and Upminster.
            <span className="hidden md:inline"> Term-time classes, real progression, and a community that lasts.</span>
          </p>
          </div>
          {/* 2×2 CTA grid: below copy on mobile, to the right of the rotating text on tablet/desktop */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-[22rem] lg:w-[26rem] md:flex-shrink-0">
            <Button asChild size="lg" className="w-full justify-center bg-[#C41230] hover:bg-[#a30f28] text-white">
              <Link href="/trial-class">Book a £10 Trial</Link>
            </Button>
            <Button asChild size="lg" className="w-full justify-center bg-white text-[#C41230] hover:bg-gray-50 border-2 border-[#C41230]">
              <Link href="/join">Join Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full justify-center">
              <Link href="/classes">View Classes</Link>
            </Button>
            <Link href="/safeguarding" className="inline-flex items-center justify-center gap-2 px-4 h-12 rounded-2xl border border-black/12 bg-white hover:border-black/25 transition-colors text-sm font-medium">
              <Image src="/safeguarding-code-logo.webp" alt="Safeguarding Code" width={28} height={28} className="w-7 h-7 object-contain flex-shrink-0" />
              <span className="text-[#111111] leading-tight">Safeguarding Code</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
