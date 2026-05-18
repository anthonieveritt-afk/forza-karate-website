import type { Metadata } from 'next'
import { Trophy } from 'lucide-react'
import TeamBanner from '@/components/sections/TeamBanner'

export const metadata: Metadata = {
  title: 'Team Forza',
  description: 'Meet Team Forza — our competitive kata and kumite teams representing Forza Karate Club at regional and national level.',
}

export default function TeamPage() {
  return (
    <div className="bg-white">
      {/* Scrolling photo banner */}
      <TeamBanner />



      {/* Kata Team */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="h-5 w-5 text-[#dc2626]" />
                <h2 className="text-2xl font-bold text-[#111111]">Kata Team</h2>
              </div>
              <p className="text-gray-500 leading-relaxed mb-6">
                Our kata team competes at WKF-aligned events across the region and nationally.
                Team members are selected based on technical ability, consistency of performance,
                and competition experience.
              </p>
              <p className="text-gray-500 leading-relaxed">
                We field individual, pair, and team kata competitors across all age categories.
              </p>

              {/* Placeholder team members */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl bg-[#fafaf9] border border-black/5 p-4 text-center">
                    <div className="w-full aspect-[3/4] rounded-2xl bg-gray-100 mb-3 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Photo</span>
                    </div>
                    <p className="text-xs font-medium text-[#111111]">Team member</p>
                    <p className="text-xs text-gray-400">Kata</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="h-5 w-5 text-[#dc2626]" />
                <h2 className="text-2xl font-bold text-[#111111]">Kumite Team</h2>
              </div>
              <p className="text-gray-500 leading-relaxed mb-6">
                Our kumite team competes across multiple weight and age categories at WKF-aligned
                events. Training is structured, strategic, and high-intensity.
              </p>
              <p className="text-gray-500 leading-relaxed">
                Competition prep includes sparring, tactical coaching, and conditioning — all within
                the regular club schedule.
              </p>

              {/* Placeholder team members */}
              <div className="mt-8 grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="rounded-2xl bg-[#fafaf9] border border-black/5 p-4 text-center">
                    <div className="w-full aspect-[3/4] rounded-2xl bg-gray-100 mb-3 flex items-center justify-center">
                      <span className="text-gray-400 text-xs">Photo</span>
                    </div>
                    <p className="text-xs font-medium text-[#111111]">Team member</p>
                    <p className="text-xs text-gray-400">Kumite</p>
                  </div>
                ))}
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
