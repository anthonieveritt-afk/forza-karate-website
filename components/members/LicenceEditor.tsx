'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { DateInput, isSaneIsoDate } from '@/components/DateInput'
import { updateMemberLicence } from '@/app/actions/portal'

const sane = (v?: string | null) => (v && isSaneIsoDate(v.slice(0, 10)) ? v.slice(0, 10) : '')

export function LicenceEditor({
  licenceNumber,
  licenceStartDate,
  licenceExpiryDate,
}: {
  licenceNumber?: string | null
  licenceStartDate?: string | null
  licenceExpiryDate?: string | null
}) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [num, setNum] = useState('')
  const [start, setStart] = useState('')
  const [expiry, setExpiry] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)
  const [pending, startTransition] = useTransition()

  function begin() {
    setNum(licenceNumber ?? '')
    setStart(sane(licenceStartDate))
    setExpiry(sane(licenceExpiryDate))
    setError('')
    setSaved(false)
    setOpen(true)
  }

  function save() {
    setError('')
    for (const [label, v] of [['Start date', start], ['Expiry date', expiry]] as const) {
      if (v && !isSaneIsoDate(v)) return setError(`${label} needs a full date with a year between 1900 and 2100.`)
    }
    if (start && expiry && expiry < start) return setError('Expiry date is before the start date.')
    startTransition(async () => {
      const r = await updateMemberLicence({ licenceNumber: num, licenceStartDate: start, licenceExpiryDate: expiry })
      if (!r.ok) return setError(r.error)
      setOpen(false)
      setSaved(true)
      router.refresh()
    })
  }

  const input = 'mt-1 w-full h-11 px-3 rounded-lg border border-black/12 bg-white text-sm text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#dc2626]/40'
  if (!open) {
    return (
      <div className="mt-4 flex items-center gap-3">
        <button type="button" onClick={begin} className="text-sm font-semibold text-[#dc2626] hover:underline">
          Update my licence details
        </button>
        {saved && <span className="text-sm text-green-700" role="status">Licence details saved.</span>}
      </div>
    )
  }
  return (
    <div className="mt-6 rounded-xl border border-black/8 bg-gray-50 p-5">
      <div className="grid gap-4 sm:grid-cols-3">
        <label className="text-xs uppercase tracking-wider text-gray-500">Licence number
          <input value={num} onChange={(e) => setNum(e.target.value)} className={input} />
        </label>
        <label className="text-xs uppercase tracking-wider text-gray-500">Start date
          <DateInput value={start} onChange={(e) => setStart(e.target.value)} className={input} />
        </label>
        <label className="text-xs uppercase tracking-wider text-gray-500">Expiry date
          <DateInput value={expiry} onChange={(e) => setExpiry(e.target.value)} className={input} />
        </label>
      </div>
      {error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}
      <div className="mt-4 flex gap-3">
        <button type="button" disabled={pending} onClick={save} className="rounded-lg bg-[#dc2626] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b91c1c] disabled:opacity-50">
          {pending ? 'Saving…' : 'Save'}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="rounded-lg border border-black/12 px-4 py-2 text-sm">Cancel</button>
      </div>
    </div>
  )
}
