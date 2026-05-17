import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import GradingRegForm from '@/components/forms/GradingRegForm'
import { logoutMembers } from '@/app/actions/members-auth'

export const metadata: Metadata = {
  title: 'Register for Grading — Members',
  description: 'Register for your next belt grading at Forza Karate Club.',
}

export default function MembersGradingPage() {
  return (
    <div className="min-h-screen bg-[#fafaf9]">
      {/* Members header */}
      <header className="bg-white border-b border-black/8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto h-16 flex items-center justify-between">
          <Link href="/">
            <Image src="/forza-logo.webp" alt="Forza Karate Club" width={120} height={48} className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Members area</span>
            <form action={logoutMembers}>
              <Button type="submit" variant="outline" size="sm">Log out</Button>
            </form>
          </div>
        </div>
      </header>

      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
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
      </main>
    </div>
  )
}
