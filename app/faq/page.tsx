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
        text: 'Yes, beginners are always welcome. All our instructors are DBS-checked and first-aid qualified. Make sure to register for a trial class online using the trial class link.',
        a: <p>Yes, beginners are always welcome. All our instructors are DBS-checked and first-aid qualified. Make sure to register for a trial class online using the <Link href="/trial-class" className={link}>trial class link</Link>.</p>,
      },
    ],
  },
  {
    group: 'Fees and payments',
    items: [
      {
        q: 'How much does membership cost?',
        text:
          'Membership is an annual fee covering 40 weeks of term-time classes, paid as 12 equal monthly payments: single person £50 a month, siblings £90 a month, family £120 a month.',
        a: (
          <>
            <p>Membership is an annual fee covering 40 weeks of term-time classes, paid as 12 equal monthly payments:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Single person: £50 a month</li>
              <li>Siblings (2 children): £90 a month</li>
              <li>Family (3 or more): £120 a month</li>
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
    group: 'Members portal',
    items: [
      {
        q: 'How do I use the portal?',
        text:
          'Log in: go to forzakarate.co.uk/members, enter the email address you enrolled with and your password, then tap Enter members area. Use Forgot password? if you need a new one. Menu: tap the ☰ menu to reach My portal, Register to Grade and Renew your licence. Log out when you finish on a shared device. My portal shows your licence number and expiry date, with a green ACTIVE bar when your licence is current. Use Update my licence details to correct your details and Download licence certificate to save a copy. Belt journey: use View certificate or Download for each grade. To grade, open Register to Grade, fill in the form and tap Pay & register. Renewing: renew at forzakarate.co.uk/members/licence (this is separate from Update my licence details), then tap Pay for Licence to pay securely with Stripe. The fee is shown on the portal. Need help? If you cannot log in, have not received an email, your details are wrong or a certificate is missing, speak to your instructor or email sensei.everitt@forzakarate.co.uk. Stay safe: never share your password. The club will never ask for it by email or phone.',
        a: (
          <>
            <p className="font-semibold text-[#111111]">1. Log in</p>
            <p>
              Go to <Link href="/members" className={link}>forzakarate.co.uk/members</Link>, enter your email and password, then
              tap <strong>Enter members area</strong>. Use the email address you gave when you enrolled. If you need a new
              password, tap <strong>Forgot password?</strong>
            </p>
            <p className="mt-4 font-semibold text-[#111111]">2. Find your way around</p>
            <p>
              Tap the <span aria-label="menu">☰</span> menu to reach <strong>My portal</strong>, <strong>Register to Grade</strong> and{' '}
              <strong>Renew your licence</strong>. Always <strong>Log out</strong> when you finish on a shared device.
            </p>
            <p className="mt-4 font-semibold text-[#111111]">3. My portal</p>
            <p>
              See your licence number and expiry date. A green <strong>ACTIVE</strong> bar means your licence is current. Use{' '}
              <strong>Update my licence details</strong> to correct your details, and <strong>Download licence certificate</strong> to
              save a copy.
            </p>
            <p className="mt-4 font-semibold text-[#111111]">4. Belt journey and gradings</p>
            <p>
              Use <strong>View certificate</strong> or <strong>Download</strong> for each grade. To grade, open{' '}
              <strong>Register to Grade</strong>, fill in the form, then tap <strong>Pay &amp; register</strong>.
            </p>
            <p className="mt-4 font-semibold text-[#111111]">5. Renew your licence</p>
            <p>
              Renew at <Link href="/members/licence" className={link}>forzakarate.co.uk/members/licence</Link>. This is separate from
              Update my licence details. Tap <strong>Pay for Licence</strong> to pay securely with Stripe. The fee is shown on the portal.
            </p>
            <p className="mt-4 font-semibold text-[#111111]">6. Need help?</p>
            <p>
              Can&apos;t log in, haven&apos;t received an email, details wrong or a certificate missing? Speak to your instructor or email{' '}
              <a href="mailto:sensei.everitt@forzakarate.co.uk" className={link}>sensei.everitt@forzakarate.co.uk</a>.
            </p>
            <p className="mt-4 font-semibold text-[#111111]">7. Stay safe</p>
            <p>Never share your password. The club will never ask for it by email or phone.</p>
            <p className="mt-4">
              <a href="/guides/members-portal-guide.pdf" className={link} target="_blank" rel="noopener">
                Download the full guide with screenshots (PDF)
              </a>
            </p>
          </>
        ),
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
        text: 'Yes — come and try it out. A trial class is £10, booked and paid online. The £10 is for the trial only and isn\u2019t taken off membership; if you join, membership starts the week after at the full monthly rate.',
        a: <p>Yes — come and try it out. A trial class is £10, <Link href="/trial-class" className={link}>booked and paid online</Link>. The £10 is for the trial only and isn&apos;t taken off membership; if you join, membership starts the week after at the full monthly rate.</p>,
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
            <p className="text-gray-500 mb-5">A trial class is £10 (trial only). If you join, membership starts the week after at the full monthly rate.</p>
            <Link href="/trial-class" className="inline-block rounded-lg bg-[#dc2626] px-6 py-3 font-semibold text-white hover:bg-[#b91c1c]">Book a trial class</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
