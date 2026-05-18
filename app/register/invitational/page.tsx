import type { Metadata } from 'next'
import EventRegForm from '@/components/forms/EventRegForm'

export const metadata: Metadata = {
  title: 'Register — Forza Invitational Karate Cup',
  description: 'Register for the Forza Invitational Karate Cup.',
}

export default function InvitationalRegPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Events</span>
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">Forza Invitational Karate Cup</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Register your interest for the Forza Invitational Karate Cup. Dates and venue will be confirmed — we&apos;ll be in touch once your registration is received.
          </p>
        </div>
      </section>
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <EventRegForm
            event="invitational"
            eventLabel="Forza Invitational Karate Cup"
          />
        </div>
      </section>
    </div>
  )
}
