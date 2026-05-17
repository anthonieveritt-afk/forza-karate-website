import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { MapPin, Clock, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Upminster Dojo',
  description: 'Forza Karate Club Upminster dojo — karate classes for all ages at St Lawrence Church Hall, Corbets Tey Rd, Upminster RM14 2BB.',
}

const timetable = [
  { day: 'Wednesday', time: '4:00 – 4:30pm',  desc: 'Beginner infants (4–6 yrs)' },
  { day: 'Wednesday', time: '4:30 – 5:00pm',  desc: 'Infant all grades (4–6 yrs)' },
  { day: 'Wednesday', time: '5:00 – 5:45pm',  desc: 'Junior all grades (7–10 yrs)' },
  { day: 'Wednesday', time: '5:45 – 7:00pm',  desc: 'Senior all grades (11 years+)' },
]

export default function UpminsterPage() {
  return (
    <div className="bg-white">
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <Link href="/dojos" className="text-sm text-gray-400 hover:text-[#111111] transition-colors">Dojos</Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm text-[#111111]">Upminster</span>
          </div>
          <div className="flex items-center gap-2 mt-6 mb-6">
            <MapPin className="h-5 w-5 text-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Upminster Dojo</span>
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">Upminster</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Minor Hall, St Lawrence Church Hall, Corbets Tey Rd, Upminster. RM14 2BB
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Location */}
          <div>
            <h2 className="text-2xl font-bold text-[#111111] mb-6">Location</h2>
            <div className="space-y-1 text-gray-500 text-sm mb-6">
              <p className="font-semibold text-[#111111]">Minor Hall, St Lawrence Church Hall</p>
              <p>Corbets Tey Road</p>
              <p>Upminster</p>
              <p className="font-medium text-[#111111]">RM14 2BB</p>
            </div>
            <a
              href="https://maps.google.com/?q=St+Lawrence+Church+Hall,+Corbets+Tey+Rd,+Upminster+RM14+2BB"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#dc2626] hover:underline font-medium"
            >
              <MapPin className="h-4 w-4" />
              Open in Google Maps
            </a>

            <div className="mt-10">
              <Button asChild>
                <Link href="/join">
                  Book Free Trial at Upminster
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Timetable */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Clock className="h-5 w-5 text-[#dc2626]" />
              <h2 className="text-2xl font-bold text-[#111111]">Class timetable</h2>
            </div>
            <div className="space-y-3">
              {timetable.map((cls, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-[#fafaf9] border border-black/5">
                  <div className="w-24 flex-shrink-0">
                    <span className="text-xs font-bold text-[#dc2626] uppercase tracking-wide">{cls.day}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#111111]">{cls.time}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{cls.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">Term time only — 40 weeks per year.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
