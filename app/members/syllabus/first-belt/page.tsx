import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getMemberPortalData } from '@/app/actions/portal'
import { FirstBeltContent } from '@/components/syllabus/FirstBeltContent'
import { MembersShell, DraftNote } from '@/components/syllabus/MembersShell'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'First Belt Stripe Tasks — Members', robots: { index: false, follow: false } }

export default async function FirstBeltPage() {
  if (!(await getMemberPortalData())) redirect('/members?redirect=/members/syllabus/first-belt')
  return (
    <MembersShell>
      <Link href="/members/syllabus/full" className="text-sm text-[#dc2626] hover:underline">← Back to the syllabus</Link>
      <h1 className="text-3xl font-bold text-[#111111] mt-3 mb-1">18th Kyu: stripe tasks</h1>
      <p className="text-gray-600 mb-2">Earn these 5 stripes on your white belt before grading to 17th Kyu.</p>
      <DraftNote>Spelling ‘hiza geri’ (draft said ‘heiza geri’) and stance name ‘fudo dachi’.</DraftNote>
      <div className="mt-8"><FirstBeltContent /></div>
    </MembersShell>
  )
}
