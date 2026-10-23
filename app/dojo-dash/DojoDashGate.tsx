'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

const SESSION_KEY = 'dojoDashParentOk'

export default function DojoDashGate() {
  const [ready, setReady] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === '1') setConfirmed(true)
    } catch {
      /* sessionStorage unavailable — show gate */
    }
    setReady(true)
  }, [])

  function confirm() {
    try {
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch {
      /* ignore */
    }
    setConfirmed(true)
  }

  if (!ready) {
    return (
      <div className="mt-6 w-full min-h-[280px] bg-[#fafaf9] border-y border-[#e7e5e4]" aria-hidden />
    )
  }

  if (!confirmed) {
    return (
      <div className="mt-6 w-full">
        <div className="mx-auto max-w-xl px-4 py-10 md:py-14 text-center bg-[#fafaf9] border-y border-[#e7e5e4]">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111111]">
            Playing with a parent or carer?
          </h2>
          <p className="mt-4 text-[#44403c] leading-relaxed">
            Dojo Dash is a Forza learning game for junior members and families. Please play with a
            parent or carer nearby.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              type="button"
              onClick={confirm}
              className="inline-block rounded-lg bg-[#dc2626] px-6 py-3 font-semibold text-white hover:bg-[#b91c1c]"
            >
              Continue to game
            </button>
            <button
              type="button"
              onClick={confirm}
              className="text-sm font-medium text-[#57534e] underline underline-offset-2 hover:text-[#111111]"
            >
              I&apos;m a parent / carer — continue
            </button>
          </div>
          <p className="mt-8 text-sm text-[#78716c]">
            No accounts needed. Nicknames only — no real names.{' '}
            <Link
              href="/privacy-policy#dojo-dash"
              className="text-[#dc2626] underline underline-offset-2 hover:text-[#b91c1c]"
            >
              Privacy
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6 w-full">
      <iframe
        src="/games/dojo-dash/index.html"
        title="Dojo Dash karate learning game"
        className="block w-full border-0 bg-[#111111] h-[min(calc(56.25vw+140px),calc(100dvh-64px))] md:h-[min(85vh,900px)] md:min-h-[480px]"
        style={{ touchAction: 'manipulation' }}
        allow="fullscreen; autoplay"
        allowFullScreen
      />
    </div>
  )
}
