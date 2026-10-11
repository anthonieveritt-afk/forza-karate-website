import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'

export function DraftNote({ children }: { children: ReactNode }) {
  return (
    <span className="block mt-1 rounded-md bg-amber-100 border border-amber-300 text-amber-900 text-xs px-2 py-1">
      <strong>DRAFT, TO CONFIRM BY ANTHONI:</strong> {children}
    </span>
  )
}

export function MembersShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <header className="bg-white border-b border-black/10 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto h-16 flex items-center justify-between gap-3">
          <Link href="/"><Image src="/forza-logo.webp" alt="Forza Karate Club" width={120} height={48} className="h-10 w-auto" /></Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/members/syllabus/full" className="text-[#dc2626] font-medium hover:underline">Syllabus</Link>
            <Link href="/members/portal" className="text-gray-600 hover:underline">Members area</Link>
          </nav>
        </div>
      </header>
      <div className="bg-amber-400 text-[#111111] text-center text-xs font-bold tracking-widest py-1">DRAFT SYLLABUS: NOT YET CONFIRMED</div>
      <main className="py-10 px-4 sm:px-6"><div className="max-w-4xl mx-auto">{children}</div></main>
    </div>
  )
}
