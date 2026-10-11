import type { Metadata } from 'next'
import Link from 'next/link'
import { FileText, PlayCircle } from 'lucide-react'
import BuyButton from '@/components/paid/BuyButton'
import { BELTS, gbp, GUIDE_BUNDLE_PRICE_PENCE, GUIDE_PRICE_PENCE, PRICES_ARE_PLACEHOLDERS, VIDEO_MONTHLY_PENCE } from '@/lib/paid/catalogue'

export const metadata: Metadata = {
  title: 'Grading Guides & Video Membership',
  description: 'Downloadable Forza Karate grading guides for every belt, plus a members’ video library.',
}

export default function GradingGuidesPage() {
  return (
    <div className="bg-white">
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Train at home</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-[#111111] mb-4 leading-tight">Grading guides<br />&amp; videos</h1>
          <p className="text-xl text-gray-500 max-w-2xl">A printable PDF guide for each belt, and a members&apos; video library to practise between classes.</p>
          {PRICES_ARE_PLACEHOLDERS && (
            <p className="mt-6 inline-block text-xs font-semibold uppercase tracking-wider bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full">
              Preview — prices and guide content are placeholders
            </p>
          )}
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl font-bold text-[#111111]">Belt guides (PDF)</h2>
              <p className="text-gray-500 text-sm mt-1">{gbp(GUIDE_PRICE_PENCE)} each, or every belt for {gbp(GUIDE_BUNDLE_PRICE_PENCE)}. Instant download after payment.</p>
            </div>
            <div className="sm:w-64"><BuyButton endpoint="/api/guides-checkout" payload={{ belt: 'bundle' }} label={`All ${BELTS.length} guides — ${gbp(GUIDE_BUNDLE_PRICE_PENCE)}`} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BELTS.map((b) => (
              <div key={b.slug} className="rounded-2xl border border-black/8 p-5 flex flex-col">
                <div className="h-3 rounded-full mb-4 border border-black/10" style={{ background: b.colour }} />
                <div className="flex items-start gap-2 mb-4 flex-1">
                  <FileText className="h-4 w-4 text-[#dc2626] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-400">{b.grade}</p>
                    <p className="font-semibold text-[#111111] text-sm">{b.name}</p>
                  </div>
                </div>
                <BuyButton endpoint="/api/guides-checkout" payload={{ belt: b.slug }} label={`Buy — ${gbp(GUIDE_PRICE_PENCE)}`} variant="outline" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="videos" className="py-16 px-4 sm:px-6 lg:px-8 bg-[#fafaf9] border-t border-black/5">
        <div className="max-w-3xl mx-auto text-center">
          <PlayCircle className="h-10 w-10 text-[#dc2626] mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-[#111111] mb-3">Video membership</h2>
          <p className="text-gray-500 mb-8">Technique and kata videos from your instructors, to practise at home. {gbp(VIDEO_MONTHLY_PENCE)} a month, cancel any time.</p>
          <div className="max-w-xs mx-auto"><BuyButton endpoint="/api/video-checkout" label={`Join — ${gbp(VIDEO_MONTHLY_PENCE)}/month`} /></div>
          <p className="text-sm text-gray-500 mt-6">
            Already a member? <Link href="/members/videos" className="text-[#dc2626] hover:underline">Open the videos</Link>
          </p>
        </div>
      </section>
    </div>
  )
}
