'use client'

import { forwardRef, useEffect, useImperativeHandle, useRef, type ComponentProps } from 'react'

export const MIN_DATE = '1900-01-01'
export const MAX_DATE = '2100-12-31'

export function isSaneIsoDate(v: string): boolean {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v)
  if (!m) return false
  const y = +m[1], mo = +m[2], d = +m[3]
  if (y < 1900 || y > 2100) return false
  const dt = new Date(Date.UTC(y, mo - 1, d))
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === mo - 1 && dt.getUTCDate() === d
}

function check(el: HTMLInputElement) {
  el.setCustomValidity(el.value && !isSaneIsoDate(el.value) ? 'Enter a full date with a year between 1900 and 2100.' : '')
}

type Props = Omit<ComponentProps<'input'>, 'type' | 'value' | 'defaultValue'> & { value?: string | null }

/**
 * <input type="date"> that types reliably: the browser owns the value while typing
 * (uncontrolled), so a re-render can't overwrite a half-typed year (2026 -> 0007).
 * The parent's value is copied in only when the field isn't focused. Years outside
 * 1900-2100 are flagged on blur/submit, never mid-typing.
 */
export const DateInput = forwardRef<HTMLInputElement, Props>(function DateInput(
  { value, min, max, onBlur, onChange, ...rest },
  ref,
) {
  const inner = useRef<HTMLInputElement | null>(null)
  useImperativeHandle(ref, () => inner.current as HTMLInputElement)
  useEffect(() => {
    const el = inner.current
    const v = value ?? ''
    if (el && document.activeElement !== el && el.value !== v) el.value = v
  }, [value])
  return (
    <input
      {...rest}
      ref={inner}
      type="date"
      min={min ?? MIN_DATE}
      max={max ?? MAX_DATE}
      defaultValue={value ?? ''}
      onChange={(e) => { e.target.setCustomValidity(''); onChange?.(e) }}
      onBlur={(e) => { check(e.target); onBlur?.(e) }}
      onInvalid={(e) => check(e.currentTarget)}
    />
  )
})
