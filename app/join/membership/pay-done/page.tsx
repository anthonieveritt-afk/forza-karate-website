'use client'

import { Suspense, useEffect, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Script from 'next/script'
import Link from 'next/link'
import { Loader2, ShieldCheck } from 'lucide-react'

declare global {
  interface Window {
    GoCardlessDropin?: {
      create: (o: {
        billingRequestFlowID: string
        environment: 'live' | 'sandbox'
        onSuccess: (br: { id: string }) => void
        onExit: (error: unknown, metadata: unknown) => void
      }) => { open: () => void; exit: () => void }
    }
  }
}

function PayDone() {
  const sessionId = useSearchParams().get('session_id') ?? ''
  const router = useRouter()
  const [scriptReady, setScriptReady] = useState(false)
  const [error, setError] = useState('')
  const [status, setStatus] = useState('Confirming your card payment…')
  const started = useRef(false)

  useEffect(() => {
    if (!sessionId || !scriptReady || started.current) return
    started.current = true
    let cancelled = false

    async function run() {
      setStatus('Card payment received — opening Direct Debit set-up…')
      try {
        const res = await fetch('/api/membership/start-dd', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId }),
        })
        const d = await res.json()
        if (cancelled) return
        if (!res.ok) {
          setError(d.error ?? 'Could not start Direct Debit.')
          return
        }
        if (d.alreadyFulfilled) {
          router.replace(`/join/membership/done?br=${d.billingRequestId}`)
          return
        }
        if (!window.GoCardlessDropin || !d.flowId) {
          setError('The secure Direct Debit form is still loading. Please refresh this page.')
          started.current = false
          return
        }
        const brId: string = d.billingRequestId
        window.GoCardlessDropin.create({
          billingRequestFlowID: d.flowId,
          environment: d.environment,
          onSuccess: () => router.push(`/join/membership/done?br=${brId}`),
          onExit: () => {
            fetch('/api/membership/cancel', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ billingRequestId: brId }),
            }).catch(() => {})
            setError('Direct Debit was not finished. Your card payment is safe — please try again or contact the club to complete your membership.')
          },
        }).open()
      } catch {
        if (!cancelled) setError('Could not connect. Please try again.')
      }
    }
    run()
    return () => { cancelled = true }
  }, [sessionId, scriptReady, router])

  return (
    <div className="min-h-screen bg-[#fafaf9] flex items-center justify-center px-4 pt-24">
      <Script src="https://pay.gocardless.com/billing/static/dropin/v2/initialise.js" onReady={() => setScriptReady(true)} />
      <div className="text-center max-w-md space-y-4">
        {!error && (
          <>
            <Loader2 className="h-12 w-12 text-[#dc2626] mx-auto animate-spin" />
            <p className="font-semibold text-[#111111]">{status}</p>
            <p className="flex gap-2 text-xs text-gray-500 justify-center">
              <ShieldCheck className="h-4 w-4 shrink-0 text-green-600" />
              Next: set up monthly Direct Debit for lesson fees only (suit, licence and first month are already paid by card).
            </p>
          </>
        )}
        {error && (
          <>
            <h1 className="text-xl font-bold text-[#111111]">Almost there</h1>
            <p className="text-sm text-gray-500">{error}</p>
            <Link href="/join/membership" className="text-[#dc2626] underline text-sm">Back to membership</Link>
          </>
        )}
        {!sessionId && !error && (
          <>
            <p className="text-sm text-red-600">Missing payment reference.</p>
            <Link href="/join/membership" className="text-[#dc2626] underline text-sm">Back to membership</Link>
          </>
        )}
      </div>
    </div>
  )
}

export default function Page() {
  return <Suspense fallback={<div className="min-h-screen flex items-center justify-center pt-24"><Loader2 className="h-8 w-8 animate-spin text-[#dc2626]" /></div>}><PayDone /></Suspense>
}
