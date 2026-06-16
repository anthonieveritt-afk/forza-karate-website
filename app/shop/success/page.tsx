import Link from 'next/link'
import { CheckCircle, Shield, CreditCard, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Order Confirmed — Forza Karate Shop' }

const nextSteps = [
  {
    icon: Shield,
    step: 'Step 2',
    title: 'Apply for your licence & insurance',
    desc: 'All members need a valid FKA licence. Takes a few minutes online.',
    href: '/join/apply-licence',
    cta: 'Apply for Licence →',
    primary: true,
  },
  {
    icon: CreditCard,
    step: 'Step 3',
    title: 'Set up your Direct Debit',
    desc: 'Pay monthly via GoCardless. Safe, easy, cancel anytime.',
    href: 'https://pay.gocardless.com/AL00041KG22CVH',
    cta: 'Set up Direct Debit →',
    primary: false,
  },
]

export default function SuccessPage() {
  return (
    <div className="bg-white min-h-screen px-4 py-20">
      <div className="max-w-lg mx-auto">
        {/* Confirmation */}
        <div className="text-center mb-12">
          <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-[#111111] mb-3">Order confirmed!</h1>
          <p className="text-gray-500 leading-relaxed">
            Thanks for your order. You&apos;ll receive a confirmation email shortly.
            We&apos;ll be in touch when your kit is ready to collect at class.
          </p>
        </div>

        {/* Next steps */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">What&apos;s next</span>
          </div>
          <div className="space-y-3">
            {nextSteps.map((s) => (
              <Link
                key={s.step}
                href={s.href}
                target={s.href.startsWith('http') ? '_blank' : undefined}
                rel={s.href.startsWith('http') ? 'noopener noreferrer' : undefined}

                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all group ${
                  s.primary
                    ? 'bg-[#dc2626] border-[#dc2626] hover:bg-[#b91c1c]'
                    : 'bg-white border-black/8 hover:border-black/20'
                }`}
              >
                <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                  s.primary ? 'bg-white/20' : 'bg-[#fafaf9]'
                }`}>
                  <s.icon className={`h-5 w-5 ${s.primary ? 'text-white' : 'text-[#dc2626]'}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-medium mb-0.5 ${s.primary ? 'text-white/70' : 'text-[#dc2626]'}`}>{s.step}</p>
                  <p className={`text-sm font-semibold leading-tight ${s.primary ? 'text-white' : 'text-[#111111]'}`}>{s.title}</p>
                  <p className={`text-xs mt-0.5 ${s.primary ? 'text-white/80' : 'text-gray-400'}`}>{s.desc}</p>
                </div>
                <ArrowRight className={`h-4 w-4 flex-shrink-0 ${s.primary ? 'text-white' : 'text-gray-400 group-hover:text-[#111111]'}`} />
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link href="/shop" className="text-sm text-gray-400 hover:text-[#111111] transition-colors">
            ← Back to Shop
          </Link>
        </div>
      </div>
    </div>
  )
}
