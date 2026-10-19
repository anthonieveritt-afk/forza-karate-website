import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { pageMeta, SITE_URL } from '@/lib/seo'
import { STANCES, stanceFigureSvg, type Stance } from '@/lib/syllabus/stances'

export const metadata: Metadata = pageMeta({
  path: '/syllabus/stances',
  title: 'Karate Stances | Forza Karate Club Syllabus',
  absoluteTitle: true,
  description:
    'Learn the karate stances in the Forza Karate Club syllabus: heisoku, musubi, fudo, shiko and kiba dachi, cat stance, zenkutsu dachi, plus junzuki and gyakuzuki dachi for yellow belt and above.',
})

const GROUPS: { id: Stance['group']; title: string; intro: string }[] = [
  {
    id: 'beginner',
    title: 'Beginner stances',
    intro: 'The first five stances every Forza white belt learns. Start here.',
  },
  {
    id: 'next',
    title: 'Next stances',
    intro: 'Once the beginner stances feel easy, these two come next.',
  },
  {
    id: 'yellow',
    title: 'Yellow belt and above',
    intro:
      'Junzuki dachi and gyakuzuki dachi are both variations of zenkutsu dachi (forward leaning stance). The difference is which hand punches, and how your hips face.',
  },
]

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
    { '@type': 'ListItem', position: 2, name: 'Gradings', item: `${SITE_URL}/gradings` },
    { '@type': 'ListItem', position: 3, name: 'Stances', item: `${SITE_URL}/syllabus/stances` },
  ],
}

function StanceCard({ s, n }: { s: Stance; n: number }) {
  return (
    <article id={s.id} className="scroll-mt-28 bg-white rounded-2xl border border-black/8 shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-[220px_1fr]">
        <div
          className="bg-[#fafaf9] border-b sm:border-b-0 sm:border-r border-black/5 p-3 flex items-center justify-center [&_svg]:w-full [&_svg]:max-w-[220px] [&_svg]:h-auto"
          // Static, trusted SVG built from the stance data above (no user input).
          dangerouslySetInnerHTML={{ __html: stanceFigureSvg(s) }}
        />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-1">
            <span className="w-7 h-7 rounded-full bg-red-50 flex items-center justify-center text-xs font-bold text-[#dc2626] flex-shrink-0">
              {n}
            </span>
            <h3 className="text-2xl font-bold text-[#111111]">{s.japanese}</h3>
          </div>
          <p className="text-[#dc2626] font-semibold mb-1">{s.english}</p>
          <p className="text-sm text-gray-500 mb-4">{s.summary}</p>
          <h4 className="text-sm font-semibold text-[#111111] uppercase tracking-wider mb-2">How to stand</h4>
          <ul className="space-y-1.5 mb-5">
            {s.howTo.map((step) => (
              <li key={step} className="flex gap-2 text-gray-600 leading-relaxed">
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#dc2626] flex-shrink-0" />
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <div className="flex gap-3 rounded-xl bg-[#fafaf9] border border-black/5 p-4">
            <AlertTriangle className="h-5 w-5 text-[#dc2626] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-600">
              <strong className="text-[#111111]">Common mistake: </strong>
              {s.mistake}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}

export default function StancesPage() {
  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />

      {/* Header */}
      <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-5xl mx-auto">
          <nav aria-label="Breadcrumb" className="text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-[#dc2626]">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/gradings" className="hover:text-[#dc2626]">Gradings</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-600">Stances</span>
          </nav>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Syllabus</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#111111] mb-4">Karate stances (dachi)</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Strong stances make strong karate. Here are the stances in the Forza syllabus, with how to stand
            in each one and the mistake to watch out for.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {STANCES.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="rounded-full border border-black/10 px-3 py-1.5 text-sm text-gray-600 hover:border-[#dc2626] hover:text-[#dc2626]"
              >
                {s.japanese}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How to read the figures */}
      <section className="pt-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm text-gray-500 rounded-2xl bg-[#fafaf9] border border-black/5 p-5">
            <strong className="text-[#111111]">Reading the pictures:</strong> each drawing shows the stance, and the box
            underneath shows your feet from above, with the front of the dojo at the top. A dotted foot means only the ball
            of the foot touches the floor.
          </p>
        </div>
      </section>

      {GROUPS.map((g) => (
        <section key={g.id} id={`group-${g.id}`} className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold text-[#111111] mb-2">{g.title}</h2>
            <p className="text-gray-500 mb-8 max-w-2xl">{g.intro}</p>
            <div className="space-y-6">
              {STANCES.filter((s) => s.group === g.id).map((s) => (
                <StanceCard key={s.id} s={s} n={STANCES.indexOf(s) + 1} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Practise + CTA */}
      <section className="bg-[#111111] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Practise at home, perfect it in class</h2>
          <p className="text-gray-300 mb-8">
            Play Dojo Dash, our free karate game for Forza kids, then come and train with us. New students start
            with a paid £10 trial class.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild size="lg">
              <Link href="/trial-class">
                Book a £10 trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/dojo-dash">Play Dojo Dash</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/gradings">Belt gradings</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
