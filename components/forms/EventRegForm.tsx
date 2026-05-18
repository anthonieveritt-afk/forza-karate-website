'use client'

import { useState } from 'react'
import { CheckCircle, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { submitEventRegistration, type EventRegData } from '@/app/actions/event-registration'
interface Props {
  event: string
  eventLabel: string
  sessions?: { value: string; label: string }[]
  showAgeGroup?: boolean
  price?: string
}

const dojos = [
  { value: 'rayleigh',  label: 'Rayleigh' },
  { value: 'upminster', label: 'Upminster' },
]

// Use belt names without kyu prefix for display
const belts = [
  'White Belt', 'White Belt / Red Stripe', 'White Belt / Yellow Stripe',
  'Red Belt', 'Red Belt / White Stripe',
  'Yellow Belt', 'Yellow Belt / White Stripe',
  'Orange Belt', 'Orange Belt / White Stripe',
  'Green Belt', 'Green Belt / White Stripe',
  'Blue Belt', 'Blue Belt / White Stripe',
  'Purple Belt', 'Purple Belt / White Stripe',
  'Brown Belt', 'Brown Belt / White Stripe', 'Brown Belt / Two Stripe', 'Brown Belt / Black Stripe',
  'Black Belt / White Stripe', '1st Dan – Black Belt',
]

export default function EventRegForm({ event, eventLabel, sessions, showAgeGroup, price }: Props) {
  const [status, setStatus]   = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const input = 'w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition'
  const select = `${input} cursor-pointer`

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const form = e.currentTarget
    const d = new FormData(form)
    try {
      await submitEventRegistration({
        event,
        firstName:   d.get('firstName')   as string,
        lastName:    d.get('lastName')    as string,
        email:       d.get('email')       as string,
        phone:       d.get('phone')       as string,
        dateOfBirth: d.get('dateOfBirth') as string || undefined,
        dojo:        d.get('dojo')        as string || undefined,
        currentBelt: d.get('currentBelt') as string || undefined,
        ageGroup:    d.get('ageGroup')    as string || undefined,
        parentName:  d.get('parentName')  as string || undefined,
        medicalNotes:d.get('medicalNotes')as string || undefined,
        sessionDate: d.get('sessionDate') as string || undefined,
      })
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'done') {
    return (
      <div className="text-center py-12">
        <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-[#111111] mb-2">You&apos;re registered!</h3>
        <p className="text-gray-500 max-w-sm mx-auto mb-6">
          Your place at {eventLabel} has been confirmed. We&apos;ll be in touch with further details.
        </p>
        {price && (
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-sm font-medium">
            <CreditCard className="h-4 w-4" />
            Payment of {price} — online payment coming soon. Your instructor will collect fees at your next class.
          </div>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === 'error' && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm text-center">
          Something went wrong — please try again.
        </div>
      )}

      {/* Price banner */}
      {price && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#fafaf9] border border-black/8">
          <CreditCard className="h-5 w-5 text-[#dc2626] flex-shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#111111]">Entry fee: {price}</p>
            <p className="text-xs text-gray-500">Online payment coming soon — fees collected at class for now.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">First name <span className="text-[#dc2626]">*</span></label>
          <input name="firstName" type="text" required placeholder="First name" className={input} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">Last name <span className="text-[#dc2626]">*</span></label>
          <input name="lastName" type="text" required placeholder="Last name" className={input} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">Email <span className="text-[#dc2626]">*</span></label>
          <input name="email" type="email" required placeholder="you@example.com" className={input} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">Phone <span className="text-[#dc2626]">*</span></label>
          <input name="phone" type="tel" required placeholder="07700 000000" className={input} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">Date of birth</label>
          <input name="dateOfBirth" type="date" className={input} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">Dojo</label>
          <select name="dojo" className={select}>
            <option value="">Select dojo</option>
            {dojos.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">Current belt</label>
          <select name="currentBelt" className={select}>
            <option value="">Select belt</option>
            {belts.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>
        {showAgeGroup && (
          <div>
            <label className="block text-sm font-medium text-[#111111] mb-1.5">Age group</label>
            <select name="ageGroup" className={select}>
              <option value="">Select age group</option>
              <option value="under-12">12 years &amp; below</option>
              <option value="13-plus">13 years+</option>
            </select>
          </div>
        )}
      </div>

      {sessions && sessions.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">Session date</label>
          <select name="sessionDate" className={select}>
            <option value="">Select session</option>
            {sessions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-[#111111] mb-1.5">
          Parent / guardian name <span className="text-gray-400 font-normal">(if under 18)</span>
        </label>
        <input name="parentName" type="text" placeholder="Full name" className={input} />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#111111] mb-1.5">
          Medical notes <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea name="medicalNotes" rows={3} placeholder="Any conditions we should know about..."
          className="w-full px-4 py-3 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition resize-none" />
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={status === 'loading'}>
        {status === 'loading' ? 'Registering…' : `Register for ${eventLabel}`}
      </Button>
    </form>
  )
}
