import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Download, AlertCircle } from 'lucide-react'
import { getForzaStripe } from '@/lib/paid/stripe'
import { BELTS, getBelt } from '@/lib/paid/catalogue'

export const metadata: Metadata = { title: 'Your Grading Guides — Forza Karate', robots: { index: false } }
export const dynamic = 'force-dynamic'

export default async function GuidesSuccess({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams
  let belts: typeof BELTS = []
  const stripe = getForzaStripe()
  if (stripe && session_id) {
    try {
      const s = await stripe.checkout.sessions.retrieve(session_id)
      if (s.payment_status === 'paid' && s.metadata?.kind === 'guide') {
        const g = s.metadata.guides
        belts = g === 'bundle' ? BELTS : [getBelt(g || '')].filter((b): b is (typeof BELTS)[number] => Boolean(b))
      }
    } catch { /* not found */ }
  }
  return (
    <div className="bg-white min-h-screen px-4 py-20">
      <div className="max-w-lg mx-auto">
        {belts.length ? (
          <>
            <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-[#111111] mb-3 text-center">Thanks — here are your guides</h1>
            <p className="text-gray-500 text-center mb-8">Bookmark this page to download them again later.</p>
            <ul className="space-y-2">
              {belts.map((b) => (
                <li key={b.slug}>
                  <a href={`/api/grading-guides/download?session_id=${encodeURIComponent(session_id!)}&belt=${b.slug}`}
                     className="flex items-center justify-between rounded-xl border border-black/8 px-4 py-3 hover:border-[#dc2626]">
                    <span className="text-sm"><span className="text-gray-400">{b.grade}</span> · {b.name}</span>
                    <Download className="h-4 w-4 text-[#dc2626]" />
                  </a>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="text-center">
            <AlertCircle className="h-14 w-14 text-amber-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-[#111111] mb-3">We couldn&apos;t find that purchase</h1>
            <p className="text-gray-500 mb-6">If you&apos;ve paid, please <Link href="/contact" className="text-[#dc2626] underline">contact us</Link> and we&apos;ll send your guides.</p>
          </div>
        )}
      </div>
    </div>
  )
}
