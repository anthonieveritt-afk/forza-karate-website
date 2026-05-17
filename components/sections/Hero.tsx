'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import AnimatedWord from '@/components/ui/AnimatedWord'

const photos = [
  { src: '/hero.webp', alt: 'Forza Karate Club members' },
  { src: '/hero2.webp', alt: 'Forza Karate Club competition squad' },
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
    }, 5000)
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
          className="object-cover object-center"
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
            champions{' '}
            <AnimatedWord />
          </h1>

          {/* Subheading */}
          <p className="text-lg text-gray-600 leading-relaxed mb-10">
            Traditional Wado Ryu karate for all ages. Two dojos across Essex — Rayleigh and Upminster.
            Term-time classes, real progression, and a community that lasts.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <Button asChild size="lg">
              <Link href="/trial-class">
                Book Free Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/classes">View Classes</Link>
            </Button>
          </div>

          {/* Safeguarding Code badge */}
          <Link
            href="/safeguarding"
            className="inline-flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-black/10 bg-white/80 hover:bg-white hover:border-black/20 transition-colors group"
          >
            <Image
              src="/safeguarding-code-logo.webp"
              alt="Safeguarding Code in Martial Arts"
              width={44}
              height={44}
              className="w-11 h-11 object-contain"
            />
            <div className="text-left">
              <p className="text-xs font-bold text-[#111111] uppercase tracking-wider leading-tight">Safeguarding Code</p>
              <p className="text-xs text-gray-500 leading-tight">in Martial Arts — certified</p>
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
