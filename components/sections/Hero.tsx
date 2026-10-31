'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import AnimatedWord from '@/components/ui/AnimatedWord'

// Stacked layout (photo first, copy below) on all screens. No zoom: photos shown whole.
const HERO_ZOOM = 1.0

const photos = [
  { src: '/hero.webp',                      alt: 'Forza Karate Club members',          position: '50% 30%' },
  { src: '/hero2.webp',                     alt: 'Forza Karate Club competition squad', position: '50% 30%' },
  { src: '/hero4.jpg',                      alt: 'Forza Karate Club training hall',    position: '50% 35%' },
  { src: '/hero5.jpg',                      alt: 'Forza Karate Club competition victory', position: '50% 30%' },
  { src: '/hero6.webp',                     alt: 'Forza Karate Club',                  position: '50% 30%' },
  { src: '/hero7.jpg',                      alt: 'Forza Karate Club',                  position: '50% 30%' },
  { src: '/hero18.jpg',                     alt: 'Forza Karate Club young student',    position: '50% 30%' },
  { src: '/hero9.jpg',                      alt: 'Forza Karate Club',                  position: '50% 30%' },
  { src: '/hero12.jpg',                     alt: 'Forza Karate Club',                  position: '50% 30%' },
  { src: '/hero14.jpg',                     alt: 'Forza Karate Club',                  position: '50% 30%' },
  { src: '/team/team-01.jpg',               alt: 'Forza Karate squad',                 position: '50% 30%' },
  { src: '/team/team-02.jpg',               alt: 'Forza Karate squad',                 position: '50% 30%' },
  { src: '/team/team-03.jpg',               alt: 'Forza Karate squad',                 position: '50% 30%' },
  { src: '/team/team-04.jpg',               alt: 'Forza Karate squad',                 position: '50% 30%' },
  { src: '/team/team-05.jpg',               alt: 'Forza Karate squad',                 position: '50% 30%' },
  { src: '/team/team-group.jpg',            alt: 'Forza Karate squad group',           position: '50% 30%' },
  { src: '/team/team-competition-01.jpg',   alt: 'Forza Karate competition',           position: '50% 30%' },
  { src: '/hero16.jpg',                     alt: 'Forza Karate',                       position: '50% 30%' },
  { src: '/hero19.jpg',                     alt: 'Forza Karate',                       position: '50% 30%' },
  { src: '/hero20.jpg',                     alt: 'Forza Karate',                       position: '50% 30%' },
  { src: '/hero21.jpg',                     alt: 'Forza Karate',                       position: '50% 30%' },
  { src: '/hero27.jpg',                     alt: 'Forza Karate class training',        position: '50% 35%' },
  { src: '/hero28.jpg',                     alt: 'Forza Karate class',                 position: '50% 35%' },
  { src: '/hero29.jpg',                     alt: 'Forza Karate class group',           position: '50% 30%' },
  { src: '/hero30.jpg',                     alt: 'BKF Four Nations medals',            position: '50% 30%' },
  { src: '/hero31.jpg',                     alt: 'Forza Karate competition action',    position: '50% 30%' },
  { src: '/hero32.jpg',                     alt: 'Forza Karate',                       position: '50% 30%' },
  { src: '/hero33.jpg',                     alt: 'Forza Karate',                       position: '50% 30%' },
  { src: '/hero34.jpg',                     alt: 'Forza Karate',                       position: '50% 30%' },
  { src: '/hero35.jpg',                     alt: 'Forza Karate',                       position: '50% 30%' },
  { src: '/hero36.jpg',                     alt: 'Forza Karate',                       position: '50% 30%' },
  { src: '/hero37.jpg',                     alt: 'Forza Karate kata competition',      position: '50% 30%' },
  { src: '/hero38.jpg',                     alt: 'Forza Karate Club group',            position: '50% 30%' },
]

type Slide =
  | { kind: 'photo'; key: string; src: string; alt: string }
  | { kind: 'ad'; key: string; href: string; eyebrow: string; title: string; sub: string; cta: string; variant: 'dark' | 'red' }

const adTrial: Slide = { kind: 'ad', key: 'ad-trial', href: '/trial-class', eyebrow: 'Forza Karate Club', title: 'Beginners welcome — click here for a trial', sub: 'New to karate? All ages, no experience needed.', cta: 'Book a Trial', variant: 'dark' }
const adJoin: Slide = { kind: 'ad', key: 'ad-join', href: '/join', eyebrow: 'Rayleigh · Upminster', title: 'Enrol / Join now', sub: 'Ready to train with us? Start your membership today.', cta: 'Join Now', variant: 'red' }

const photoSlides: Slide[] = photos.map((p) => ({ kind: 'photo', key: p.src, src: p.src, alt: p.alt }))
// Order: 3 photos → trial ad → 4 photos → join ad → remaining photos → loop
const slides: Slide[] = [...photoSlides.slice(0, 3), adTrial, ...photoSlides.slice(3, 7), adJoin, ...photoSlides.slice(7)]

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
                  objectFit: 'cover', objectPosition: '50% 40%',
                  transform: `scale(${HERO_ZOOM})`,
                  opacity: i === current ? 1 : 0,
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
                className={`absolute inset-0 flex flex-col items-center justify-center text-center px-6 md:px-16 text-white ${slide.variant === 'dark' ? 'bg-gradient-to-br from-[#111111] via-[#1a0a0d] to-[#C41230]' : 'bg-gradient-to-br from-[#C41230] via-[#8f0d23] to-[#111111]'}`}
                style={{ opacity: i === current ? 1 : 0, pointerEvents: i === current ? 'auto' : 'none', transition: 'opacity 0.8s ease-in-out' }}
              >
                <span className="text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-white/80 mb-3 md:mb-4">{slide.eyebrow}</span>
                <span className="block text-3xl sm:text-4xl md:text-6xl font-bold leading-[1.05] tracking-tight max-w-[14ch] md:max-w-[18ch]">{slide.title}</span>
                <span className="hidden sm:block mt-3 md:mt-5 text-sm md:text-lg text-white/85 max-w-[40ch]">{slide.sub}</span>
                <span className={`mt-5 md:mt-8 inline-flex items-center gap-2 rounded-xl px-5 md:px-7 h-11 md:h-14 text-sm md:text-base font-bold uppercase tracking-wide shadow-lg ${slide.variant === 'dark' ? 'bg-[#C41230] text-white' : 'bg-white text-[#C41230]'}`}>
                  {slide.cta} <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </span>
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
