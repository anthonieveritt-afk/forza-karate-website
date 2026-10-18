// Shared SEO helpers: one canonical host, per-page canonical + Open Graph, and the
// club's LocalBusiness / SportsActivityLocation schema built from the dojo timetables.
import type { Metadata } from 'next'

/** Canonical host. Set NEXT_PUBLIC_SITE_URL=https://forzakarate.co.uk in Production at cutover. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://forzakarate.co.uk').replace(/\/$/, '')

type PageMetaInput = {
  path: string
  title: string
  description: string
  /** Use the title exactly as given (no " | Forza Karate Club" suffix). */
  absoluteTitle?: boolean
}

/** Title, description, canonical URL and matching Open Graph tags for one public page. */
export function pageMeta({ path, title, description, absoluteTitle }: PageMetaInput): Metadata {
  const ogTitle = absoluteTitle ? title : `${title} | Forza Karate Club`
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title: ogTitle,
      description,
      url: path,
      siteName: 'Forza Karate Club',
      locale: 'en_GB',
      type: 'website',
    },
  }
}

export type TimetableSlot = { day: string; time: string; desc: string; opens: string; closes: string }

export const RAYLEIGH_TIMETABLE: TimetableSlot[] = [
  { day: 'Tuesday',  time: '6:15 – 7:00pm',  desc: 'Ages 4–10 · all grades', opens: '18:15', closes: '19:00' },
  { day: 'Tuesday',  time: '7:00 – 8:00pm',  desc: '11 years+ · all grades', opens: '19:00', closes: '20:00' },
  { day: 'Friday',   time: '3:40 – 4:40pm',  desc: 'After-school club · Rayleigh Primary School pupils only', opens: '15:40', closes: '16:40' },
  { day: 'Saturday', time: '10:00 – 11:00am', desc: 'Ages 4+ · all grades', opens: '10:00', closes: '11:00' },
]

export const UPMINSTER_TIMETABLE: TimetableSlot[] = [
  { day: 'Wednesday', time: '4:00 – 4:30pm',  desc: 'Beginner infants (4–6 yrs)', opens: '16:00', closes: '16:30' },
  { day: 'Wednesday', time: '4:30 – 5:00pm',  desc: 'Infant all grades (4–6 yrs)', opens: '16:30', closes: '17:00' },
  { day: 'Wednesday', time: '5:00 – 5:45pm',  desc: 'Junior all grades (7–10 yrs)', opens: '17:00', closes: '17:45' },
  { day: 'Wednesday', time: '5:45 – 7:00pm',  desc: 'Senior all grades (11 years+)', opens: '17:45', closes: '19:00' },
]

const hours = (slots: TimetableSlot[]) =>
  slots.map((s) => ({
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: `https://schema.org/${s.day}`,
    opens: s.opens,
    closes: s.closes,
    description: s.desc.replace(' · ', ', '),
  }))

const AREA = ['Rayleigh', 'Hockley', 'Wickford', 'Thundersley', 'Benfleet', 'Southend-on-Sea', 'Upminster', 'Hornchurch', 'Cranham', 'Romford', 'Essex']

export const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'SportsOrganization',
  '@id': `${SITE_URL}/#organization`,
  name: 'Forza Karate Club',
  url: SITE_URL,
  logo: `${SITE_URL}/forza-logo.webp`,
  image: `${SITE_URL}/opengraph-image.png`,
  description: 'Karate classes for kids and adults in Rayleigh and Upminster, Essex. Beginners welcome from age 4. Book a £10 trial class.',
  sport: 'Karate',
  areaServed: AREA.map((name) => ({ '@type': 'Place', name })),
  location: [
    {
      '@type': 'SportsActivityLocation',
      '@id': `${SITE_URL}/dojos/rayleigh#dojo`,
      name: 'Forza Karate Club — Rayleigh Dojo',
      url: `${SITE_URL}/dojos/rayleigh`,
      image: `${SITE_URL}/opengraph-image.png`,
      priceRange: '££',
      address: { '@type': 'PostalAddress', streetAddress: 'Rayleigh Primary School, Love Lane', addressLocality: 'Rayleigh', addressRegion: 'Essex', postalCode: 'SS6 7DD', addressCountry: 'GB' },
      openingHoursSpecification: hours(RAYLEIGH_TIMETABLE),
    },
    {
      '@type': 'SportsActivityLocation',
      '@id': `${SITE_URL}/dojos/upminster#dojo`,
      name: 'Forza Karate Club — Upminster Dojo',
      url: `${SITE_URL}/dojos/upminster`,
      image: `${SITE_URL}/opengraph-image.png`,
      priceRange: '££',
      address: { '@type': 'PostalAddress', streetAddress: 'St Lawrence Church Hall, Corbets Tey Road', addressLocality: 'Upminster', addressRegion: 'Essex', postalCode: 'RM14 2BB', addressCountry: 'GB' },
      openingHoursSpecification: hours(UPMINSTER_TIMETABLE),
    },
  ],
}
