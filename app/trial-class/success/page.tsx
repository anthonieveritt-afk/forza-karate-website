import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { getForzaStripe } from '@/lib/paid/stripe'
import { gbp } from '@/lib/paid/catalogue'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = { title: 'Trial Class Booked — Forza Karate', robots: { index: false } }
export const dynamic = 'force-dynamic'

export default async function TrialSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams
  let paid = false, who = '', where = '', amount = ''
  const stripe = getForzaStripe()
  if (stripe && session_id) {
    try {
      const s = await stripe.checkout.sessions.retrieve(session_id)
      paid = s.payment_status === 'paid' && s.metadata?.kind === 'trial'
      who = s.metadata?.childName || s.metadata?.parentName || ''
      where = [s.metadata?.ageGroup, s.metadata?.dojo].filter(Boolean).join(' at ')
      amount = gbp(s.amount_total ?? 0)
    } catch { /* fall through */ }
  }
  return (
    <div className="bg-white min-h-screen px-4 py-20">
      <div className="max-w-lg mx-auto text-center">
        {paid ? (
          <>
            <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-[#111111] mb-3">You&apos;re booked in{who ? `, ${who.split(' ')[0]}` : ''}!</h1>
            <p className="text-gray-500 leading-relaxed mb-2">Thanks — your {amount} trial class payment went through{where ? ` for ${where}` : ''}.</p>
            <p className="text-gray-500 leading-relaxed mb-8">We&apos;ll be in touch within 72 hours to confirm your class time. Just wear something comfy — no kit needed. Come and try it out, then ask questions!</p>
          </>
        ) : (
          <>
            <AlertCircle className="h-14 w-14 text-amber-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-[#111111] mb-3">We couldn&apos;t confirm your payment</h1>
            <p className="text-gray-500 leading-relaxed mb-8">If you were charged, don&apos;t worry — we&apos;ll still have your booking. Otherwise please try again or get in touch.</p>
          </>
        )}
        <div className="flex gap-3 justify-center">
          <Button asChild><Link href="/classes">See class times</Link></Button>
          <Button asChild variant="outline"><Link href="/contact">Contact us</Link></Button>
        </div>
      </div>
    </div>
  )
}
