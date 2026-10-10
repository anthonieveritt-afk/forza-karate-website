import type { Metadata } from 'next'
import Link from 'next/link'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Frequently asked questions about Forza Karate Club: class times, fees, cancelling, uniform and booking a trial class in Rayleigh and Upminster.',
  alternates: { canonical: '/faq' },
}

type Faq = { q: string; a: ReactNode; text: string }

const link = 'font-medium text-[#dc2626] underline underline-offset-2 hover:text-[#b91c1c]'

const faqs: { group: string; items: Faq[] }[] = [
  {
    group: 'Classes',
    items: [
      {
        q: 'When and where are classes at Rayleigh?',
        text:
          'Rayleigh Dojo, Rayleigh Primary School, Love Lane, SS6 7DD. Tuesday 6.15–7pm, ages 4–10, all grades. Tuesday 7–8pm, ages 11 and up, all grades. Friday 3.40–4.40pm, after-school club for Rayleigh Primary School pupils only (not open to the public). Saturday 10–11am, ages 4 and up, all grades.',
        a: (
          <>
            <p>Rayleigh Dojo, Rayleigh Primary School, Love Lane, SS6 7DD.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Tuesday 6.15–7pm: ages 4–10, all grades</li>
              <li>Tuesday 7–8pm: ages 11 and up, all grades</li>
              <li>Friday 3.40–4.40pm: after-school club for Rayleigh Primary School pupils only (not open to the public)</li>
              <li>Saturday 10–11am: ages 4 and up, all grades</li>
            </ul>
            <p className="mt-2"><Link href="/dojos/rayleigh" className={link}>More about Rayleigh Dojo</Link></p>
          </>
        ),
      },
      {
        q: 'When and where are classes at Upminster?',
        text:
          'Upminster Dojo, Minor Hall, St Lawrence Church Hall, Corbets Tey Rd, RM14 2BB, on Wednesdays. 4–4.30pm beginner infants (4–6). 4.30–5pm infants, all grades (4–6). 5–5.45pm juniors, all grades (7–10). 5.45–7pm seniors, all grades (11 and up).',
        a: (
          <>
            <p>Upminster Dojo, Minor Hall, St Lawrence Church Hall, Corbets Tey Rd, RM14 2BB, on Wednesdays.</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>4–4.30pm: beginner infants (ages 4–6)</li>
              <li>4.30–5pm: infants, all grades (ages 4–6)</li>
              <li>5–5.45pm: juniors, all grades (ages 7–10)</li>
              <li>5.45–7pm: seniors, all grades (ages 11 and up)</li>
            </ul>
            <p className="mt-2"><Link href="/dojos/upminster" className={link}>More about Upminster Dojo</Link></p>
          </>
        ),
      },
      {
        q: 'What style of karate do you teach?',
        text: 'We teach Wado Ryu karate and WKF sport karate. Gradings are held at the club.',
        a: <p>We teach Wado Ryu karate and WKF sport karate. Gradings are held at the club. <Link href="/gradings" className={link}>About gradings</Link></p>,
      },
      {
        q: 'Are beginners welcome?',
        text: 'Yes, beginners are always welcome. All our instructors are DBS-checked and first-aid qualified.',
        a: <p>Yes, beginners are always welcome. All our instructors are DBS-checked and first-aid qualified.</p>,
      },
    ],
  },
  {
    group: 'Fees and payments',
    items: [
      {
        q: 'How much does membership cost?',
        text:
          'Membership is an annual fee covering 40 weeks of term-time classes, paid as 12 equal monthly payments: single person £50 a month, siblings £80 a month, family £120 a month.',
        a: (
          <>
            <p>Membership is an annual fee covering 40 weeks of term-time classes, paid as 12 equal monthly payments:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Single person: £50 a month</li>
              <li>Siblings: £80 a month</li>
              <li>Family: £120 a month</li>
            </ul>
          </>
        ),
      },
      {
        q: 'Why do I pay during the school holidays and August?',
        text:
          'We run in school terms only and do not teach in the holidays. The annual fee covers 40 weeks of classes and is spread over 12 equal monthly payments to make it easier to manage, so payments continue through the holidays and August.',
        a: (
          <p>
            We run in school terms only and don&apos;t teach in the holidays. The annual fee already covers just the 40 weeks of
            classes, and it&apos;s spread over 12 equal monthly payments to make it easier to manage. That&apos;s why payments
            continue through the holidays and August.
          </p>
        ),
      },
      {
        q: 'When is payment due?',
        text: 'Payment is due on the 1st of each month.',
        a: <p>Payment is due on the 1st of each month.</p>,
      },
      {
        q: 'How do I cancel?',
        text: 'Cancelling requires one month’s paid notice. Please contact us to let us know.',
        a: <p>Cancelling requires one month&apos;s paid notice. Please <Link href="/contact" className={link}>contact us</Link> to let us know.</p>,
      },
    ],
  },
  {
    group: 'Uniform and trial classes',
    items: [
      {
        q: 'What can be worn in class?',
        text:
          'Only karate suits and equipment from Forza Karate Club’s online shop may be worn in class. Buy from our online shop or ask your instructor.',
        a: (
          <p>
            Only karate suits and equipment from Forza Karate Club&apos;s own shop may be worn in class. Please don&apos;t buy
            kit elsewhere. <Link href="/shop" className={link}>Buy from our online shop</Link> or ask your instructor.
          </p>
        ),
      },
      {
        q: 'Can I try a class first?',
        // TODO(trial-price): the trial becomes £10, paid at booking, once Stripe checkout is live.
        // Update this answer, its `text` (used in the FAQPage JSON-LD) and the trial booking page then.
        text: 'Your first trial class is £10 — book and pay online.',
        a: <p>Your first trial class is £10 — <Link href="/trial-class" className={link}>book and pay online</Link>.</p>,
      },
      {
        q: 'I have another question',
        text: 'Get in touch with us through our contact page and we will be happy to help.',
        a: <p><Link href="/contact" className={link}>Get in touch</Link> and we&apos;ll be happy to help.</p>,
      },
    ],
  },
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.flatMap((g) =>
    g.items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.text } })),
  ),
}

export default function FaqPage() {
  return (
    <div className="bg-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">FAQ</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#111111] mb-4">Frequently asked questions</h1>
          <p className="text-xl text-gray-500 max-w-2xl">Everything you need to know about training with Forza Karate Club.</p>
        </div>
      </section>

      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-12">
          {faqs.map((g) => (
            <div key={g.group}>
              <h2 className="text-2xl font-bold text-[#111111] mb-4">{g.group}</h2>
              <div className="divide-y divide-black/5 border-y border-black/5">
                {g.items.map((f) => (
                  <details key={f.q} className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-left font-semibold text-[#111111] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#dc2626] [&::-webkit-details-marker]:hidden">
                      <span>{f.q}</span>
                      <span aria-hidden="true" className="text-2xl leading-none text-[#dc2626] transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <div className="pb-5 text-gray-500 leading-relaxed">{f.a}</div>
                  </details>
                ))}
              </div>
            </div>
          ))}

          <div className="rounded-2xl bg-[#fafaf9] p-8 text-center">
            <h2 className="text-xl font-bold text-[#111111] mb-2">Ready to start?</h2>
            <p className="text-gray-500 mb-5">Your first trial class is £10.</p>
            <Link href="/trial-class" className="inline-block rounded-lg bg-[#dc2626] px-6 py-3 font-semibold text-white hover:bg-[#b91c1c]">Book a trial class</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
