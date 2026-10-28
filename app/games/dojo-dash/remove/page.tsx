import type { Metadata } from 'next'
import Link from 'next/link'
import RemoveForm from './RemoveForm'

export const metadata: Metadata = {
  title: 'Forza Game: Request Score Removal',
  description: 'Ask for a Forza Game leaderboard entry to be removed.',
  robots: { index: false, follow: true },
}

export default function DojoDashRemovePage() {
  return (
    <div className="bg-white">
      <section className="pt-20 pb-10 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Forza Game</span>
          </div>
          <h1 className="text-4xl font-bold text-[#111111] mb-4">Remove a leaderboard score</h1>
          <p className="text-gray-600 text-sm leading-relaxed">
            <strong>Quickest way:</strong> on the device that saved the score, open{' '}
            <Link href="/dojo-dash" className="text-[#dc2626] hover:underline">Forza Game</Link>, tap{' '}
            <strong>🗑 My scores</strong> and choose <strong>Remove my score</strong>. It is deleted straight away.
          </p>
          <p className="text-gray-600 text-sm leading-relaxed mt-3">
            Saved it on another device, or cleared your browser? Fill in this form instead. We only need the
            nickname and game mode, so please don&apos;t include any real names or contact details.
          </p>
        </div>
      </section>
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <RemoveForm />
          <p className="text-gray-500 text-xs mt-8">
            We process requests within 2 working days (and always within one month). You can also email{' '}
            <a href="mailto:sensei.everitt@forzakarate.co.uk" className="text-[#dc2626] hover:underline">sensei.everitt@forzakarate.co.uk</a>.
            See the <Link href="/privacy-policy#dojo-dash" className="text-[#dc2626] hover:underline">privacy notice</Link> for details.
          </p>
        </div>
      </section>
    </div>
  )
}
