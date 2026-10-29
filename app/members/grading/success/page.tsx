import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { getForzaStripe } from '@/lib/paid/stripe'
import { gbp } from '@/lib/paid/catalogue'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = { title: 'Grading Registered — Forza Karate', robots: { index: false } }
export const dynamic = 'force-dynamic'

export default async function GradingSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams
  let paid = false, who = '', what = '', amount = ''
  const stripe = getForzaStripe()
  if (stripe && session_id) {
    try {
      const s = await stripe.checkout.sessions.retrieve(session_id)
      paid = s.payment_status === 'paid' && s.metadata?.kind === 'grading'
      who = s.metadata?.memberName || ''
      what = [s.metadata?.grade, s.metadata?.gradingName].filter(Boolean).join(' — ')
      amount = gbp(s.amount_total ?? 0)
    } catch { /* fall through */ }
  }
  return (
    <div className="bg-white min-h-screen px-4 py-20">
      <div className="max-w-lg mx-auto text-center">
        {paid ? (
          <>
            <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-[#111111] mb-3">Grading registered{who ? ` for ${who.split(' ')[0]}` : ''}!</h1>
            <p className="text-gray-500 leading-relaxed mb-8">Thanks — your {amount} grading fee has been paid{what ? ` for ${what}` : ''}. Your instructor will confirm the place.</p>
          </>
        ) : (
          <>
            <AlertCircle className="h-14 w-14 text-amber-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-[#111111] mb-3">We couldn&apos;t confirm your payment</h1>
            <p className="text-gray-500 leading-relaxed mb-8">Your grading is only registered once the fee is paid. Please try again or get in touch.</p>
          </>
        )}
        <div className="flex gap-3 justify-center">
          <Button asChild><Link href="/members/grading">Back to grading</Link></Button>
          <Button asChild variant="outline"><Link href="/contact">Contact us</Link></Button>
        </div>
      </div>
    </div>
  )
}
