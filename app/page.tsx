import type { Metadata } from 'next'
import Link from 'next/link'
import Hero from '@/components/sections/Hero'
import StatsBand from '@/components/sections/StatsBand'
import ClassCard from '@/components/sections/ClassCard'
import BeltJourney from '@/components/sections/BeltJourney'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Shield, Heart, Zap, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Forza Karate Club — Rayleigh & Upminster',
  description: 'Traditional Wado Ryu karate for all ages across Essex. Book your free trial class today at Rayleigh or Upminster.',
}

const classes = [
  {
    title: 'Forza Ninjas',
    subtitle: 'Our youngest karatekas',
    ageRange: 'Ages 4–7',
    description:
      'Play-based karate that builds coordination, confidence, and listening skills through fun drills, games, and structured movement.',
    href: '/classes/ninjas',
  },
  {
    title: 'Forza Kids / Juniors',
    subtitle: 'Building real technique',
    ageRange: 'Ages 8–10',
    description:
      'Structured kata, kumite, and belt progression. Students develop discipline, focus, and technical skill in a supportive environment.',
    href: '/classes/juniors',
  },
  {
    title: 'Forza Club',
    subtitle: '11 years and up, including adults',
    ageRange: 'Ages 11+',
    description:
      'Technical, competitive, serious training. Traditional Wado Ryu alongside WKF sport karate — for those who want to go further.',
    href: '/classes/seniors',
  },
]

const whyPoints = [
  { icon: Shield, title: 'Discipline & Focus', desc: 'The mat teaches life skills. Self-control, respect, and the ability to push through.' },
  { icon: Heart, title: 'Confidence', desc: 'From the first bow to the first black belt — every step builds self-belief.' },
  { icon: Zap, title: 'Fitness & Coordination', desc: "Full-body conditioning that's actually fun. No gym required." },
  { icon: Users, title: 'Community', desc: 'A club that actually feels like one. People look out for each other here.' },
]

export default function HomePage() {
  return (
    <>
      <Hero />
      <StatsBand />

      {/* Classes section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-[#dc2626]" />
              <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">
                Classes
              </span>
              <div className="w-8 h-0.5 bg-[#dc2626]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] mb-4">
              A class for every age
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              From 4-year-old ninjas to senior competitors — we train everyone with the same intent.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {classes.map((c) => (
              <ClassCard key={c.href} {...c} />
            ))}
          </div>
        </div>
      </section>

      <BeltJourney />

      {/* Why Karate teaser */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-0.5 bg-[#dc2626]" />
                <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">
                  Why Karate?
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] mb-4">
                More than kicks and punches
              </h2>
              <p className="text-gray-500 leading-relaxed mb-8">
                Karate builds people. The focus, the discipline, the community — they follow
                you off the mat and into every part of life.
              </p>
              <Button asChild variant="outline">
                <Link href="/why-karate">
                  Learn more
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {whyPoints.map((point) => (
                <div key={point.title} className="p-5 rounded-2xl bg-[#fafaf9] border border-black/5">
                  <point.icon className="h-5 w-5 text-[#dc2626] mb-3" />
                  <h3 className="font-semibold text-[#111111] text-sm mb-1">{point.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{point.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Instructor teaser */}
      <section className="bg-[#fafaf9] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">
              Instructors
            </span>
            <div className="w-8 h-0.5 bg-[#dc2626]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] mb-4">
            Qualified. DBS checked. Fully insured.
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto mb-8">
            Every instructor at Forza is DBS enhanced, first aid qualified, and fully insured.
            Your child is in good hands.
          </p>
          <Button asChild variant="outline">
            <Link href="/instructors">Meet the team</Link>
          </Button>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-0.5 bg-[#dc2626] mx-auto mb-8" />
          <h2 className="text-4xl sm:text-5xl font-bold text-[#111111] mb-4 leading-tight">
            First class is free.<br />No kit needed. Just show up.
          </h2>
          <p className="text-gray-500 mb-10 text-lg">
            Book a free trial at Rayleigh or Upminster and see if Forza is right for you.
          </p>
          <Button asChild size="lg">
            <Link href="/trial-class">
              Book Your Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  )
}
