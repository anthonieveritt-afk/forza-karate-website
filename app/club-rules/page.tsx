import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import PageHeader from '@/components/sections/PageHeader'
import TrialCta from '@/components/sections/TrialCta'

export const metadata: Metadata = {
  title: 'Club Rules & Etiquette',
  description: 'Forza Karate Club rules: uniform, equipment, dojo etiquette, training, attendance, gradings and the Dojo Code.',
}

const fiveConcepts = ['Character', 'Sincerity', 'Effort', 'Etiquette', 'Self-control']

const dojoCode = [
  'Seek perfection of character',
  'Be faithful',
  'Endeavour',
  'Respect others',
  'Refrain from violent behaviour',
]

function Rule({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle className="h-5 w-5 text-[#dc2626] mt-0.5 flex-shrink-0" />
      <span className="text-gray-600 text-sm leading-relaxed">{children}</span>
    </li>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-[#111111] mb-5">{title}</h2>
      {children}
    </div>
  )
}

export default function ClubRulesPage() {
  return (
    <div className="bg-white">
      <PageHeader
        eyebrow="Club Rules"
        title="Club rules & etiquette"
        intro="Etiquette is one of the most important parts of karate. It is the basis of a good club, and the measure by which others judge the reputation of the club, its members and its instructors."
      />

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-14">
          <p className="text-gray-600 leading-relaxed">
            It is the responsibility of every member to make sure a high level of respect and etiquette is kept at all
            times: when training, visiting other clubs, competing or attending courses. Remember that this is your club,
            and a good club is built by its members. Your support and regular attendance matter to you and to the club.
          </p>

          <Section title="Karate uniform">
            <ul className="space-y-3">
              <Rule>Only the official Forza Karate Club uniform (gi) may be worn in our lessons.</Rule>
              <Rule>Beginners may train in a t-shirt and tracksuit bottoms or shorts for up to 4 weeks. After that, the uniform must be bought through our <Link href="/shop" className="text-[#dc2626] hover:underline">club shop</Link>.</Rule>
              <Rule>If you have trained in karate before and have moved to Forza, you will need to buy our uniform by your 2nd week of training.</Rule>
            </ul>
          </Section>

          <Section title="Karate equipment">
            <ul className="space-y-3">
              <Rule>From yellow belt upwards you must have hand mitts and shin and instep pads.</Rule>
              <Rule>We recommend buying them through the <Link href="/shop" className="text-[#dc2626] hover:underline">club shop</Link> so you have the correct type used by Forza Karate Club.</Rule>
            </ul>
          </Section>

          <Section title="Dojo etiquette">
            <ul className="space-y-3">
              <Rule>Dojo etiquette must be observed at all times. Bow when entering or leaving the dojo.</Rule>
              <Rule>Show respect to your instructors and your fellow members, whatever their grade, by bowing when spoken to or when speaking.</Rule>
              <Rule>Pay attention to personal hygiene: it reflects the character of the student. Wash your gi regularly, and keep fingernails and toenails short and clean to avoid injuring other members.</Rule>
              <Rule>Tie long hair back. Do not wear jewellery such as earrings, rings, necklaces, wristbands or watches when training, as they may injure other students.</Rule>
              <Rule>The club will not tolerate misbehaviour such as constant talking, laughing, joking or not paying attention to the lesson, before or during the lesson.</Rule>
              <Rule>Students who consistently disobey dojo etiquette will be asked to leave the club and their membership will be terminated.</Rule>
            </ul>
          </Section>

          <Section title="Training">
            <ul className="space-y-3">
              <Rule>Arrive about 10 minutes before training starts so you have time to limber up and practise techniques.</Rule>
              <Rule>When you enter the dojo before a lesson, start limbering up or practising techniques that need improvement. Standing around in groups talking or laughing gets in the way of students who want to limber up properly.</Rule>
              <Rule>On the command to line up, do so quickly and in a straight line, with the highest grade on the right. Students in the back row line up directly behind the front row. Stand with your feet together and your hands by your sides, then follow the instructor.</Rule>
              <Rule>From the moment you enter the dojo until you leave, give 100%, physically and mentally. Keep your mind on what you are being taught and keep a positive attitude.</Rule>
              <Rule>If you arrive late, limber up at the side of the dojo and wait for the instructor to let you join the lesson.</Rule>
              <Rule>If you are injured or feel unwell during training, tell the instructor, who will arrange for the first aid personnel to take charge. No other member should get involved, and other students should carry on training.</Rule>
            </ul>
            <p className="text-sm text-gray-500 leading-relaxed mt-6">
              With regular training and an understanding of karate, there is no reason why students cannot reach their
              own goals through hard work and dedication. Students will have different abilities, but the emphasis on
              attitude, etiquette and discipline is the same for everyone.
            </p>
          </Section>

          <Section title="Attendance">
            <ul className="space-y-3">
              <Rule>Regular attendance is very important to both the students and the club.</Rule>
              <Rule>Students who consistently fail to attend regular training will have their membership terminated.</Rule>
              <Rule>Missing 4 or 8 weeks in a row without telling the club instructor affects your fees and membership. See the <Link href="/membership-terms" className="text-[#dc2626] hover:underline">membership terms</Link>.</Rule>
            </ul>
          </Section>

          <Section title="Gradings">
            <p className="text-sm text-gray-600 leading-relaxed mb-4">The club organises grading sessions at intervals of approximately:</p>
            <ul className="space-y-3">
              <Rule>3 months, from beginner to purple belt (4th Kyu)</Rule>
              <Rule>6 months between each grade from 3rd Kyu to 1st Kyu</Rule>
              <Rule>1 year from 1st Kyu to 1st Dan</Rule>
              <Rule>Gradings are conducted by the Club Chief Instructor only.</Rule>
            </ul>
            <p className="text-sm text-gray-500 mt-4">
              Full details on the <Link href="/gradings" className="text-[#dc2626] hover:underline">gradings page</Link>.
            </p>
          </Section>

          <Section title="What can be gained from karate">
            <p className="text-sm text-gray-600 leading-relaxed mb-4">
              Karate is an excellent form of physical exercise in which, unlike most sports, both sides of the body are
              trained and developed equally. Through diligent training it can also have a very positive influence on
              the character and personality of its students. Five concepts lie at the heart of good karate:
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {fiveConcepts.map((c) => (
                <span key={c} className="inline-flex items-center rounded-full bg-red-50 text-[#dc2626] text-sm font-semibold px-4 py-1.5">{c}</span>
              ))}
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              If you train hard and sincerely, whatever your age, you will gain a great deal in physical and mental
              health. You cannot progress in karate as a martial art without developing your inner strength and
              character at the same time. The ultimate aim of karate lies not in victory or defeat, but in the
              perfection of one’s character.
            </p>
          </Section>

          <div className="rounded-2xl bg-[#111111] p-8 sm:p-10">
            <h2 className="text-2xl font-bold text-white mb-6">Dojo Code</h2>
            <ol className="space-y-3">
              {dojoCode.map((line, i) => (
                <li key={line} className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#dc2626] text-white text-sm font-bold flex items-center justify-center flex-shrink-0">{i + 1}</span>
                  <span className="text-white text-lg font-medium">{line}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <TrialCta />
    </div>
  )
}
