import type { Metadata } from 'next'
import LocalLandingPage, { type Dojo } from '@/components/local/LocalLandingPage'

export const metadata: Metadata = {
  title: 'Kids Karate in Rayleigh, Essex — Classes from Age 4',
  description: 'Kids and adult karate classes in Rayleigh at Rayleigh Primary School, Love Lane, SS6 7DD. Tuesday and Saturday classes from age 4. Book a £10 trial with Forza Karate Club.',
  alternates: { canonical: '/karate-rayleigh' },
  openGraph: { title: 'Kids Karate in Rayleigh | Forza Karate Club', description: 'Karate classes from age 4 at Rayleigh Primary School. Book a £10 trial.', url: '/karate-rayleigh', locale: 'en_GB' },
}

const dojo: Dojo = {
  slug: 'karate-rayleigh',
  town: 'Rayleigh',
  eyebrow: 'Kids karate in Rayleigh',
  heading: 'Kids karate in Rayleigh',
  intro: 'Traditional Wado Ryu karate for children from age 4, teenagers and adults, at Rayleigh Primary School. Build confidence, focus and fitness with Forza Karate Club.',
  venue: 'Rayleigh Primary School',
  addressLines: ['Love Lane', 'Rayleigh', 'Essex', 'SS6 7DD'],
  street: 'Love Lane',
  locality: 'Rayleigh',
  region: 'Essex',
  postcode: 'SS6 7DD',
  mapQuery: 'Rayleigh Primary School, Love Lane, Rayleigh, Essex SS6 7DD',
  sessions: [
    { day: 'Tuesday', dayCode: 'Tu', time: '6:15 – 7:00pm', opens: '18:15', closes: '19:00', desc: '4 years+ · 10 yrs all grades' },
    { day: 'Tuesday', dayCode: 'Tu', time: '7:00 – 8:00pm', opens: '19:00', closes: '20:00', desc: '11 years+ · all grades' },
    { day: 'Saturday', dayCode: 'Sa', time: '10:00 – 11:00am', opens: '10:00', closes: '11:00', desc: '4 years+ · all grades and ages' },
    { day: 'Friday', dayCode: 'Fr', time: '3:40 – 4:40pm', opens: '15:40', closes: '16:40', desc: 'After-school club · Rayleigh Primary School members only', publicSession: false },
  ],
  faqs: [
    { q: 'What age can my child start karate in Rayleigh?', a: 'Children can start from 4 years old. Our Tuesday 6:15pm and Saturday 10am classes take children from age 4, and the Tuesday 7pm class is for 11 years and over, including adults.' },
    { q: 'Can anyone come to the Friday class?', a: 'No. The Friday 3:40–4:40pm class is an after-school club for Rayleigh Primary School members only. Everyone else is welcome on Tuesdays and Saturdays.' },
    { q: "Do I need any kit for the trial?", a: "No kit or uniform is needed for the trial. Just come in comfortable clothes." },
  { q: "How much does it cost?", a: "The trial class is £10 and covers the trial only — it is not taken off membership. Membership is £50 a month for one person, £90 for siblings and £120 for a family, paid on the 1st of each month by GoCardless Direct Debit." },
  { q: "How do I book?", a: "Book and pay for your £10 trial online on our trial class page. If you have any questions, email hello@forzakarate.co.uk." },
  { q: "Are classes all year round?", a: "Classes run in term time only, 40 weeks a year." },
  ],
}

export default function Page() {
  return <LocalLandingPage dojo={dojo} />
}
