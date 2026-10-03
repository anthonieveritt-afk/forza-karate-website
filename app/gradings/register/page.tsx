import type { Metadata } from 'next'
import Link from 'next/link'
import EventRegForm from '@/components/forms/EventRegForm'
import PageHeader from '@/components/sections/PageHeader'
import { GRADINGS } from '@/lib/gradings'
import { BELT_OPTIONS } from '@/lib/belts'
import { TIMETABLE, DOJO_NAMES } from '@/lib/timetable'

export const metadata: Metadata = {
  title: 'Register for Grading',
  description: 'Register for your next belt grading at Forza Karate Club.',
}

// Re-render hourly so gradings drop off the list once their registration deadline passes.
export const revalidate = 3600

// Grading fees, from the old site's 2026 grading registration form.
const fees = [
  { grades: '17th – 14th Kyu (white/red stripe to red/white stripe)', fee: '£35' },
  { grades: '13th – 8th Kyu (yellow to green/white stripe)', fee: '£40' },
  { grades: '7th – 4th Kyu (blue to purple/white stripe)', fee: '£45' },
  { grades: '3rd Kyu – Brown Belt', fee: '£70' },
  { grades: '2nd Kyu – Brown Belt / White Stripe', fee: '£85' },
  { grades: '1st Kyu – Brown Belt / Two Stripe', fee: '£90' },
  { grades: 'Black belt probation (Black Belt / White Stripe)', fee: '£150' },
  { grades: '1st Dan – Black Belt', fee: '£200' },
  { grades: '2nd Dan – Black Belt', fee: '£250' },
  { grades: '3rd Dan – Black Belt', fee: '£300' },
]

const classOptions = TIMETABLE.map((s) => ({
  value: `${DOJO_NAMES[s.dojo]} ${s.day} ${s.time}`,
  label: `${DOJO_NAMES[s.dojo]} — ${s.day} ${s.time}`,
}))

export default function GradingRegisterPage() {
  const now = new Date()
  const sessions = GRADINGS
    .filter((g) => g.registerBy >= now)
    .map((g) => ({
      value: g.name,
      label: `${g.name} — register by ${g.registerDeadlineLabel} (belts awarded ${g.awardLabel})`,
    }))

  return (
    <div className="bg-white min-h-screen">
      <PageHeader
        eyebrow="Gradings"
        title="Register for grading"
        intro="Register yourself or your child for the next grading. Please check the details carefully before you send the form."
      />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-black/8 p-6 sm:p-8">
              <EventRegForm
                event="grading"
                eventLabel="grading"
                sessions={sessions}
                sessionLabel="Grading"
                sessionRequired
                noSessionsMessage="No grading is open for registration right now"
                beltLabel="Grade you are grading for"
                beltOptions={BELT_OPTIONS.slice(1)}
                beltRequired
                hideFields={['medicalNotes']}
                extraFields={[
                  { name: 'gradingClass', label: 'Class you will grade at', type: 'select', options: classOptions, required: true },
                  { name: 'licenceNumber', label: 'Licence number', required: true, placeholder: 'e.g. from your licence book' },
                  { name: 'licenceExpiry', label: 'Licence expiry date', type: 'date', required: true },
                  { name: 'feeAgreement', label: 'I understand that the application will only be processed once the correct grading fee has been paid.', type: 'checkbox', required: true },
                ]}
                submitLabel="Register for grading"
                successTitle="Grading registration sent"
                successMessage="Thank you. Your grading registration has been received. Your application will be processed once the correct grading fee has been paid."
              />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-2xl bg-[#fafaf9] border border-black/5 p-6">
              <h2 className="text-lg font-bold text-[#111111] mb-4">Grading fees</h2>
              <ul className="divide-y divide-black/5">
                {fees.map((f) => (
                  <li key={f.grades} className="flex items-start justify-between gap-4 py-2.5 text-sm">
                    <span className="text-gray-600">{f.grades}</span>
                    <span className="font-semibold text-[#111111] whitespace-nowrap">{f.fee}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-[#fafaf9] border border-black/5 p-6 text-sm text-gray-600 space-y-3">
              <h2 className="text-lg font-bold text-[#111111]">Before you register</h2>
              <p>Gradings are conducted by the Club Chief Instructor only.</p>
              <p>Students at purple belt (4th Kyu) and above must be registered for FKA kata and kumite squad training to be eligible to grade.</p>
              <p>You need a valid licence to grade. <Link href="/join/apply-licence" className="text-[#dc2626] hover:underline">Apply for or renew your licence</Link>.</p>
              <p>Passed? <Link href="/store/personalised-belt" className="text-[#dc2626] hover:underline">Pre-order your personalised belt</Link>.</p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
