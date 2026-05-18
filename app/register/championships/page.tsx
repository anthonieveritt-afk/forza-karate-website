import type { Metadata } from 'next'
import EventRegForm from '@/components/forms/EventRegForm'

export const metadata: Metadata = {
  title: 'Register — Forza Karate Club Championships',
  description: 'Register for the Forza Inter Club Karate Championships League.',
}

const sessions = [
  { value: '2026-02-28-div2', label: 'Sat 28th Feb 2026 — Division 2 (Rayleigh Primary School)' },
  { value: '2026-03-01-div1', label: 'Sun 1st March 2026 — Division 1 (Rayleigh Primary School)' },
  { value: '2026-06-13-div2', label: 'Sat 13th June 2026 — Division 2 (Rayleigh Primary School)' },
  { value: '2026-06-14-div1', label: 'Sun 14th June 2026 — Division 1 (Rayleigh Primary School)' },
  { value: '2026-09-19-div2', label: 'Sat 19th Sept 2026 — Division 2 (Rayleigh Primary School)' },
  { value: '2026-09-20-div1', label: 'Sun 20th Sept 2026 — Division 1 (Rayleigh Primary School)' },
]

export default function ChampionshipsRegPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Events</span>
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">Forza Karate Club Championships</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            The Forza Inter Club Karate Championships League — held at Rayleigh Primary School across three rounds in 2026.
          </p>
        </div>
      </section>
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <EventRegForm
            event="championships"
            eventLabel="Forza Club Championships"
            sessions={sessions}
          />
        </div>
      </section>
    </div>
  )
}
