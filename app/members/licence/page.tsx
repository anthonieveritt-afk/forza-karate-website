import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, CreditCard, ArrowRight } from 'lucide-react'
import MembersArea from '@/components/members/MembersArea'
import { requireMemberPage } from '@/lib/members/require'

// Members only: render per request, never from a static/shared cache.
export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Renew Your Licence — Members',
  description: 'Renew your FKA licence and insurance as a Forza Karate Club member.',
  robots: { index: false, follow: false },
}

const steps = [
  {
    icon: Shield,
    title: 'Apply for / renew your licence & insurance',
    desc: 'All active members require a valid FKA licence and insurance. Renew annually to stay covered.',
    href: '/join/apply-licence',
    cta: 'Apply / Renew Licence',
  },
  {
    icon: CreditCard,
    title: 'Set up or update your Direct Debit',
    desc: 'Pay your monthly club fees by Direct Debit via GoCardless. Safe, easy, cancel anytime.',
    href: '/join/membership',
    cta: 'Set up Direct Debit',
  },
]

export default async function MembersLicencePage() {
  // Defence in depth: middleware already sends logged-out visitors to the login page,
  // but the page checks the Club Honbu session itself too.
  await requireMemberPage('/members/licence')

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <MembersArea>
        <div className="max-w-2xl">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-[#dc2626]" />
              <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Members</span>
            </div>
            <h1 className="text-4xl font-bold text-[#111111] mb-2">Renew your licence</h1>
            <p className="text-gray-500">Keep your FKA licence and club membership active for the new season.</p>
          </div>

          <div className="space-y-4">
            {steps.map((step, i) => (
              <Link
                key={i}
                href={step.href}
                className="flex items-start gap-4 p-5 rounded-2xl border border-black/8 hover:border-[#dc2626] hover:shadow-sm transition-all group bg-white"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <step.icon className="h-5 w-5 text-[#dc2626]" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#111111] text-sm mb-1">{step.title}</p>
                  <p className="text-xs text-gray-500 mb-2">{step.desc}</p>
                  <span className="text-xs font-semibold text-[#dc2626] group-hover:underline flex items-center gap-1">
                    {step.cta}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#dc2626] flex-shrink-0 mt-3 transition-colors" />
              </Link>
            ))}
          </div>


        </div>
      </MembersArea>
    </div>
  )
}
