import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getForzaStripe } from '@/lib/paid/stripe'

export const dynamic = 'force-dynamic'

const BUY_URL = 'https://book.stripe.com/6oUfZbgiTf51ehI0xT6Ri00'
const PAYMENT_LINK = 'plink_1UXrXs8NPYAdovVdGcnwZQiR'

export const metadata: Metadata = {
  title: 'Awards Evening & Christmas Party 2026',
  description: 'Friday 27 November 2026, 6:00 PM at Rayleigh Dojo – Rayleigh Primary School. Tickets £5 per group.',
  alternates: { canonical: '/events/awards-christmas-2026' },
  openGraph: { images: ['/news/awards-evening-christmas-party-2026.webp'] },
}

type Group = { id: string; main: string; names: string; amount: number }

async function getGroups(): Promise<Group[] | null> {
  const stripe = getForzaStripe()
  if (!stripe) return null
  try {
    const out: Group[] = []
    for await (const s of stripe.checkout.sessions.list({ payment_link: PAYMENT_LINK, limit: 100 })) {
      if (s.payment_status !== 'paid') continue
      const f = (k: string) => s.custom_fields?.find((c) => c.key === k)?.text?.value?.trim() || ''
      out.push({ id: s.id, main: f('main_member') || s.customer_details?.name || 'Forza member', names: f('group_names'), amount: (s.amount_total || 0) / 100 })
      if (out.length >= 500) break
    }
    return out.reverse()
  } catch (e) {
    console.error('awards attendees', e)
    return null
  }
}

function BuyButton() {
  return (
    <a href={BUY_URL} className="inline-block rounded-lg bg-[#dc2626] px-6 py-3 font-semibold text-white hover:bg-[#b91c1c]">
      🎟️ Buy tickets – £5 per group
    </a>
  )
}

export default async function AwardsEvent({ searchParams }: { searchParams: Promise<{ paid?: string }> }) {
  const paid = (await searchParams).paid === '1'
  const groups = await getGroups()
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {paid && (
        <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800">
          Thank you — your tickets are booked! Your group will appear in the list below shortly.
        </div>
      )}
      <p className="text-sm font-medium text-[#dc2626]">Events</p>
      <h1 className="mt-1 text-3xl font-bold">🎄🏆 Forza Karate Awards Evening &amp; Christmas Party 2026</h1>
      <p className="mt-3 text-lg">📅 Friday 27 November 2026 · ⏰ 6:00 PM · 📍 Rayleigh Dojo – Rayleigh Primary School</p>
      <div className="my-6"><BuyButton /></div>
      <Image src="/news/awards-evening-christmas-party-2026.webp" alt="Forza Karate Awards Evening & Christmas Party 2026 flyer" width={1200} height={1500} className="h-auto w-full rounded-xl" priority />
      <div className="prose mt-8 max-w-none space-y-4">
        <p>It&apos;s nearly time for one of the biggest and most enjoyable evenings in the Forza Karate calendar!</p>
        <p>After another fantastic year of hard work, dedication, achievements and progress, it&apos;s time to put the karate suits away for the evening, get together and CELEBRATE! 🥳</p>
        <p><strong>🏆 PRIZES FOR EVERYONE!</strong> This isn&apos;t just about recognising our champions and competition winners. It&apos;s about celebrating EVERY student who has shown commitment, determination, improvement and a positive attitude throughout the year. Every student has something to be proud of, and we want them all to feel part of this special occasion! ❤️</p>
        <p><strong>🎄 WHAT&apos;S HAPPENING?</strong><br />🏆 Awards and presentations<br />🎉 Christmas celebrations and plenty of fun<br />👏 Recognition of our students&apos; achievements<br />🍕 Bring along your favourite party food to share<br />👨‍👩‍👧‍👦 A fantastic evening for the WHOLE FAMILY!</p>
        <p><strong>🎟️ TICKETS JUST £5 PER GROUP!</strong> Just £5 per group, making it a fantastic opportunity to bring the family along and celebrate together. Please don&apos;t leave it until the last minute!</p>
        <p>We can&apos;t wait to see you all there!<br />Sensei Anthoni Everitt<br />Forza Karate Club 🥋❤️</p>
      </div>
      <div className="my-8"><BuyButton /></div>

      <section className="mt-10">
        <h2 className="text-2xl font-bold">Who&apos;s coming</h2>
        <p className="mt-2 text-sm text-gray-600">This event is for Forza Karate families. Each group must be booked under a current Forza student as the main member — bookings not linked to a Forza student may be refunded.</p>
        {groups && groups.length > 0 ? (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead><tr className="border-b"><th className="py-2 pr-4">Main member (Forza student)</th><th className="py-2 pr-4">Group</th><th className="py-2">Payment</th></tr></thead>
              <tbody>
                {groups.map((g) => (
                  <tr key={g.id} className="border-b border-black/5 align-top">
                    <td className="py-2 pr-4 font-medium">{g.main}</td>
                    <td className="py-2 pr-4">{g.names || '—'}</td>
                    <td className="py-2 text-green-700">✓ Paid £{g.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-2 text-sm text-gray-600">{groups.length} group{groups.length === 1 ? '' : 's'} booked</p>
          </div>
        ) : (
          <p className="mt-4 rounded-lg bg-[#fafaf9] p-4 text-gray-600">Booked groups appear here after payment.</p>
        )}
      </section>
      <p className="mt-8"><Link href="/news/awards-evening-christmas-party-2026" className="text-sm text-[#dc2626]">Read the news post →</Link></p>
    </main>
  )
}
