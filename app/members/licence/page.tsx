import type { Metadata } from 'next'
import { Suspense } from 'react'
import MembersArea from '@/components/members/MembersArea'
import { ApplyLicenceForm } from '@/components/licence/ApplyLicenceForm'
import { requireMemberPage } from '@/lib/members/require'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Renew Your Licence — Members',
  description: 'Renew your FKA licence and insurance as a Forza Karate Club member.',
  robots: { index: false, follow: false },
}

export default async function MembersLicencePage() {
  await requireMemberPage('/members/licence')

  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <MembersArea>
        <Suspense fallback={<p className="text-sm text-gray-500">Loading licence form…</p>}>
          <ApplyLicenceForm forceRenewal embedded />
        </Suspense>
      </MembersArea>
    </div>
  )
}
