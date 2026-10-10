import type { Metadata } from 'next'
import TrialClassForm from '@/components/forms/TrialClassForm'
import { CheckCircle } from 'lucide-react'
import { Suspense } from 'react'

export const metadata: Metadata = {
  title: 'Book a £10 Trial Class',
  description: 'Come and try it out! Book a £10 trial karate class at Forza Karate Club. No kit needed, no commitment. Available at Rayleigh and Upminster.',
}

const perks = [
  'Trial class £10, paid securely online',
  'The £10 covers the trial only — it isn’t taken off membership',
  'If you join, membership starts the week after at the full monthly rate',
  'No kit or uniform needed',
  'No commitment required',
  'All ages welcome — 4 to adult',
  "We'll be in touch within 72 hours",
]

export default function TrialClassPage() {
  return (
    <div className="bg-white">
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">£10 Trial Class</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-[#111111] mb-4 leading-tight">
            Come and<br />try it out
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Book a £10 trial class and see what Forza is about. No kit, no commitment — come and try it out, then ask questions.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Perks */}
          <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-[#111111] mb-6">What to expect</h2>
            <ul className="space-y-4 mb-10">
              {perks.map((perk) => (
                <li key={perk} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-[#dc2626] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">{perk}</span>
                </li>
              ))}
            </ul>

            <div className="p-6 rounded-2xl bg-[#fafaf9] border border-black/5">
              <h3 className="font-semibold text-[#111111] mb-2 text-sm">Two locations</h3>
              <p className="text-sm text-gray-500 mb-1">📍 Rayleigh, Essex</p>
              <p className="text-sm text-gray-500">📍 Upminster, East London</p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl border border-black/8 p-8">
              <Suspense><TrialClassForm /></Suspense>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
