import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import AnimatedWord from '@/components/ui/AnimatedWord'

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-white">
      {/* Background photo — left side */}
      <div className="absolute inset-0">
        <Image
          src="/hero.webp"
          alt="Forza Karate Club members"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* White fade — covers right half, blends into photo */}
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
          <div className="flex flex-col sm:flex-row gap-3">
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
        </div>
      </div>
    </section>
  )
}
