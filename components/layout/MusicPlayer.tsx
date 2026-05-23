'use client'

import { useState, useRef, useEffect } from 'react'

export default function MusicPlayer() {
  const [playing, setPlaying] = useState(false)
  const [visible, setVisible] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  // Fade in the button after a short delay
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1500)
    return () => clearTimeout(t)
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  return (
    <>
      <audio ref={audioRef} src="/background-music.mp3" loop preload="none" />
      <button
        onClick={toggle}
        aria-label={playing ? 'Pause music' : 'Play music'}
        title={playing ? 'Pause music' : 'Play background music'}
        className={`
          fixed bottom-6 right-6 z-50
          w-12 h-12 rounded-full
          bg-[#111111] border border-white/10
          flex items-center justify-center
          shadow-lg shadow-black/30
          transition-all duration-500
          hover:bg-[#dc2626] hover:border-[#dc2626] hover:scale-110
          ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}
      >
        {playing ? (
          /* Pause icon */
          <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
            <rect x="3" y="2" width="3.5" height="12" rx="1" />
            <rect x="9.5" y="2" width="3.5" height="12" rx="1" />
          </svg>
        ) : (
          /* Animated sound-wave icon when stopped, play triangle */
          <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
            <path d="M4 3 L13 8 L4 13 Z" />
          </svg>
        )}
      </button>

      {/* Subtle pulse ring when playing */}
      {playing && (
        <span className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-full border border-[#dc2626]/40 animate-ping pointer-events-none" />
      )}
    </>
  )
}
