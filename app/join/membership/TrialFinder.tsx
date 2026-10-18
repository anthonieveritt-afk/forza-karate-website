'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export type FoundTrial = {
  trialRef: string
  firstName: string
  surname: string
  dateOfBirth: string | null
  club: string | null
  status: 'attended' | 'booked' | 'pending'
  trialDate: string | null
  startDate: string | null
  eligible: boolean
  reason: string | null
}
export type Verified = { token: string; trials: FoundTrial[]; email: string; mobile: string }

const input = 'w-full h-11 px-4 rounded-xl border border-black/15 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent'
const lbl = 'block text-sm font-medium text-[#111111] mb-1.5'
const btn = 'inline-flex items-center justify-center gap-2 h-11 px-5 rounded-xl bg-[#dc2626] text-white text-sm font-semibold hover:bg-[#b91c1c] disabled:opacity-60'

export function BookTrialFirst({ intro }: { intro?: string }) {
  return (
    <div id="book-trial-first" className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm space-y-2">
      <p className="font-semibold text-[#111111]">Book a trial first</p>
      <p className="text-gray-700">{intro ?? 'To join, we need to find your trial class booking.'} If you haven&apos;t had a trial class yet, please <Link href="/trial-class" className="text-[#dc2626] font-semibold underline">book a trial class</Link> first.</p>
      <p className="text-gray-600">Already had your trial? Check you used the same email and mobile as when you booked, or contact us at <a href="mailto:hello@forzakarate.co.uk" className="underline">hello@forzakarate.co.uk</a> and we&apos;ll help.</p>
    </div>
  )
}

export function TrialFinder({ onVerified }: { onVerified: (v: Verified) => void }) {
  const [email, setEmail] = useState('')
  const [mobile, setMobile] = useState('')
  const [lookupId, setLookupId] = useState('')
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function start() {
    setError(''); setBusy(true)
    try {
      const r = await fetch('/api/membership/trial/start', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, mobile }) })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) { setError(d.error ?? 'Something went wrong. Please try again.'); return }
      setLookupId(d.lookupId); setMsg(d.message); setCode('')
    } catch { setError('Could not connect. Please try again.') } finally { setBusy(false) }
  }
  async function verify() {
    setError(''); setBusy(true)
    try {
      const r = await fetch('/api/membership/trial/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ lookupId, code }) })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) { setError(d.error ?? 'Something went wrong. Please try again.'); return }
      onVerified({ token: d.token, trials: d.trials ?? [], email, mobile })
    } catch { setError('Could not connect. Please try again.') } finally { setBusy(false) }
  }

  return (
    <section id="trial-finder" className="space-y-4">
      <h2 className="text-lg font-bold">Find your trial booking</h2>
      <p className="text-sm text-gray-600">Enter the email address and mobile number you used to book your trial class. We&apos;ll email you a 6-digit code to confirm it&apos;s you, then fill in the student details for you.</p>
      {!lookupId ? (
        <div className="grid sm:grid-cols-2 gap-4">
          <div><label className={lbl} htmlFor="tl-email">Email used for the trial</label><input id="tl-email" type="email" autoComplete="email" className={input} value={email} onChange={e => setEmail(e.target.value)} /></div>
          <div><label className={lbl} htmlFor="tl-mobile">Mobile used for the trial</label><input id="tl-mobile" type="tel" autoComplete="tel" className={input} value={mobile} onChange={e => setMobile(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (email && mobile && !busy) start() } }} /></div>
          <div className="sm:col-span-2"><button type="button" id="tl-send" className={btn} disabled={busy || !email || !mobile} onClick={start}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Email me a code</button></div>
        </div>
      ) : (
        <div className="space-y-3">
          <p id="tl-sent" className="text-sm rounded-xl bg-green-50 border border-green-200 text-green-800 px-3 py-2">{msg}</p>
          <div className="flex flex-wrap items-end gap-3">
            <div><label className={lbl} htmlFor="tl-code">6-digit code</label><input id="tl-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} className={`${input} w-40 tracking-[0.3em] text-center`} value={code} onChange={e => setCode(e.target.value.replace(/\D/g, ''))} onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); if (code.length === 6 && !busy) verify() } }} /></div>
            <button type="button" id="tl-verify" className={btn} disabled={busy || code.length !== 6} onClick={verify}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Confirm</button>
            <button type="button" className="text-sm text-gray-500 underline h-11" onClick={() => { setLookupId(''); setError(''); setMsg('') }}>Use a different email or mobile</button>
          </div>
          <p className="text-xs text-gray-500">The code works for 10 minutes. No email? Check your junk folder. If nothing arrives, we may not have a trial booking under those details:</p>
          <BookTrialFirst intro="No code arriving?" />
        </div>
      )}
      {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
    </section>
  )
}
