import type { Metadata } from 'next'
import EventRegForm from '@/components/forms/EventRegForm'
import MembersArea from '@/components/members/MembersArea'
import { requireMemberPage } from '@/lib/members/require'

// Members only (gated in middleware): render per request, never from a static/shared cache.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Register — Forza Invitational Karate Cup',
  description: 'Register for the Forza Invitational Karate Cup.',
}

export default async function InvitationalRegPage() {
  await requireMemberPage('/members/events/invitational')
  return (
    <div className="bg-[#fafaf9] min-h-screen">
      <MembersArea>
      <section className="pb-8 border-b border-black/5">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Events</span>
          </div>
          <h1 className="text-4xl font-bold text-[#111111] mb-4">Forza Invitational Karate Cup</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Register your interest for the Forza Invitational Karate Cup. Dates and venue will be confirmed — we&apos;ll be in touch once your registration is received.
          </p>
        </div>
      </section>
      <section className="pt-8">
        <div className="max-w-2xl">
          <EventRegForm
            event="invitational"
            eventLabel="Forza Invitational Karate Cup"
          />
        </div>
      </section>
      </MembersArea>
    </div>
  )
}
