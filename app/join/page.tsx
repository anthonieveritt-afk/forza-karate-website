import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { ArrowRight, CreditCard, Clock, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Join Today',
  description: 'Join Forza Karate Club. Annual membership payable in 12 monthly instalments via GoCardless Direct Debit.',
}

const details = [
  {
    icon: CreditCard,
    title: 'Annual membership',
    desc: 'Fees are charged annually, payable in 12 monthly instalments on the 1st of each month via GoCardless Direct Debit.',
  },
  {
    icon: Clock,
    title: 'One month notice',
    desc: 'One calendar month\'s written notice is required to cancel your membership.',
  },
  {
    icon: Shield,
    title: 'Fully insured',
    desc: 'All members are covered by Forza\'s full club insurance via our FKA affiliation.',
  },
]

export default function JoinPage() {
  return (
    <div className="bg-white">
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Membership</span>
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">Join Forza</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Ready to commit? Here&apos;s everything you need to know about becoming a member.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {details.map((detail) => (
              <div key={detail.title} className="p-6 rounded-2xl bg-[#fafaf9] border border-black/5">
                <detail.icon className="h-5 w-5 text-[#dc2626] mb-4" />
                <h3 className="font-bold text-[#111111] mb-2">{detail.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{detail.desc}</p>
              </div>
            ))}
          </div>

          {/* GoCardless note */}
          <div className="max-w-2xl">
            <div className="p-6 rounded-2xl border border-dashed border-black/15">
              <h2 className="font-bold text-[#111111] mb-2">Online enrolment — coming soon</h2>
              <p className="text-sm text-gray-500 mb-4">
                We&apos;re working on a seamless online enrolment system with GoCardless Direct Debit.
                For now, please book a free trial class and your instructor will walk you through
                the membership process in person.
              </p>
              <Button asChild>
                <Link href="/trial-class">
                  Start with a free trial
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
