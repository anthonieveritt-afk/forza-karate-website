import type { Metadata } from 'next'
import { FirstBeltContent } from '@/components/syllabus/FirstBeltContent'

// Hidden draft: not in menu or sitemap, noindex until Anthoni confirms.
export const metadata: Metadata = {
  title: 'Syllabus',
  description: 'Forza Karate Club grading syllabus.',
  robots: { index: false, follow: false },
}

export default function SyllabusPage() {
  return (
    <main className="bg-[#fafaf9] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-0.5 bg-[#dc2626]" />
          <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Forza Karate Club</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#111111] mb-2">Syllabus</h1>
        <p className="text-gray-600 mb-10">What to learn for each stripe on your belt.</p>

        <FirstBeltContent />
      </div>
    </main>
  )
}
