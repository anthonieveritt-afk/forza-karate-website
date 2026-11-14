import type { Metadata } from 'next'
import MembersArea from '@/components/members/MembersArea'
import KaratekaVote from '@/components/members/KaratekaVote'
import { requireMemberPage } from '@/lib/members/require'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export const metadata: Metadata = {
  title: 'Vote: Karate-ka of the Year — Members',
  description: 'Vote for the Forza Karate Club Karate-ka of the Year.',
  robots: { index: false, follow: false },
}

export default async function MembersVotePage() {
  await requireMemberPage('/members/vote')
  return (
    <div className="min-h-screen bg-[#fafaf9]">
      <MembersArea>
        <KaratekaVote />
      </MembersArea>
    </div>
  )
}
