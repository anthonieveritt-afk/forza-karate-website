'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { UkDateOfBirthInput } from '@/components/UkDateOfBirthInput'

const lbl = 'block text-sm font-medium text-[#111111] mb-1.5 whitespace-nowrap'
const input = 'w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition'
// DD / MM / YYYY boxes: same height and border as the other fields, filling the column.
const dobBox = 'w-full h-11 px-2 rounded-xl border border-black/12 bg-white text-[#111111] text-base sm:text-sm text-center tabular-nums placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition'
// Hide the small Day/Month/Year captions visually (kept for screen readers; the boxes show DD/MM/YYYY)
// so the boxes line up with the Phone input; stretch the boxes to the column width.
const dobFieldset = "min-w-0 [&>legend]:whitespace-nowrap [&>legend]:after:ml-1 [&>legend]:after:text-[#dc2626] [&>legend]:after:content-['*'] [&_label]:sr-only [&_.flex>div]:flex-1 [&_.flex>div:last-child]:flex-[1.6]"

export default function TrialClassForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [dob, setDob] = useState('')

  const cancelled = useSearchParams().get('cancelled') === '1'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    const data = Object.fromEntries(new FormData(e.currentTarget).entries())
    try {
      const res = await fetch('/api/trial-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string }
      if (!res.ok || !body.url) throw new Error(body.error || 'Something went wrong. Please try again.')
      window.location.href = body.url // Stripe Checkout
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle className="h-14 w-14 text-green-500 mb-4" />
        <h3 className="text-2xl font-bold text-[#111111] mb-2">You&apos;re booked in!</h3>
        <p className="text-gray-500 max-w-sm">
          Thanks! We&apos;ll be in touch within 72 hours to confirm your trial class.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {cancelled && status !== 'error' && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-100 text-amber-800 text-sm">
          Payment cancelled — you haven&apos;t been charged. Your trial isn&apos;t booked yet; try again whenever you&apos;re ready.
        </div>
      )}
      {status === 'error' && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-5 items-start">
        <div>
          <label htmlFor="trial-parentName" className={lbl}>
            Your name <span className="text-[#dc2626]">*</span>
          </label>
          <input id="trial-parentName" name="parentName" type="text" required autoComplete="name" placeholder="Jane Smith" className={input} />
        </div>
        <div>
          <label htmlFor="trial-email" className={lbl}>
            Email <span className="text-[#dc2626]">*</span>
          </label>
          <input id="trial-email" name="email" type="email" required autoComplete="email" placeholder="jane@example.com" className={input} />
        </div>

        <div>
          <label htmlFor="trial-childName" className={lbl}>Child&apos;s name</label>
          <input id="trial-childName" name="childName" type="text" placeholder="Tommy Smith" className={input} />
        </div>
        <div>
          <label htmlFor="trial-age" className={lbl}>Their age</label>
          <input id="trial-age" name="age" type="number" min="3" max="99" placeholder="e.g. 7" className={input} />
        </div>

        <div>
          <label htmlFor="trial-phone" className={lbl}>
            Phone <span className="text-[#dc2626]">*</span>
          </label>
          <input id="trial-phone" name="phone" type="tel" required autoComplete="tel" placeholder="07700 900000" className={input} />
        </div>
        <UkDateOfBirthInput
          name="dateOfBirth"
          required
          legend="Date of birth"
          value={dob}
          onChange={setDob}
          inputClassName={dobBox}
          className={dobFieldset}
        />

        <div>
          <label htmlFor="trial-ageGroup" className={lbl}>
            Age group <span className="text-[#dc2626]">*</span>
          </label>
          <select id="trial-ageGroup" name="ageGroup" required className={input}>
            <option value="">Select age group</option>
            <option value="ninjas">Forza Ninjas (Ages 4–6)</option>
            <option value="juniors">Forza Juniors (Ages 7–10)</option>
            <option value="seniors">Forza Seniors (Ages 11+)</option>
            <option value="adult">Adult</option>
          </select>
        </div>
        <div>
          <label htmlFor="trial-preferredDojo" className={lbl}>
            Preferred dojo <span className="text-[#dc2626]">*</span>
          </label>
          <select id="trial-preferredDojo" name="preferredDojo" required className={input}>
            <option value="">Select dojo</option>
            <option value="rayleigh">Rayleigh</option>
            <option value="upminster">Upminster</option>
            <option value="no-preference">No preference</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="trial-message" className={lbl}>
          Anything we should know? <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          id="trial-message"
          name="message"
          rows={3}
          maxLength={400}
          placeholder="Medical notes, previous experience, questions…"
          className="w-full px-4 py-3 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={status === 'loading'}
        className="w-full"
      >
        {status === 'loading' ? 'Taking you to payment…' : 'Book & pay £10'}
      </Button>

      {status === 'error' && (
        <p role="alert" className="text-sm text-red-700 text-center">{errorMsg}</p>
      )}

      <p className="text-xs text-gray-400 text-center">
        £10 for the trial only (not taken off membership). Secure card payment by Stripe. We&apos;ll be in touch within 72 hours to confirm your class. No obligation, no kit needed.
      </p>
    </form>
  )
}
