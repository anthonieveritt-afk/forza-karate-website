// Para Karate for All sessions, from the old site (https://forzakarate.co.uk/para-karate-2/)
// and its registration form. One-hour sessions, once a month.

export const PARA_VENUES = {
  Rayleigh: 'Rayleigh Primary School, Love Lane, SS6 7DD',
  Chingford: 'St Francis Church Hall, Hawkwood Crescent, E4 7UH',
} as const

export type ParaVenue = keyof typeof PARA_VENUES

export interface ParaSession {
  /** ISO date (YYYY-MM-DD), or null when the date is still to be confirmed. */
  date: string | null
  label: string
  venue: ParaVenue
  time?: string
}

export const PARA_PRICE = '£20 per session'

export const PARA_SESSIONS: ParaSession[] = [
  { date: '2026-01-10', label: 'Saturday 10th January 2026',  venue: 'Rayleigh',  time: '2:00pm' },
  { date: '2026-02-14', label: 'Saturday 14th February 2026', venue: 'Chingford', time: '2:00pm' },
  { date: '2026-03-14', label: 'Saturday 14th March 2026',    venue: 'Rayleigh',  time: '2:00pm' },
  { date: '2026-04-25', label: 'Saturday 25th April 2026',    venue: 'Chingford', time: '2:00pm' },
  { date: '2026-05-09', label: 'Saturday 9th May 2026',       venue: 'Rayleigh',  time: '2:00pm' },
  { date: '2026-06-06', label: 'Saturday 6th June 2026',      venue: 'Chingford', time: '2:30pm' },
  { date: '2026-07-11', label: 'Saturday 11th July 2026',     venue: 'Rayleigh',  time: '2:00pm' },
  { date: '2026-08-01', label: 'Saturday 1st August 2026',    venue: 'Chingford', time: '2:00pm' },
  { date: '2026-09-12', label: 'Saturday 12th September 2026', venue: 'Rayleigh', time: '2:00pm' },
  { date: '2026-10-24', label: 'Saturday 24th October 2026',  venue: 'Chingford', time: '2:00pm' },
  { date: '2026-11-14', label: 'Saturday 14th November 2026', venue: 'Rayleigh',  time: '2:00pm' },
  { date: '2026-12-05', label: 'Saturday 5th December 2026',  venue: 'Chingford', time: '2:00pm' },
  { date: null,         label: 'January 2027 (date TBC)',     venue: 'Rayleigh' },
  { date: null,         label: 'February 2027 (date TBC)',    venue: 'Chingford' },
]

/** Sessions that haven't happened yet (TBC sessions are always included). */
export function upcomingParaSessions(now = new Date()) {
  const today = now.toISOString().slice(0, 10)
  return PARA_SESSIONS.filter((s) => s.date === null || s.date >= today)
}
