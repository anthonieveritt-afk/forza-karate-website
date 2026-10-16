'use client'

import { useEffect, useId, useRef, useState, type ClipboardEvent, type KeyboardEvent } from 'react'

/** Age limits for a student date of birth. */
export const DOB_MIN_AGE = 3
export const DOB_MAX_AGE = 100

const pad = (n: number, w = 2) => String(n).padStart(w, '0')

/** Whole years between dob and `on` (calendar-accurate, birthday-aware). */
function yearsBetween(y: number, m: number, d: number, on: Date): number {
  let age = on.getFullYear() - y
  const mm = on.getMonth() + 1
  if (mm < m || (mm === m && on.getDate() < d)) age--
  return age
}

/**
 * Validates day/month/year parts. Returns { iso } (YYYY-MM-DD) when it is a real
 * calendar date in the past with an age between the limits, otherwise { error }.
 * Empty parts give { error: '' } when nothing is entered (handled by `required`).
 */
export function validateUkDob(day: string, month: string, year: string, on = new Date(), minAge = DOB_MIN_AGE, maxAge = DOB_MAX_AGE): { iso?: string; error: string } {
  if (!day && !month && !year) return { error: '' }
  if (!/^\d{1,2}$/.test(day) || !/^\d{1,2}$/.test(month) || !/^\d{4}$/.test(year))
    return { error: 'Enter the date of birth as DD/MM/YYYY, for example 12/03/2015.' }
  const d = +day, m = +month, y = +year
  if (m < 1 || m > 12) return { error: 'Month must be between 1 and 12.' }
  const dt = new Date(Date.UTC(y, m - 1, d))
  if (d < 1 || dt.getUTCFullYear() !== y || dt.getUTCMonth() !== m - 1 || dt.getUTCDate() !== d)
    return { error: `${pad(d)}/${pad(m)}/${y} isn't a real date. Check the day and month.` }
  const today = Date.UTC(on.getFullYear(), on.getMonth(), on.getDate())
  if (dt.getTime() >= today) return { error: 'Date of birth must be in the past.' }
  const age = yearsBetween(y, m, d, on)
  if (age < minAge) return { error: `Students must be at least ${minAge} years old.` }
  if (age > maxAge) return { error: `Please check the year: that would make the student over ${maxAge}.` }
  return { iso: `${y}-${pad(m)}-${pad(d)}`, error: '' }
}

/** Splits a pasted/typed string like 12/03/2015, 12-3-2015, 12.03.2015 or 12032015. */
export function parseUkDateString(s: string): [string, string, string] | null {
  const t = s.trim()
  let m = /^(\d{1,2})\s*[\/\-. ]\s*(\d{1,2})\s*[\/\-. ]\s*(\d{4})$/.exec(t)
  if (m) return [m[1], m[2], m[3]]
  m = /^(\d{2})(\d{2})(\d{4})$/.exec(t)
  if (m) return [m[1], m[2], m[3]]
  m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(t) // ISO, e.g. pasted from a spreadsheet
  if (m) return [m[3], m[2], m[1]]
  return null
}

function splitIso(v?: string | null): [string, string, string] {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v ?? '')
  return m ? [m[3], m[2], m[1]] : ['', '', '']
}

type Props = {
  /** Stored value, YYYY-MM-DD, or '' while incomplete/invalid. */
  value?: string | null
  /** Called with YYYY-MM-DD when valid, '' otherwise. */
  onChange: (iso: string) => void
  legend?: string
  required?: boolean
  name?: string
  className?: string
  inputClassName?: string
  minAge?: number
  maxAge?: number
}

/**
 * Typeable UK date of birth: three numeric boxes (DD / MM / YYYY) with
 * auto-advance, backspace-to-previous, and paste of a full date into any box.
 * Emits the same YYYY-MM-DD string the old <input type="date"> produced.
 */
export function UkDateOfBirthInput({ value, onChange, legend = 'Date of birth', required, name, className, inputClassName, minAge, maxAge }: Props) {
  const id = useId()
  const [parts, setParts] = useState<[string, string, string]>(() => splitIso(value))
  const [touched, setTouched] = useState(false)
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)]
  const lastEmitted = useRef<string>(value ?? '')

  // Copy an external value in (e.g. form reset) unless it's the one we just emitted.
  useEffect(() => {
    const v = value ?? ''
    if (v !== lastEmitted.current) { lastEmitted.current = v; setParts(splitIso(v)) }
  }, [value])

  const { iso, error } = validateUkDob(parts[0], parts[1], parts[2], new Date(), minAge, maxAge)
  const complete = parts[0].length > 0 && parts[1].length > 0 && parts[2].length === 4
  const showError = (touched || complete) && !!error
  const message = error || (required && !parts.join('') ? 'Enter a date of birth.' : '')

  // Native form validation: block submit while the date is invalid.
  useEffect(() => {
    refs[0].current?.setCustomValidity(error && (touched || complete) ? error : '')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, touched, complete])

  const partsRef = useRef(parts)
  partsRef.current = parts
  const update = (next: [string, string, string]) => {
    partsRef.current = next
    setParts(next)
    const r = validateUkDob(next[0], next[1], next[2], new Date(), minAge, maxAge)
    const out = r.iso ?? ''
    if (out !== lastEmitted.current) { lastEmitted.current = out; onChange(out) }
  }

  const max = [2, 2, 4]
  const onInput = (i: number, raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, max[i])
    const next = [...parts] as [string, string, string]
    next[i] = digits
    // Typing 4-9 in the day box or 2-9 in the month box can only be one digit: move on.
    const early = (i === 0 && /^[4-9]$/.test(digits)) || (i === 1 && /^[2-9]$/.test(digits))
    if (early) next[i] = '0' + digits
    update(next)
    if (i < 2 && (next[i].length === max[i])) { refs[i + 1].current?.focus(); refs[i + 1].current?.select() }
  }

  const onKeyDown = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    const el = e.currentTarget
    if (e.key === 'Backspace' && i > 0 && el.value === '') {
      e.preventDefault()
      const prev = refs[i - 1].current
      if (prev) { prev.focus(); const n = [...parts] as [string, string, string]; n[i - 1] = n[i - 1].slice(0, -1); update(n) }
    } else if (e.key === 'ArrowLeft' && i > 0 && el.selectionStart === 0) {
      e.preventDefault(); refs[i - 1].current?.focus()
    } else if (e.key === 'ArrowRight' && i < 2 && el.selectionStart === el.value.length) {
      e.preventDefault(); refs[i + 1].current?.focus()
    } else if ((e.key === '/' || e.key === '-' || e.key === '.' || e.key === ' ') ) {
      e.preventDefault()
      if (i < 2 && el.value) {
        if (el.value.length === 1) { const n = [...parts] as [string, string, string]; n[i] = '0' + el.value; update(n) }
        refs[i + 1].current?.focus()
      }
    }
  }

  const onPaste = (i: number, e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData('text')
    const p = parseUkDateString(text)
    if (p) {
      e.preventDefault()
      update([p[0].padStart(2, '0'), p[1].padStart(2, '0'), p[2]])
      setTouched(true)
      refs[2].current?.focus()
    }
    // otherwise let the browser paste into this box; onInput strips non-digits
  }

  const onBlurGroup = () => {
    // Only mark touched once focus leaves the whole group.
    setTimeout(() => {
      if (!refs.some(r => r.current === document.activeElement)) {
        const cur = partsRef.current
        // pad single-digit day/month for neatness
        if (cur[0].length === 1 || cur[1].length === 1) update([cur[0] && cur[0].padStart(2, '0'), cur[1] && cur[1].padStart(2, '0'), cur[2]])
        if (cur.some(Boolean)) setTouched(true)
      }
    }, 0)
  }

  const box = inputClassName ?? 'w-full h-11 px-2 rounded-xl border border-black/15 bg-white text-[#111111] text-base text-center tabular-nums placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent'
  const errId = `${id}-err`
  const hintId = `${id}-hint`
  const labels = ['Day', 'Month', 'Year']
  const placeholders = ['DD', 'MM', 'YYYY']

  return (
    <fieldset className={className} aria-describedby={`${hintId}${showError ? ' ' + errId : ''}`}>
      <legend className="block text-sm font-medium text-[#111111] mb-1.5">{legend}</legend>
      <p id={hintId} className="sr-only">Enter day, month and year, for example 12 03 2015.</p>
      <div className="flex items-end gap-2">
        {[0, 1, 2].map(i => (
          <div key={i} className={i === 2 ? 'w-24' : 'w-16'}>
            <label htmlFor={`${id}-${i}`} className="block text-xs text-gray-500 mb-0.5">{labels[i]}</label>
            <input
              ref={refs[i]}
              id={`${id}-${i}`}
              type="text"
              inputMode="numeric"
              pattern={i === 2 ? '[0-9]{4}' : '[0-9]{1,2}'}
              maxLength={max[i]}
              autoComplete={['bday-day', 'bday-month', 'bday-year'][i]}
              placeholder={placeholders[i]}
              required={required}
              aria-invalid={showError || undefined}
              aria-describedby={showError ? errId : undefined}
              data-dob-part={['day', 'month', 'year'][i]}
              className={box + (showError ? ' border-red-500' : '')}
              value={parts[i]}
              onChange={e => onInput(i, e.target.value)}
              onKeyDown={e => onKeyDown(i, e)}
              onPaste={e => onPaste(i, e)}
              onBlur={onBlurGroup}
              onInvalid={() => setTouched(true)}
              title={message || undefined}
            />
          </div>
        ))}
      </div>
      {name && <input type="hidden" name={name} value={iso ?? ''} />}
      <p id={errId} role="alert" aria-live="polite" className={'text-sm text-red-600 mt-1 ' + (showError ? '' : 'hidden')}>{showError ? error : ''}</p>
    </fieldset>
  )
}
