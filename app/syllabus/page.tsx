import type { Metadata } from 'next'
import { belts } from '@/lib/syllabus'
import { StanceIllustration } from '@/components/syllabus/StanceIllustration'

// Hidden draft: not in menu or sitemap, noindex until Anthoni confirms.
export const metadata: Metadata = {
  title: 'Syllabus',
  description: 'Forza Karate Club grading syllabus.',
  robots: { index: false, follow: false },
}

export default function SyllabusPage() {
  return (
    <main className="bg-[#fafaf9] min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-0.5 bg-[#dc2626]" />
          <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Forza Karate Club</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-[#111111] mb-2">Syllabus</h1>
        <p className="text-gray-600 mb-10">What to learn for each stripe on your belt.</p>

        {belts.map((belt) => (
          <section key={belt.id} className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-block w-12 h-4 rounded-sm border border-[#111111]" style={{ background: belt.beltHex }} aria-hidden />
              <h2 className="text-2xl font-bold text-[#111111]">{belt.name}</h2>
            </div>

            <ol className="space-y-6">
              {belt.stripes.map((s) => (
                <li key={s.number} className="bg-white rounded-2xl border border-black/10 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-3 px-5 py-4 border-b border-black/10">
                    <span className="inline-block w-3 h-10 rounded-sm border border-[#111111]" style={{ background: s.hex }} aria-hidden />
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Stripe {s.number}: {s.colour} stripe</p>
                      <h3 className="text-lg font-bold text-[#111111]">{s.title}</h3>
                    </div>
                  </div>
                  <div className="px-5 py-4">
                    {s.intro && <p className="text-gray-600 mb-3">{s.intro}</p>}
                    <ul className={s.items.some((i) => i.stance) ? 'grid gap-5 sm:grid-cols-2' : 'space-y-2'}>
                      {s.items.map((it) => (
                        <li key={it.name}>
                          {it.stance ? (
                            <div className="rounded-xl border border-black/10 p-3">
                              {it.photo ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={it.photo} alt={it.name} className="w-full rounded-lg mb-3" />
                              ) : (
                                <div className="mb-3"><StanceIllustration stance={it.stance} label={it.name} /></div>
                              )}
                              <p className="font-semibold text-[#111111]">{it.name}</p>
                              {it.description && <p className="text-sm text-gray-600">{it.description}</p>}
                            </div>
                          ) : (
                            <p className="text-[#111111]">
                              <span className="font-semibold">{it.japanese && it.japanese !== it.name ? `${it.japanese}` : it.name}</span>
                              {it.japanese && it.japanese !== it.name && <span className="text-gray-600"> ({it.name.toLowerCase()})</span>}
                              {it.description && <span className="text-gray-600">: {it.description}</span>}
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </main>
  )
}
