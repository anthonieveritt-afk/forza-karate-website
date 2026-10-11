import Link from 'next/link'
import { MapPin, Clock, ArrowRight, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export type Session = { day: string; dayCode: string; time: string; opens: string; closes: string; desc: string; publicSession?: boolean }
export type Dojo = {
  slug: string
  town: string
  eyebrow: string
  heading: string
  intro: string
  venue: string
  addressLines: string[]
  street: string
  locality: string
  region?: string
  postcode: string
  mapQuery: string
  sessions: Session[]
  faqs: { q: string; a: string }[]
}

const BASE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://forzakarate.co.uk').replace(/\/$/, '')
export const EMAIL = 'hello@forzakarate.co.uk'

export function dojoJsonLd(d: Dojo) {
  const url = `${BASE}/${d.slug}`
  return [
    {
      '@context': 'https://schema.org',
      '@type': ['SportsActivityLocation', 'LocalBusiness'],
      '@id': `${url}#dojo`,
      name: `Forza Karate Club ${d.town}`,
      description: d.intro,
      url,
      email: EMAIL,
      image: `${BASE}/opengraph-image.png`,
      priceRange: '£10–£120',
      sport: 'Karate',
      address: {
        '@type': 'PostalAddress',
        streetAddress: `${d.venue}, ${d.street}`,
        addressLocality: d.locality,
        ...(d.region ? { addressRegion: d.region } : {}),
        postalCode: d.postcode,
        addressCountry: 'GB',
      },
      openingHoursSpecification: d.sessions
        .filter((s) => s.publicSession !== false)
        .map((s) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: `https://schema.org/${s.day}`, opens: s.opens, closes: s.closes })),
      parentOrganization: { '@type': 'SportsOrganization', name: 'Forza Karate Club', url: BASE },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: d.faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ]
}

export default function LocalLandingPage({ dojo: d }: { dojo: Dojo }) {
  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dojoJsonLd(d)) }} />
      <section className="pt-16 sm:pt-20 pb-12 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">{d.eyebrow}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#111111] mb-4">{d.heading}</h1>
          <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mb-8">{d.intro}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg">
              <Link href="/trial-class">Book a £10 trial <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Link href={`/dojos/${d.town.toLowerCase()}`} className="inline-flex items-center justify-center px-5 py-3 rounded-full border border-black/10 text-sm font-medium text-[#111111] hover:border-black/30">
              {d.town} dojo details
            </Link>
          </div>
        </div>
      </section>

      <section className="py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center gap-2 mb-5"><Clock className="h-5 w-5 text-[#dc2626]" /><h2 className="text-2xl font-bold text-[#111111]">Class times</h2></div>
            <div className="space-y-3">
              {d.sessions.map((s, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-[#fafaf9] border border-black/5">
                  <span className="w-24 flex-shrink-0 text-xs font-bold text-[#dc2626] uppercase tracking-wide">{s.day}</span>
                  <div><p className="text-sm font-semibold text-[#111111]">{s.time}</p><p className="text-xs text-gray-500 mt-0.5">{s.desc}</p></div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-4">Term time only — 40 weeks per year.</p>

            <h2 className="text-2xl font-bold text-[#111111] mt-10 mb-4">Prices</h2>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><strong className="text-[#111111]">Trial class:</strong> £10 (covers the trial only, not taken off membership)</li>
              <li><strong className="text-[#111111]">Single:</strong> £50 a month</li>
              <li><strong className="text-[#111111]">Siblings:</strong> £90 a month</li>
              <li><strong className="text-[#111111]">Family:</strong> £120 a month</li>
            </ul>
            <p className="text-xs text-gray-400 mt-3">Membership is paid on the 1st of each month by GoCardless Direct Debit.</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-5"><MapPin className="h-5 w-5 text-[#dc2626]" /><h2 className="text-2xl font-bold text-[#111111]">Where we train</h2></div>
            <address className="not-italic text-sm text-gray-600 mb-4">
              <span className="font-semibold text-[#111111]">{d.venue}</span><br />
              {d.addressLines.map((l) => (<span key={l}>{l}<br /></span>))}
            </address>
            <div className="rounded-2xl overflow-hidden border border-black/5 aspect-[4/3]">
              <iframe
                title={`Map of Forza Karate Club ${d.town}`}
                src={`https://maps.google.com/maps?q=${encodeURIComponent(d.mapQuery)}&output=embed`}
                className="w-full h-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <a href={`mailto:${EMAIL}`} className="mt-4 inline-flex items-center gap-2 text-sm text-[#dc2626] font-medium hover:underline"><Mail className="h-4 w-4" />{EMAIL}</a>
          </div>
        </div>
      </section>

      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-[#fafaf9] border-t border-black/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#111111] mb-6">Questions parents ask</h2>
          <div className="space-y-3">
            {d.faqs.map((f) => (
              <details key={f.q} className="group bg-white rounded-2xl border border-black/5 p-5">
                <summary className="cursor-pointer font-semibold text-[#111111] text-sm">{f.q}</summary>
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">{f.a}</p>
              </details>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button asChild size="lg"><Link href="/trial-class">Book a £10 trial in {d.town} <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
        </div>
      </section>
    </div>
  )
}
