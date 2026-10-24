'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CheckCircle, Clock, Loader2, AlertTriangle } from 'lucide-react'

type View = 'loading' | 'done' | 'processing' | 'failed'
// ~2 minutes of checks: quick at first, then slower. Each check also runs the
// server-side fulfilment itself, so the result never depends on the webhook alone.
const DELAYS = [0, 2000, 2000, 3000, 3000, 5000, 5000, 8000, 8000, 10000, 10000, 15000, 15000, 15000, 15000]

function Done() {
  const br = useSearchParams().get('br') ?? ''
  const [view, setView] = useState<View>(br ? 'loading' : 'failed')
  const [start, setStart] = useState<string | null>(null)

  useEffect(() => {
    if (!br) return
    let stop = false
    let i = 0
    let unknownCount = 0
    async function poll() {
      if (stop) return
      let d: { state?: string; recorded?: boolean; subscriptionStart?: string | null } = {}
      try {
        const r = await fetch('/api/membership/complete', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ billingRequestId: br }), cache: 'no-store' })
        d = await r.json().catch(() => ({}))
      } catch { d = { state: 'retry' } }
      if (stop) return
      if (d.state === 'done') {
        setStart(d.subscriptionStart ?? null)
        // Paid + DD set up. If the club record isn't in yet, the server retries and alerts staff.
        if (d.recorded) { setView('done'); return }
        setView('processing')
      }
      if (d.state === 'failed') { setView('failed'); return }
      if (d.state === 'unknown' && ++unknownCount >= 3) { setView('failed'); return }
      // After ~20s of waiting, reassure rather than keep spinning; keep checking quietly.
      if (i >= 5) setView(v => (v === 'loading' ? 'processing' : v))
      if (++i < DELAYS.length) setTimeout(poll, DELAYS[i])
    }
    poll()
    return () => { stop = true }
  }, [br])

  const startLabel = start ? new Date(start + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }) : null

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-24">
      <div className="text-center max-w-md" aria-live="polite">
        {view === 'loading' && <>
          <Loader2 className="h-12 w-12 text-[#dc2626] mx-auto mb-4 animate-spin" />
          <p className="font-semibold">Confirming your membership…</p>
          <p className="text-gray-500 text-sm mt-2">This usually takes a few seconds. Please keep this page open.</p>
        </>}
        {view === 'done' && <>
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Welcome to Forza Karate Club!</h1>
          <p className="text-gray-500 text-sm">Your card payment is complete and your monthly Direct Debit is set up{startLabel ? ` (from ${startLabel})` : ''}. GoCardless will email you a confirmation, and we&apos;ll be in touch about your first class as a member.</p>
        </>}
        {view === 'processing' && <>
          <Clock className="h-12 w-12 text-[#dc2626] mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">You&apos;re all set</h1>
          <p className="text-gray-500 text-sm">Your payment and Direct Debit are set up. We&apos;re just finishing your membership record and will email you to confirm. There&apos;s nothing more you need to do, and you won&apos;t be charged again.</p>
        </>}
        {view === 'failed' && <>
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">We couldn&apos;t confirm your Direct Debit</h1>
          <p className="text-gray-500 text-sm mb-4">It looks like the Direct Debit set-up wasn&apos;t completed. If you already paid by card, you won&apos;t be charged again. Please get in touch and we&apos;ll sort it out with you.</p>
          <a href={`/contact?subject=${encodeURIComponent('Membership sign-up' + (br ? ` (${br})` : ''))}`} className="inline-block rounded-xl bg-[#dc2626] text-white text-sm font-semibold px-5 py-3">Contact the club</a>
        </>}
      </div>
    </div>
  )
}

export default function Page() { return <Suspense><Done /></Suspense> }
