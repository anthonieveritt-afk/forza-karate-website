import type { Metadata } from 'next'
import { CalendarDays, MapPin, Heart } from 'lucide-react'
import EventRegForm from '@/components/forms/EventRegForm'
import PageHeader from '@/components/sections/PageHeader'
import { PARA_PRICE, PARA_VENUES, upcomingParaSessions } from '@/lib/para'

export const metadata: Metadata = {
  title: 'Para Karate for All',
  description: 'A monthly, inclusive karate session for students with additional needs, learning difficulties and disabilities. All ages and abilities welcome.',
}

// Re-render hourly so past sessions drop off the list.
export const revalidate = 3600

const highlights = [
  'Building confidence',
  'Developing fundamental karate skills',
  'Improving coordination',
  'Positive progression at each student’s own pace',
  'Tailored coaching and smaller group sizes',
  'Clear, structured activities in a calm, welcoming environment',
]

export default function ParaKaratePage() {
  const upcoming = upcomingParaSessions()
  const bookable = upcoming
    .filter((s) => s.date)
    .map((s) => ({ value: `${s.date}-${s.venue.toLowerCase()}`, label: `${s.label} — ${s.venue}, ${s.time} start` }))

  return (
    <div className="bg-white">
      <PageHeader
        eyebrow="Para Karate"
        title="Para Karate for All"
        intro="A monthly, inclusive development session designed for students with additional needs, learning difficulties and disabilities."
      />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-5 text-gray-600 leading-relaxed">
            <p>
              Our Para Karate for All Development Session is a monthly, inclusive training session designed
              specifically for students with additional needs, learning difficulties and disabilities. Our sessions
              are open to all students on the spectrum.
            </p>
            <p>
              Held once a month, this supportive session focuses on building confidence, developing fundamental karate
              skills, improving coordination and providing positive progression at each student’s pace.
            </p>
            <p>
              Delivered in a calm and welcoming environment, the session allows students to thrive with tailored
              coaching, smaller group sizes and clear, structured activities. All ages and abilities are welcome, from
              complete beginners to current karate students.
            </p>
            <p className="font-medium text-[#111111]">
              The aim is simple: to create a space where every student can enjoy karate, grow and feel part of our
              wider martial arts community.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#111111] mb-6">What the session offers</h2>
            <ul className="space-y-3">
              {highlights.map((h) => (
                <li key={h} className="flex items-start gap-3">
                  <Heart className="h-5 w-5 text-[#dc2626] mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">{h}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 p-5 rounded-2xl bg-[#fafaf9] border border-black/5">
              <p className="text-sm text-gray-600">
                <strong className="text-[#111111]">One-hour sessions · {PARA_PRICE}.</strong> All ages and abilities welcome.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="bg-[#fafaf9] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <CalendarDays className="h-5 w-5 text-[#dc2626]" />
              <h2 className="text-2xl font-bold text-[#111111]">Upcoming sessions</h2>
            </div>
            <div className="space-y-3">
              {upcoming.map((s) => (
                <div key={s.label} className="flex items-start gap-4 p-4 rounded-2xl bg-white border border-black/5">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#111111]">{s.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{s.venue}{s.time ? ` · ${s.time} start` : ''}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-6">
              <MapPin className="h-5 w-5 text-[#dc2626]" />
              <h2 className="text-2xl font-bold text-[#111111]">Venues</h2>
            </div>
            <div className="space-y-3">
              {Object.entries(PARA_VENUES).map(([name, address]) => (
                <div key={name} className="p-4 rounded-2xl bg-white border border-black/5">
                  <p className="text-sm font-semibold text-[#111111]">{name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{address}</p>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-[#dc2626] hover:underline font-medium mt-2"
                  >
                    Open in Google Maps
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Registration */}
      <section id="register" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-[#111111] mb-3">Register for a session</h2>
          <p className="text-gray-500 mb-8">Choose a session and tell us a little about the student.</p>
          <EventRegForm
            event="para-karate"
            eventLabel="Para Karate"
            sessions={bookable}
            sessionLabel="Session"
            sessionRequired
            noSessionsMessage="New dates will be added soon"
            price={PARA_PRICE}
            hideFields={['currentBelt']}
            medicalLabel="Additional needs or medical notes"
            extraFields={[
              { name: 'age', label: 'Age', type: 'number', required: true },
              { name: 'gender', label: 'Gender', type: 'select', required: true, options: [
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
              ] },
              { name: 'height', label: 'Height', required: true, placeholder: 'e.g. 140cm' },
            ]}
            submitLabel="Register for Para Karate"
          />
        </div>
      </section>
    </div>
  )
}
