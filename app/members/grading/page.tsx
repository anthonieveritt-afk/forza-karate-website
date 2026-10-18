import type { Metadata } from 'next'
import GradingRegForm from '@/components/forms/GradingRegForm'
import MembersArea from '@/components/members/MembersArea'
import { requireMemberPage } from '@/lib/members/require'

// Members only (gated in middleware): render per request, never from a static/shared cache.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Register for Grading — Members',
  description: 'Register for your next belt grading at Forza Karate Club.',
}

export default async function MembersGradingPage() {
  await requireMemberPage('/members/grading')
  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <MembersArea>
        <div className="max-w-3xl">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-[#dc2626]" />
              <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Members</span>
            </div>
            <h1 className="text-4xl font-bold text-[#111111] mb-2">Register for grading</h1>
            <p className="text-gray-500">
              Submit your grading registration below. Your instructor will confirm your place.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-black/8 p-8 shadow-sm">
            <GradingRegForm />
          </div>
        </div>
      </MembersArea>
    </div>
  )
}
