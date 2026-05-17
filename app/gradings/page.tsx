import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import GradingRegForm from '@/components/forms/GradingRegForm'

export const metadata: Metadata = {
  title: 'Gradings',
  description: 'Belt grading information for Forza Karate Club. Learn about the grading system, criteria, and register for upcoming gradings.',
}

const belts = [
  { kyu: '9th Kyu', name: 'White', color: 'bg-white border-2 border-gray-200' },
  { kyu: '8th Kyu', name: 'Orange', color: 'bg-orange-400' },
  { kyu: '7th Kyu', name: 'Red', color: 'bg-red-500' },
  { kyu: '6th Kyu', name: 'Yellow', color: 'bg-yellow-400' },
  { kyu: '5th Kyu', name: 'Green', color: 'bg-green-500' },
  { kyu: '4th Kyu', name: 'Blue', color: 'bg-blue-500' },
  { kyu: '3rd Kyu', name: 'Purple', color: 'bg-purple-600' },
  { kyu: '2nd Kyu', name: 'Brown', color: 'bg-amber-800' },
  { kyu: '1st Kyu', name: 'Brown', color: 'bg-amber-900' },
  { kyu: '1st Dan', name: 'Black', color: 'bg-black' },
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
              {belts.map((belt) => (
                <div key={belt.kyu} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full ${belt.color} flex-shrink-0`} />
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-[#111111] text-sm w-20">{belt.kyu}</span>
                    <span className="text-gray-500 text-sm">{belt.name} Belt</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Registration form */}
      <section className="bg-[#fafaf9] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#111111] mb-4">Register for grading</h2>
            <p className="text-gray-500">
              Use this form to register for an upcoming grading. Your instructor will confirm your place.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-black/8 p-8">
            <GradingRegForm />
          </div>
        </div>
      </section>
    </div>
  )
}
