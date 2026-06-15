'use client'

import { useState } from 'react'
import { Mail, MapPin, Clock, Send, Bot } from 'lucide-react'
import SecretaryBot from '@/components/SecretaryBot'
import { sendContactMessage } from '@/app/actions/contact'

export default function ContactPage() {
  const [name, setName]       = useState('')
  const [email, setEmail]     = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus]   = useState<'idle' | 'sending' | 'done'>('idle')
  const [reply, setReply]     = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !message) return
    setStatus('sending')
    try {
      const result = await sendContactMessage({ name, email, message })
      setReply(result.reply)
      setStatus('done')
    } catch {
      setReply("Thanks for reaching out! We'll get back to you shortly.")
      setStatus('done')
    }
  }

  return (
    <>
    <div className="bg-white">
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Contact</span>
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">Get in touch</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Questions about classes, membership, or anything else — we&apos;re happy to help.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Contact info */}
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <Mail className="h-5 w-5 text-[#dc2626]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111111] mb-1">Email</h3>
                <p className="text-gray-500 text-sm">Send us a message using the form and get an instant reply.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-5 w-5 text-[#dc2626]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111111] mb-1">Locations</h3>
                <p className="text-gray-500 text-sm mb-1">Rayleigh Primary School, Rayleigh, Essex</p>
                <p className="text-gray-500 text-sm">Upminster, East London</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                <Clock className="h-5 w-5 text-[#dc2626]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#111111] mb-1">When we train</h3>
                <p className="text-gray-500 text-sm">Term time only — 40 weeks per year. Contact us for current class times.</p>
              </div>
            </div>
          </div>

          {/* Form + reply */}
          <div>
            <h2 className="text-xl font-bold text-[#111111] mb-6">Send a message</h2>

            {status !== 'done' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-1.5">Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-1.5">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-1.5">Message</label>
                  <textarea
                    rows={5}
                    required
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="What would you like to know?"
                    className="w-full px-4 py-3 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full h-11 bg-[#dc2626] text-white font-medium rounded-full text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {status === 'sending' ? (
                    <>
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                      </svg>
                      Getting a reply…
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                {/* Their message */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold text-gray-500">
                    {name.charAt(0).toUpperCase()}
                  </div>
                  <div className="bg-[#fafaf9] rounded-2xl rounded-tl-none px-4 py-3 flex-1 border border-black/5">
                    <p className="text-sm text-[#111111] leading-relaxed">{message}</p>
                  </div>
                </div>

                {/* Bot reply */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#dc2626] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 flex-1 border border-black/8 shadow-sm">
                    <p className="text-xs font-semibold text-[#dc2626] mb-1">Forza Karate</p>
                    <p className="text-sm text-[#111111] leading-relaxed">{reply}</p>
                  </div>
                </div>

                <button
                  onClick={() => { setStatus('idle'); setMessage(''); setReply('') }}
                  className="text-sm text-gray-400 hover:text-[#111111] transition-colors"
                >
                  Send another message →
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
    <SecretaryBot />
    </>
  )
}
