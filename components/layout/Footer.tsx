import type { SVGProps } from 'react'
import Link from 'next/link'

function IconInstagram(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}
function IconFacebook(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  )
}
function IconYoutube(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="#0a0a0a" />
    </svg>
  )
}

const SOCIALS = [
  { href: 'https://www.instagram.com/forzakarateclub', label: 'Instagram', Icon: IconInstagram },
  { href: 'https://www.facebook.com/Forzakarateuk/', label: 'Facebook', Icon: IconFacebook },
  { href: 'https://www.youtube.com/c/Forzakarate', label: 'YouTube', Icon: IconYoutube },
] as const

export default function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-1">
            <div className="font-bold text-lg mb-3">
              <span className="text-[#dc2626]">FORZA</span>
              <span className="text-white"> KARATE CLUB</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-500">
              Developing champions on and off the mat. FKA affiliated. Established with purpose.
            </p>
            <div className="flex gap-3 mt-5">
              {SOCIALS.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center hover:border-[#dc2626] hover:text-white transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

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

          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Club</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/team" className="hover:text-white transition-colors">Team Forza</Link></li>
              <li><Link href="/instructors" className="hover:text-white transition-colors">Instructors</Link></li>
              <li><Link href="/hall-of-fame" className="hover:text-white transition-colors">Hall of Fame</Link></li>
              <li><Link href="/gallery" className="hover:text-white transition-colors">Gallery</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors">Shop</Link></li>
              <li><Link href="/join" className="hover:text-white transition-colors">Join Today</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold text-sm mb-4">Info</h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/dojos/rayleigh" className="hover:text-white transition-colors">Rayleigh Dojo</Link></li>
              <li><Link href="/dojos/upminster" className="hover:text-white transition-colors">Upminster Dojo</Link></li>
              <li><Link href="/safeguarding" className="hover:text-white transition-colors">Safeguarding</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
              <li><Link href="/admin" className="hover:text-white transition-colors">Club Management</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          <p>© 2012 – 2026 Forza Karate Club. All rights reserved.</p>
          <p>FKA (Frontier Karate Association) Affiliated</p>
        </div>
      </div>
    </footer>
  )
}
