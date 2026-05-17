import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Shield, Heart, Zap, Users, Trophy, Star, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Why Karate',
  description: 'Discover the real benefits of karate — discipline, confidence, fitness, self-defence, and community. Learn about Wado Ryu and WKF sport karate at Forza Karate Club.',
}

const benefits = [
  {
    icon: Shield,
    title: 'Discipline & Self-Control',
    description:
      'Karate demands respect — for your instructor, your training partners, and yourself. Students learn to control their impulses, manage frustration, and stay focused under pressure. These habits follow them everywhere.',
  },
  {
    icon: Heart,
    title: 'Confidence',
    description:
      'There is nothing quite like grading for a new belt or stepping into competition for the first time. Every challenge overcome builds genuine, earned confidence — not the hollow kind.',
  },
  {
    icon: Zap,
    title: 'Fitness & Coordination',
    description:
      'Karate training works the whole body — strength, flexibility, speed, and balance. For children especially, the coordination benefits are significant and carry over into all sports.',
  },
  {
    icon: Users,
    title: 'Community',
    description:
      'A dojo is more than a gym. It is a place where people look out for each other. The relationships formed on the mat often last years beyond training.',
  },
  {
    icon: Trophy,
    title: 'Competition',
    description:
      'For those who want to compete, Forza trains kata and kumite to WKF standards. We attend regional and national competitions and have produced some serious results.',
  },
  {
    icon: Star,
    title: 'Resilience',
    description:
      'Karate teaches you to fall and get up. To fail a grading and come back stronger. To face a more experienced opponent and not quit. These are lessons that matter.',
  },
]

export default function WhyKaratePage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto max-w-3xl">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Why Karate</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-[#111111] leading-tight mb-6">
            More than kicks<br />and punches
          </h1>
          <p className="text-xl text-gray-500 leading-relaxed max-w-2xl">
            Karate changes people. The focus, the discipline, the community — they follow you off
            the mat and into every part of life. Here is why it matters.
          </p>
        </div>
      </section>

      {/* Style note */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#fafaf9]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <h2 className="text-2xl font-bold text-[#111111] mb-4">Our style: Wado Ryu</h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              Forza Karate Club trains primarily in <strong className="text-[#111111]">Wado Ryu</strong>, one of the four major
              Japanese karate styles. Wado Ryu emphasises fluid movement, evasion, and body
              shifting rather than hard-force blocking — making it highly effective and elegant.
            </p>
            <p className="text-gray-500 leading-relaxed">
              For those interested in competition, we also train to <strong className="text-[#111111]">WKF (World Karate Federation)</strong> standards
              for both kata and kumite. This means our competitive students are prepared to
              perform at regional, national, and international level.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits grid */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-[#111111] mb-12">The real benefits</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title}>
                <benefit.icon className="h-6 w-6 text-[#dc2626] mb-4" />
                <h3 className="font-bold text-[#111111] mb-3">{benefit.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#fafaf9] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#111111] mb-4">Ready to start?</h2>
          <p className="text-gray-500 mb-8">Your first class is free. No kit, no commitment.</p>
          <Button asChild size="lg">
            <Link href="/trial-class">
              Book Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
