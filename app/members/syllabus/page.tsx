import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Syllabus — Members',
  description: 'Forza Karate Club grading syllabus for members.',
}

export default function MembersSyllabusPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9]">

      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-[#dc2626]" />
              <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Members</span>
            </div>
            <h1 className="text-4xl font-bold text-[#111111] mb-2">Syllabus</h1>
            <p className="text-gray-500">Grading requirements and techniques for each belt level.</p>
          </div>

          <div className="bg-white rounded-2xl border border-black/8 p-8 shadow-sm">
            <p className="text-gray-600 mb-6">View or download the Forza Karate Club grading syllabus. Click the button below to open the interactive syllabus — you can fill it in and save as PDF.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button asChild>
                <a href="/forza-syllabus-template.html" target="_blank" rel="noopener noreferrer">Open Syllabus →</a>
              </Button>
              <Button asChild variant="outline">
                <Link href="/members/grading">Register to Grade →</Link>
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
