'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState, useRef } from 'react'
import { Menu, X, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'

const navLinks = [
  { href: '/classes', label: 'Classes' },
  { href: '/dojos', label: 'Dojos' },
  { href: '/gradings', label: 'Gradings' },
  { href: '/team', label: 'Team' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/shop', label: 'Shop' },
]

const membersLinks = [
  { href: '/members/grading',          label: 'Register to Grade' },
  { href: '/members/syllabus',          label: 'Syllabus' },
  { href: '/members/licence',           label: 'Renew your licence' },
  { href: 'https://f8s.co/26cd',        label: 'Register for Super Champs',       external: true },
  { href: 'https://f8s.co/21zc',        label: 'Register for Preparation Training', external: true },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-black/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src="/forza-logo.webp"
              alt="Forza Karate Club"
              width={120}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-[#111111] transition-colors"
              >
                {link.label}
              </Link>
            ))}
            {/* Members dropdown */}
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-[#111111] transition-colors">
                Members
                <ChevronDown className="h-3.5 w-3.5 mt-0.5" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-56 bg-white border border-black/8 rounded-xl shadow-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-50">
                {membersLinks.map((link) =>
                  link.external ? (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-[#fafaf9] hover:text-[#dc2626] transition-colors"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="block px-4 py-2.5 text-sm text-gray-600 hover:bg-[#fafaf9] hover:text-[#dc2626] transition-colors"
                    >
                      {link.label}
                    </Link>
                  )
                )}
              </div>
            </div>
          </nav>

          {/* CTA */}
          <div className="hidden md:block">
            <Button asChild size="sm">
              <Link href="/trial-class">Book Free Trial</Link>
            </Button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="md:hidden border-t border-black/8 bg-white">
          <div className="px-4 py-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-[#111111] py-1 transition-colors"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-1 border-t border-black/5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-0 py-2">Members</p>
              {membersLinks.map((link) =>
                link.external ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-sm font-medium text-gray-600 hover:text-[#dc2626] py-1 transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block text-sm font-medium text-gray-600 hover:text-[#dc2626] py-1 transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
              )}
            </div>
            <div className="pt-2">
              <Button asChild size="sm" className="w-full">
                <Link href="/trial-class" onClick={() => setOpen(false)}>
                  Book Free Trial
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
