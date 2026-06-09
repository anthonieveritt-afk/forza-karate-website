'use client'

import { useRef, useState } from 'react'

const sponsors = [
  {
    name: 'Favourite Chicken & Ribs',
    logo: '/sponsors/favorite.webp',
    href: 'https://favorite.co.uk/store-finder/favorite-chicken-ribs-rayleigh.html',
  },
  {
    name: 'Sport Karate Coaching',
    logo: '/sponsors/sport-karate-coaching.jpg',
    href: 'https://sportkaratecoaching.co.uk',
  },
  {
    name: 'VM Elevators',
    logo: '/sponsors/vm-elevators.webp',
    href: 'https://vmelevators.com',
  },
  {
    name: 'Direct Property Care',
    logo: '/sponsors/direct-property-care.jpg',
    href: '#',
  },
]

// Triple the list so the seamless loop works at any screen width
const items = [...sponsors, ...sponsors, ...sponsors]

function SponsorLogo({ s, index }: { s: typeof sponsors[0]; index: number }) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      key={index}
      href={s.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex-shrink-0 flex items-center justify-center"
      aria-label={s.name}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        transition: 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1), opacity 300ms ease',
        transform: hovered ? 'scale(1.55) translateY(-6px)' : 'scale(1)',
        opacity: hovered ? 1 : 0.55,
        transformOrigin: 'bottom center',
        zIndex: hovered ? 10 : 1,
        position: 'relative',
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={s.logo}
        alt={s.name}
        style={{ height: '72px', width: 'auto', objectFit: 'contain', display: 'block' }}
      />
    </a>
  )
}

export default function LogoTicker() {
  return (
    <div className="bg-white border-t border-black/8 border-b border-black/8 py-6 overflow-hidden">
      <p className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-5">
        Our Partners &amp; Sponsors
      </p>
      <div className="relative flex" style={{ paddingBottom: '16px' }}>
        <div className="flex animate-ticker gap-28 items-end">
          {items.map((s, i) => (
            <SponsorLogo key={i} s={s} index={i} />
          ))}
        </div>
      </div>
    </div>
  )
}
