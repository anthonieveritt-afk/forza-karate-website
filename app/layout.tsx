import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import LogoTicker from '@/components/layout/LogoTicker'
import MusicPlayer from '@/components/layout/MusicPlayer'
import { CartProvider } from '@/lib/cart-context'

export const metadata: Metadata = {
  title: {
    default: 'Forza Karate Club — Rayleigh & Upminster',
    template: '%s | Forza Karate Club',
  },
  description:
    'Traditional Wado Ryu karate for all ages. Two dojos across Essex — Rayleigh and Upminster. Book a free trial class today.',
  keywords: ['karate', 'martial arts', 'Rayleigh', 'Upminster', 'Essex', 'FKA', 'Wado Ryu', 'children karate', 'kids martial arts'],
  openGraph: {
    title: 'Forza Karate Club',
    description: 'This is where champions begin. Traditional karate across Essex.',
    url: 'https://www.forzakarate.co.uk',
    siteName: 'Forza Karate Club',
    locale: 'en_GB',
    type: 'website',
  },
  // DEVELOPMENT ONLY: keep every page out of search results until launch.
  // Flip this (and app/robots.ts + the X-Robots-Tag header in next.config.ts) when the site goes live.
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
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
