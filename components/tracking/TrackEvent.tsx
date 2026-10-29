'use client'
import { useEffect } from 'react'
import { track } from '@/lib/tracking'

/** Fires one Meta event on mount (after the pixel has had a moment to load). */
export default function TrackEvent({ event, params, eventID }: { event: string; params?: Record<string, unknown>; eventID?: string }) {
  useEffect(() => {
    const key = `fk_evt_${event}_${eventID || location.pathname}`
    if (eventID && sessionStorage.getItem(key)) return
    const t = setTimeout(() => { track(event, params, eventID); if (eventID) sessionStorage.setItem(key, '1') }, 800)
    return () => clearTimeout(t)
  }, [event, eventID, params])
  return null
}
