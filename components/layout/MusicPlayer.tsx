'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

const tracks = [
  { src: '/music/track-1.mp3', label: '80s Champion' },
  { src: '/music/track-2.mp3', label: 'Taiko Groove' },
  { src: '/music/track-3.mp3', label: 'Eastern Flow' },
  { src: '/music/track-4.mp3', label: 'Dojo Spirit' },
]

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false)
  const [trackIndex, setTrackIndex] = useState(0)
  const [visible, setVisible] = useState(false)
  const [showLabel, setShowLabel] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(t)
  }, [])

  // When track changes, resume playback if already playing
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.src = tracks[trackIndex].src
    audio.load()
    if (playing) {
      audio.play().catch(() => {})
      // Flash the label briefly
      setShowLabel(true)
      const t = setTimeout(() => setShowLabel(false), 2000)
      return () => clearTimeout(t)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackIndex])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
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

  // Auto-advance when a track ends
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onEnd = () => {
      setTrackIndex(i => (i + 1) % tracks.length)
    }
    audio.addEventListener('ended', onEnd)
    return () => audio.removeEventListener('ended', onEnd)
  }, [])

  return (
    <>
      <audio ref={audioRef} src={tracks[trackIndex].src} preload="none" />

      {/* Track label tooltip */}
      <div
        className={`
          fixed bottom-[4.5rem] right-6 z-50
          bg-[#111111] text-white text-xs font-medium
          px-3 py-1.5 rounded-full
          transition-all duration-300 pointer-events-none whitespace-nowrap
          ${showLabel ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-1'}
        `}
      >
        {tracks[trackIndex].label}
      </div>

      {/* Player controls */}
      <div
        className={`
          fixed bottom-6 right-6 z-50
          flex items-center gap-2
          transition-all duration-500
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
      >
        {/* Prev */}
        <button
          onClick={prev}
          aria-label="Previous track"
          className="w-9 h-9 rounded-full bg-[#111111] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
            <polygon points="11,1 4,6 11,11" />
            <rect x="1" y="1" width="2" height="10" rx="1" />
          </svg>
        </button>

        {/* Play / Pause — main button */}
        <button
          onClick={togglePlay}
          aria-label={playing ? 'Pause music' : 'Play music'}
          className="w-12 h-12 rounded-full bg-[#111111] border border-white/10 flex items-center justify-center shadow-lg shadow-black/30 hover:bg-[#dc2626] hover:border-[#dc2626] hover:scale-110 transition-all duration-200"
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

        {/* Next */}
        <button
          onClick={next}
          aria-label="Next track"
          className="w-9 h-9 rounded-full bg-[#111111] border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="white">
            <polygon points="1,1 8,6 1,11" />
            <rect x="9" y="1" width="2" height="10" rx="1" />
          </svg>
        </button>
      </div>

      {/* Pulse ring when playing */}
      {playing && (
        <span className="fixed bottom-6 right-[3.25rem] z-40 w-12 h-12 rounded-full border border-[#dc2626]/40 animate-ping pointer-events-none" />
      )}
    </>
  )
}
