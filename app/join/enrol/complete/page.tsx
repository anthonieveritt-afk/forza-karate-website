import Link from 'next/link'
import { CheckCircle, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Enrolment Complete — Forza Karate Club' }

export default function EnrolCompletePage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-[#111111] mb-3">You&apos;re in! 🥋</h1>
        <p className="text-gray-500 leading-relaxed mb-8">
          Your enrolment is complete. We&apos;ll be in touch shortly to confirm your first class.
          Your kit will be ready to collect at the dojo.
        </p>
        <div className="p-5 rounded-2xl bg-[#fafaf9] border border-black/8 text-left space-y-3 mb-8">
          <p className="text-sm font-semibold text-[#111111]">What happens next</p>
          <ul className="text-sm text-gray-500 space-y-2 list-disc list-inside">
            <li>You&apos;ll receive a confirmation email shortly</li>
            <li>Your instructor will be in touch to confirm your first class</li>
            <li>Your gi will be ready to collect at the dojo</li>
            <li>Monthly Direct Debit starts from the 1st of next month</li>
          </ul>
        </div>
        <div className="flex gap-3 flex-col sm:flex-row">
          <Link href="/join/apply-licence" className="inline-flex items-center justify-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold px-6 py-3 rounded-2xl transition-colors text-sm">
            Next: Apply for Licence
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/" className="inline-flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-[#111111] font-semibold px-6 py-3 rounded-2xl transition-colors text-sm">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
