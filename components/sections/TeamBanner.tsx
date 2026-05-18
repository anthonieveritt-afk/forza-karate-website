'use client'

import { useState, useEffect } from 'react'

const photos = [
  { src: '/team/team-01.jpg', alt: 'Team Forza 1' },
  { src: '/team/team-02.jpg', alt: 'Team Forza 2' },
  { src: '/team/team-03.jpg', alt: 'Team Forza 3' },
  { src: '/team/team-04.jpg', alt: 'Team Forza 4' },
  { src: '/team/team-05.jpg', alt: 'Team Forza 5' },
  { src: '/team/team-06.jpg', alt: 'Team Forza 6' },
  { src: '/team/team-07.jpg', alt: 'Team Forza 7' },
  { src: '/team/team-08.jpg', alt: 'Team Forza 8' },
  { src: '/team/team-09.jpg', alt: 'Team Forza 9' },
  { src: '/team/team-10.jpg', alt: 'Team Forza 10' },
  { src: '/team/team-11.jpg', alt: 'Team Forza 11' },
]

export default function TeamBanner() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        setCurrent(i => (i + 1) % photos.length)
        setFading(false)
      }, 700)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-[85vh] flex items-center overflow-hidden bg-white">
      {/* Background photo — crossfades */}
      <div
        className="absolute inset-0 transition-opacity duration-700"
        style={{ opacity: fading ? 0 : 1 }}
      >
        <img
          key={photos[current].src}
          src={photos[current].src}
          alt={photos[current].alt}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center top',
          }}
        />
      </div>

      {/* White fade — right side blend */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-white" />

      {/* Text — right side over white fade */}
      <div className="relative z-10 ml-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="ml-auto max-w-lg py-24">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">
              Team Forza
            </span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#111111] leading-[1.05] tracking-tight mb-6">
            Built to<br />
            <span className="text-[#dc2626]">compete.</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Our competitive squad represents Forza Karate Club at regional and national level in both kata and kumite disciplines.
          </p>
        </div>
      </div>
    </div>
  )
}
