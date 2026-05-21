'use client'

import { useState, useEffect } from 'react'

const photos = [
  { src: '/team/team-01.jpg', alt: 'Team Forza' },
  { src: '/team/team-02.jpg', alt: 'Team Forza' },
  { src: '/team/team-03.jpg', alt: 'Team Forza' },
  { src: '/team/team-04.jpg', alt: 'Team Forza' },
  { src: '/team/team-05.jpg', alt: 'Team Forza' },
  { src: '/team/team-06.jpg', alt: 'Team Forza' },
  { src: '/team/team-07.jpg', alt: 'Team Forza' },
  { src: '/team/team-08.jpg', alt: 'Team Forza' },
  { src: '/team/team-09.jpg', alt: 'Team Forza' },
  { src: '/team/team-10.jpg', alt: 'Team Forza' },
  { src: '/team/team-11.jpg', alt: 'Team Forza' },
  { src: '/team/team-12.jpg', alt: 'Team Forza' },
  { src: '/team/team-13.jpg', alt: 'Team Forza' },
  { src: '/team/team-14.jpg', alt: 'Team Forza' },
  { src: '/team/team-15.jpg', alt: 'Team Forza' },
  { src: '/team/team-16.jpg', alt: 'Team Forza' },
  { src: '/team/team-group.jpg', alt: 'Team Forza group' },
  { src: '/team/team-competition-01.jpg', alt: 'Team Forza competition' },
  { src: '/team/kumite-y-yogarajah.jpg', alt: 'Team Forza kumite' },
  { src: '/team/kumite-q-wong.jpg', alt: 'Team Forza kumite' },
  { src: '/team/kumite-h-dosser.jpg', alt: 'Team Forza kumite' },
  { src: '/team/kumite-q-godfrey.jpg', alt: 'Team Forza kumite' },
  { src: '/team/kumite-a-tebbutt.jpg', alt: 'Team Forza kumite' },
  { src: '/team/kumite-a-buss.jpg', alt: 'Team Forza kumite' },
  { src: '/team/kumite-7.jpg', alt: 'Team Forza kumite' },
  { src: '/team/kumite-new-01.jpg', alt: 'Team Forza kumite' },
  { src: '/team/y-yogarajah.jpg', alt: 'Team Forza kata' },
  { src: '/team/a-wong.jpg', alt: 'Team Forza kata' },
  { src: '/team/q-wong.jpg', alt: 'Team Forza kata' },
  { src: '/team/kata-b-squad-01.jpg', alt: 'Team Forza B Squad' },
  { src: '/team/kata-b-squad-02.jpg', alt: 'Team Forza B Squad' },
  { src: '/team/kata-b-squad-03.jpg', alt: 'Team Forza B Squad' },
  { src: '/team/leo-buss.jpg', alt: 'Team Forza para karate' },
  { src: '/team/anthoni-everitt.jpg', alt: 'Team Forza coach' },
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
