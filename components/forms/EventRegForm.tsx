'use client'

import { useState } from 'react'
import { CheckCircle, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { submitEventRegistration } from '@/app/actions/event-registration'

/** An extra question for forms that need more than the standard event fields. Answers are saved in `details`. */
export interface ExtraField {
  name: string
  label: string
  type?: 'text' | 'date' | 'number' | 'select' | 'checkbox'
  options?: { value: string; label: string }[]
  required?: boolean
  placeholder?: string
  help?: string
}

type OptionalField = 'dateOfBirth' | 'dojo' | 'currentBelt' | 'parentName' | 'medicalNotes'

interface Props {
  event: string
  eventLabel: string
  sessions?: { value: string; label: string }[]
  showAgeGroup?: boolean
  price?: string
  /** Label for the session dropdown (default "Session date"). */
  sessionLabel?: string
  sessionRequired?: boolean
  /** Message shown when there are no sessions to choose from. */
  noSessionsMessage?: string
  /** Label and options for the belt dropdown. */
  beltLabel?: string
  beltOptions?: string[]
  beltRequired?: boolean
  medicalLabel?: string
  hideFields?: OptionalField[]
  extraFields?: ExtraField[]
  submitLabel?: string
  successTitle?: string
  successMessage?: string
}

const dojos = [
  { value: 'rayleigh',  label: 'Rayleigh' },
  { value: 'upminster', label: 'Upminster' },
]

// Use belt names without kyu prefix for display
const defaultBelts = [
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

export default function EventRegForm({
  event, eventLabel, sessions, showAgeGroup, price,
  sessionLabel = 'Session date', sessionRequired = false, noSessionsMessage,
  beltLabel = 'Current belt', beltOptions = defaultBelts, beltRequired = false,
  medicalLabel = 'Medical notes', hideFields = [], extraFields = [],
  submitLabel, successTitle = 'You\u2019re registered!', successMessage,
}: Props) {
  const [status, setStatus]   = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const show = (f: OptionalField) => !hideFields.includes(f)

  const input = 'w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition'
  const select = `${input} cursor-pointer`
  const label = 'block text-sm font-medium text-[#111111] mb-1.5'
  const req = <span className="text-[#dc2626]">*</span>

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const form = e.currentTarget
    const d = new FormData(form)
    const details: Record<string, string> = {}
    for (const f of extraFields) {
      const v = f.type === 'checkbox' ? (d.get(f.name) ? 'Yes' : 'No') : ((d.get(f.name) as string) || '')
      if (v) details[f.label] = v
    }
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
        details:     Object.keys(details).length ? details : undefined,
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
        <h3 className="text-2xl font-bold text-[#111111] mb-2">{successTitle}</h3>
        <p className="text-gray-500 max-w-sm mx-auto mb-6">
          {successMessage ?? <>Your place at {eventLabel} has been confirmed. We&apos;ll be in touch with further details.</>}
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

  const noSessions = sessionRequired && (!sessions || sessions.length === 0)

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
          <label className={label}>First name {req}</label>
          <input name="firstName" type="text" required placeholder="First name" className={input} />
        </div>
        <div>
          <label className={label}>Last name {req}</label>
          <input name="lastName" type="text" required placeholder="Last name" className={input} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Email {req}</label>
          <input name="email" type="email" required placeholder="you@example.com" className={input} />
        </div>
        <div>
          <label className={label}>Phone {req}</label>
          <input name="phone" type="tel" required placeholder="07700 000000" className={input} />
        </div>
      </div>

      {(show('dateOfBirth') || show('dojo')) && (
        <div className="grid grid-cols-2 gap-4">
          {show('dateOfBirth') && (
            <div>
              <label className={label}>Date of birth</label>
              <input name="dateOfBirth" type="date" className={input} />
            </div>
          )}
          {show('dojo') && (
            <div>
              <label className={label}>Dojo</label>
              <select name="dojo" className={select}>
                <option value="">Select dojo</option>
                {dojos.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
          )}
        </div>
      )}

      {(show('currentBelt') || showAgeGroup) && (
        <div className="grid grid-cols-2 gap-4">
          {show('currentBelt') && (
            <div>
              <label className={label}>{beltLabel} {beltRequired && req}</label>
              <select name="currentBelt" className={select} required={beltRequired}>
                <option value="">Select belt</option>
                {beltOptions.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          )}
          {showAgeGroup && (
            <div>
              <label className={label}>Age group</label>
              <select name="ageGroup" className={select}>
                <option value="">Select age group</option>
                <option value="under-12">12 years &amp; below</option>
                <option value="13-plus">13 years+</option>
              </select>
            </div>
          )}
        </div>
      )}

      {sessions && (sessions.length > 0 || sessionRequired) && (
        <div>
          <label className={label}>{sessionLabel} {sessionRequired && req}</label>
          <select name="sessionDate" className={select} required={sessionRequired} disabled={noSessions}>
            {noSessions ? (
              <option value="">{noSessionsMessage ?? 'No upcoming dates'}</option>
            ) : (
              <>
                <option value="">Select {sessionLabel.toLowerCase()}</option>
                {sessions.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </>
            )}
          </select>
        </div>
      )}

      {extraFields.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {extraFields.map((f) => (
            <div key={f.name} className={f.type === 'checkbox' ? 'sm:col-span-2' : ''}>
              {f.type === 'checkbox' ? (
                <label className="flex items-start gap-3 text-sm text-[#111111] cursor-pointer">
                  <input name={f.name} type="checkbox" required={f.required} className="mt-0.5 h-4 w-4 accent-[#dc2626]" />
                  <span>{f.label} {f.required && req}</span>
                </label>
              ) : (
                <>
                  <label className={label}>{f.label} {f.required && req}</label>
                  {f.type === 'select' ? (
                    <select name={f.name} required={f.required} className={select}>
                      <option value="">Select</option>
                      {f.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  ) : (
                    <input name={f.name} type={f.type ?? 'text'} required={f.required} placeholder={f.placeholder} className={input} />
                  )}
                </>
              )}
              {f.help && <p className="text-xs text-gray-400 mt-1">{f.help}</p>}
            </div>
          ))}
        </div>
      )}

      {show('parentName') && (
        <div>
          <label className={label}>
            Parent / guardian name <span className="text-gray-400 font-normal">(if under 18)</span>
          </label>
          <input name="parentName" type="text" placeholder="Full name" className={input} />
        </div>
      )}

      {show('medicalNotes') && (
        <div>
          <label className={label}>
            {medicalLabel} <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea name="medicalNotes" rows={3} placeholder="Any conditions we should know about..."
            className="w-full px-4 py-3 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition resize-none" />
        </div>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={status === 'loading' || noSessions}>
        {status === 'loading' ? (submitLabel ? 'Sending…' : 'Registering…') : (submitLabel ?? `Register for ${eventLabel}`)}
      </Button>
    </form>
  )
}
