import { CheckCircle, AlertTriangle } from 'lucide-react'
import { processBillingRequest, type FulfilResult } from '@/lib/gocardless/fulfil'
import { loadSignup } from '@/lib/gocardless/store'

export const dynamic = 'force-dynamic'
export const maxDuration = 30
export const metadata = { title: 'Membership confirmed | Forza Karate Club', robots: { index: false } }

type View = { kind: 'confirmed' | 'received' | 'failed'; start?: string | null }

/**
 * Server-rendered: the confirmation runs on this request, so the first paint is the answer.
 * Not fulfilled yet / Honbu slow → "You're all set" (card already paid); webhook + cron finish.
 */
async function resolve(br: string): Promise<View> {
  if (!/^BRQ[0-9A-Z]+$/.test(br)) return { kind: 'failed' }
  let r: FulfilResult
  try {
    r = await Promise.race([
      processBillingRequest(br, { honbuWaits: [0] }),
      new Promise<FulfilResult>(res => setTimeout(() => res({ state: 'pending', status: 'timeout' }), 12000)),
    ])
  } catch (e) {
    console.error('done page fulfil error', br, e)
    r = { state: 'pending', status: 'error' }
  }
  if (r.state === 'done') return { kind: r.outcome.honbu.ok ? 'confirmed' : 'received', start: r.outcome.subscriptionStart }
  if (r.state === 'pending' && r.status === 'cancelled') return { kind: 'failed' }
  if (r.state === 'unknown') {
    const s = await loadSignup(br).catch(() => null)
    return s?.stripe?.paidAt ? { kind: 'received' } : { kind: 'failed' }
  }
  return { kind: 'received' }
}

export default async function Page({ searchParams }: { searchParams: Promise<{ br?: string }> }) {
  const br = (await searchParams).br ?? ''
  const v = await resolve(br)
  const startLabel = v.start ? new Date(v.start + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long' }) : null
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 pt-24">
      <div className="text-center max-w-md">
        {v.kind !== 'failed' ? <>
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">{v.kind === 'confirmed' ? 'Welcome to Forza Karate Club!' : "You're all set!"}</h1>
          <p className="text-gray-500 text-sm">
            Your card payment and Direct Debit are received{startLabel ? `; monthly fees start ${startLabel}` : ''}.
            {v.kind === 'confirmed'
              ? ' GoCardless will email you a confirmation, and we\u2019ll be in touch about your first class as a member.'
              : ' We\u2019re finishing your membership record and will email you to confirm. There\u2019s nothing more you need to do, and you won\u2019t be charged again.'}
          </p>
        </> : <>
          <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold mb-2">Your Direct Debit wasn&apos;t completed</h1>
          <p className="text-gray-500 text-sm mb-4">If you already paid by card, you won&apos;t be charged again. Please get in touch and we&apos;ll sort it out with you.</p>
          <a href={`/contact?subject=${encodeURIComponent('Membership sign-up' + (br ? ` (${br})` : ''))}`} className="inline-block rounded-xl bg-[#dc2626] text-white text-sm font-semibold px-5 py-3">Contact the club</a>
        </>}
      </div>
    </div>
  )
}
