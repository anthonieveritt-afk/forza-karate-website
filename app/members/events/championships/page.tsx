import type { Metadata } from 'next'
import EventRegForm from '@/components/forms/EventRegForm'
import MembersArea from '@/components/members/MembersArea'
import { requireMemberPage } from '@/lib/members/require'

// Members only (gated in middleware): render per request, never from a static/shared cache.
export const dynamic = 'force-dynamic'

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

export default async function ChampionshipsRegPage() {
  await requireMemberPage('/members/events/championships')
  return (
    <div className="bg-[#fafaf9] min-h-screen">
      <MembersArea>
      <section className="pb-8 border-b border-black/5">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Events</span>
          </div>
          <h1 className="text-4xl font-bold text-[#111111] mb-4">Forza Karate Club Championships</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            The Forza Inter Club Karate Championships League — held at Rayleigh Primary School across three rounds in 2026.
          </p>
        </div>
      </section>
      <section className="pt-8">
        <div className="max-w-2xl">
          <EventRegForm
            event="championships"
            eventLabel="Forza Club Championships"
            sessions={sessions}
          />
        </div>
      </section>
      </MembersArea>
    </div>
  )
}
