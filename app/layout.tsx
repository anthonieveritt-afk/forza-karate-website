import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LogoTicker from '@/components/layout/LogoTicker'
import MusicPlayer from '@/components/layout/MusicPlayer'
import { CartProvider } from '@/lib/cart-context'
import { SITE_URL, orgSchema } from '@/lib/seo'
import { Analytics } from '@vercel/analytics/next'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Karate Classes in Rayleigh & Upminster, Essex | Forza Karate Club',
    template: '%s | Forza Karate Club',
  },
  description:
    'Traditional Wado Ryu karate for all ages. Two dojos across Essex — Rayleigh and Upminster. Come and try it out — book a £10 trial class today.',
  keywords: ['karate', 'karate classes', 'karate for kids', 'kids karate', 'martial arts', 'Rayleigh', 'Upminster', 'Essex', 'Hockley', 'Hornchurch', 'FKA', 'Wado Ryu', 'children karate', 'kids martial arts', 'adult karate'],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/fkc-favicon-32.png', type: 'image/png', sizes: '32x32' },
    ],
    apple: [{ url: '/fkc-favicon-180.png', sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: 'Karate Classes in Rayleigh & Upminster, Essex | Forza Karate Club',
    description: 'Karate for kids and adults in Rayleigh and Upminster, Essex. Beginners welcome from age 4. Book a £10 trial class.',
    siteName: 'Forza Karate Club',
    locale: 'en_GB',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-GB">
      <body className="min-h-screen flex flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        <CartProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <LogoTicker />
          <Footer />
          <MusicPlayer />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
