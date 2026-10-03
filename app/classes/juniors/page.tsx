import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight, CheckCircle } from 'lucide-react'
import ClassTimetable from '@/components/sections/ClassTimetable'
import FeesPanel from '@/components/sections/FeesPanel'
import { sessionsForClass } from '@/lib/timetable'
import { TRIAL_HREF } from '@/lib/site'
import { PROGRAMME_AGES } from '@/lib/timetable'

export const metadata: Metadata = {
  title: 'Forza Kids / Juniors',
  description: 'Structured karate training for children up to age 10 at Rayleigh and up to 13 at Upminster. Kata, kumite, and belt progression at Forza Karate Club.',
}

const expects = [
  'Structured kata training (Wado Ryu)',
  'Controlled kumite (sparring) introduction',
  'Belt grading with technical assessment',
  'Competition preparation for those who want it',
  'Focus, discipline, and teamwork',
  'Regular attendance tracking for grading eligibility',
]

export default function JuniorsPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center rounded-full bg-red-50 text-[#dc2626] text-xs font-semibold px-3 py-1 mb-6">
            {PROGRAMME_AGES.juniors}
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-[#111111] mb-4">Forza Kids / Juniors</h1>
          <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
            Where the real technique begins. Students at this level develop genuine karate skill
            through structured kata, controlled kumite, and consistent belt progression.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-bold text-[#111111] mb-4">About this class</h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              The Juniors class bridges the gap between our Ninjas programme and the senior club.
              Children who are ready for structured, technical training (up to age 10 at Rayleigh
              and up to 13 at Upminster) get exactly that here.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Kata are introduced and refined. Controlled partner work (kumite) begins. Gradings
              become more technical and demanding. This is where many students find their real
              passion for karate.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#111111] mb-4">What&apos;s included</h2>
            <ul className="space-y-3">
              {expects.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#dc2626] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Timetable */}
      <section className="bg-[#fafaf9] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Class timetable</h2>
          <ClassTimetable sessions={sessionsForClass('juniors')} />
          <p className="text-xs text-gray-400 mt-4">
            Term time only — 40 weeks per year. See the{' '}
            <Link href="/dojos/rayleigh" className="underline underline-offset-2 hover:text-[#dc2626]">Rayleigh</Link> and{' '}
            <Link href="/dojos/upminster" className="underline underline-offset-2 hover:text-[#dc2626]">Upminster</Link> dojo pages for venue details.
          </p>
        </div>
      </section>

      {/* Fees */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <FeesPanel />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#111111] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Book a free trial</h2>
          <p className="text-gray-400 mb-8">No kit needed. No commitment. Just come and see.</p>
          <Button asChild size="lg">
            <Link href={TRIAL_HREF}>
              Book Free Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
