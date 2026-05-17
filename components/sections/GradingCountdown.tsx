'use client'

import { useState, useEffect } from 'react'
import { Timer, ChevronDown, ChevronUp, History } from 'lucide-react'
import { GRADINGS } from '@/lib/gradings'

function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  return now
}

function getCountdown(target: Date, now: Date) {
  const diff = target.getTime() - now.getTime()
  if (diff <= 0) return null
  const total   = Math.floor(diff / 1000)
  const days    = Math.floor(total / 86400)
  const hours   = Math.floor((total % 86400) / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  return { days, hours, minutes, seconds }
}

function pad(n: number) { return String(n).padStart(2, '0') }

function formatDate(d: Date) {
  return d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' })
}

function CountdownBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center min-w-[2.5rem]">
      <span className="text-2xl font-bold tabular-nums leading-none text-[#dc2626]">{pad(value)}</span>
      <span className="text-[10px] text-gray-400 font-medium mt-0.5 uppercase tracking-wider">{label}</span>
    </div>
  )
}

function GradingCard({ grading, isNext, now }: {
  grading: typeof GRADINGS[number]
  isNext: boolean
  now: Date
}) {
  const countdown  = getCountdown(grading.registerBy, now)
  const regClosed  = grading.registerBy < now

  return (
    <div className={`rounded-2xl border p-5 flex flex-col gap-3 transition-all bg-white ${
      isNext
        ? 'border-[#dc2626] ring-2 ring-red-100 shadow-md'
        : 'border-black/8 shadow-sm'
    }`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {isNext && (
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-[#dc2626] text-white">Next</span>
            )}
            <h3 className="font-semibold text-[#111111]">{grading.name}</h3>
          </div>
          <p className="text-xs text-gray-500">
            Belts awarded: <span className="font-semibold text-[#111111]">{grading.awardLabel}</span>
          </p>
        </div>
        {regClosed && (
          <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200 shrink-0">
            Reg. closed
          </span>
        )}
      </div>

      {!regClosed && countdown && (
        <div>
          <p className="text-xs text-gray-500 mb-3">
            Registration closes <span className="font-semibold text-[#111111]">{formatDate(grading.registerBy)}</span>
          </p>
          <div className="flex items-center gap-2">
            <CountdownBlock value={countdown.days}    label="days" />
            <span className="text-lg font-bold text-gray-300 pb-3">:</span>
            <CountdownBlock value={countdown.hours}   label="hrs" />
            <span className="text-lg font-bold text-gray-300 pb-3">:</span>
            <CountdownBlock value={countdown.minutes} label="min" />
            <span className="text-lg font-bold text-gray-300 pb-3">:</span>
            <CountdownBlock value={countdown.seconds} label="sec" />
          </div>
        </div>
      )}

      {regClosed && (
        <p className="text-xs text-gray-400">Registration closed — belts awarded during grading week.</p>
      )}
    </div>
  )
}

export default function GradingCountdown() {
  const now      = useNow()
  const [showHistory, setShowHistory] = useState(false)

  const upcoming = GRADINGS.filter(g => g.registerBy > now)
  const past     = GRADINGS.filter(g => g.registerBy <= now)
  const nextIdx  = 0 // first upcoming is always next

  return (
    <div className="bg-[#fafaf9] rounded-2xl border border-black/8 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
          <Timer className="w-5 h-5 text-[#dc2626]" />
        </div>
        <div>
          <h3 className="font-bold text-[#111111]">Grading Calendar 2026</h3>
          <p className="text-xs text-gray-400 mt-0.5">Live countdown to registration deadlines</p>
        </div>
      </div>

      {upcoming.length > 0 ? (
        <div className={`grid grid-cols-1 gap-3 ${
          upcoming.length >= 2 ? 'sm:grid-cols-2' : ''
        }`}>
          {upcoming.map((g, i) => (
            <GradingCard key={g.name} grading={g} isNext={i === nextIdx} now={now} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400">
          <Timer className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No upcoming gradings scheduled</p>
        </div>
      )}

      {past.length > 0 && (
        <div className="mt-4 pt-4 border-t border-black/5">
          <button
            onClick={() => setShowHistory(v => !v)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#111111] transition-colors w-full text-left"
          >
            <History className="w-4 h-4 shrink-0" />
            <span className="font-medium">{past.length} completed grading{past.length !== 1 ? 's' : ''} — view history</span>
            {showHistory
              ? <ChevronUp className="w-4 h-4 ml-auto shrink-0" />
              : <ChevronDown className="w-4 h-4 ml-auto shrink-0" />}
          </button>
          {showHistory && (
            <div className="mt-3 space-y-2">
              {past.map(g => (
                <div key={g.name} className="flex items-center justify-between py-2 border-b border-black/5 last:border-0">
                  <div>
                    <p className="text-sm font-semibold text-[#111111]">{g.name}</p>
                    <p className="text-xs text-gray-400">{g.awardLabel}</p>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Completed</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
