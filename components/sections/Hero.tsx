'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import AnimatedWord from '@/components/ui/AnimatedWord'

// Hero media: 1-minute new-student promo video (replaces photo carousel).
const HERO_VIDEO = '/videos/forza-new-students-1min.mp4'
const HERO_POSTER = '/videos/forza-new-students-poster.jpg'

export default function Hero() {
  return (
    <section className="bg-white overflow-hidden">
      {/* ── Promo video first (all screens) ── */}
      <div className="mx-auto w-full max-w-[1280px] md:px-6 md:pt-6">
        <div className="relative w-full aspect-video bg-black overflow-hidden md:rounded-2xl">
          <video
            className="absolute inset-0 w-full h-full object-cover"
            src={HERO_VIDEO}
            poster={HERO_POSTER}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label="Forza Karate Club new students promo video"
          />
        </div>
        <p className="text-[10px] text-gray-400 text-right px-4 md:px-0 pt-1">
          Music: &ldquo;Volatile Reaction&rdquo; Kevin MacLeod (incompetech.com), licensed under{' '}
          <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener noreferrer" className="underline">CC BY 4.0</a>
        </p>
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
