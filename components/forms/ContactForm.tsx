'use client'

import { useState } from 'react'
import { sendContactMessage } from '@/app/actions/contact'
import { Button } from '@/components/ui/Button'

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setError('')
    const fd = new FormData(e.currentTarget)
    const result = await sendContactMessage({
      name: String(fd.get('name') || ''),
      email: String(fd.get('email') || ''),
      phone: String(fd.get('phone') || ''),
      message: String(fd.get('message') || ''),
      website: String(fd.get('website') || ''),
    })
    if (result.success) {
      setStatus('ok')
      e.currentTarget.reset()
    } else {
      setStatus('err')
      setError(result.error)
    }
  }

  if (status === 'ok') {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <p className="font-semibold text-[#111111]">Message sent</p>
        <p className="text-sm text-gray-600 mt-1">Thanks — we&apos;ll get back to you as soon as we can.</p>
        <button
          type="button"
          className="mt-4 text-sm text-[#dc2626] font-medium"
          onClick={() => setStatus('idle')}
        >
          Send another message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      {/* Honeypot — hidden from people */}
      <div className="absolute -left-[9999px] opacity-0 h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-[#111111] mb-1.5">Name</label>
        <input
          id="name" name="name" required maxLength={120}
          className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]/30"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-[#111111] mb-1.5">Email</label>
        <input
          id="email" name="email" type="email" required maxLength={200}
          className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]/30"
        />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-[#111111] mb-1.5">
          Phone <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <input
          id="phone" name="phone" type="tel" maxLength={40}
          className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]/30"
        />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-[#111111] mb-1.5">Message</label>
        <textarea
          id="message" name="message" required rows={5} minLength={10} maxLength={5000}
          className="w-full rounded-xl border border-black/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]/30"
        />
      </div>

      {status === 'err' && (
        <p className="text-sm text-[#dc2626] bg-red-50 border border-red-100 rounded-xl px-4 py-3">{error}</p>
      )}

      <Button type="submit" disabled={status === 'loading'} className="w-full">
        {status === 'loading' ? 'Sending…' : 'Send message'}
      </Button>
      <p className="text-xs text-gray-400 text-center">
        Or email <a className="underline hover:text-[#dc2626]" href="mailto:hello@forzakarate.co.uk">hello@forzakarate.co.uk</a>
      </p>
    </form>
  )
}
