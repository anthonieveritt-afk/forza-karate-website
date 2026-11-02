import type { Metadata } from 'next'
import Link from 'next/link'
import DojoDashGate from './DojoDashGate'

export const metadata: Metadata = {
  title: 'Forza Game — karate learning game for Forza junior members and families',
  description:
    'Forza Game is a free Forza Karate Club learning game for junior members and families. Play on phone, tablet or computer. Parents can book a £10 trial class.',
  alternates: { canonical: '/dojo-dash' },
}

export default function DojoDashPage() {
  return (
    <main className="bg-white pt-24 pb-12">
      <div className="mx-auto max-w-5xl px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Forza Game</h1>
        <p className="mt-3 text-gray-700">
          A Forza Karate Club learning game for junior members and families. Dodge, jump and earn
          your belts. Works on phones, tablets and computers. Parents: want the real thing?{' '}
          <Link
            href="/trial-class"
            className="font-medium text-[#dc2626] underline underline-offset-2 hover:text-[#b91c1c]"
          >
            Book a £10 trial at Forza Karate Club
          </Link>
          .
        </p>
      </div>
      <DojoDashGate />
      <div className="mx-auto max-w-5xl px-4 mt-6 text-center">
        <Link
          href="/trial-class"
          className="inline-block rounded-lg bg-[#dc2626] px-6 py-3 font-semibold text-white hover:bg-[#b91c1c]"
        >
          Parents — book a £10 trial
        </Link>
        <p className="mt-3 text-sm text-gray-500">for a real karate class with Forza Karate Club.</p>
      </div>
    </main>
  )
}
