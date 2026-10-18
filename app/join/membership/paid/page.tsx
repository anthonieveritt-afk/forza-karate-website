'use client'

// Stripe returns here after the card payment. We confirm it with the server, then (unless the
// training fees are £0) open GoCardless to set up the monthly Direct Debit.
import { Suspense, useEffect, useState } from 'react'
import Script from 'next/script'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Loader2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { pounds } from '@/lib/gocardless/plans'

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

type Status = { paid: boolean; amountPence?: number; monthlyFeePence?: number; needsDirectDebit?: boolean; directDebitStart?: string | null; discount?: { code: string; percent: number } | null }
const ukDate = (iso: string) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

function Paid() {
  const q = useSearchParams()
  const router = useRouter()
  const signupId = q.get('signup') ?? ''
  const sessionId = q.get('session_id') ?? ''
  const [state, setState] = useState<'loading' | 'paid' | 'unpaid' | 'error'>('loading')
  const [st, setSt] = useState<Status | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [scriptReady, setScriptReady] = useState(false)

  useEffect(() => {
    let tries = 0, stop = false
    async function poll() {
      try {
        const r = await fetch('/api/membership/card-status', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ signupId, sessionId }) })
        const d: Status = await r.json()
        if (stop) return
        if (r.ok && d.paid) { setSt(d); setState('paid'); return }
        if (++tries < 5) { setTimeout(poll, 2000); return }
        setState(r.ok ? 'unpaid' : 'error')
      } catch { if (!stop) setState('error') }
    }
    if (signupId) poll()
    return () => { stop = true }
  }, [signupId, sessionId])

  async function startDirectDebit() {
    setError('')
    if (!window.GoCardlessDropin) { setError('The secure Direct Debit form is still loading. Please try again in a moment.'); return }
    setBusy(true)
    try {
      const res = await fetch('/api/membership/billing-request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ signupId }) })
      const d = await res.json()
      if (!res.ok) { setError(d.error ?? 'Something went wrong.'); setBusy(false); return }
      const brId: string = d.billingRequestId
      window.GoCardlessDropin.create({
        billingRequestFlowID: d.flowId,
        environment: d.environment,
        onSuccess: () => router.push(`/join/membership/done?br=${brId}`),
        onExit: () => setBusy(false),
      }).open()
    } catch { setError('Could not connect. Please try again.'); setBusy(false) }
  }

  const fee = st?.monthlyFeePence ?? 0
  const view = signupId ? state : 'error'
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-24 pb-16">
      {view === 'paid' && fee > 0 && <Script src="https://pay.gocardless.com/billing/static/dropin/v2/initialise.js" onReady={() => setScriptReady(true)} />}
      <div className="text-center max-w-md">
        {view === 'loading' && <><Loader2 className="h-12 w-12 text-[#dc2626] mx-auto mb-4 animate-spin" /><p className="font-semibold">Confirming your card payment…</p></>}
        {view === 'paid' && fee > 0 && <>
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Card payment received{st?.amountPence ? `: ${pounds(st.amountPence)}` : ''}</h1>
          <p className="text-gray-500 text-sm mb-6">Last step: set up the Direct Debit for your monthly fee of <strong>{pounds(fee)}</strong>, collected on the 1st{st?.directDebitStart ? `, starting ${ukDate(st.directDebitStart)}` : ''}. Nothing else is taken by Direct Debit.</p>
          {st?.needsDirectDebit === false
            ? <p className="text-sm text-green-700">Your Direct Debit is already set up. <Link className="underline" href="/">Back to the home page</Link></p>
            : <>
              <Button size="lg" className="w-full" disabled={busy} onClick={startDirectDebit}>{busy ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Opening secure form…</> : 'Set up monthly Direct Debit'}</Button>
              {!scriptReady && <p className="text-xs text-gray-400 mt-2">Loading secure Direct Debit form…</p>}
              {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
              <p className="flex gap-2 text-xs text-gray-500 mt-4 text-left"><ShieldCheck className="h-4 w-4 shrink-0 text-green-600" /> Bank details are entered in GoCardless&apos;s secure window and are protected by the Direct Debit Guarantee.</p>
            </>}
        </>}
        {view === 'paid' && fee <= 0 && <>
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Welcome to Forza Karate Club!</h1>
          <p className="text-gray-500 text-sm">Your card payment{st?.amountPence ? ` of ${pounds(st.amountPence)}` : ''} for the suit and licence has gone through. With your code {st?.discount?.code} your training fees are £0, so there is no monthly Direct Debit. We&apos;ve emailed you a summary and we&apos;ll be in touch about your first class as a member.</p>
        </>}
        {view === 'unpaid' && <><h1 className="text-xl font-bold mb-2">We haven&apos;t received the card payment yet</h1><p className="text-gray-500 text-sm mb-4">If you paid, please refresh this page in a minute. If not, nothing has been set up and you can start again.</p><Link href="/join/membership" className="text-[#dc2626] underline text-sm">Back to the form</Link></>}
        {view === 'error' && <><h1 className="text-xl font-bold mb-2">We couldn&apos;t check this yet</h1><p className="text-gray-500 text-sm mb-4">Please refresh in a minute, or email hello@forzakarate.co.uk and we&apos;ll help.</p><Link href="/join/membership" className="text-[#dc2626] underline text-sm">Back to the form</Link></>}
      </div>
    </div>
  )
}

export default function Page() { return <Suspense><Paid /></Suspense> }
