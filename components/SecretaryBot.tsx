'use client'

import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Loader2, Bot } from 'lucide-react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTED = [
  'What age can my child start?',
  'How much does membership cost?',
  'Where are your classes?',
  'Can I try a free class?',
]

export default function SecretaryBot() {
  const [open, setOpen]         = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [started, setStarted]   = useState(false)
  const bottomRef               = useRef<HTMLDivElement>(null)
  const inputRef                = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && !started) {
      setMessages([{
        role: 'assistant',
        content: "Hi! I'm Sempai, Forza Karate Club's virtual assistant. I can answer questions about classes, membership, locations, and more. What would you like to know? 🥋",
      }])
      setStarted(true)
    }
  }, [open, started])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  async function send(text?: string) {
    const content = (text ?? input).trim()
    if (!content || loading) return

    const updated: Message[] = [...messages, { role: 'user', content }]
    setMessages(updated)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.reply ?? "Sorry, I couldn't get a reply. Please try again.",
      }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, something went wrong. Please use the contact form instead.",
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 left-4 sm:left-6 w-[calc(100vw-2rem)] sm:w-96 max-h-[600px] bg-white rounded-3xl shadow-2xl border border-black/8 flex flex-col z-50 overflow-hidden">

          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-black/5 bg-[#111111]">
            <div className="w-9 h-9 rounded-full bg-[#dc2626] flex items-center justify-center flex-shrink-0">
              <Bot className="h-4 w-4 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">Sempai</p>
              <p className="text-[11px] text-gray-400">Forza Karate Club · Always online</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-gray-400 hover:text-white transition-colors p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 min-h-0">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2.5 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[#dc2626] flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="h-3.5 w-3.5 text-white" />
                  </div>
                )}
                <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user'
                    ? 'bg-[#111111] text-white rounded-br-sm'
                    : 'bg-[#fafaf9] text-[#111111] border border-black/6 rounded-bl-sm'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-[#dc2626] flex items-center justify-center flex-shrink-0">
                  <Bot className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="bg-[#fafaf9] border border-black/6 px-4 py-3 rounded-2xl rounded-bl-sm">
                  <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Suggestions (only at start) */}
          {messages.length <= 1 && !loading && (
            <div className="px-4 pb-2 flex flex-wrap gap-1.5">
              {SUGGESTED.map(s => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-black/12 text-gray-600 hover:border-[#dc2626] hover:text-[#dc2626] transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="px-4 pb-4 pt-2 border-t border-black/5">
            <form
              onSubmit={e => { e.preventDefault(); send() }}
              className="flex items-center gap-2 bg-[#fafaf9] border border-black/10 rounded-2xl px-4 py-2.5"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask a question…"
                className="flex-1 bg-transparent text-sm text-[#111111] placeholder-gray-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                className="text-[#dc2626] disabled:text-gray-300 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Floating button */}
      <button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-6 left-4 sm:left-6 w-14 h-14 bg-[#dc2626] hover:bg-red-700 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 z-50"
        aria-label="Chat with Sempai"
      >
        {open
          ? <X className="h-5 w-5" />
          : <MessageCircle className="h-5 w-5" />
        }
      </button>
    </>
  )
}
