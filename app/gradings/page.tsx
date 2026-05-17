import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight, Lock } from 'lucide-react'
import BeltIcon from '@/components/ui/BeltIcon'

export const metadata: Metadata = {
  title: 'Gradings',
  description: 'Belt grading information for Forza Karate Club. Learn about the grading system, criteria, and register for upcoming gradings.',
}

const belts = [
  { kyu: '18th Kyu', name: 'White Belt',                 bg: '#ffffff', border: '#d1d5db', stripe: null },
  { kyu: '17th Kyu', name: 'White Belt / Red Stripe',    bg: '#ffffff', border: '#d1d5db', stripe: '#ef4444' },
  { kyu: '16th Kyu', name: 'White Belt / Yellow Stripe', bg: '#ffffff', border: '#d1d5db', stripe: '#facc15' },
  { kyu: '15th Kyu', name: 'Red Belt',                   bg: '#ef4444', border: '#dc2626', stripe: null },
  { kyu: '14th Kyu', name: 'Red Belt / White Stripe',    bg: '#ef4444', border: '#dc2626', stripe: '#ffffff' },
  { kyu: '13th Kyu', name: 'Yellow Belt',                bg: '#facc15', border: '#eab308', stripe: null },
  { kyu: '12th Kyu', name: 'Yellow Belt / White Stripe', bg: '#facc15', border: '#eab308', stripe: '#ffffff' },
  { kyu: '11th Kyu', name: 'Orange Belt',                bg: '#f97316', border: '#ea580c', stripe: null },
  { kyu: '10th Kyu', name: 'Orange Belt / White Stripe', bg: '#f97316', border: '#ea580c', stripe: '#ffffff' },
  { kyu: '9th Kyu',  name: 'Green Belt',                 bg: '#22c55e', border: '#16a34a', stripe: null },
  { kyu: '8th Kyu',  name: 'Green Belt / White Stripe',  bg: '#22c55e', border: '#16a34a', stripe: '#ffffff' },
  { kyu: '7th Kyu',  name: 'Blue Belt',                  bg: '#3b82f6', border: '#2563eb', stripe: null },
  { kyu: '6th Kyu',  name: 'Blue Belt / White Stripe',   bg: '#3b82f6', border: '#2563eb', stripe: '#ffffff' },
  { kyu: '5th Kyu',  name: 'Purple Belt',                bg: '#9333ea', border: '#7e22ce', stripe: null },
  { kyu: '4th Kyu',  name: 'Purple Belt / White Stripe', bg: '#9333ea', border: '#7e22ce', stripe: '#ffffff' },
  { kyu: '3rd Kyu',  name: 'Brown Belt',                 bg: '#92400e', border: '#78350f', stripe: null },
  { kyu: '2nd Kyu',  name: 'Brown Belt / White Stripe',  bg: '#92400e', border: '#78350f', stripe: '#ffffff' },
  { kyu: '1st Kyu',  name: 'Brown Belt / Two Stripe',    bg: '#92400e', border: '#78350f', stripe: '#ffffff', doubleStripe: true },
  { kyu: '',         name: 'Brown Belt / Black Stripe',  bg: '#92400e', border: '#78350f', stripe: '#111111' },
  { kyu: '',         name: 'Black Belt / White Stripe',  bg: '#111111', border: '#000000', stripe: '#ffffff' },
  { kyu: '1st Dan',  name: 'Black Belt',                 bg: '#111111', border: '#000000', stripe: null },
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

      {/* Members CTA */}
      <section className="bg-[#fafaf9] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#111111] mb-6">
            <Lock className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-[#111111] mb-4">Register for grading</h2>
          <p className="text-gray-500 mb-8">
            Grading registration is available to Forza members. Log in to your members area to register.
          </p>
          <Button asChild size="lg">
            <Link href="/members">
              Members login
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
