import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="bg-white pt-20 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl">
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
            <span className="text-[#dc2626]">begin.</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-500 leading-relaxed mb-10 max-w-xl">
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
