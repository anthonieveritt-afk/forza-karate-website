import type { Metadata } from 'next'
import EventRegForm from '@/components/forms/EventRegForm'
import MembersArea from '@/components/members/MembersArea'
import { requireMemberPage } from '@/lib/members/require'

// Members only (gated in middleware): render per request, never from a static/shared cache.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Register for Super Champs',
  description: 'Register for the Forza Saturday Super Champs sessions.',
}

const sessions = [
  { value: '2026-02-14-chingford', label: 'Sat 14th Feb 2026 — Chingford, 2:00pm' },
  { value: '2026-03-14-rayleigh',  label: 'Sat 14th March 2026 — Rayleigh, 2:00pm' },
  { value: '2026-04-25-chingford', label: 'Sat 25th April 2026 — Chingford, 2:00pm' },
  { value: '2026-05-09-rayleigh',  label: 'Sat 9th May 2026 — Rayleigh, 2:00pm' },
  { value: '2026-06-06-chingford', label: 'Sat 6th June 2026 — Chingford, 2:30pm' },
  { value: '2026-07-11-rayleigh',  label: 'Sat 11th July 2026 — Rayleigh, 2:00pm' },
  { value: '2026-08-01-chingford', label: 'Sat 1st Aug 2026 — Chingford, 2:00pm' },
  { value: '2026-09-12-rayleigh',  label: 'Sat 12th Sept 2026 — Rayleigh, 2:00pm' },
  { value: '2026-10-24-chingford', label: 'Sat 24th Oct 2026 — Chingford, 2:00pm' },
  { value: '2026-11-14-rayleigh',  label: 'Sat 14th Nov 2026 — Rayleigh, 2:00pm' },
  { value: '2026-12-05-chingford', label: 'Sat 5th Dec 2026 — Chingford, 2:00pm' },
]

export default async function SuperChampsRegPage() {
  await requireMemberPage('/members/events/super-champs')
  return (
    <div className="bg-[#fafaf9] min-h-screen">
      <MembersArea>
      <section className="pb-8 border-b border-black/5">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Events</span>
          </div>
          <h1 className="text-4xl font-bold text-[#111111] mb-4">Saturday Super Champs</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            1-hour fun, team-building karate for beginners and lower grades. Perfect for students new to the competition side of karate.
          </p>
        </div>
      </section>
      <section className="pt-8">
        <div className="max-w-2xl">
          <EventRegForm
            event="super-champs"
            eventLabel="Super Champs"
            sessions={sessions}
          />
        </div>
      </section>
      </MembersArea>
    </div>
  )
}
