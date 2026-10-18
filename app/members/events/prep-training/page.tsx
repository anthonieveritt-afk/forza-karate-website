import type { Metadata } from 'next'
import EventRegForm from '@/components/forms/EventRegForm'
import MembersArea from '@/components/members/MembersArea'
import { requireMemberPage } from '@/lib/members/require'

// Members only (gated in middleware): render per request, never from a static/shared cache.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Register for Preparation Training',
  description: 'Register for Forza Sport Karate Coaching / Preparation Training sessions.',
}

const sessions = [
  { value: '2026-03-08-rayleigh-kum-u12',  label: 'Sun 8th March — Rayleigh — Kumite (12 & below) 11:00am' },
  { value: '2026-03-08-rayleigh-kum-s',    label: 'Sun 8th March — Rayleigh — Kumite (13+) 1:00pm' },
  { value: '2026-03-14-rayleigh-kata',     label: 'Sat 14th March — Rayleigh — Kata (all ages) 3:00pm' },
  { value: '2026-04-25-chingford-kata',    label: 'Sat 25th April — Chingford — Kata (all ages) 3:00pm' },
  { value: '2026-04-26-chingford-kum-u12', label: 'Sun 26th April — Chingford — Kumite (12 & below) 2:00pm' },
  { value: '2026-04-26-chingford-kum-s',   label: 'Sun 26th April — Chingford — Kumite (13+) 4:00pm' },
  { value: '2026-05-09-rayleigh-kata',     label: 'Sat 9th May — Rayleigh — Kata (all ages) 3:00pm' },
  { value: '2026-05-17-rayleigh-kum-u12',  label: 'Sun 17th May — Rayleigh — Kumite (12 & below) 11:00am' },
  { value: '2026-05-17-rayleigh-kum-s',    label: 'Sun 17th May — Rayleigh — Kumite (13+) 1:00pm' },
  { value: '2026-06-06-chingford-kata',    label: 'Sat 6th June — Chingford — Kata (all ages) 3:30pm' },
  { value: '2026-06-07-chingford-kum-u12', label: 'Sun 7th June — Chingford — Kumite (12 & below) 2:00pm' },
  { value: '2026-06-07-chingford-kum-s',   label: 'Sun 7th June — Chingford — Kumite (13+) 4:00pm' },
  { value: '2026-07-11-rayleigh-kata',     label: 'Sat 11th July — Rayleigh — Kata (all ages) 3:00pm' },
  { value: '2026-07-26-rayleigh-kum-u12',  label: 'Sun 26th July — Rayleigh — Kumite (12 & below) 11:00am' },
  { value: '2026-07-26-rayleigh-kum-s',    label: 'Sun 26th July — Rayleigh — Kumite (13+) 1:00pm' },
  { value: '2026-08-01-chingford-kata',    label: 'Sat 1st Aug — Chingford — Kata (all ages) 3:00pm' },
  { value: '2026-08-02-chingford-kum',     label: 'Sun 2nd Aug — Chingford — Kumite (all ages) 2:00pm' },
  { value: '2026-09-12-rayleigh-kata',     label: 'Sat 12th Sept — Rayleigh — Kata (all ages) 3:00pm' },
  { value: '2026-09-13-rayleigh-kum-u12',  label: 'Sun 13th Sept — Rayleigh — Kumite (12 & below) 11:00am' },
  { value: '2026-09-13-rayleigh-kum-s',    label: 'Sun 13th Sept — Rayleigh — Kumite (13+) 1:00pm' },
  { value: '2026-10-24-chingford-kata',    label: 'Sat 24th Oct — Chingford — Kata (all ages) 3:00pm' },
  { value: '2026-10-04-chingford-kum-u12', label: 'Sun 4th Oct — Chingford — Kumite (12 & below) 2:00pm' },
  { value: '2026-10-04-chingford-kum-s',   label: 'Sun 4th Oct — Chingford — Kumite (13+) 4:00pm' },
  { value: '2026-11-14-rayleigh-kata',     label: 'Sat 14th Nov — Rayleigh — Kata (all ages) 3:00pm' },
  { value: '2026-11-01-rayleigh-kum-u12',  label: 'Sun 1st Nov — Rayleigh — Kumite (12 & below) 11:00am' },
  { value: '2026-11-01-rayleigh-kum-s',    label: 'Sun 1st Nov — Rayleigh — Kumite (13+) 1:00pm' },
  { value: '2026-12-05-chingford-kata',    label: 'Sat 5th Dec — Chingford — Kata (all ages) 3:00pm' },
  { value: '2026-12-20-chingford-kum',     label: 'Sun 20th Dec — Chingford — Kumite (all ages) 2:00pm' },
]

export default async function PrepTrainingRegPage() {
  await requireMemberPage('/members/events/prep-training')
  return (
    <div className="bg-[#fafaf9] min-h-screen">
      <MembersArea>
      <section className="pb-8 border-b border-black/5">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Events</span>
          </div>
          <h1 className="text-4xl font-bold text-[#111111] mb-4">Preparation Training</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Sport Karate Coaching — 2-hour focused sessions split by age group (12 &amp; below / 13+). Kata and Kumite preparation for upcoming competitions.
          </p>
        </div>
      </section>
      <section className="pt-8">
        <div className="max-w-2xl">
          <EventRegForm
            event="prep-training"
            eventLabel="Preparation Training"
            sessions={sessions}
            showAgeGroup
          />
        </div>
      </section>
      </MembersArea>
    </div>
  )
}
