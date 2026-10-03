'use client'

import { useState } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'
import { submitStoreEnquiry } from '@/app/actions/store-enquiry'

const input = 'w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition'
const label = 'block text-sm font-medium text-[#111111] mb-1.5'

export default function HelpForm() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setStatus('sending')
    const d = new FormData(e.currentTarget)
    try {
      const result = await submitStoreEnquiry({
        name: String(d.get('name') ?? ''),
        email: String(d.get('email') ?? ''),
        orderRef: String(d.get('orderRef') ?? ''),
        message: String(d.get('message') ?? ''),
        website: String(d.get('website') ?? ''),
      })
      if (result.ok) {
        setStatus('sent')
        return
      }
      setError(result.error)
    } catch {
      setError('Sorry, we couldn’t send your message just now. Please try again later, or ask your instructor at class.')
    }
    setStatus('idle')
  }

  if (status === 'sent') {
    return (
      <div className="text-center py-10">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-[#111111] mb-2">Message sent</h3>
        <p className="text-gray-500">Thanks. We’ll reply by email as soon as we can.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot, hidden from people */}
      <div className="hidden" aria-hidden="true">
        <label>Website <input name="website" tabIndex={-1} autoComplete="off" /></label>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className={label}>Your name <span className="text-[#dc2626]">*</span></label>
          <input id="name" name="name" className={input} required maxLength={80} autoComplete="name" />
        </div>
        <div>
          <label htmlFor="email" className={label}>Email for our reply <span className="text-[#dc2626]">*</span></label>
          <input id="email" name="email" type="email" className={input} required maxLength={200} autoComplete="email" />
        </div>
      </div>
      <div>
        <label htmlFor="orderRef" className={label}>Order reference (if you have one)</label>
        <input id="orderRef" name="orderRef" className={input} maxLength={20} placeholder="e.g. FKMG4T2Q-7A3F" />
      </div>
      <div>
        <label htmlFor="message" className={label}>How can we help? <span className="text-[#dc2626]">*</span></label>
        <textarea id="message" name="message" required minLength={10} maxLength={2000} rows={5}
          className="w-full px-4 py-3 rounded-xl border border-black/12 bg-white text-[#111111] text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition" />
        <p className="text-xs text-gray-400 mt-1.5">Please don’t include card details or medical information.</p>
      </div>
      {error && <p role="alert" className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">{error}</p>}
      <button type="submit" disabled={status === 'sending'}
        className="h-11 px-7 rounded-full bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-60 text-white text-sm font-semibold inline-flex items-center gap-2">
        {status === 'sending' && <Loader2 className="h-4 w-4 animate-spin" />}
        Send message
      </button>
      <p className="text-xs text-gray-400">We use your name and email only to answer this message. See our Privacy Policy.</p>
    </form>
  )
}
