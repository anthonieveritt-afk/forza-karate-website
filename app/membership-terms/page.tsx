import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import PageHeader from '@/components/sections/PageHeader'
import TrialCta from '@/components/sections/TrialCta'
import { MEMBERSHIP_FEES } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Membership Terms',
  description: 'Forza Karate Club membership terms: fees, notice, refunds, absences and licences.',
}

const sections: { title: string; items: React.ReactNode[] }[] = [
  {
    title: 'Fees and payments',
    items: [
      'Membership fees are charged annually and paid in 12 monthly instalments.',
      'Your first payment covers you for your first month.',
      'Future payments are made by Direct Debit and must arrive in our bank account on the 1st of each month.',
      'Your membership allows you to train at any Forza Karate Club dojo on our timetable.',
      'The family discount is for immediate family (parent and child or children) registering together. Extended family members (cousins, aunts, uncles, grandparents) are not eligible.',
    ],
  },
  {
    title: 'Cancelling your membership',
    items: [
      'To cancel, you must give your instructor one calendar month’s paid notice in writing.',
      'We do not accept payment breaks.',
      'No refunds will be issued for any reason.',
    ],
  },
  {
    title: 'Absences',
    items: [
      'If a student under 18 is going to miss a class, their parent or guardian must let the club instructor know before the class.',
      'If you miss 4 weeks of training in a row without telling the club instructor, the monthly fee is still payable on your return for any unpaid period.',
      'If you miss 8 weeks of training in a row without telling the club instructor, we will assume you have left. If you want to come back, you will need to rejoin as a new member.',
    ],
  },
  {
    title: 'Cancelled classes',
    items: [
      'If a physical class is cancelled because of a hall booking error, an emergency, illness or a pandemic, we will put online classes in place, and these are to be attended until normal classes resume.',
    ],
  },
  {
    title: 'Licence and insurance',
    items: [
      <>Every member needs a valid, up-to-date licence. It is the student’s responsibility (or the parent’s, if the student is under 18) to make sure one has been applied for by the 2nd lesson. <Link href="/join/apply-licence" className="text-[#dc2626] hover:underline">Apply for your licence</Link>.</>,
    ],
  },
  {
    title: 'Club rules',
    items: [
      <>All members must follow the <Link href="/club-rules" className="text-[#dc2626] hover:underline">club rules and dojo etiquette</Link>, including the uniform and equipment rules.</>,
      'If these terms are not followed, we will cancel your membership.',
    ],
  },
]

export default function MembershipTermsPage() {
  return (
    <div className="bg-white">
      <PageHeader
        eyebrow="Join"
        title="Membership terms"
        intro="Please read these terms before you enrol. They apply to every Forza Karate Club member."
      />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            {sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-2xl font-bold text-[#111111] mb-5">{section.title}</h2>
                <ul className="space-y-3">
                  {section.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-[#dc2626] mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <aside>
            <div className="rounded-2xl bg-[#fafaf9] border border-black/5 p-6 lg:sticky lg:top-28">
              <h2 className="text-lg font-bold text-[#111111] mb-4">Monthly fees</h2>
              <ul className="space-y-3">
                {MEMBERSHIP_FEES.map((fee) => (
                  <li key={fee.key} className="flex items-baseline justify-between gap-4 text-sm">
                    <span className="text-gray-600">{fee.label}</span>
                    <span className="font-semibold text-[#111111]">{fee.price}/mo</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-400 mt-4">Term time only — 40 weeks per year. Your first class is free.</p>
            </div>
          </aside>
        </div>
      </section>

      <TrialCta />
    </div>
  )
}
