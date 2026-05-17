import Link from 'next/link'
import { Globe, Share2, Play } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="font-bold text-lg mb-3">
              <span className="text-[#dc2626]">FORZA</span>
              <span className="text-white"> KARATE CLUB</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              Developing champions on and off the mat. FKA affiliated. Established with purpose.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                href="#"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-[#dc2626] hover:text-white transition-colors"
              >
                <Globe className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-[#dc2626] hover:text-white transition-colors"
              >
                <Share2 className="h-4 w-4" />
              </a>
              <a
                href="#"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-[#dc2626] hover:text-white transition-colors"
              >
                <Play className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Training */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Training</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/classes" className="hover:text-white transition-colors">Classes</Link></li>
              <li><Link href="/classes/ninjas" className="hover:text-white transition-colors">Forza Ninjas</Link></li>
              <li><Link href="/classes/juniors" className="hover:text-white transition-colors">Forza Juniors</Link></li>
              <li><Link href="/classes/seniors" className="hover:text-white transition-colors">Forza Club</Link></li>
              <li><Link href="/gradings" className="hover:text-white transition-colors">Gradings</Link></li>
              <li><Link href="/calendar" className="hover:text-white transition-colors">Calendar</Link></li>
            </ul>
          </div>

          {/* Club */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Club</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/instructors" className="hover:text-white transition-colors">Instructors</Link></li>
              <li><Link href="/team" className="hover:text-white transition-colors">Team Forza</Link></li>
              <li><Link href="/hall-of-fame" className="hover:text-white transition-colors">Hall of Fame</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link href="/join" className="hover:text-white transition-colors">Join Today</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Info</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/dojos/rayleigh" className="hover:text-white transition-colors">Rayleigh Dojo</Link></li>
              <li><Link href="/dojos/upminster" className="hover:text-white transition-colors">Upminster Dojo</Link></li>
              <li><Link href="/safeguarding" className="hover:text-white transition-colors">Safeguarding</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>© 2012 – 2026 Forza Karate Club. All rights reserved.</p>
          <p>FKA (Frontier Karate Association) Affiliated</p>
        </div>
      </div>
    </footer>
  )
}
