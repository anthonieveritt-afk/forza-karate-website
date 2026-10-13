import type { Metadata } from 'next'
import ClassCard from '@/components/sections/ClassCard'

export const metadata: Metadata = {
  title: 'Classes',
  description: 'Karate classes for all ages at Forza Karate Club. Forza Ninjas (4–6), Forza Juniors (7–10), and Forza Club (11+).',
}

const classes = [
  {
    title: 'Forza Ninjas',
    subtitle: 'Our youngest karatekas',
    ageRange: 'Ages 4–6',
    description:
      'Play-based karate that builds coordination, confidence, and listening skills through fun drills, games, and structured movement. Perfect introduction to martial arts.',
    href: '/classes/ninjas',
  },
  {
    title: 'Forza Kids / Juniors',
    subtitle: 'Building real technique',
    ageRange: 'Ages 7–10',
    description:
      'Structured kata, kumite, and belt progression. Students develop discipline, focus, and technical skill in a supportive but demanding environment.',
    href: '/classes/juniors',
  },
  {
    title: 'Forza Club',
    subtitle: '11 years and up, including adults',
    ageRange: 'Ages 11+',
    description:
      'Technical, competitive, serious training. Traditional Wado Ryu alongside WKF sport karate — for students who want to go further.',
    href: '/classes/seniors',
  },
]

const TIMETABLE: { dojo: string; rows: [string, string, string][] }[] = [
  { dojo: 'Upminster — Wednesday', rows: [
    ['Wednesday', '4:00 – 4:30pm', 'Beginner infants (ages 4–6)'],
    ['Wednesday', '4:30 – 5:00pm', 'Infants, all grades (ages 4–6)'],
    ['Wednesday', '5:00 – 5:45pm', 'Juniors, all grades (ages 7–10)'],
    ['Wednesday', '5:45 – 7:00pm', 'Seniors, all grades (ages 11+)'],
  ] },
  { dojo: 'Rayleigh', rows: [
    ['Tuesday', '6:15 – 7:00pm', 'Ages 4–10, all grades'],
    ['Tuesday', '7:00 – 8:00pm', 'Ages 11+, all grades'],
    ['Friday', '3:40 – 4:40pm', 'After-school club — Rayleigh Primary School pupils only'],
    ['Saturday', '10:00 – 11:00am', 'Ages 4+, all grades'],
  ] },
]

export default function ClassesPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Classes</span>
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">A class for every age</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            From 4-year-old ninjas to senior competitors — we train everyone with the same
            intent. Find the right class for you or your child.
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {classes.map((c) => (
              <ClassCard key={c.href} {...c} />
            ))}
          </div>
        </div>
      </section>

      {/* Timetable */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {TIMETABLE.map((d) => (
            <div key={d.dojo} className="rounded-2xl border border-black/8 p-6">
              <h2 className="text-xl font-bold text-[#111111] mb-4">{d.dojo}</h2>
              <ul className="divide-y divide-black/5 text-sm">
                {d.rows.map((r) => (
                  <li key={r[0] + r[1]} className="py-3 grid grid-cols-[6.5rem_1fr] gap-3">
                    <span className="font-semibold text-[#111111]">{r[0]}<br /><span className="font-normal text-gray-500">{r[1]}</span></span>
                    <span className="text-gray-500">{r[2]}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="max-w-7xl mx-auto text-xs text-gray-400 mt-4">Term-time only — 40 weeks per year.</p>
      </section>

      {/* Fees note */}
      <section className="bg-[#fafaf9] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl font-bold text-[#111111] mb-3">Fees</h2>
          <p className="text-gray-500 leading-relaxed max-w-2xl">
            Membership is an annual fee for 40 weeks of term-time classes, paid as 12 monthly payments on the
            1st of each month by GoCardless Direct Debit: single person £50, siblings £80, family £120 a month.
            One month&apos;s paid notice is required to cancel. See our <a href="/faq" className="text-[#dc2626] underline">FAQ</a> for more.
          </p>
        </div>
      </section>
    </div>
  )
}
