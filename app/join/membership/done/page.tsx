'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Loader2 } from 'lucide-react'

function Done() {
  const br = useSearchParams().get('br') ?? ''
  const [state, setState] = useState<'loading' | 'done' | 'pending' | 'error'>('loading')
  const [start, setStart] = useState<string | null>(null)

  useEffect(() => {
    let tries = 0
    let stop = false
    async function poll() {
      try {
        const r = await fetch('/api/membership/complete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ billingRequestId: br }) })
        const d = await r.json()
        if (stop) return
        if (d.state === 'done') { setStart(d.subscriptionStart); setState('done'); return }
        if (++tries < 6) { setTimeout(poll, 2500); return }
        setState(d.state === 'pending' ? 'pending' : 'error')
      } catch { if (!stop) setState('error') }
    }
    if (br) poll(); else setState('error')
    return () => { stop = true }
  }, [br])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-24">
      <div className="text-center max-w-md">
        {state === 'loading' && <><Loader2 className="h-12 w-12 text-[#dc2626] mx-auto mb-4 animate-spin" /><p className="font-semibold">Confirming your membership…</p></>}
        {state === 'done' && <>
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Welcome to Forza Karate Club!</h1>
          <p className="text-gray-500 text-sm">Your card payment has gone through and your monthly Direct Debit is set up{start ? `: your monthly fee is collected on the 1st, starting ${new Date(start + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}` : ''}. Stripe has emailed your card receipt, GoCardless will email to confirm the Direct Debit, and we&apos;ll be in touch about your first class as a member.</p>
        </>}
        {state === 'pending' && <><h1 className="text-xl font-bold mb-2">Nearly there</h1><p className="text-gray-500 text-sm">GoCardless is still confirming your Direct Debit. There&apos;s nothing more to do; we&apos;ll email you once it&apos;s confirmed.</p></>}
        {state === 'error' && <><h1 className="text-xl font-bold mb-2">We couldn&apos;t confirm this yet</h1><p className="text-gray-500 text-sm mb-4">Your card payment is safe. If you completed the Direct Debit, there&apos;s nothing more to do and we&apos;ll be in touch. Otherwise please email hello@forzakarate.co.uk and we&apos;ll help you finish.</p><Link href="/join/membership" className="text-[#dc2626] underline text-sm">Back to the form</Link></>}
      </div>
    </div>
  )
}

export default function Page() { return <Suspense><Done /></Suspense> }
