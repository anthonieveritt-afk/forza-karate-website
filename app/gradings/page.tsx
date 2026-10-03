import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import BeltIcon from '@/components/ui/BeltIcon'
import GradingCountdown from '@/components/sections/GradingCountdown'
import { BELTS as belts } from '@/lib/belts'

export const metadata: Metadata = {
  title: 'Gradings',
  description: 'Belt grading information for Forza Karate Club. Learn about the grading system, criteria, and register for upcoming gradings.',
}


// From the old site's Rules page (https://forzakarate.co.uk/join-today-2/).
const intervals = [
  { range: 'Beginner to purple belt (4th Kyu)', interval: 'About every 3 months' },
  { range: '3rd Kyu to 1st Kyu', interval: '6 months between each grade' },
  { range: '1st Kyu to 1st Dan', interval: '1 year' },
]

const criteria = [
  { title: 'Attendance', desc: 'Regular, consistent attendance is the foundation. Students who rarely attend are not eligible.' },
  { title: 'Technical ability', desc: 'Techniques must be clean, controlled, and meet the standard for the next grade.' },
  { title: 'Personal progress', desc: 'We look at how much you have grown, not just where you are right now.' },
  { title: 'Tournament / Course attendance', desc: 'Participation in competitions and courses demonstrates commitment and accelerates progress.' },
]

export default function GradingsPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Gradings</span>
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">Belt progression</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Gradings are earned, not given. Your belt represents real work — consistent training,
            technical ability, and personal growth.
          </p>
        </div>
      </section>

      {/* Philosophy */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-8">
            <div>
            <h2 className="text-2xl font-bold text-[#111111] mb-6">Grading criteria</h2>
            <div className="space-y-6">
              {criteria.map((item, i) => (
                <div key={item.title} className="flex gap-4">
                  <div className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-[#dc2626]">{i + 1}</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#111111] mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 p-5 rounded-2xl bg-[#fafaf9] border border-black/5">
              <p className="text-sm text-gray-500">
                <strong className="text-[#111111]">Local gradings</strong> are held at your club. Black belt examinations
                are held separately and require FKA approval.
              </p>
            </div>
            </div>
            <GradingCountdown />
          </div>

          {/* Belt order */}
          <div>
            <h2 className="text-2xl font-bold text-[#111111] mb-6">Belt order</h2>
            <div className="space-y-3">
              {belts.map((belt, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-24 flex-shrink-0">
                    <BeltIcon
                      color={belt.bg}
                      border={belt.border}
                      stripe={belt.stripe}
                      doubleStripe={belt.doubleStripe}
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    {belt.kyu && <span className="font-medium text-[#111111] text-sm w-16">{belt.kyu}</span>}
                    <span className="text-gray-500 text-sm">{belt.name}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Grading rules */}
      <section className="bg-[#fafaf9] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-bold text-[#111111] mb-6">Grading rules</h2>
            <p className="text-sm text-gray-500 mb-5">The club organises grading sessions at intervals of approximately:</p>
            <div className="space-y-3">
              {intervals.map((row) => (
                <div key={row.range} className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white border border-black/5">
                  <span className="text-sm text-gray-600">{row.range}</span>
                  <span className="text-sm font-semibold text-[#111111] whitespace-nowrap">{row.interval}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-black/5">
              <h3 className="font-semibold text-[#111111] mb-2">Who conducts gradings</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Gradings are conducted by the Club Chief Instructor only.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-black/5">
              <h3 className="font-semibold text-[#111111] mb-2">Squad training from purple belt</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Kata and kumite squad training with the FKA (Frontier Karate Association) is compulsory for students at
                purple belt (4th Kyu) and above. Students who are not registered for squad training are not eligible to grade.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-black/5">
              <h3 className="font-semibold text-[#111111] mb-2">Licence</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                You need a valid, in-date licence to grade. <Link href="/join/apply-licence" className="text-[#dc2626] hover:underline">Apply for your licence</Link>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Register CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-[#111111] mb-4">Register for grading</h2>
          <p className="text-gray-500 mb-8">
            Register yourself or your child for the next grading before the deadline. Passed your grading? Order your
            personalised belt.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/gradings/register">
                Register for grading
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/store/personalised-belt">Order a personalised belt</Link>
            </Button>
          </div>
          <p className="text-sm text-gray-400 mt-6">
            Members can also register from the <Link href="/members" className="underline underline-offset-2 hover:text-[#dc2626]">members area</Link>.
          </p>
        </div>
      </section>
    </div>
  )
}
