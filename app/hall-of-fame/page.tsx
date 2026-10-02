import type { Metadata } from 'next'
import Image from 'next/image'
import { Star, Medal, Trophy } from 'lucide-react'

// International honours, from the old site's "England Karate – Hall of fame" page
// (https://forzakarate.co.uk/hall-of-fame/) and Kobe's achievements page.
// Grades follow the new site where the two sites differ (Jade 4th Dan, Kobe 2nd Dan).
const honours = [
  {
    name: 'Jade Honeywood',
    grade: '4th Dan',
    photo: '/hall-of-fame/jade-honeywood-honours.webp',
    photoAlt: 'Jade Honeywood with her gold medal',
    honours: [
      'English Senior -68kg Champion — EKF, Sheffield 2022',
      '4 × British Champion — BKF',
      'England International and British International Open Champion',
      'England International Squad member 2006–2008',
      'Silver medallist, European Karate Federation, Izmir, Turkey 2007',
    ],
  },
  {
    name: 'Tom Gibbings',
    grade: '2nd Dan',
    photo: '/hall-of-fame/tom-gibbings.webp',
    photoAlt: 'Tom Gibbings on the podium in Trieste',
    honours: [
      'Gold medallist, 2005 Commonwealth Karate Championships, New Zealand',
      'Silver medallist, 2008 European Karate Federation Championships, Trieste, Italy',
      'England International',
      'Multiple English (EKGB) and BKF Champion',
      'English International Open Champion',
    ],
  },
  {
    name: 'Aaron Mclaughlin',
    grade: '1st Dan',
    photo: '/hall-of-fame/aaron-mclaughlin.webp',
    photoAlt: 'Aaron Mclaughlin with his WKF World Championships bronze medal, Greece 2001',
    honours: [
      'World bronze medallist — WKF 2001, Greece',
      'England International',
      'Multiple English and British Champion',
    ],
  },
  {
    name: 'Kobe Yogarajah',
    grade: '2nd Dan',
    photo: '/hall-of-fame/kobe-yogarajah-honours.webp',
    photoAlt: 'Kobe Yogarajah with his medal',
    honours: [
      'England Karate Team member',
      '2024 EKF Senior Junior -55kg bronze medallist',
      '2023 Orléans, France — Junior -55kg bronze medallist',
      '2022 Active Essex Young Sport Personality of the Year',
      '2022 Central England International Open — Junior -55kg Champion',
      '2022 Commonwealth Karate Federation — Cadet -52kg bronze medallist (England)',
      '2022 BKF 4 Nations Cadet -52kg Champion',
      'Southern England Regional Team member (bronze)',
      'EKF Team Kumite silver 2015 and bronze 2016',
    ],
  },
]

// Black belt photos from the old site's Black Belts page (https://forzakarate.co.uk/gallery/black-belts/).
const blackBelts = [
  { photo: '/gallery/archive/black-belts/01.webp', label: 'Latest black belts' },
  { photo: '/gallery/archive/black-belts/02.webp', label: 'Latest black belts' },
  { photo: '/gallery/archive/black-belts/03.webp', label: '2021 black belts' },
  { photo: '/gallery/archive/black-belts/04.webp', label: '2018 black belts' },
  { photo: '/gallery/archive/black-belts/05.webp', label: '2015 black belts' },
  { photo: '/gallery/archive/black-belts/06.webp', label: '2014 black belts' },
]

export const metadata: Metadata = {
  title: 'Hall of Fame',
  description: 'Celebrating the black belts and honorary black belts of Forza Karate Club.',
}

export default function HallOfFamePage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Hall of Fame</span>
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">Hall of Fame</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Celebrating those who have gone all the way — our black belts, honorary black belts,
            and the people who have shaped this club.
          </p>
        </div>
      </section>

      {/* International honours */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <Medal className="h-5 w-5 text-[#dc2626]" />
            <h2 className="text-2xl font-bold text-[#111111]">International honours</h2>
          </div>
          <p className="text-gray-500 mb-10 max-w-2xl">
            Forza karateka who have represented England and won titles on the national and international stage.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {honours.map((person) => (
              <div key={person.name} className="rounded-2xl bg-white border border-black/8 overflow-hidden flex flex-col">
                <div className="relative aspect-[16/10] bg-gray-100">
                  <Image
                    src={person.photo}
                    alt={person.photoAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-baseline justify-between gap-3 mb-4">
                    <h3 className="text-lg font-bold text-[#111111]">{person.name}</h3>
                    <span className="text-xs font-semibold text-[#dc2626] whitespace-nowrap">{person.grade}</span>
                  </div>
                  <ul className="space-y-2">
                    {person.honours.map((h) => (
                      <li key={h} className="flex items-start gap-2 text-sm text-gray-600">
                        <Trophy className="h-4 w-4 text-[#dc2626] mt-0.5 flex-shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Black Belts */}
      <section className="bg-[#fafaf9] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111111] mb-3">Black Belts</h2>
          <p className="text-gray-500 mb-10 max-w-2xl">
            Every Forza black belt has earned it on the mat. Here are our black belt gradings through the years.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {blackBelts.map((bb) => (
              <figure key={bb.photo} className="rounded-2xl bg-white border border-black/8 overflow-hidden">
                <div className="relative aspect-[4/3] bg-gray-100">
                  <Image
                    src={bb.photo}
                    alt={`Forza black belts — ${bb.label}`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="px-5 py-4 text-sm font-semibold text-[#111111]">{bb.label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Honorary Black Belts */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <Star className="h-5 w-5 text-[#dc2626]" />
            <h2 className="text-2xl font-bold text-[#111111]">Honorary Black Belts</h2>
          </div>
          <p className="text-gray-500 mb-8 max-w-2xl">
            Awarded to individuals who have made extraordinary contributions to Forza Karate Club
            or the wider karate community.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-w-2xl">
            <div className="rounded-2xl bg-white border border-black/8 p-5 text-center">
              <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                <Image
                  src="/hall-of-fame/richard-dahler.webp"
                  alt="Richard Dahler"
                  width={300}
                  height={400}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <p className="text-sm font-semibold text-[#111111]">Richard Dahler</p>
              <p className="text-xs text-[#dc2626] mt-1 font-medium">Honorary Black Belt</p>
              <p className="text-xs text-gray-400 mt-0.5">5 Jan 2001</p>
            </div>
            <div className="rounded-2xl bg-white border border-black/8 p-5 text-center">
              <div className="w-full aspect-[3/4] rounded-2xl overflow-hidden mb-4">
                <Image
                  src="/hall-of-fame/medhi-el-wahabi.webp"
                  alt="Medhi El-Wahabi"
                  width={300}
                  height={400}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <p className="text-sm font-semibold text-[#111111]">Medhi El-Wahabi</p>
              <p className="text-xs text-[#dc2626] mt-1 font-medium">Honorary Black Belt</p>
              <p className="text-xs text-gray-400 mt-0.5">14 Jun 2017</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
