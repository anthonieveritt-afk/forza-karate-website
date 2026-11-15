'use client'

import { useState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/Button'
import { CheckCircle, AlertCircle } from 'lucide-react'
import { gradingFee, GRADING_VENUES } from '@/lib/gradings'
import {
  defaultEmergencyClosesOn,
  EMERGENCY_GRADING_FEE_POUNDS,
  emergencyFeeWording,
  ukDateLabel,
  type RegistrationMode,
} from '@/lib/grading-registration-window'
import { eventMode, localEvents, parsePreviewWindow, type PreviewWindow, type PublicGradingEvent } from '@/lib/grading-checkout'

const HONBU_API = process.env.NEXT_PUBLIC_CLUB_HONBU_API ?? 'https://forza-club-honbu-production.up.railway.app/api'

// Grades a student can grade FOR (17th to 1st Kyu). White Belt is not a grade; it comes with the gi.
// and the public /gradings belt chart. Values are what Forza Club Honbu stores as currentBelt.
const belts = [
  '17th Kyu – White Belt / Red Stripe',
  '16th Kyu – White Belt / Yellow Stripe',
  '15th Kyu – Red Belt',
  '14th Kyu – Red Belt / White Stripe',
  '13th Kyu – Yellow Belt',
  '12th Kyu – Yellow Belt / White Stripe',
  '11th Kyu – Orange Belt',
  '10th Kyu – Orange Belt / White Stripe',
  '9th Kyu – Green Belt',
  '8th Kyu – Green Belt / White Stripe',
  '7th Kyu – Blue Belt',
  '6th Kyu – Blue Belt / White Stripe',
  '5th Kyu – Purple Belt',
  '4th Kyu – Purple Belt / White Stripe',
  '3rd Kyu – Brown Belt',
  '2nd Kyu – Brown Belt / White Stripe',
  '1st Kyu – Brown Belt / Two Stripe',
]

function previewHostAllowed(): boolean {
  if (typeof window === 'undefined') return false
  const h = window.location.hostname
  return h !== 'forzakarate.co.uk' && h !== 'www.forzakarate.co.uk'
}

function readPreviewWindow(): PreviewWindow | null {
  if (!previewHostAllowed()) return null
  return parsePreviewWindow(new URLSearchParams(window.location.search).get('previewWindow'))
}

function mergeEvents(fromHonbu: PublicGradingEvent[]): PublicGradingEvent[] {
  const byName = new Map<string, PublicGradingEvent>()
  for (const g of localEvents()) byName.set(g.name.toLowerCase(), { ...g })
  for (const e of fromHonbu) {
    const key = e.name.toLowerCase()
    const prev = byName.get(key)
    byName.set(key, {
      ...prev,
      ...e,
      awardStart: e.awardStart || prev?.awardStart,
      awardEnd: e.awardEnd || prev?.awardEnd,
      registerBy: e.registerBy || prev?.registerBy || '',
    })
  }
  return [...byName.values()]
}

function feeLine(mode: RegistrationMode, baseFee: number): { total: number; text: string } {
  const total = mode === 'emergency' ? baseFee + EMERGENCY_GRADING_FEE_POUNDS : baseFee
  return {
    total,
    text: mode === 'emergency' ? emergencyFeeWording(total) : `Grading fee: £${total}`,
  }
}

export default function GradingRegForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [gradingEvents, setGradingEvents] = useState<PublicGradingEvent[]>([])
  const [eventsLoading, setEventsLoading] = useState(true)
  const [grade, setGrade] = useState('')
  const [gradingName, setGradingName] = useState('')
  const [previewWindow, setPreviewWindow] = useState<PreviewWindow | null>(null)
  const [now] = useState(() => new Date())
  const selectedFee = grade ? gradingFee(grade) : null

  useEffect(() => {
    setPreviewWindow(readPreviewWindow())
    fetch(`${HONBU_API}/public/grading-events`)
      .then(r => r.json())
      .then((data: PublicGradingEvent[]) => {
        setGradingEvents(mergeEvents(Array.isArray(data) ? data : []))
        setEventsLoading(false)
      })
      .catch(() => {
        setGradingEvents(mergeEvents([]))
        setEventsLoading(false)
      })
  }, [])

  const openEvents = useMemo(() => {
    return gradingEvents.filter((g) => eventMode(g, now, previewWindow) !== 'closed')
  }, [gradingEvents, now, previewWindow])

  const selectedEvent = openEvents.find((g) => g.name === gradingName) ?? null
  const selectedMode: RegistrationMode | null = selectedEvent ? eventMode(selectedEvent, now, previewWindow) : null
  const allClosed = !eventsLoading && (previewWindow === 'closed' || openEvents.length === 0)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const form = e.currentTarget
    const data = new FormData(form)
    // Stripe only: the registration is created in Forza Club Honbu once the grading fee is paid.
    try {
      const res = await fetch('/api/grading-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberName: data.get('memberName'), parentName: data.get('parentName') || '', email: data.get('email'),
          currentBelt: data.get('currentBelt'), venue: data.get('venue'), gradingName: data.get('gradingName'),
          notes: data.get('notes') || '',
          previewWindow,
        }),
      })
      const result = await res.json()
      if (res.ok && result.url) { window.location.href = result.url; return }
      setStatus('error')
      setErrorMsg(result.error || 'Something went wrong.')
    } catch {
      setStatus('error')
      setErrorMsg('Could not start payment. Please try again.')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle className="h-14 w-14 text-green-500 mb-4" />
        <h3 className="text-2xl font-bold text-[#111111] mb-2">Registration received!</h3>
        <p className="text-gray-500 max-w-sm">
          Your grading registration has been submitted. Your instructor will confirm your place.
        </p>
      </div>
    )
  }

  if (allClosed) {
    return (
      <div className="py-6" data-testid="grading-closed">
        {previewWindow && (
          <p className="mb-4 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">Preview only — this is the closed state, not the live dates.</p>
        )}
        <div className="flex items-start gap-3 p-5 rounded-xl bg-[#fafaf9] border border-black/8">
          <AlertCircle className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-bold text-[#111111] mb-1">Registration has closed</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              The usual deadline has passed, and emergency registration (available until the day before belts are handed out) has also closed.
              The next grading will open for registration in the usual way. If you need help, please get in touch via{' '}
              <a href="https://forzakarate.co.uk/contact" className="text-[#dc2626] underline">forzakarate.co.uk/contact</a>.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const fee = selectedFee != null && selectedMode ? feeLine(selectedMode, selectedFee) : null
  const closeLabel = selectedEvent ? emergencyCloseLabel(selectedEvent) : ''

  return (
    <form onSubmit={handleSubmit} className="space-y-5" data-testid="grading-reg-form">
      {previewWindow && (
        <p className="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
          Preview only — showing the {previewWindow} registration state, not the live dates.
        </p>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      {selectedMode === 'emergency' && selectedEvent && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-sm text-amber-950" data-testid="emergency-grading-banner">
          <p className="font-semibold mb-1">Emergency registration</p>
          <p>
            The usual registration deadline for {selectedEvent.name} has passed. You can still register until{' '}
            <span className="font-semibold">{closeLabel || 'the day before belts are handed out'}</span>
            {' '}(the day before belts are handed out).{' '}
            {fee ? <span className="font-semibold">{fee.text}</span> : 'The fee is the usual grading fee plus £20 late registration.'}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">
            Member name <span className="text-[#dc2626]">*</span>
          </label>
          <input
            name="memberName"
            type="text"
            required
            placeholder="Full name of member grading"
            className="w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">
            Parent / guardian name <span className="text-gray-400 font-normal">(if under 18)</span>
          </label>
          <input
            name="parentName"
            type="text"
            placeholder="Jane Smith"
            className="w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#111111] mb-1.5">
          Email <span className="text-[#dc2626]">*</span>
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="contact@example.com"
          className="w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">
            Grading for <span className="text-[#dc2626]">*</span>
          </label>
          <select
            name="currentBelt"
            required
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition"
          >
            <option value="">Select the grade being taken</option>
            {belts.map((belt) => (
              <option key={belt} value={belt}>{belt} (£{gradingFee(belt)})</option>
            ))}
          </select>
          {fee && (
            <p className="mt-1.5 text-sm font-medium text-[#111111]" data-testid="grading-fee">{fee.text}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">
            Venue <span className="text-[#dc2626]">*</span>
          </label>
          <select
            name="venue"
            required
            className="w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition"
          >
            <option value="">Select venue</option>
            {GRADING_VENUES.map((v) => (
              <option key={v.value} value={v.value}>{v.value}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#111111] mb-1.5">
          Grading <span className="text-[#dc2626]">*</span>
        </label>
        <select
          name="gradingName"
          required
          value={gradingName}
          onChange={(e) => setGradingName(e.target.value)}
          className="w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition"
          disabled={eventsLoading}
        >
          {eventsLoading ? (
            <option value="">Loading dates…</option>
          ) : openEvents.length === 0 ? (
            <option value="">No upcoming gradings scheduled</option>
          ) : (
            <>
              <option value="">Select grading</option>
              {openEvents.map((g) => {
                const mode = eventMode(g, now, previewWindow)
                const close = emergencyCloseLabel(g)
                const label = mode === 'emergency'
                  ? `${g.name} — emergency registration until ${close || 'the day before belts are handed out'}`
                  : `${g.name} — awards ${g.awardLabel} (register by ${g.registerDeadlineLabel})`
                return (
                  <option key={g.name} value={g.name}>{label}</option>
                )
              })}
            </>
          )}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#111111] mb-1.5">
          Notes <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          name="notes"
          rows={3}
          placeholder="Any additional notes for your instructor..."
          className="w-full px-4 py-3 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition resize-none"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={status === 'loading' || eventsLoading || openEvents.length === 0}
        className="w-full"
      >
        {status === 'loading' ? 'Opening secure payment…' : `Pay${fee ? ` £${fee.total}` : ''} & register`}
      </Button>
    </form>
  )
}

function emergencyCloseLabel(ev: PublicGradingEvent): string {
  if (ev.emergencyClosesLabel) return ev.emergencyClosesLabel
  const start = ev.awardStart || localEvents().find((g) => g.name === ev.name)?.awardStart
  const ymd = ev.emergencyClosesOn || (start ? defaultEmergencyClosesOn(start) : '')
  return ymd ? ukDateLabel(ymd) : ''
}
