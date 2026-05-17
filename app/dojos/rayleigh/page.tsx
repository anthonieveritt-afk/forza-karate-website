import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { MapPin, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Rayleigh Dojo',
  description: 'Forza Karate Club Rayleigh dojo — karate classes for all ages at Rayleigh Primary School, Essex.',
}

export default function RayleighPage() {
  return (
    <div className="bg-white">
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dojos" className="text-sm text-gray-400 hover:text-[#111111] transition-colors">Dojos</Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm text-[#111111]">Rayleigh</span>
          </div>
          <div className="flex items-center gap-2 mt-6 mb-6">
            <MapPin className="h-5 w-5 text-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Rayleigh Dojo</span>
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">Rayleigh</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Rayleigh Primary School, Rayleigh, Essex. Classes for Ninjas, Juniors, and Senior/Adult students.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-bold text-[#111111] mb-4">Location</h2>
            <p className="text-gray-500 mb-2">Rayleigh Primary School</p>
            <p className="text-gray-500 mb-8">Rayleigh, Essex</p>

            {/* Map placeholder */}
            <div className="w-full h-64 rounded-2xl bg-[#fafaf9] border border-black/8 flex items-center justify-center">
              <div className="text-center text-gray-400">
                <MapPin className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Map coming soon</p>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#111111] mb-4">Class timetable</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/10">
                    <th className="text-left py-3 pr-6 font-semibold text-[#111111]">Class</th>
                    <th className="text-left py-3 pr-6 font-semibold text-[#111111]">Day</th>
                    <th className="text-left py-3 font-semibold text-[#111111]">Time</th>
                  </tr>
                </thead>
                <tbody className="text-gray-500">
                  <tr className="border-b border-black/5">
                    <td className="py-3 pr-6">Contact us</td>
                    <td className="py-3 pr-6">—</td>
                    <td className="py-3">—</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-3">* Contact us for the current timetable.</p>

            <div className="mt-10">
              <Button asChild>
                <Link href="/trial-class">
                  Book Free Trial at Rayleigh
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
