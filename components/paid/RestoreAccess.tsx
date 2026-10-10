'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'

export default function RestoreAccess() {
  const [msg, setMsg] = useState('')
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const email = new FormData(e.currentTarget).get('email')
    const res = await fetch('/api/video-access/restore', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
    const b = (await res.json().catch(() => ({}))) as { message?: string; error?: string }
    setMsg(b.message || b.error || 'Something went wrong.')
  }
  return (
    <form onSubmit={submit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
      <input name="email" type="email" required placeholder="Email you subscribed with"
        className="flex-1 h-10 px-4 rounded-xl border border-black/12 text-sm" />
      <Button type="submit" size="sm" variant="outline">Email me a link</Button>
      {msg && <p className="text-xs text-gray-500 sm:basis-full">{msg}</p>}
    </form>
  )
}
