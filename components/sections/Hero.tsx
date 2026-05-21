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
]

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent((i) => {
          // pick a random different index
          const next = (i + 1 + Math.floor(Math.random() * (photos.length - 1))) % photos.length
          return next
        })
        setFading(false)
      }, 700)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-white">
      {/* Background photo — crossfades between images */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <Image
          key={photos[current].src}
          src={photos[current].src}
          alt={photos[current].alt}
          fill
          priority
          className="object-cover"
          style={{ objectPosition: photos[current].position }}
          sizes="100vw"
        />
      </div>

      {/* White fade — blends right side */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-white" />

      {/* Content — sits on the right over the white fade */}
      <div className="relative z-10 ml-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="ml-auto max-w-lg py-24">
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

          {/* CTAs — 2×2 grid, all uniform */}
          <div className="grid grid-cols-2 gap-3">
            <Button asChild size="lg" className="w-full justify-center">
              <Link href="/trial-class">
                Book a Free Trial
              </Link>
            </Button>
            <Button asChild size="lg" className="w-full justify-center bg-white text-[#dc2626] hover:bg-gray-50 border-2 border-[#dc2626]">
              <Link href="/join">
                Join Now
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="w-full justify-center">
              <Link href="/classes">
                View Classes
              </Link>
            </Button>
            <Link
              href="/safeguarding"
              className="inline-flex items-center justify-center gap-2 px-4 h-12 rounded-2xl border border-black/12 bg-white/80 hover:bg-white hover:border-black/25 transition-colors text-sm font-medium"
            >
              <Image
                src="/safeguarding-code-logo.webp"
                alt="Safeguarding Code"
                width={28}
                height={28}
                className="w-7 h-7 object-contain flex-shrink-0"
              />
              <span className="text-[#111111] leading-tight">Safeguarding Code</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
