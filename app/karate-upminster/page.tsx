import type { Metadata } from 'next'
import LocalLandingPage, { type Dojo } from '@/components/local/LocalLandingPage'

export const metadata: Metadata = {
  title: 'Karate in Upminster — Kids & Adult Classes',
  description: 'Karate classes in Upminster for infants, juniors and seniors at St Lawrence Church Hall, Corbets Tey Road, RM14 2BB. Wednesday classes from age 4. Book a £10 trial with Forza Karate Club.',
  alternates: { canonical: '/karate-upminster' },
  openGraph: { title: 'Karate in Upminster | Forza Karate Club', description: 'Wednesday karate classes from age 4 at St Lawrence Church Hall. Book a £10 trial.', url: '/karate-upminster', locale: 'en_GB' },
}

const dojo: Dojo = {
  slug: 'karate-upminster',
  town: 'Upminster',
  eyebrow: 'Karate in Upminster',
  heading: 'Karate in Upminster',
  intro: 'Traditional Wado Ryu karate for infants from age 4, juniors, teenagers and adults every Wednesday at St Lawrence Church Hall, Upminster.',
  venue: 'Minor Hall, St Lawrence Church Hall',
  addressLines: ['Corbets Tey Road', 'Upminster', 'RM14 2BB'],
  street: 'Corbets Tey Road',
  locality: 'Upminster',
  postcode: 'RM14 2BB',
  mapQuery: 'St Lawrence Church Hall, Corbets Tey Rd, Upminster RM14 2BB',
  sessions: [
    { day: 'Wednesday', dayCode: 'We', time: '4:00 – 4:30pm', opens: '16:00', closes: '16:30', desc: 'Beginner infants (4–6 yrs)' },
    { day: 'Wednesday', dayCode: 'We', time: '4:30 – 5:00pm', opens: '16:30', closes: '17:00', desc: 'Infant all grades (4–6 yrs)' },
    { day: 'Wednesday', dayCode: 'We', time: '5:00 – 5:45pm', opens: '17:00', closes: '17:45', desc: 'Junior all grades (7–10 yrs)' },
    { day: 'Wednesday', dayCode: 'We', time: '5:45 – 7:00pm', opens: '17:45', closes: '19:00', desc: 'Senior all grades (11 years+)' },
  ],
  faqs: [
    { q: 'Which Upminster class should my child join?', a: 'Infants aged 4–6 start in the 4pm beginner class, juniors aged 7–10 train at 5pm, and seniors aged 11 and over (including adults) train at 5:45pm, all on Wednesdays.' },
    { q: 'Where exactly is the Upminster dojo?', a: 'We train in the Minor Hall at St Lawrence Church Hall, Corbets Tey Road, Upminster RM14 2BB.' },
    { q: "Do I need any kit for the trial?", a: "No kit or uniform is needed for the trial. Just come in comfortable clothes." },
  { q: "How much does it cost?", a: "The trial class is £10 and covers the trial only — it is not taken off membership. Membership is £50 a month for one person, £90 for siblings and £120 for a family, paid on the 1st of each month by GoCardless Direct Debit." },
  { q: "How do I book?", a: "Book and pay for your £10 trial online on our trial class page. If you have any questions, email hello@forzakarate.co.uk." },
  { q: "Are classes all year round?", a: "Classes run in term time only, 40 weeks a year." },
  ],
}

export default function Page() {
  return <LocalLandingPage dojo={dojo} />
}
