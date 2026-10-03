import type { Metadata } from 'next'
import ClassCard from '@/components/sections/ClassCard'
import FeesPanel from '@/components/sections/FeesPanel'
import { PROGRAMME_AGES } from '@/lib/timetable'

export const metadata: Metadata = {
  title: 'Classes',
  description: 'Karate classes for all ages at Forza Karate Club, from age 4 to adults: Forza Ninjas, Forza Kids / Juniors and Forza Club, at Rayleigh and Upminster.',
}

const classes = [
  {
    title: 'Forza Ninjas',
    subtitle: 'Our youngest karatekas',
    ageRange: PROGRAMME_AGES.ninjas,
    description:
      'Play-based karate that builds coordination, confidence, and listening skills through fun drills, games, and structured movement. Perfect introduction to martial arts.',
    href: '/classes/ninjas',
  },
  {
    title: 'Forza Kids / Juniors',
    subtitle: 'Building real technique',
    ageRange: PROGRAMME_AGES.juniors,
    description:
      'Structured kata, kumite, and belt progression. Students develop discipline, focus, and technical skill in a supportive but demanding environment.',
    href: '/classes/juniors',
  },
  {
    title: 'Forza Club',
    subtitle: 'Older students and adults',
    ageRange: PROGRAMME_AGES.seniors,
    description:
      'Technical, competitive, serious training. Traditional Wado Ryu alongside WKF sport karate — for students who want to go further.',
    href: '/classes/seniors',
  },
]

export default function ClassesPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Classes</span>
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">A class for every age</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            From 4-year-old ninjas to senior competitors — we train everyone with the same
            intent. Find the right class for you or your child.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {classes.map((c) => (
              <ClassCard key={c.href} {...c} />
            ))}
          </div>
        </div>
      </section>

      {/* Fees */}
      <section className="bg-[#fafaf9] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <FeesPanel />
        </div>
      </section>
    </div>
  )
}
