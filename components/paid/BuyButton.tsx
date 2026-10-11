'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

export default function BuyButton({ endpoint, payload, label, variant }: {
  endpoint: string; payload?: Record<string, string>; label: string; variant?: 'outline'
}) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function go() {
    setBusy(true); setError('')
    try {
      const res = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload || {}) })
      const body = (await res.json().catch(() => ({}))) as { url?: string; error?: string }
      if (!res.ok || !body.url) throw new Error(body.error || 'Something went wrong.')
      window.location.href = body.url
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.'); setBusy(false)
    }
  }
  return (
    <div>
      <Button onClick={go} disabled={busy} size="sm" variant={variant} className="w-full">{busy ? 'Opening checkout…' : label}</Button>
      {error && <p className="text-xs text-red-600 mt-2" role="alert">{error}</p>}
    </div>
  )
}
