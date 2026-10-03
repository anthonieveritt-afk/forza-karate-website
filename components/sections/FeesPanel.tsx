import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { MEMBERSHIP_FEES, TRIAL_HREF } from '@/lib/site'

export default function FeesPanel({ heading = 'Fees' }: { heading?: string }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#111111] mb-4">{heading}</h2>
      <p className="text-gray-500 max-w-2xl mb-8">
        Your first class is free. Membership fees are charged annually, payable in 12 monthly
        instalments on the 1st of each month by Direct Debit. One calendar month&apos;s paid notice
        is required to cancel.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl">
        {MEMBERSHIP_FEES.map((fee) => (
          <div key={fee.key} className="rounded-2xl bg-white border border-black/8 p-6">
            <p className="text-sm font-semibold text-[#111111] mb-2">{fee.label}</p>
            <p className="text-3xl font-bold text-[#111111]">
              {fee.price}
              <span className="text-sm font-medium text-gray-400"> {fee.period}</span>
            </p>
            <p className="text-xs text-gray-500 mt-2">{fee.note}</p>
          </div>
        ))}
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-8">
        <Button asChild>
          <Link href={TRIAL_HREF}>
            Book a free trial
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Link href="/membership-terms" className="text-sm text-gray-500 hover:text-[#dc2626] underline underline-offset-4">
          Read the membership terms
        </Link>
      </div>
    </div>
  )
}
