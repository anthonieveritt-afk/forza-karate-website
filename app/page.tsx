import type { Metadata } from 'next'
import { pageMeta, RAYLEIGH_TIMETABLE, UPMINSTER_TIMETABLE } from '@/lib/seo'
import Link from 'next/link'
import Image from 'next/image'
import Hero from '@/components/sections/Hero'
import ClassCard from '@/components/sections/ClassCard'
import BeltJourney from '@/components/sections/BeltJourney'
import { Button } from '@/components/ui/Button'
import {
  ArrowRight,
  Shield,
  Heart,
  Zap,
  Users,
  MapPin,
  Clock,
  CheckCircle,
} from 'lucide-react'
import { allPosts, formatDate } from '@/lib/news'

export const metadata: Metadata = pageMeta({
  path: '/',
  title: 'Karate Classes in Rayleigh & Upminster, Essex | Forza Karate Club',
  description:
    'Karate for kids and adults in Rayleigh and Upminster, Essex. Beginners welcome from age 4. Book a £10 trial class at Forza Karate Club.',
  absoluteTitle: true,
})

const classes = [
  {
    title: 'Forza Ninjas',
    subtitle: 'Fun first steps',
    ageRange: 'Ages 4–6',
    description:
      'Play-based karate that builds coordination, confidence and listening skills through games and structured movement.',
    href: '/classes/ninjas',
    imageSrc: '/hero18.jpg',
    imageAlt: 'Young Forza student enjoying class',
    playful: true,
  },
  {
    title: 'Forza Kids / Juniors',
    subtitle: 'Building real technique',
    ageRange: 'Ages 7–10',
    description:
      'Structured kata, kumite and belt progression. Discipline, focus and skill in a supportive environment.',
    href: '/classes/juniors',
    imageSrc: '/hero12.jpg',
    imageAlt: 'Junior karate competitors sparring with protective gear',
  },
  {
    title: 'Forza Club',
    subtitle: '11 years and up, including adults',
    ageRange: 'Ages 11+',
    description:
      'Technical training for teens and adults. Beginners welcome — train alongside experienced students at your own pace.',
    href: '/classes/seniors',
    imageSrc: '/hero27.jpg',
    imageAlt: 'Club class training together in the dojo',
  },
]

const benefits = [
  {
    icon: Heart,
    title: 'Confidence',
    desc: 'Small wins on the mat — a first bow, a new belt — help build self-belief over time.',
  },
  {
    icon: Shield,
    title: 'Focus & respect',
    desc: 'Listening, self-control and respect for others are part of every class.',
  },
  {
    icon: Zap,
    title: 'Fitness & coordination',
    desc: 'Full-body movement that develops strength, balance and coordination.',
  },
  {
    icon: Users,
    title: 'Friendship & belonging',
    desc: 'A club community where people look out for each other — on and off the mat.',
  },
]

/** First-class steps drawn from existing trial / FAQ guidance only. */
const firstClassSteps = [
  {
    n: '1',
    title: 'Book a £10 trial',
    desc: 'Choose Rayleigh or Upminster and pay the £10 trial securely online. It covers the trial only — it isn’t taken off membership.',
  },
  {
    n: '2',
    title: 'Wear something comfy',
    desc: 'No kit or uniform needed. Comfortable clothes (a tracksuit works well) are fine for the first class.',
  },
  {
    n: '3',
    title: 'We’ll confirm your class',
    desc: 'We’ll be in touch within 72 hours to confirm your time. Come and try it out — no commitment required.',
  },
]

const dojos = [
  {
    name: 'Rayleigh',
    venue: 'Rayleigh Primary School, Love Lane, SS6 7DD',
    href: '/dojos/rayleigh',
    slots: RAYLEIGH_TIMETABLE.slice(0, 3),
  },
  {
    name: 'Upminster',
    venue: 'St Lawrence Church Hall, Corbets Tey Road, RM14 2BB',
    href: '/dojos/upminster',
    slots: UPMINSTER_TIMETABLE.slice(0, 3),
  },
]

export default function HomePage() {
  const news = allPosts.slice(0, 3)

  return (
    <>
      {/* A — Hero */}
      <Hero />

      {/* B — Find the right class */}
      <section id="find-class" className="bg-white py-20 px-4 sm:px-6 lg:px-8 scroll-mt-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-[#dc2626]" />
              <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">
                Find the right class
              </span>
              <div className="w-8 h-0.5 bg-[#dc2626]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] mb-4">
              A class for every age
            </h2>
            <p className="text-gray-700 max-w-xl mx-auto">
              From 4-year-old ninjas to teens and adults — beginners are welcome in every group.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {classes.map((c) => (
              <ClassCard key={c.href} {...c} />
            ))}
          </div>
        </div>
      </section>

      {/* C — Benefits (no guaranteed outcomes) */}
      <section className="bg-[#f5f5f4] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-[#dc2626]" />
              <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">
                Why Forza?
              </span>
              <div className="w-8 h-0.5 bg-[#dc2626]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] mb-4">
              Skills that travel off the mat
            </h2>
            <p className="text-gray-700 max-w-xl mx-auto">
              Karate helps children and adults practise focus, respect and fitness — at their own pace.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="p-6 rounded-2xl bg-white border border-black/5"
              >
                <b.icon className="h-6 w-6 text-[#dc2626] mb-4" aria-hidden />
                <h3 className="font-semibold text-[#111111] mb-2">{b.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button asChild variant="outline">
              <Link href="/why-karate">
                Why Forza?
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* D — Your first class */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-[#dc2626]" />
              <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">
                Your first class
              </span>
              <div className="w-8 h-0.5 bg-[#dc2626]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] mb-4">
              Three simple steps
            </h2>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {firstClassSteps.map((s) => (
              <li
                key={s.n}
                className="relative p-7 rounded-2xl bg-[#fafaf9] border border-black/5"
              >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-[#ffcc00] text-[#111111] font-bold text-sm mb-4">
                  {s.n}
                </span>
                <h3 className="font-bold text-[#111111] mb-2">{s.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{s.desc}</p>
              </li>
            ))}
          </ol>
          <div className="text-center mt-10">
            <Button asChild size="lg">
              <Link href="/trial-class">
                Book a £10 Trial
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* E — Meet coaches */}
      <section className="bg-[#111111] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[4/5] max-w-md mx-auto lg:mx-0 rounded-2xl overflow-hidden">
            <Image
              src="/instructors/anthoni-everitt.jpg"
              alt="Sensei Anthoni Everitt, Head Instructor"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover object-top"
              loading="lazy"
            />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-[#dc2626]" />
              <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">
                Meet the coaches
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Sensei Anthoni Everitt
            </h2>
            <p className="text-[#dc2626] font-medium mb-4">6th Dan · Head Instructor</p>
            <p className="text-white/85 leading-relaxed mb-6">
              Head Instructor at Forza Karate Club, teaching at Rayleigh and Upminster. The wider
              coaching team is DBS enhanced, first aid qualified and fully insured.
            </p>
            <ul className="space-y-3 mb-8">
              {['DBS Enhanced', 'Fully insured', 'First aid qualified'].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-white/80">
                  <CheckCircle className="h-4 w-4 text-[#dc2626] shrink-0" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap gap-3">
              <Button asChild variant="outline" className="border-white/25 bg-transparent text-white hover:bg-white/10">
                <Link href="/instructors">Meet the team</Link>
              </Button>
              <Button asChild variant="outline" className="border-white/25 bg-transparent text-white hover:bg-white/10">
                <Link href="/safeguarding" className="inline-flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-white p-0.5">
                    <Image
                      src="/safeguarding-code-logo.webp"
                      alt=""
                      width={24}
                      height={24}
                      className="w-6 h-6 object-contain"
                    />
                  </span>
                  Safeguarding
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* F — Real families (photos only — no invented testimonials) */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-[#dc2626]" />
              <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">
                Real families
              </span>
              <div className="w-8 h-0.5 bg-[#dc2626]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] mb-4">
              Club life at Forza
            </h2>
            <p className="text-gray-700 max-w-xl mx-auto">
              Real photos from our dojos and events — students of all ages training together.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { src: '/hero29.jpg', alt: 'Forza students and coaches together after class' },
              { src: '/hero27.jpg', alt: 'Class training in the dojo' },
              { src: '/hero-new3.jpg', alt: 'Forza team at a championship event' },
            ].map((p) => (
              <div key={p.src} className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#f5f5f4]">
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/gallery" className="text-sm font-medium text-[#dc2626] hover:underline">
              View the gallery →
            </Link>
          </div>
        </div>
      </section>

      {/* G — Locations & times */}
      <section className="bg-[#f5f5f4] py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-0.5 bg-[#dc2626]" />
              <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">
                Locations &amp; times
              </span>
              <div className="w-8 h-0.5 bg-[#dc2626]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] mb-4">
              Rayleigh &amp; Upminster
            </h2>
            <p className="text-gray-700 max-w-xl mx-auto">
              Two dojos, same club. Term time — 40 weeks per year.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {dojos.map((d) => (
              <div
                key={d.name}
                className="rounded-2xl bg-white border border-black/8 p-7 flex flex-col"
              >
                <div className="flex items-start gap-3 mb-4">
                  <MapPin className="h-5 w-5 text-[#dc2626] mt-0.5 shrink-0" aria-hidden />
                  <div>
                    <h3 className="text-xl font-bold text-[#111111]">{d.name}</h3>
                    <p className="text-sm text-gray-700 mt-1">{d.venue}</p>
                  </div>
                </div>
                <ul className="space-y-2 mb-6 flex-1">
                  {d.slots.map((s, i) => (
                    <li key={i} className="flex gap-3 text-sm">
                      <Clock className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" aria-hidden />
                      <span>
                        <span className="font-medium text-[#111111]">{s.day}</span>
                        <span className="text-gray-700"> · {s.time}</span>
                        <span className="block text-xs text-gray-600">{s.desc}</span>
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="sm">
                    <Link href="/trial-class">Book a £10 Trial</Link>
                  </Button>
                  <Button asChild size="sm" variant="outline">
                    <Link href={d.href}>Full timetable</Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* H — Belt journey */}
      <BeltJourney />

      {/* I — Achievements / news (elite + everyday) */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8 border-t border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between gap-4 mb-10 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-0.5 bg-[#dc2626]" />
                <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">
                  From the dojo
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#111111]">
                Achievements &amp; news
              </h2>
              <p className="text-gray-700 mt-2 max-w-lg text-sm">
                Championship results alongside everyday club life — both matter here.
              </p>
            </div>
            <Link href="/news" className="text-sm font-medium text-[#dc2626] whitespace-nowrap">
              All news →
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {news.map((p) => (
              <Link
                key={p.slug}
                href={`/news/${p.slug}`}
                className="group rounded-2xl border border-black/5 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="aspect-[16/10] bg-[#fafaf9] overflow-hidden relative">
                  {p.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.image}
                      alt={p.imageAlt}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="p-5">
                  <p className="text-xs text-gray-600 mb-2">{formatDate(p.date)}</p>
                  <h3 className="font-bold text-[#111111] leading-snug group-hover:text-[#dc2626]">
                    {p.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* J — Final trial CTA */}
      <section className="bg-[#111111] py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-0.5 bg-[#dc2626] mx-auto mb-8" />
          <h2 className="text-3xl sm:text-5xl font-bold text-white mb-4 leading-tight">
            Ready for a first class?
          </h2>
          <p className="text-white/85 mb-10 text-lg">
            Book a £10 trial at Rayleigh or Upminster. No kit needed. Beginners welcome from age 4.
          </p>
          <Button asChild size="lg">
            <Link href="/trial-class">
              Book a £10 Trial
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <div className="mt-10 flex justify-center">
            <Link
              href="/safeguarding"
              className="flex items-center gap-3 px-5 py-3 rounded-2xl border border-white/15 bg-white/5 hover:bg-white/10 transition-colors"
            >
              <span className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white p-1 shrink-0">
                <Image
                  src="/safeguarding-code-logo.webp"
                  alt="Safeguarding Code in Martial Arts"
                  width={48}
                  height={48}
                  className="w-12 h-12 object-contain"
                />
              </span>
              <div className="text-left">
                <p className="text-xs font-bold text-white uppercase tracking-wider">
                  Safeguarding Code
                </p>
                <p className="text-xs text-white/75">in Martial Arts — certified</p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
