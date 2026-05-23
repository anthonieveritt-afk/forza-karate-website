import type { Metadata } from 'next'
import Image from 'next/image'
import { Trophy } from 'lucide-react'
import TeamBanner from '@/components/sections/TeamBanner'
import LogoTicker from '@/components/layout/LogoTicker'


export const metadata: Metadata = {
  title: 'Team Forza',
  description: 'Meet Team Forza — our competitive kata and kumite teams representing Forza Karate Club at regional and national level.',
}

const eliteSquad = [
  'Kobe Yogarajah',
  'Yuan Yogarajah',
  'Quintin Wong',
  'Ayden Wong',
]

const kumiteAthletes = [
  'Kobe Yogarajah',
  'Yuan Yogarajah',
  'Quintin Wong',
  'Ayden Wong',
  'Nam Mac',
  'Harry Dossor',
  'David Butlin',
  'Alex Austin',
  'Claire Buss',
  'Annabelle Buss',
  'Quinn Godfrey',
  'Archie Tebbutt',
  'Lukas Tran',
]

const kataAthletes = [
  'Kobe Yogarajah',
  'Yuan Yogarajah',
  'Claire Buss',
  'Ahm Mac',
  'Nam Mac',
  'Lukas Tran',
]

const paraAthletes = [
  'L. Buss',
]

const coaches = [
  { name: 'Anthoni Everitt', grade: '6th Dan' },
  { name: 'Jade Honeywood',  grade: '4th Dan' },
  { name: 'Kobe Yogarajah',  grade: '2nd Dan' },
]

const paraCoaches = [
  { name: 'Claire Buss', grade: '2nd Kyu', role: 'Para Team Coach' },
]

function AthleteList({ names }: { names: string[] }) {
  return (
    <ul className="mt-6 space-y-2">
      {names.map((name) => (
        <li
          key={name}
          className="flex items-center gap-3 py-2.5 border-b border-black/5 last:border-0"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-[#dc2626] flex-shrink-0" />
          <span className="text-sm font-medium text-[#111111]">{name}</span>
        </li>
      ))}
    </ul>
  )
}

export default function TeamPage() {
  return (
    <div className="bg-white">
      <TeamBanner />
      <LogoTicker />

      {/* Coaches */}
      <section className="bg-[#fafaf9] py-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Coaching Staff</span>
          </div>
          <div className="flex flex-wrap gap-4">
            {coaches.map((c) => (
              <div key={c.name} className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-black/8">
                <div className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />
                <span className="text-sm font-semibold text-[#111111]">{c.name}</span>
                <span className="text-xs font-medium text-gray-400">{c.grade}</span>
              </div>
            ))}
            {paraCoaches.map((c) => (
              <div key={c.name} className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-black/8">
                <div className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />
                <span className="text-sm font-semibold text-[#111111]">{c.name}</span>
                <span className="text-xs font-medium text-gray-400">{c.grade}</span>
                <span className="text-xs text-[#dc2626] font-medium">{c.role}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teams */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Elite Squad */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="h-5 w-5 text-[#dc2626]" />
              <h2 className="text-2xl font-bold text-[#111111]">Elite Squad</h2>
            </div>
            <p className="text-sm text-gray-400 mb-6">{eliteSquad.length} athletes</p>
            <div className="flex flex-wrap gap-3">
              {eliteSquad.map((name) => (
                <div key={name} className="flex items-center gap-2.5 px-5 py-3 rounded-2xl border border-[#dc2626]/20 bg-red-50">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#dc2626]" />
                  <span className="text-sm font-semibold text-[#111111]">{name}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

            {/* Kumite */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="h-5 w-5 text-[#dc2626]" />
                <h2 className="text-2xl font-bold text-[#111111]">Kumite Team</h2>
              </div>
              <p className="text-sm text-gray-400">{kumiteAthletes.length} athletes</p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { src: '/team/kumite-y-yogarajah.jpg', name: 'Y. Yogarajah' },
                  { src: '/team/kumite-q-wong.jpg',      name: 'Q. Wong' },
                  { src: '/team/kumite-h-dosser.jpg',    name: 'H. Dosser' },
                  { src: '/team/kumite-q-godfrey.jpg',   name: 'Q. Godfrey' },
                  { src: '/team/kumite-a-tebbutt.jpg',   name: 'A. Tebbutt' },
                  { src: '/team/kumite-a-buss.jpg',      name: 'A. Buss' },
                  { src: '/team/kumite-7.jpg',            name: 'Kumite 7' },
                  { src: '/team/kumite-new-01.jpg',       name: 'Kumite' },
                ].map((a) => (
                  <div key={a.name} className="rounded-2xl overflow-hidden border border-black/8">
                    <Image
                      src={a.src}
                      alt="Kumite athlete"
                      width={300}
                      height={380}
                      className="w-full object-cover object-top"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Kata */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="h-5 w-5 text-[#dc2626]" />
                <h2 className="text-2xl font-bold text-[#111111]">Kata Team</h2>
              </div>
              <p className="text-sm text-gray-400">{kataAthletes.length} athletes</p>
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  { src: '/team/kata-ahm-mac.jpg' },
                  { src: '/team/kata-nam-mac.jpg' },
                ].map((a, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden border border-black/8">
                    <Image
                      src={a.src}
                      alt="Kata athlete"
                      width={300}
                      height={380}
                      className="w-full object-cover object-top"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Para Karate */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Trophy className="h-5 w-5 text-[#dc2626]" />
                <h2 className="text-2xl font-bold text-[#111111]">Para Karate</h2>
              </div>
              <p className="text-sm text-gray-400">{paraAthletes.length} athlete</p>
              <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                <div className="rounded-2xl overflow-hidden border border-black/8">
                  <Image
                    src="/team/leo-buss.jpg"
                    alt="Para Karate athlete"
                    width={300}
                    height={380}
                    className="w-full object-cover object-top"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* B Squad Kata — full width below Kata Team */}
          <div className="mt-12">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="h-5 w-5 text-[#dc2626]" />
              <h2 className="text-2xl font-bold text-[#111111]">B Squad Kata</h2>
            </div>
            <div className="mt-6 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              <div className="rounded-2xl overflow-hidden border border-black/8">
                <Image src="/team/kata-b-squad-01.jpg" alt="B Squad Kata athlete" width={300} height={380} className="w-full object-cover object-top" />
              </div>
              <div className="rounded-2xl overflow-hidden border border-black/8">
                <Image src="/team/kata-b-squad-02.jpg" alt="B Squad Kata athlete" width={300} height={380} className="w-full object-cover object-top" />
              </div>
              <div className="rounded-2xl overflow-hidden border border-black/8">
                <Image src="/team/kata-b-squad-03.jpg" alt="B Squad Kata athlete" width={300} height={380} className="w-full object-cover object-top" />
              </div>
              <div className="rounded-2xl overflow-hidden border border-black/8">
                <Image src="/team/kata-casielle.jpg" alt="B Squad Kata athlete" width={300} height={380} className="w-full object-cover object-top" />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Competition info */}
      <section className="bg-[#fafaf9] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111111] mb-4">Want to compete?</h2>
          <p className="text-gray-500 max-w-2xl leading-relaxed">
            Competition is open to all Forza Club members who meet the minimum belt requirement.
            Speak to your instructor if you want to join the competition squad. No prior competition
            experience required — we&apos;ll train you from your first tournament.
          </p>
        </div>
      </section>
    </div>
  )
}
