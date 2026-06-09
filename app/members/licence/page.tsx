import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/Button'
import { logoutMembers } from '@/app/actions/members-auth'
import { Shield, ExternalLink, CreditCard, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Renew Your Licence — Members',
  description: 'Renew your FKA licence and insurance as a Forza Karate Club member.',
}

const steps = [
  {
    icon: Shield,
    title: 'Apply for / renew your licence & insurance',
    desc: 'All active members require a valid FKA licence and insurance. Renew annually to stay covered.',
    href: 'https://forza-karate-website.vercel.app/join',
    cta: 'Apply / Renew Licence',
  },
  {
    icon: CreditCard,
    title: 'Set up or update your Direct Debit',
    desc: 'Pay your monthly club fees by Direct Debit via GoCardless. Safe, easy, cancel anytime.',
    href: 'https://forza-karate-website.vercel.app/join',
    cta: 'Set up Direct Debit',
  },
]

export default function MembersLicencePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Members header */}
      <header className="bg-white border-b border-black/8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto h-16 flex items-center justify-between">
          <Link href="/">
            <Image src="/forza-logo.webp" alt="Forza Karate Club" width={120} height={48} className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/members/grading" className="text-sm text-gray-500 hover:text-[#111111] transition-colors">Register to Grade</Link>
            <Link href="/members/syllabus" className="text-sm text-gray-500 hover:text-[#111111] transition-colors">Syllabus</Link>
            <span className="text-gray-300">|</span>
            <form action={logoutMembers}>
              <Button type="submit" variant="outline" size="sm">Log out</Button>
            </form>
          </div>
        </div>
      </header>

      <main className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
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
              <a
                key={i}
                href={step.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 rounded-2xl border border-black/8 hover:border-[#dc2626] hover:shadow-sm transition-all group bg-white"
              >
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <step.icon className="h-5 w-5 text-[#dc2626]" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#111111] text-sm mb-1">{step.title}</p>
                  <p className="text-xs text-gray-500 mb-2">{step.desc}</p>
                  <span className="text-xs font-semibold text-[#dc2626] group-hover:underline flex items-center gap-1">
                    {step.cta} <ExternalLink className="h-3 w-3" />
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#dc2626] flex-shrink-0 mt-3 transition-colors" />
              </a>
            ))}
          </div>


        </div>
      </main>
    </div>
  )
}
