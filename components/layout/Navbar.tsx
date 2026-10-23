'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Menu, X, ChevronDown, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { membersCoreLinks, membersEventLinks as eventLinks, externalProps } from '@/lib/members/links'

/** Public primary nav — brief order. Members tools live in the Members menu. */
const publicLinks = [
  { href: '/classes', label: 'Classes' },
  { href: '/dojos', label: 'Locations & Times' },
  { href: '/why-karate', label: 'Why Forza?' },
  { href: '/instructors', label: 'Meet the Coaches' },
]

const membersExtraLinks = [
  { href: '/downloads', label: 'Downloads' },
  { href: '/shop', label: 'Shop' },
  { href: '/dojo-dash', label: 'Dojo Dash' },
  { href: '/gradings', label: 'Belt grading info' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [eventsOpen, setEventsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-black/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 py-2">
          <Link href="/" className="flex items-center shrink-0">
            <Image
              src="/forza-logo.webp"
              alt="Forza Karate Club"
              width={200}
              height={80}
              className="h-10 md:h-12 w-auto max-w-[180px] object-contain"
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-6" aria-label="Primary">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-[#111111] transition-colors"
              >
                {link.label}
              </Link>
            ))}

            <div className="relative group">
              <button
                type="button"
                className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-[#111111] transition-colors"
                aria-haspopup="true"
              >
                Members <ChevronDown className="h-3.5 w-3.5 mt-0.5" aria-hidden />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-black/8 rounded-xl shadow-lg overflow-visible opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                {membersCoreLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    {...externalProps(link)}
                    className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-[#fafaf9] hover:text-[#dc2626] transition-colors"
                  >
                    {link.label}
                    {link.external && <span aria-hidden> ↗</span>}
                  </Link>
                ))}
                {membersExtraLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-[#fafaf9] hover:text-[#dc2626] transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="relative group/events border-t border-black/5">
                  <button
                    type="button"
                    className="w-full flex items-center justify-between px-4 py-2.5 text-sm text-gray-600 hover:bg-[#fafaf9] hover:text-[#dc2626] transition-colors"
                  >
                    <span className="flex items-center gap-1">
                      <ChevronLeft className="h-3.5 w-3.5" aria-hidden />
                      Events
                    </span>
                  </button>
                  <div className="absolute right-full top-0 mr-1 w-64 bg-white border border-black/8 rounded-xl shadow-lg overflow-hidden opacity-0 invisible group-hover/events:opacity-100 group-hover/events:visible transition-all duration-150">
                    {eventLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        {...externalProps(link)}
                        className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-[#fafaf9] hover:text-[#dc2626] transition-colors"
                      >
                        {link.label}
                        {link.external && <span aria-hidden> ↗</span>}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            {/* Mobile / tablet trial — in header, not floating over content */}
            <Button asChild size="sm" className="lg:hidden">
              <Link href="/trial-class">Book a Trial</Link>
            </Button>
            <div className="hidden lg:block">
              <Button asChild size="sm">
                <Link href="/trial-class">Book a Trial</Link>
              </Button>
            </div>
            <button
              type="button"
              className="lg:hidden p-2.5 min-h-11 min-w-11 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden border-t border-black/8 bg-white max-h-[min(80vh,640px)] overflow-y-auto">
          <div className="px-4 py-4 flex flex-col gap-1">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-[#111111] py-3 min-h-11 transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-2 border-t border-black/5 mt-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider py-2">Members</p>
              {membersCoreLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  {...externalProps(link)}
                  className="block text-sm font-medium text-gray-600 hover:text-[#dc2626] py-2.5 min-h-11 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                  {link.external && <span aria-hidden> ↗</span>}
                </Link>
              ))}
              {membersExtraLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm font-medium text-gray-600 hover:text-[#dc2626] py-2.5 min-h-11 transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <button
                type="button"
                className="w-full flex items-center justify-between text-sm font-medium text-gray-600 py-2.5 mt-1 min-h-11"
                onClick={() => setEventsOpen(!eventsOpen)}
                aria-expanded={eventsOpen}
              >
                <span>Events</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${eventsOpen ? 'rotate-180' : ''}`} />
              </button>
              {eventsOpen && (
                <div className="pl-3 border-l border-black/8 ml-1 mt-1 space-y-1">
                  {eventLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      {...externalProps(link)}
                      className="block text-sm text-gray-500 hover:text-[#dc2626] py-2 min-h-11 transition-colors"
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                      {link.external && <span aria-hidden> ↗</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3">
              <Button asChild size="sm" className="w-full">
                <Link href="/trial-class" onClick={() => setOpen(false)}>
                  Book a Trial
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
