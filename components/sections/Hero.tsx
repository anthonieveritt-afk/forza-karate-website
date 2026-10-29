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

export default function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((i) => (i + 1) % photos.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [current])

  return (
    <section className="bg-white overflow-hidden">
      {/* ── Photo first (all screens), shown whole: object-contain, no zoom ── */}
      <div className="mx-auto w-full max-w-[1280px] md:px-6 md:pt-6">
        <div className="relative w-full aspect-[4/3] md:aspect-video bg-[#111111] overflow-hidden md:rounded-2xl">
          {photos.map((photo, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              loading={i === 0 ? 'eager' : 'lazy'}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: '50% 50%',
                transform: `scale(${HERO_ZOOM})`,
                opacity: i === current ? 1 : 0,
                transition: 'opacity 0.8s ease-in-out',
              }}
            />
          ))}
        </div>
        {/* Carousel controls under the image */}
        <div className="flex flex-wrap justify-center gap-1.5 py-3 px-4" aria-label="Choose photo">
          {photos.map((photo, i) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === current}
              className={`h-2 rounded-full transition-all ${i === current ? 'w-6 bg-[#C41230]' : 'w-2 bg-black/20 hover:bg-black/40'}`}
            />
          ))}
        </div>
      </div>

      {/* ── Copy + CTAs underneath ── */}
      <div className="mx-auto w-full max-w-[1280px] px-5 md:px-6 pt-4 pb-12 md:pb-16">
        <div className="max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-[#C41230]" />
            <span className="text-sm font-medium text-[#C41230] uppercase tracking-wider">Forza Karate Club</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-[#111111] leading-[1.1] tracking-tight mb-4 md:mb-6">
            This is where<br />our students{' '}<AnimatedWord />
          </h1>
          <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-8">
            Traditional Wado Ryu karate for all ages. Two dojos across Essex — Rayleigh and Upminster.
            <span className="hidden md:inline"> Term-time classes, real progression, and a community that lasts.</span>
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
