import type { Metadata } from 'next'
import Image from 'next/image'
import { Star } from 'lucide-react'

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

      {/* Black Belts */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111111] mb-8">Black Belts</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-[#fafaf9] border border-black/5 p-5 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">Photo</span>
                </div>
                <p className="text-sm font-medium text-[#111111]">Member name</p>
                <p className="text-xs text-gray-400 mt-1">1st Dan · 2024</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-6">
            * Full hall of fame listing coming soon. Contact us if we&apos;re missing anyone.
          </p>
        </div>
      </section>

      {/* Honorary Black Belts */}
      <section className="bg-[#fafaf9] py-20 px-4 sm:px-6 lg:px-8">
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
              <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3">
                <Image
                  src="/hall-of-fame/richard-dahler.webp"
                  alt="Richard Dahler"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm font-semibold text-[#111111]">Richard Dahler</p>
              <p className="text-xs text-[#dc2626] mt-1 font-medium">Honorary Black Belt</p>
              <p className="text-xs text-gray-400 mt-0.5">5 Jan 2001</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
