import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight, CheckCircle } from 'lucide-react'
import ClassTimetable from '@/components/sections/ClassTimetable'
import FeesPanel from '@/components/sections/FeesPanel'
import { sessionsForClass } from '@/lib/timetable'
import { TRIAL_HREF } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Forza Club — Ages 11+',
  description: 'Technical and competitive karate training for ages 11 and up, including adults. Traditional Wado Ryu and WKF sport karate at Forza Karate Club.',
}

const expects = [
  'Advanced kata — Wado Ryu syllabus and beyond',
  'Full kumite (sparring) with protective equipment',
  'WKF competition preparation',
  'Technical grading assessments',
  'Squad training opportunities for competitors',
  'Adult classes available — all welcome',
]

export default function SeniorsPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center rounded-full bg-red-50 text-[#dc2626] text-xs font-semibold px-3 py-1 mb-6">
            Ages 11+ · Adults welcome
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-[#111111] mb-4">Forza Club</h1>
          <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
            Technical, competitive, serious training. This is where Forza students who want to
            go all the way come to train — alongside adults who want the real thing.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-bold text-[#111111] mb-4">About this class</h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Forza Club is the senior tier of our training programme. Students aged 11 and above
              — including adults starting from scratch or coming with prior experience — train
              together in a focused, demanding environment.
            </p>
            <p className="text-gray-500 leading-relaxed mb-6">
              We train traditional <strong className="text-[#111111]">Wado Ryu</strong> kata and
              kumite alongside <strong className="text-[#111111]">WKF sport karate</strong>. For
              those who want to compete, we have an active competition squad. For those who just
              want to train — you are equally welcome.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Adults new to karate are always welcome. We regularly have adults join from zero
              experience and progress to brown and black belt level.
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
          <ClassTimetable sessions={sessionsForClass('seniors')} />
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
          <h2 className="text-3xl font-bold text-white mb-4">Start your journey</h2>
          <p className="text-gray-400 mb-8">First class free. Adults and seniors welcome.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href={TRIAL_HREF}>
                Book a free trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-white text-[#dc2626] hover:bg-gray-50 border-2 border-[#dc2626]">
              <Link href="/join">Join Today</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
