import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Forza Ninjas — Ages 4–6',
  description: 'Play-based karate for children aged 4–6. Building coordination, confidence, and listening skills through fun structured training at Forza Karate Club.',
}

const expects = [
  'Fun, game-based warm-ups',
  'Basic kicks, punches, and blocks taught as games',
  'Listening skills and focus exercises',
  'Age-appropriate kata introduction',
  'Belt grading every term (subject to instructor approval)',
  'A safe, welcoming environment',
]

export default function NinjasPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center rounded-full bg-red-50 text-[#dc2626] text-xs font-semibold px-3 py-1 mb-6">
            Ages 4–6
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-[#111111] mb-4">Forza Ninjas</h1>
          <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
            Our youngest karatekas. Play-based, high-energy, and built around making children
            fall in love with movement, discipline, and karate.
          </p>
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-bold text-[#111111] mb-4">What to expect</h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Forza Ninjas classes are designed around the development stage of 4–6 year olds.
              Everything is taught through movement, play, and games. We build focus, coordination,
              and listening skills — the foundation everything else is built on.
            </p>
            <p className="text-gray-500 leading-relaxed">
              Children begin learning basic karate techniques — kicks, punches, blocks, and stances
              — in a way that feels exciting rather than formal. Progress is celebrated with belt
              gradings each term.
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
                  <td className="py-3 pr-8">Wednesday</td>
                  <td className="py-3 pr-8">4:00 – 4:30pm</td>
                  <td className="py-3">Upminster · beginner infants (4–6)</td>
                </tr>
                <tr className="border-b border-black/5">
                  <td className="py-3 pr-8">Wednesday</td>
                  <td className="py-3 pr-8">4:30 – 5:00pm</td>
                  <td className="py-3">Upminster · infants, all grades (4–6)</td>
                </tr>
                <tr className="border-b border-black/5">
                  <td className="py-3 pr-8">Tuesday</td>
                  <td className="py-3 pr-8">6:15 – 7:00pm</td>
                  <td className="py-3">Rayleigh · ages 4–10, all grades</td>
                </tr>
                <tr className="border-b border-black/5">
                  <td className="py-3 pr-8">Saturday</td>
                  <td className="py-3 pr-8">10:00 – 11:00am</td>
                  <td className="py-3">Rayleigh · ages 4+, all grades</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-4">
            Term-time only — 40 weeks per year. Rayleigh also runs a Friday 3:40–4:40pm after-school class for Rayleigh Primary School pupils only.
          </p>
        </div>
      </section>

      {/* Fees */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111111] mb-4">Fees</h2>
          <p className="text-gray-500 max-w-2xl">
            Membership is an annual fee for 40 weeks of term-time classes, paid as 12 monthly payments on the
            1st of each month by Direct Debit: single person £50, siblings £80, family £120 a month. One
            month&apos;s paid notice is required to cancel.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#111111] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to try a class?</h2>
          <p className="text-gray-400 mb-8">Come and try it out — £10 trial class. No kit required.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/trial-class">
                Book a Trial
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
