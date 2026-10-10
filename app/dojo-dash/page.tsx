import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Dojo Dash: Kids Karate Game',
  description: 'Dojo Dash is a free karate game for Forza kids. Play on phone, tablet or computer, then book a free trial class.',
  alternates: { canonical: '/dojo-dash' },
}

export default function DojoDashPage() {
  return (
    <main className="bg-white pt-24 pb-12">
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Dojo Dash</h1>
        <p className="mt-3 text-gray-700">
          A fun karate game for Forza kids. Dodge, jump and earn your belts. Works on phones, tablets and computers.
          Parents: want the real thing?{' '}
          <Link href="/trial-class" className="font-medium text-[#dc2626] underline underline-offset-2 hover:text-[#b91c1c]">
            Book a free trial
          </Link>
          .
        </p>
      </div>
      <div className="mt-6 w-full">
        <iframe
          src="/games/dojo-dash/index.html"
          title="Dojo Dash karate game"
          className="block w-full border-0 bg-black"
          style={{ height: 'min(85vh, 900px)', minHeight: 480, touchAction: 'manipulation' }}
          allow="fullscreen; autoplay"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <div className="mx-auto max-w-5xl px-4 mt-6 text-center">
        <Link href="/trial-class" className="inline-block rounded-lg bg-[#dc2626] px-6 py-3 font-semibold text-white hover:bg-[#b91c1c]">
          Book a free trial
        </Link>
      </div>
    </main>
  )
}
