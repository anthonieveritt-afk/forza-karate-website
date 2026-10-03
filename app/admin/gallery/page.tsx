import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { MEMBERS_COOKIE, verifyMemberToken } from '@/lib/members-auth'
import GalleryAdminClient from './GalleryAdminClient'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Gallery admin',
  robots: { index: false, follow: false },
}

export default async function GalleryAdminPage() {
  const token = (await cookies()).get(MEMBERS_COOKIE)?.value
  if (!(await verifyMemberToken(token))) {
    redirect('/members?redirect=/admin/gallery')
  }
  return <GalleryAdminClient />
}
