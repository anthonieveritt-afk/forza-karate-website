'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Clock, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react'
import { EVENTS, CATEGORY_COLOURS, formatEventDate, groupByMonth, type EventCategory } from '@/lib/events'

const CATEGORIES: EventCategory[] = ['Competition', 'Coaching', 'Super Champs', 'Grading', 'Para Karate']

const CATEGORY_ICONS: Record<EventCategory, string> = {
  Competition:    '🏆',
  Coaching:       '🥋',
  'Super Champs': '⭐',
  Grading:        '🎽',
  'Para Karate':  '💪',
}

export default function CalendarPage() {
  const [activeCategory, setActiveCategory] = useState<EventCategory | 'All'>('All')
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set())

  const now = new Date()

  const filtered = useMemo(() => {
    const events = EVENTS
      .filter(e => activeCategory === 'All' || e.category === activeCategory)
      .sort((a, b) => a.date.localeCompare(b.date))
    return events
  }, [activeCategory])

  const grouped = useMemo(() => groupByMonth(filtered), [filtered])

  function toggleMonth(month: string) {
    setExpandedMonths(prev => {
      const next = new Set(prev)
      next.has(month) ? next.delete(month) : next.add(month)
      return next
    })
  }

  // Auto-expand current + next month on first render
  const currentMonthKey = now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  const nextMonthKey = nextMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  function isExpanded(month: string) {
    if (expandedMonths.has(month)) return true
    if (expandedMonths.size === 0 && (month === currentMonthKey || month === nextMonthKey)) return true
    return false
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Calendar</span>
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">Events Calendar</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Competitions, coaching sessions, gradings, Super Champs and Para Karate — all in one place.
          </p>
        </div>
      </section>

      {/* Category filter */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 border-b border-black/5 sticky top-16 bg-white z-10">
        <div className="max-w-7xl mx-auto flex gap-2 flex-wrap">
          <button
            onClick={() => setActiveCategory('All')}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              activeCategory === 'All' ? 'bg-[#111111] text-white border-[#111111]' : 'bg-white text-gray-600 border-black/12 hover:border-black/25'
            }`}
          >
            All events
          </button>
          {CATEGORIES.map(cat => {
            const c = CATEGORY_COLOURS[cat]
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                  activeCategory === cat
                    ? `${c.bg} ${c.text} ${c.border}`
                    : 'bg-white text-gray-600 border-black/12 hover:border-black/25'
                }`}
              >
                {CATEGORY_ICONS[cat]} {cat}
              </button>
            )
          })}
        </div>
      </section>

      {/* Events */}
      <section className="py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-3">
          {Object.entries(grouped).map(([month, events]) => {
            const open = isExpanded(month)
            const pastEvents = events.filter(e => new Date(e.date) < now)
            const upcoming = events.filter(e => new Date(e.date) >= now)

            return (
              <div key={month} className="rounded-2xl border border-black/8 overflow-hidden">
                {/* Month header */}
                <button
                  onClick={() => toggleMonth(month)}
                  className="w-full flex items-center justify-between px-5 py-4 bg-[#fafaf9] hover:bg-[#f3f3f0] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-[#dc2626]" />
                    <span className="font-bold text-[#111111]">{month}</span>
                    <span className="text-xs text-gray-400">{events.length} event{events.length !== 1 ? 's' : ''}</span>
                  </div>
                  {open ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                </button>

                {/* Events list */}
                {open && (
                  <div className="divide-y divide-black/5">
                    {events.map(event => {
                      const c = CATEGORY_COLOURS[event.category]
                      const isPast = new Date(event.date) < now
                      return (
                        <div
                          key={event.id}
                          className={`px-5 py-4 flex gap-4 ${isPast ? 'opacity-50' : ''} ${event.cancelled ? 'line-through opacity-40' : ''}`}
                        >
                          {/* Date badge */}
                          <div className="w-14 flex-shrink-0 text-center">
                            <div className="bg-[#111111] rounded-xl px-1 py-2">
                              <p className="text-white text-xs font-bold leading-none">
                                {new Date(event.date + 'T12:00:00').toLocaleDateString('en-GB', { day: 'numeric' })}
                              </p>
                              <p className="text-gray-400 text-[9px] uppercase tracking-wider mt-0.5">
                                {new Date(event.date + 'T12:00:00').toLocaleDateString('en-GB', { month: 'short' })}
                              </p>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start gap-2 flex-wrap mb-1">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}>
                                {CATEGORY_ICONS[event.category]} {event.category}
                              </span>
                              {event.cancelled && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600 border border-red-200">CANCELLED</span>
                              )}
                            </div>
                            <p className="font-semibold text-[#111111] text-sm leading-snug">{event.title}</p>
                            <div className="flex flex-wrap gap-3 mt-1.5">
                              <span className="flex items-center gap-1 text-xs text-gray-500">
                                <MapPin className="h-3 w-3 text-gray-400" />{event.venue}
                              </span>
                              {event.time && (
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                  <Clock className="h-3 w-3 text-gray-400" />{event.time}
                                </span>
                              )}
                            </div>
                            {event.eligibility && (
                              <p className="text-xs text-gray-400 mt-1">👥 {event.eligibility}</p>
                            )}
                            {event.notes && (
                              <p className="text-xs text-gray-400 mt-0.5">📌 {event.notes}</p>
                            )}
                          </div>

                          {/* Register link */}
                          {event.registrationHref && !isPast && !event.cancelled && (
                            <a
                              href={event.registrationHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-shrink-0 self-start text-xs font-semibold text-[#dc2626] hover:underline flex items-center gap-1 mt-1"
                            >
                              Register <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
