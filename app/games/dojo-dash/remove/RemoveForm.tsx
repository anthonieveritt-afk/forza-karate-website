'use client'

import { useState } from 'react'

const input =
  'w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition'
const label = 'block text-sm font-medium text-[#111111] mb-1.5'

export default function RemoveForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')
  const today = new Date().toISOString().slice(0, 10)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    setStatus('sending')
    setError('')
    try {
      const r = await fetch('/api/dojo-dash/removal-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          n: f.get('n'),
          mode: f.get('mode'),
          date: f.get('date') || undefined,
          parent: f.get('parent') === 'on',
          website: f.get('website'),
        }),
      })
      if (r.ok) return setStatus('done')
      const j = await r.json().catch(() => ({}))
      setError(
        r.status === 503
          ? 'The form is not available right now. Please email sensei.everitt@forzakarate.co.uk with the nickname and game mode instead.'
          : j.message || 'Something went wrong. Please check the details and try again.',
      )
      setStatus('error')
    } catch {
      setError('No connection. Please try again, or email sensei.everitt@forzakarate.co.uk.')
      setStatus('error')
    }
  }

  if (status === 'done')
    return (
      <div role="status" className="rounded-2xl border border-green-200 bg-green-50 p-6 text-sm text-green-900">
        <p className="font-semibold text-base mb-1">✓ Request received</p>
        <p>Thank you. We&apos;ll remove matching scores within 2 working days (and always within one month).</p>
      </div>
    )

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor="n" className={label}>Nickname on the leaderboard <span className="text-[#dc2626]">*</span></label>
        <input id="n" name="n" required maxLength={12} autoComplete="off" className={input} placeholder="e.g. NinjaFox" />
        <p className="text-xs text-gray-500 mt-1">For a team score, enter either player&apos;s nickname.</p>
      </div>
      <div>
        <label htmlFor="mode" className={label}>Game mode <span className="text-[#dc2626]">*</span></label>
        <select id="mode" name="mode" required defaultValue="" className={input}>
          <option value="" disabled>Choose…</option>
          <option value="career">Career (Top Ninjas)</option>
          <option value="daily">Daily Challenge</option>
          <option value="mastery">Black Belt Mastery</option>
          <option value="team">2-Player Team</option>
          <option value="unsure">Not sure / all modes</option>
        </select>
      </div>
      <div>
        <label htmlFor="date" className={label}>Roughly when was it saved? <span className="text-gray-400 font-normal">(optional)</span></label>
        <input id="date" name="date" type="date" max={today} className={input} />
        <p className="text-xs text-gray-500 mt-1">We remove matching scores from about a week either side. Leave blank to remove all scores with this nickname.</p>
      </div>
      <label className="flex items-center gap-2 text-sm text-[#111111]">
        <input type="checkbox" name="parent" className="h-4 w-4 accent-[#dc2626]" /> I am a parent or carer asking for my child
      </label>
      {/* honeypot: hidden from people, bots fill it in */}
      <div aria-hidden="true" style={{ position: 'absolute', left: '-10000px', width: 1, height: 1, overflow: 'hidden' }}>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      {status === 'error' && <p role="alert" className="text-sm text-[#dc2626]">{error}</p>}
      <button type="submit" disabled={status === 'sending'} className="inline-block rounded-lg bg-[#dc2626] px-6 py-3 font-semibold text-white hover:bg-[#b91c1c] disabled:opacity-60">
        {status === 'sending' ? 'Sending…' : 'Request removal'}
      </button>
    </form>
  )
}
