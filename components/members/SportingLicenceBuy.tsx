'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

export function SportingLicenceBuy({ allowed }: { allowed: boolean }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function buy() {
    setBusy(true); setError('')
    try {
      const r = await fetch('/api/sporting-licence-checkout', { method: 'POST' })
      const j = await r.json().catch(() => ({}))
      if (r.ok && j.url) { window.location.href = j.url; return }
      setError(j.error || 'Something went wrong — please try again.')
    } catch { setError('Something went wrong — please try again.') }
    setBusy(false)
  }
  return (
    <div>
      <Button onClick={buy} disabled={!allowed || busy} className="w-full sm:w-auto">
        {busy ? 'Opening secure checkout…' : 'Buy Sporting licence — £33'}
      </Button>
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  )
}
