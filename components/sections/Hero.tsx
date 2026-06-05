'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import AnimatedWord from '@/components/ui/AnimatedWord'

const photos = [
  { src: '/hero.webp',                      alt: 'Forza Karate Club members',          position: '50% 25%' },
  { src: '/hero2.webp',                     alt: 'Forza Karate Club competition squad', position: '50% 20%' },
  { src: '/hero3.jpg',                      alt: 'Forza Karate Club podium',           position: '50% 25%' },
  { src: '/hero4.jpg',                      alt: 'Forza Karate Club training hall',    position: '50% 35%' },
  { src: '/hero5.jpg',                      alt: 'Forza Karate Club competition victory', position: '50% 30%' },
  { src: '/hero6.webp',                     alt: 'Forza Karate Club',                  position: '50% 25%' },
  { src: '/hero7.jpg',                      alt: 'Forza Karate Club',                  position: '50% 25%' },
  { src: '/hero18.jpg',                     alt: 'Forza Karate Club young student',    position: '50% 25%' },
  { src: '/hero9.jpg',                      alt: 'Forza Karate Club',                  position: '50% 25%' },
  { src: '/hero12.jpg',                     alt: 'Forza Karate Club',                  position: '50% 25%' },
  { src: '/hero14.jpg',                     alt: 'Forza Karate Club',                  position: '50% 25%' },
  { src: '/team/team-01.jpg',               alt: 'Forza Karate squad',                 position: '50% 25%' },
  { src: '/team/team-02.jpg',               alt: 'Forza Karate squad',                 position: '50% 25%' },
  { src: '/team/team-03.jpg',               alt: 'Forza Karate squad',                 position: '50% 25%' },
  { src: '/team/team-04.jpg',               alt: 'Forza Karate squad',                 position: '50% 25%' },
  { src: '/team/team-05.jpg',               alt: 'Forza Karate squad',                 position: '50% 25%' },
  { src: '/team/team-group.jpg',            alt: 'Forza Karate squad group',           position: '50% 25%' },
  { src: '/team/team-competition-01.jpg',   alt: 'Forza Karate competition',           position: '50% 25%' },
  { src: '/hero15.jpg',                     alt: 'Forza Karate sparring',              position: '50% 25%' },
  { src: '/hero16.jpg',                     alt: 'Forza Karate',                       position: '50% 25%' },
  { src: '/hero17.jpg',                     alt: 'Forza Karate',                       position: '50% 25%' },
  { src: '/hero19.jpg',                     alt: 'Forza Karate',                       position: '50% 25%' },
  { src: '/hero20.jpg',                     alt: 'Forza Karate',                       position: '50% 25%' },
  { src: '/hero21.jpg',                     alt: 'Forza Karate',                       position: '50% 25%' },
  { src: '/hero22.jpg',                     alt: 'Forza Karate competition podium',    position: '50% 30%' },
  { src: '/hero23.jpg',                     alt: 'Forza Karate competition results',   position: '50% 30%' },
  { src: '/hero24.jpg',                     alt: 'Forza Karate competition results',   position: '50% 30%' },
  { src: '/hero25.jpg',                     alt: 'Forza Karate training kick',         position: '50% 25%' },
  { src: '/hero26.jpg',                     alt: 'Forza Karate',                       position: '50% 25%' },
  { src: '/hero27.jpg',                     alt: 'Forza Karate class training',        position: '50% 35%' },
  { src: '/hero28.jpg',                     alt: 'Forza Karate class',                 position: '50% 35%' },
]

export default function Hero() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((i) => (i + 1) % photos.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="bg-white overflow-hidden">

      {/* ── MOBILE: photo block above text ── */}
      <div className="relative h-64 sm:h-80 md:hidden overflow-hidden">
        {photos.map((photo, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: photo.position,
              opacity: i === current ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out',
            }}
          />
        ))}
      </div>

      {/* ── DESKTOP: full-background photo behind content ── */}
      <div className="relative min-h-[85vh] hidden md:flex items-center">
        {photos.map((photo, i) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={photo.src}
            src={photo.src}
            alt={photo.alt}
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: photo.position,
              opacity: i === current ? 1 : 0,
              transition: 'opacity 0.8s ease-in-out',
              zIndex: i === current ? 1 : 0,
            }}
          />
        ))}
        {/* White fade right */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-white" style={{ zIndex: 2 }} />
        <div className="relative z-10 ml-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="ml-auto max-w-lg py-24">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-0.5 bg-[#dc2626]" />
              <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Forza Karate Club</span>
            </div>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#111111] leading-[1.05] tracking-tight mb-6">
              This is where<br />our students{' '}<AnimatedWord />
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed mb-10">
              Traditional Wado Ryu karate for all ages. Two dojos across Essex — Rayleigh and Upminster.
              Term-time classes, real progression, and a community that lasts.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button asChild size="lg" className="w-full justify-center">
                <Link href="/trial-class">Book a Free Trial</Link>
              </Button>
              <Button asChild size="lg" className="w-full justify-center bg-white text-[#dc2626] hover:bg-gray-50 border-2 border-[#dc2626]">
                <Link href="/join">Join Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full justify-center">
                <Link href="/classes">View Classes</Link>
              </Button>
              <Link href="/safeguarding" className="inline-flex items-center justify-center gap-2 px-4 h-12 rounded-2xl border border-black/12 bg-white/80 hover:bg-white hover:border-black/25 transition-colors text-sm font-medium">
                <Image src="/safeguarding-code-logo.webp" alt="Safeguarding Code" width={28} height={28} className="w-7 h-7 object-contain flex-shrink-0" />
                <span className="text-[#111111] leading-tight">Safeguarding Code</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── MOBILE: text below photo ── */}
      <div className="md:hidden px-5 py-10 bg-white">
        <div className="max-w-lg">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Forza Karate Club</span>
          </div>
          <h1 className="text-4xl font-bold text-[#111111] leading-[1.1] tracking-tight mb-4">
            This is where<br />our students{' '}<AnimatedWord />
          </h1>
          <p className="text-base text-gray-600 leading-relaxed mb-8">
            Traditional Wado Ryu karate for all ages. Two dojos across Essex — Rayleigh and Upminster.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <Button asChild size="lg" className="w-full justify-center">
              <Link href="/trial-class">Book a Free Trial</Link>
            </Button>
            <Button asChild size="lg" className="w-full justify-center bg-white text-[#dc2626] hover:bg-gray-50 border-2 border-[#dc2626]">
              <Link href="/join">Join Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full justify-center">
              <Link href="/classes">View Classes</Link>
            </Button>
            <Link href="/safeguarding" className="inline-flex items-center justify-center gap-2 px-4 h-12 rounded-2xl border border-black/12 bg-white/80 hover:bg-white hover:border-black/25 transition-colors text-sm font-medium">
              <Image src="/safeguarding-code-logo.webp" alt="Safeguarding Code" width={28} height={28} className="w-7 h-7 object-contain flex-shrink-0" />
              <span className="text-[#111111] leading-tight">Safeguarding Code</span>
            </Link>
          </div>
        </div>
      </div>
          {/* Eyebrow */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">
              Forza Karate Club
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#111111] leading-[1.05] tracking-tight mb-6">
            This is where<br />
            our students{' '}
            <AnimatedWord />
          </h1>

          {/* Subheading */}
          <p className="text-lg text-gray-600 leading-relaxed mb-10">
            Traditional Wado Ryu karate for all ages. Two dojos across Essex — Rayleigh and Upminster.
            Term-time classes, real progression, and a community that lasts.
          </p>

          {/* CTAs */}
          <div className="grid grid-cols-2 gap-3">
            <Button asChild size="lg" className="w-full justify-center">
              <Link href="/trial-class">Book a Free Trial</Link>
            </Button>
            <Button asChild size="lg" className="w-full justify-center bg-white text-[#dc2626] hover:bg-gray-50 border-2 border-[#dc2626]">
              <Link href="/join">Join Now</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full justify-center">
              <Link href="/classes">View Classes</Link>
            </Button>
            <Link href="/safeguarding" className="inline-flex items-center justify-center gap-2 px-4 h-12 rounded-2xl border border-black/12 bg-white/80 hover:bg-white hover:border-black/25 transition-colors text-sm font-medium">
              <Image src="/safeguarding-code-logo.webp" alt="Safeguarding Code" width={28} height={28} className="w-7 h-7 object-contain flex-shrink-0" />
              <span className="text-[#111111] leading-tight">Safeguarding Code</span>
            </Link>
          </div>
        </div>
      </div>

    </section>
  )
}
