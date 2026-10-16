'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { isMembersLoggedIn, logoutMembers } from '@/app/actions/members-auth'

const navLinks = [
  { href: '/classes',  label: 'Classes' },
  { href: '/dojos',    label: 'Dojos' },
  { href: '/gradings', label: 'Gradings' },
  { href: '/team',     label: 'Team' },
  { href: '/gallery',  label: 'Gallery' },
  { href: '/shop',     label: 'Shop' },
  { href: '/dojo-dash', label: 'Dojo Dash' },
  { href: '/faq',      label: 'FAQ' },
]

const membersLoginLink    = { href: '/members',        label: '🔐 Members Login' }
const membersDashboardLink = { href: '/members/portal', label: 'Members area' }

const membersCoreLinks = [
  { href: '/members/grading', label: 'Register to Grade' },
  // Syllabus hidden for now (Anthoni, Oct 2026) — re-add: { href: '/members/syllabus', label: 'Syllabus' },
  { href: '/members/licence',  label: 'Renew your licence' },
]

const eventLinks = [
  { href: '/register/super-champs',   label: 'Register for Super Champs' },
  { href: '/register/prep-training',  label: 'Register for Preparation Training' },
  { href: '/register/championships',  label: 'Register for Club Championships' },
  { href: '/register/invitational',   label: 'Register for Invitational Cup' },
]

export default function Navbar() {
  const [open, setOpen]         = useState(false)
  const [eventsOpen, setEventsOpen] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)
  const pathname = usePathname()

  // Re-check the members session on navigation (cookie is httpOnly, so ask the server)
  useEffect(() => {
    let live = true
    isMembersLoggedIn().then(v => { if (live) setLoggedIn(v) }).catch(() => {})
    return () => { live = false }
  }, [pathname])

  const membersLinks = [loggedIn ? membersDashboardLink : membersLoginLink, ...membersCoreLinks]

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-black/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-1">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/forza-logo.webp" alt="Forza Karate Club" width={200} height={80} className="h-[45px] md:h-[80px] w-auto object-contain" priority />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-gray-600 hover:text-[#111111] transition-colors">
                {link.label}
              </Link>
            ))}

            {/* Members dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-[#111111] transition-colors">
                Members <ChevronDown className="h-3.5 w-3.5 mt-0.5" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-black/8 rounded-xl shadow-lg overflow-visible opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">

                {/* Core links */}
                {membersLinks.map(link => (
                  <Link key={link.href} href={link.href} className={`block px-4 py-2.5 text-sm hover:bg-[#fafaf9] hover:text-[#dc2626] transition-colors ${pathname === link.href ? 'text-[#dc2626] font-medium' : 'text-gray-600'}`}>
                    {link.label}
                  </Link>
                ))}
                {loggedIn && (
                  <form action={logoutMembers}>
                    <button type="submit" className="w-full text-left px-4 py-2.5 text-sm text-gray-600 hover:bg-[#fafaf9] hover:text-[#dc2626] transition-colors">
                      Log out
                    </button>
                  </form>
                )}

                {/* Events sub-menu */}
                <div className="relative group/events border-t border-black/5">
                  <button className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 hover:bg-[#fafaf9] hover:text-[#dc2626] transition-colors">
                    Events <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                  <div className="absolute left-full top-0 ml-1 w-64 bg-white border border-black/8 rounded-xl shadow-lg overflow-hidden opacity-0 invisible group-hover/events:opacity-100 group-hover/events:visible transition-all duration-150">
                    {eventLinks.map(link => (
                      <Link key={link.href} href={link.href} className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-[#fafaf9] hover:text-[#dc2626] transition-colors">
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <Button asChild size="sm"><Link href="/trial-class">Book a Trial</Link></Button>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden border-t border-black/8 bg-white">
          <div className="px-4 py-4 flex flex-col gap-3">
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-gray-600 hover:text-[#111111] py-1 transition-colors" onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            ))}

            <div className="pt-1 border-t border-black/5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider py-2">Members</p>
              {membersLinks.map(link => (
                <Link key={link.href} href={link.href} className={`block text-sm font-medium hover:text-[#dc2626] py-1.5 transition-colors ${pathname === link.href ? 'text-[#dc2626]' : 'text-gray-600'}`} onClick={() => setOpen(false)}>
                  {link.label}
                </Link>
              ))}
              {loggedIn && (
                <form action={logoutMembers}>
                  <button type="submit" className="block text-sm font-medium text-gray-600 hover:text-[#dc2626] py-1.5 transition-colors" onClick={() => setOpen(false)}>
                    Log out
                  </button>
                </form>
              )}

              {/* Events accordion on mobile */}
              <button
                className="w-full flex items-center justify-between text-sm font-medium text-gray-600 py-1.5 mt-1"
                onClick={() => setEventsOpen(!eventsOpen)}
              >
                <span>Events</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${eventsOpen ? 'rotate-180' : ''}`} />
              </button>
              {eventsOpen && (
                <div className="pl-3 border-l border-black/8 ml-1 mt-1 space-y-1">
                  {eventLinks.map(link => (
                    <Link key={link.href} href={link.href} className="block text-sm text-gray-500 hover:text-[#dc2626] py-1 transition-colors" onClick={() => setOpen(false)}>
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2">
              <Button asChild size="sm" className="w-full">
                <Link href="/trial-class" onClick={() => setOpen(false)}>Book a Trial</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
