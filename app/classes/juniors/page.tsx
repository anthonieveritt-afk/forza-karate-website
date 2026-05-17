import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Forza Kids / Juniors — Ages 8–10',
  description: 'Structured karate training for children aged 8–10. Kata, kumite, and belt progression at Forza Karate Club.',
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
            Ages 8–10
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
              The Juniors class bridges the gap between our Ninjas program and the senior club.
              Students aged 8–10 are ready for structured, technical training — and this class
              delivers exactly that.
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-black/10">
                  <th className="text-left py-3 pr-8 font-semibold text-[#111111]">Day</th>
                  <th className="text-left py-3 pr-8 font-semibold text-[#111111]">Time</th>
                  <th className="text-left py-3 font-semibold text-[#111111]">Location</th>
                </tr>
              </thead>
              <tbody className="text-gray-500">
                <tr className="border-b border-black/5">
                  <td className="py-3 pr-8">Contact us</td>
                  <td className="py-3 pr-8">—</td>
                  <td className="py-3">Rayleigh / Upminster</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            * Contact us for current timetable. Term-time only — 40 weeks per year.
          </p>
        </div>
      </section>

      {/* Fees */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111111] mb-4">Fees</h2>
          <p className="text-gray-500 max-w-2xl">
            Membership fees are charged annually, payable by 12 monthly instalments on the 1st of
            each month via Direct Debit. One calendar month&apos;s notice required to cancel. Contact us
            for current pricing.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#111111] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Book a free trial</h2>
          <p className="text-gray-400 mb-8">No kit needed. No commitment. Just come and see.</p>
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
