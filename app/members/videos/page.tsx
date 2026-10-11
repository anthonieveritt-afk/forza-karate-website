import type { Metadata } from 'next'
import Link from 'next/link'
import { cookies } from 'next/headers'
import { Lock, PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import RestoreAccess from '@/components/paid/RestoreAccess'
import { getForzaStripe } from '@/lib/paid/stripe'
import { gbp, VIDEOS, VIDEO_MONTHLY_PENCE } from '@/lib/paid/catalogue'
import { hasActiveVideoSub, verifyAccess, VIDEO_COOKIE } from '@/lib/paid/video-access'
import { getMemberPortalData } from '@/app/actions/portal'

export const metadata: Metadata = { title: 'Members’ Videos — Forza Karate', robots: { index: false } }
export const dynamic = 'force-dynamic'

// Who can watch: (a) a Stripe video subscriber (signed cookie, re-checked with Stripe),
// or (b) a club member logged in to the member portal, when VIDEOS_FREE_FOR_MEMBERS isn't "false".
async function access(): Promise<'subscriber' | 'member' | null> {
  const jar = await cookies()
  const cid = verifyAccess(jar.get(VIDEO_COOKIE)?.value)
  const stripe = getForzaStripe()
  if (cid && stripe) {
    try { if (await hasActiveVideoSub(stripe, cid)) return 'subscriber' } catch { /* ignore */ }
  }
  if (process.env.VIDEOS_FREE_FOR_MEMBERS !== 'false' && jar.get('forza-members-auth')?.value) {
    const me = await getMemberPortalData()
    if (me) return 'member'
  }
  return null
}

export default async function VideosPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams
  const who = await access()

  if (!who) {
    return (
      <div className="bg-white min-h-screen px-4 py-20">
        <div className="max-w-lg mx-auto text-center">
          <Lock className="h-12 w-12 text-[#dc2626] mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-[#111111] mb-3">Members&apos; videos</h1>
          {error === 'no-subscription' && <p className="text-sm text-red-600 mb-4">We couldn&apos;t find an active video membership for that link.</p>}
          <p className="text-gray-500 mb-8">Join the video membership for {gbp(VIDEO_MONTHLY_PENCE)} a month, or log in to the member portal.</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
            <Button asChild><Link href="/grading-guides#videos">Join the video membership</Link></Button>
            <Button asChild variant="outline"><Link href="/members?redirect=/members/videos">Member portal login</Link></Button>
          </div>
          <p className="text-sm text-gray-500 mb-3">Subscribed on another device?</p>
          <RestoreAccess />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white min-h-screen px-4 sm:px-6 lg:px-8 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold text-[#111111] mb-2">Members&apos; videos</h1>
        <p className="text-gray-500 mb-10">Practise between classes. New videos are added regularly.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {VIDEOS.map((v) => (
            <div key={v.id} className="rounded-2xl border border-black/8 overflow-hidden">
              {v.youtubeId ? (
                <iframe className="w-full aspect-video" src={`https://www.youtube-nocookie.com/embed/${v.youtubeId}?rel=0`}
                  title={v.title} allow="accelerometer; encrypted-media; gyroscope; picture-in-picture" allowFullScreen loading="lazy" />
              ) : (
                <div className="w-full aspect-video bg-[#111111] flex flex-col items-center justify-center text-gray-400">
                  <PlayCircle className="h-10 w-10 mb-2" /><span className="text-xs">Video coming soon</span>
                </div>
              )}
              <p className="p-4 text-sm font-medium text-[#111111]">{v.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
