import type { Metadata } from 'next'
import { Calendar } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Calendar & Term Dates',
  description: 'Forza Karate Club class calendar, term dates, grading dates, and key events.',
}

const termDates = [
  { term: 'Autumn Term 1', dates: 'Contact us for current dates' },
  { term: 'Autumn Term 2', dates: 'Contact us for current dates' },
  { term: 'Spring Term 1', dates: 'Contact us for current dates' },
  { term: 'Spring Term 2', dates: 'Contact us for current dates' },
  { term: 'Summer Term 1', dates: 'Contact us for current dates' },
  { term: 'Summer Term 2', dates: 'Contact us for current dates' },
]

const keyDates = [
  { event: 'Grading — Rayleigh & Upminster', date: 'TBC — contact your instructor', type: 'Grading' },
  { event: 'Regional Competition', date: 'TBC', type: 'Competition' },
  { event: 'Club Course', date: 'TBC', type: 'Course' },
]

export default function CalendarPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Calendar</span>
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">Calendar & Term Dates</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            We teach for 40 weeks out of the year, in term time only. Here&apos;s what&apos;s coming up.
          </p>
        </div>
      </section>

      {/* Term dates */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-2xl font-bold text-[#111111] mb-6">Term dates</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-black/10">
                    <th className="text-left py-3 pr-6 font-semibold text-[#111111]">Term</th>
                    <th className="text-left py-3 font-semibold text-[#111111]">Dates</th>
                  </tr>
                </thead>
                <tbody>
                  {termDates.map((row) => (
                    <tr key={row.term} className="border-b border-black/5">
                      <td className="py-3 pr-6 font-medium text-[#111111]">{row.term}</td>
                      <td className="py-3 text-gray-500">{row.dates}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              * Term dates are updated each academic year. Contact us for the most current information.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#111111] mb-6">Key dates</h2>
            <div className="space-y-4">
              {keyDates.map((item) => (
                <div key={item.event} className="flex gap-4 p-4 rounded-xl border border-black/8">
                  <Calendar className="h-5 w-5 text-[#dc2626] mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-[#111111] text-sm">{item.event}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.date}</p>
                    <span className="inline-flex mt-2 items-center rounded-full bg-red-50 text-[#dc2626] text-xs font-semibold px-2.5 py-0.5">
                      {item.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Calendar embed placeholder */}
      <section className="bg-[#fafaf9] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Full calendar</h2>
          <div className="w-full h-96 rounded-2xl bg-white border border-black/8 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <Calendar className="h-10 w-10 mx-auto mb-3" />
              <p className="text-sm font-medium">Calendar embed coming soon</p>
              <p className="text-xs mt-1">Contact us for upcoming dates</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
