'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'

// Upbeat tracks: HoliznaCC0, CC0 1.0 (see public/music/CREDITS.md)
const tracks = [
  { src: '/music/track-1.mp3', label: '80s Champion' },
  { src: '/music/track-2.mp3', label: 'Taiko Groove' },
  { src: '/music/track-3.mp3', label: 'Eastern Flow' },
  { src: '/music/upbeat-funky-pop.mp3', label: 'Funky Pop' },
  { src: '/music/upbeat-happy-dance.mp3', label: 'Happy Dance' },
  { src: '/music/upbeat-retro-synths.mp3', label: 'Retro Synths' },
  { src: '/music/upbeat-50-over-the-speed-limit.mp3', label: '50 Over The Speed Limit' },
  { src: '/music/upbeat-retro-soundtrack.mp3', label: 'Retro Soundtrack' },
  { src: '/music/upbeat-bouncing.mp3', label: 'Bouncing' },
  { src: '/music/upbeat-love-love-love.mp3', label: 'Love Love Love' },
  { src: '/music/upbeat-mutant-club.mp3', label: 'Mutant Club' },
  { src: '/music/upbeat-dear-mr-super-computer.mp3', label: 'Dear Mr Super Computer' },
  { src: '/music/upbeat-back-in-the-80s.mp3', label: 'Back In The 80s' },
]

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [showLabel, setShowLabel] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)
  const pathname = usePathname()

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(t)
  }, [])

  const ensureSrc = useCallback((index: number) => {
    const audio = audioRef.current
    if (!audio) return
    const next = tracks[index].src
    if (audio.getAttribute('src') !== next) {
      audio.src = next
      audio.load()
    }
    setLoaded(true)
  }, [])

  // When track changes while playing, switch source and continue
  useEffect(() => {
    if (!playing) return
    const audio = audioRef.current
    if (!audio) return
    ensureSrc(trackIndex)
    audio.play().catch(() => {})
    setShowLabel(true)
    const t = setTimeout(() => setShowLabel(false), 2000)
    return () => clearTimeout(t)
  }, [trackIndex, playing, ensureSrc])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      ensureSrc(trackIndex)
      audio.play().then(() => {
        setPlaying(true)
        setShowLabel(true)
        setTimeout(() => setShowLabel(false), 2000)
      }).catch(() => {})
    }
  }

  const next = useCallback(() => {
    setTrackIndex(i => (i + 1) % tracks.length)
  }, [])

  const prev = useCallback(() => {
    setTrackIndex(i => (i - 1 + tracks.length) % tracks.length)
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onEnd = () => setTrackIndex(i => (i + 1) % tracks.length)
    audio.addEventListener('ended', onEnd)
    return () => audio.removeEventListener('ended', onEnd)
  }, [])

  // Hide on the game page so it doesn't cover the game's touch controls
  if (pathname?.startsWith('/dojo-dash')) return null

  return (
    <>
      {/* No src until the user presses play — avoids downloading audio on every page view */}
      <audio ref={audioRef} preload="none" />

      <div
        className={`
          fixed bottom-[4.5rem] right-3 sm:bottom-[5.75rem] sm:right-6 z-50
          bg-[#111111] text-white text-xs font-medium
          px-3 py-1.5 rounded-full
          transition-all duration-300 pointer-events-none whitespace-nowrap
          ${showLabel ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}
        `}
      >
        {tracks[trackIndex].label}{loaded ? '' : ''}
      </div>

      <div
        className={`
          fixed bottom-3 right-3 sm:bottom-6 sm:right-6 z-50
          flex flex-nowrap items-center gap-1.5 sm:gap-2 isolate p-1 rounded-full bg-[#111111] border border-white/10 shadow-lg shadow-black/40
          transition-opacity duration-500
          ${visible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
        `}
      >
        <button
          onClick={prev}
          aria-label="Previous track"
          className="relative z-20 flex shrink-0 w-9 h-9 transform-gpu [transform:translateZ(0)] rounded-full bg-[#111111] border border-white/10 items-center justify-center hover:bg-white/10 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
            <polygon points="11,1 4,6 11,11" />
            <rect x="1" y="1" width="2" height="10" rx="1" />
          </svg>
        </button>

        <div className="relative z-0 w-10 h-10 sm:w-12 sm:h-12 shrink-0 overflow-hidden rounded-full">
          {playing && (
            <span
              aria-hidden
              className="absolute inset-0 rounded-full border-2 border-[#dc2626]/50 animate-pulse pointer-events-none"
            />
          )}
          <button
            onClick={togglePlay}
            aria-label={playing ? 'Pause music' : 'Play music'}
            className="relative z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#111111] border border-white/10 flex items-center justify-center shadow-lg shadow-black/30 hover:bg-[#dc2626] hover:border-[#dc2626] transition-colors duration-200"
          >
            {playing ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
                <rect x="2" y="1" width="3.5" height="12" rx="1" />
                <rect x="8.5" y="1" width="3.5" height="12" rx="1" />
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="white">
                <path d="M3 2 L12 7 L3 12 Z" />
              </svg>
            )}
          </button>
        </div>

        <button
          onClick={next}
          aria-label="Next track"
          className="relative z-20 flex shrink-0 w-9 h-9 transform-gpu [transform:translateZ(0)] rounded-full bg-[#111111] border border-white/10 items-center justify-center hover:bg-white/10 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
            <polygon points="1,1 8,6 1,11" />
            <rect x="9" y="1" width="2" height="10" rx="1" />
          </svg>
        </button>
      </div>
    </>
  )
}
