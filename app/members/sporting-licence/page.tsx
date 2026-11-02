import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertCircle, CheckCircle } from 'lucide-react'
import MembersArea from '@/components/members/MembersArea'
import { SportingLicenceBuy } from '@/components/members/SportingLicenceBuy'
import { requireMemberPage } from '@/lib/members/require'
import { getMemberPortalData } from '@/app/actions/portal'
import { ekngbStatus, formatUkDate } from '@/lib/members/sporting'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Sporting Licence — Members',
  description: 'Buy your Sport:80 Sporting licence as a Forza Karate Club member.',
  robots: { index: false, follow: false },
}

export default async function SportingLicencePage({ searchParams }: { searchParams: Promise<{ cancelled?: string }> }) {
  await requireMemberPage('/members/sporting-licence')
  const { cancelled } = await searchParams
  const data = await getMemberPortalData()
  const ek = ekngbStatus(data?.profile?.licenceExpiryDate)

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <MembersArea>
        <div className="max-w-3xl">
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-[#dc2626]" />
              <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Members</span>
            </div>
            <h1 className="text-4xl font-bold text-[#111111] mb-2">Sporting licence</h1>
            <p className="text-gray-500">Buy your Sport:80 Sporting licence for competitions and events — <strong className="text-[#111111]">£33</strong> for 12 months.</p>
          </div>

          <div className="mb-6 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
            <strong>Please note:</strong> a current EKNGB licence must be valid and in date to purchase a Sporting licence.
          </div>

          <div className="bg-white rounded-2xl border border-black/8 p-8 shadow-sm space-y-6">
            {ek.ok ? (
              <div className="flex gap-3 text-sm text-green-800">
                <CheckCircle className="h-5 w-5 shrink-0 text-green-600" />
                <p>Your EKNGB licence{data?.profile?.licenceNumber ? ` (${data.profile.licenceNumber})` : ''} is in date until <strong>{formatUkDate(ek.expiry!)}</strong> — you can buy a Sporting licence.</p>
              </div>
            ) : (
              <div className="flex gap-3 text-sm text-red-800">
                <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
                <p>
                  {ek.reason === 'expired'
                    ? <>Your EKNGB licence expired on <strong>{formatUkDate(ek.expiry!)}</strong>.</>
                    : <>We can&apos;t find a current EKNGB licence on your record.</>}{' '}
                  Please <Link href="/members/licence" className="underline font-medium">renew your EKNGB licence</Link> first, then come back to buy your Sporting licence.
                </p>
              </div>
            )}
            <div className="flex items-baseline justify-between border-t border-black/8 pt-6">
              <span className="font-medium text-[#111111]">Sporting Licence (Sport:80)</span>
              <span className="text-2xl font-bold text-[#111111]">£33</span>
            </div>
            {cancelled && <p className="text-sm text-gray-500">Checkout was cancelled — you haven&apos;t been charged.</p>}
            <SportingLicenceBuy allowed={ek.ok} />
            <p className="text-xs text-gray-400">Secure card payment by Stripe. Once paid, your Sporting licence will appear under My licence → Sporting when it&apos;s issued.</p>
          </div>
        </div>
      </MembersArea>
    </div>
  )
}
