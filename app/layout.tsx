import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LogoTicker from '@/components/layout/LogoTicker'
import MusicPlayer from '@/components/layout/MusicPlayer'
import { CartProvider } from '@/lib/cart-context'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://forzakarate.co.uk'),
  title: {
    default: 'Forza Karate Club — Rayleigh & Upminster',
    template: '%s | Forza Karate Club',
  },
  description:
    'Traditional Wado Ryu karate for all ages. Two dojos across Essex — Rayleigh and Upminster. Come and try it out — book a £10 trial class today.',
  keywords: ['karate', 'martial arts', 'Rayleigh', 'Upminster', 'Essex', 'FKA', 'Wado Ryu', 'children karate', 'kids martial arts'],
  openGraph: {
    title: 'Forza Karate Club',
    description: 'This is where champions begin. Traditional karate across Essex.',
    siteName: 'Forza Karate Club',
    locale: 'en_GB',
    type: 'website',
  },
}

const SITE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://forzakarate.co.uk').replace(/\/$/, '')
const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'SportsOrganization',
  name: 'Forza Karate Club',
  url: SITE,
  logo: `${SITE}/forza-logo.webp`,
  sport: 'Karate',
  location: [
    {
      '@type': 'SportsActivityLocation',
      name: 'Forza Karate Club — Rayleigh Dojo',
      url: `${SITE}/dojos/rayleigh`,
      address: { '@type': 'PostalAddress', streetAddress: 'Rayleigh Primary School, Love Lane', addressLocality: 'Rayleigh', addressRegion: 'Essex', postalCode: 'SS6 7DD', addressCountry: 'GB' },
    },
    {
      '@type': 'SportsActivityLocation',
      name: 'Forza Karate Club — Upminster Dojo',
      url: `${SITE}/dojos/upminster`,
      address: { '@type': 'PostalAddress', streetAddress: 'St Lawrence Church Hall, Corbets Tey Road', addressLocality: 'Upminster', postalCode: 'RM14 2BB', addressCountry: 'GB' },
    },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <LogoTicker />
          <Footer />
          <MusicPlayer />
        </CartProvider>
      </body>
    </html>
  )
}
