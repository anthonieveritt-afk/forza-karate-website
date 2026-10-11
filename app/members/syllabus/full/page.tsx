import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getMemberPortalData } from '@/app/actions/portal'
import { grades, gradingRules, generalToConfirm, TRAINED_STRIPES } from '@/lib/syllabus-full'
import { BeltGraphic } from '@/components/syllabus/BeltGraphic'
import { MembersShell, DraftNote } from '@/components/syllabus/MembersShell'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Grading Syllabus — Members', robots: { index: false, follow: false } }

export default async function FullSyllabusPage() {
  const member = await getMemberPortalData()
  if (!member) redirect('/members?redirect=/members/syllabus/full')
  return (
    <MembersShell>
      <div className="flex items-center gap-2 mb-3"><div className="w-8 h-0.5 bg-[#dc2626]" /><span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Members</span></div>
      <h1 className="text-3xl sm:text-4xl font-bold text-[#111111] mb-2">Grading Syllabus</h1>
      <p className="text-gray-600 mb-4">Wado Ryu traditional karate with WKF sport karate. Kyu grades 18th to 1st, then Shodan (1st Dan).</p>
      <a href="/members/syllabus/pdf" className="inline-flex items-center rounded-lg bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold px-4 py-2 mb-6">Download PDF</a>
      {generalToConfirm.map((t) => <DraftNote key={t}>{t}</DraftNote>)}

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-[#111111] mb-4">Grading rules</h2>
        <ol className="list-decimal pl-5 space-y-3 text-gray-800">
          {gradingRules.map((r) => <li key={r.text}>{r.text}{r.toConfirm && <DraftNote>{r.toConfirm}</DraftNote>}</li>)}
        </ol>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-[#111111] mb-2">Progress stripes</h2>
        <p className="text-gray-700 mb-3">Every belt up to 1st Kyu has 5 progress stripes, earned through set tasks and shown at the end of the belt. Some belts also come with a stripe automatically when you grade (for example White Belt / Red Stripe), which runs along the belt.</p>
        <div className="flex flex-wrap gap-2 mb-2">
          {TRAINED_STRIPES.map((s) => (
            <span key={s.n} className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-3 py-1 text-sm">
              <span className="inline-block w-2.5 h-4 border border-[#111111]" style={{ background: s.hex }} />Stripe {s.n}: {s.colour}
            </span>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-bold text-[#111111] mb-4">Belt order</h2>
        <ol className="space-y-3">
          {grades.map((g) => (
            <li key={g.grade} className="bg-white rounded-2xl border border-black/10 shadow-sm p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <BeltGraphic g={g} className="w-48 shrink-0" />
                <div className="flex-1">
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">{g.grade}</p>
                  <h3 className="text-lg font-bold text-[#111111]">{g.belt}</h3>
                  {g.autoStripe && <p className="text-sm text-gray-600">Automatic stripe: {g.autoStripe.label}</p>}
                </div>
              </div>
              <dl className="mt-3 grid sm:grid-cols-2 gap-x-6 gap-y-1 text-sm">
                <div><dt className="inline font-semibold">Main kata: </dt><dd className="inline text-gray-700">{g.kata}</dd></div>
                <div><dt className="inline font-semibold">Minimum time: </dt><dd className="inline text-gray-700">{g.minTime}</dd></div>
              </dl>
              <div className="mt-3 text-sm">
                {!g.trainedStripes ? <span className="text-gray-600">No progress stripes at Shodan.</span>
                  : g.tasksHref ? <Link href={g.tasksHref} className="font-semibold text-[#dc2626] underline underline-offset-2">See the 5 stripe tasks →</Link>
                  : <span className="text-gray-500 italic">Stripe tasks to be added</span>}
              </div>
              {g.toConfirm?.map((t) => <DraftNote key={t}>{t}</DraftNote>)}
              <DraftNote>Belt colour.</DraftNote>
            </li>
          ))}
        </ol>
      </section>
    </MembersShell>
  )
}
