import Image from 'next/image'
import Link from 'next/link'

const sponsors = [
  {
    name: 'Favourite Chicken & Ribs',
    logo: '/sponsors/favorite.png',
    href: 'https://favorite.co.uk/store-finder/favorite-chicken-ribs-rayleigh.html',
  },
  {
    name: 'Sport Karate Coaching',
    logo: '/sponsors/sport-karate-coaching.jpg',
    href: 'https://sportkaratecoaching.co.uk',
  },
  {
    name: 'VM Elevators',
    logo: '/sponsors/vm-elevators.png',
    href: 'https://vmelevators.com',
  },
]

// Duplicate so the scroll loops seamlessly
const items = [...sponsors, ...sponsors, ...sponsors]

export default function LogoTicker() {
  return (
    <div className="bg-[#0a0a0a] border-t border-white/5 py-6 overflow-hidden">
      <p className="text-center text-xs font-medium text-gray-500 uppercase tracking-widest mb-5">
        Our Partners &amp; Sponsors
      </p>
      <div className="relative flex">
        <div className="flex animate-ticker gap-16 items-center whitespace-nowrap">
          {items.map((s, i) => (
            <Link
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity duration-300"
              aria-label={s.name}
            >
              <Image
                src={s.logo}
                alt={s.name}
                width={140}
                height={56}
                className="h-12 w-auto object-contain filter brightness-0 invert"
                unoptimized
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
