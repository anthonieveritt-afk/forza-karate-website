import Link from 'next/link'
import { CheckCircle, AlertCircle, Shield, CreditCard, ArrowRight } from 'lucide-react'
import type { Metadata } from 'next'
import Stripe from 'stripe'

export const metadata: Metadata = { title: 'Your Order — Forza Karate Shop', robots: { index: false } }
export const dynamic = 'force-dynamic'

// The shop uses STRIPE_SECRET_KEY (see /api/checkout). Only show "confirmed" for a paid session from this site.
async function paidOrder(sessionId: string | undefined): Promise<{ paid: boolean; email?: string; amount?: string }> {
  const key = process.env.STRIPE_SECRET_KEY?.trim()
  if (!key || !sessionId || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) return { paid: false }
  try {
    const stripe = new Stripe(key, { apiVersion: '2026-04-22.dahlia' })
    const s = await stripe.checkout.sessions.retrieve(sessionId)
    const paid = s.payment_status === 'paid' && s.metadata?.source === 'forza-karate-website'
    return { paid, email: s.customer_details?.email ?? undefined, amount: s.amount_total != null ? `£${(s.amount_total / 100).toFixed(2)}` : undefined }
  } catch {
    return { paid: false }
  }
}

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
    href: '/join/membership',
    cta: 'Set up Direct Debit →',
    primary: false,
  },
]

export default async function SuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams
  const order = await paidOrder(session_id)
  if (!order.paid) {
    return (
      <div className="bg-white min-h-screen px-4 py-20">
        <div className="max-w-lg mx-auto text-center">
          <AlertCircle className="h-14 w-14 text-amber-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-[#111111] mb-3">We couldn&apos;t confirm your payment</h1>
          <p className="text-gray-500 leading-relaxed mb-8">If you were charged, don&apos;t worry: we&apos;ll still have your order. Otherwise please try again from the shop or get in touch.</p>
          <div className="flex gap-4 justify-center text-sm">
            <Link href="/shop" className="text-[#dc2626] font-medium">Back to the shop</Link>
            <Link href="/contact" className="text-gray-500">Contact us</Link>
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="bg-white min-h-screen px-4 py-20">
      <div className="max-w-lg mx-auto">
        {/* Confirmation */}
        <div className="text-center mb-12">
          <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-[#111111] mb-3">Order confirmed!</h1>
          <p className="text-gray-500 leading-relaxed">
            Thanks for your order{order.amount ? ` — your ${order.amount} payment went through` : ''}.
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
