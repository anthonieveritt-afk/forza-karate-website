'use client'

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
]

// Triple the list so the seamless loop works at any screen width
const items = [...sponsors, ...sponsors, ...sponsors]

export default function LogoTicker() {
  return (
    <div className="bg-white border-t border-black/8 border-b border-black/8 py-6 overflow-hidden">
      <p className="text-center text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-5">
        Our Partners &amp; Sponsors
      </p>
      <div className="relative flex">
        <div className="flex animate-ticker gap-28 items-center">
          {items.map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300"
              aria-label={s.name}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={s.logo}
                alt={s.name}
                style={{ height: '72px', width: 'auto', objectFit: 'contain', display: 'block' }}
              />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
