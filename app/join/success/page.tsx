import Link from 'next/link'
import { CheckCircle, ArrowRight, ShoppingBag, CreditCard, Shield } from 'lucide-react'

const nextSteps = [
  {
    icon: ShoppingBag,
    title: 'Order your official karate suit',
    desc: '2020 Forza Karate Gi — £40. Embroidered with the club logo.',
    href: 'https://forzakarate.co.uk/shop/2020ForzaKarateGi-p223518731',
    cta: 'Order Gi →',
  },
  {
    icon: Shield,
    title: 'Apply for your licence & insurance',
    desc: 'All members need an FKA licence. Takes a few minutes to complete.',
    href: 'https://forzakarate.co.uk/apply-for-your-first-licence/',
    cta: 'Apply for Licence →',
  },
  {
    icon: CreditCard,
    title: 'Set up your Direct Debit',
    desc: 'Pay monthly via GoCardless. Safe, easy, cancel anytime.',
    href: 'https://pay.gocardless.com/AL00041KG22CVH',
    cta: 'Set up Direct Debit →',
  },
]

export default function JoinSuccessPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">

          <div className="text-center mb-12">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-[#111111] mb-2">Enrolment received!</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Thank you — we'll be in touch shortly to confirm your place. In the meantime, get ahead with the steps below.
            </p>
          </div>

          <h3 className="text-lg font-bold text-[#111111] mb-5">Complete your membership</h3>
          <div className="space-y-4">
            {nextSteps.map((step, i) => (
              <a key={i} href={step.href} target="_blank" rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 rounded-2xl border border-black/8 hover:border-[#dc2626] hover:shadow-sm transition-all group">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <step.icon className="h-5 w-5 text-[#dc2626]" />
                </div>
                <div className="flex-1">
                  <span className="text-xs font-bold text-[#dc2626] bg-red-50 px-2 py-0.5 rounded-full">Step {i + 1}</span>
                  <p className="font-semibold text-[#111111] text-sm mt-1 mb-1">{step.title}</p>
                  <p className="text-xs text-gray-500 mb-2">{step.desc}</p>
                  <span className="text-xs font-semibold text-[#dc2626] group-hover:underline">{step.cta}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#dc2626] flex-shrink-0 mt-3 transition-colors" />
              </a>
            ))}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-[#fafaf9] border border-black/6 text-xs text-gray-500 leading-relaxed">
            <strong className="text-[#111111]">Family discount</strong> — available for immediate family (parent + child/children) registering together. Extended family members (cousins, aunts, uncles, grandparents) are not eligible.
          </div>

          <div className="mt-8 text-center">
            <Link href="/join" className="text-sm text-gray-400 hover:text-[#dc2626] transition-colors">
              ← Back to enrolment form
            </Link>
          </div>

        </div>
      </section>
    </div>
  )
}
