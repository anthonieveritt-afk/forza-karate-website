import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'
import Image from 'next/image'
import { Shield, Award, Heart } from 'lucide-react'
import InstructorsClient from './InstructorsClient'

export const metadata: Metadata = pageMeta({
  path: '/instructors',
  title: 'Karate Instructors',
  description: 'Meet the experienced, DBS-enhanced and fully insured karate instructors at Forza Karate Club in Rayleigh and Upminster, Essex.',
})

const credentials = [
  { icon: Shield, title: 'DBS Enhanced', desc: 'All instructors hold current enhanced DBS clearance.' },
  { icon: Award, title: 'Fully Insured', desc: 'Full public liability and professional indemnity insurance.' },
  { icon: Heart, title: 'First Aid Qualified', desc: 'All instructors hold current first aid certification.' },
]

const instructors = [
  {
    name: 'Sensei Anthoni Everitt',
    grade: '6th Dan',
    role: 'Head Instructor',
    dojo: 'Rayleigh & Upminster',
    photo: '/instructors/anthoni-everitt.jpg',
    bio: 'Dedicated and accomplished karate coach with four decades of experience in traditional and sport karate. Proven record of developing athletes from grassroots to world-class level. Renowned for mentoring national and international champions, promoting karate through community-based initiatives and fostering discipline, technical excellence and mental resilience. Skilled in designing structured training programmes for athletes of all ages and abilities.\n\nFormer England Assistant Coach\nFormer Southern Regional Coach',
  },
  {
    name: 'Sensei Scott Nicholls',
    grade: '4th Dan (Wado Ryu)',
    role: 'Senior Instructor & Kumite Coach',
    dojo: 'Upminster',
    photo: '/instructors/scott-nicholls.jpg',
    bio: 'Sensei Scott Nicholls has been dedicated to the practice of Wado Ryu Karate since beginning his martial arts journey in July 1986. Demonstrating exceptional discipline and commitment, he earned his 1st Dan Black Belt in September 1989 and has since advanced to the rank of 4th Dan Black Belt, building a distinguished career as an international competitor, coach, and official. In his early karate days, Sensei Nicholls trained and competed alongside Sensei Anthoni Everitt, laying a strong foundation for a lifetime in the sport.\n\nThroughout his martial arts career, Sensei Nicholls has achieved extensive competitive success across all facets of the discipline, earning multiple local and national titles in both Kata and Kumite. A former squad member for the Shikon Karate Association, he has represented his club on the international stage and was a key member of the victorious Redbridge London Youth Games kumite teams.\n\nAs an instructor, Sensei Nicholls brings decades of top-tier competition and traditional Wado Ryu experience to training the next generation of martial artists. He serves as the Kumite Coach for Forza Karate Club and holds senior official roles within Forza as a Kumite and Kata Referee, as well as a Black Belt and Dan Grade Examiner.\n\nDeeply committed to student welfare, athletic development, and maintaining high standards within the martial arts community, Sensei Nicholls also serves as the Designated Safeguarding Lead for Forza.',
  },
  {
    name: 'Sensei Jade Honeywood',
    grade: '4th Dan',
    role: 'Senior Instructor',
    dojo: 'Rayleigh & Upminster',
    photo: '/instructors/jade-honeywood.png',
    bio: 'Sensei Jade\'s experience in Karate began at the age of 5. Her love of kumite (competition fighting) helped her to establish herself and gain selection onto the England National Karate Team from 2006–2008. Sensei Jade has been coached by many of Great Britain\'s elite karate ka and coaches — Sensei Ticky Donavan (OBE), Sensei Wayne Otto (OBE), Sensei Willie Thomas, Sensei Molly Samuels, Sensei Tyrone Whyte and Sensei Ian Cole. Sensei Jade has won numerous medals at both English and British International Championships .\n\nSensei Jade competed in the Wado International Karate Federation (WIKF) World Championships in Texas, USA at the age of 15, winning a gold medal. She later competed at the WIKF European Championships in Amsterdam, Holland, where she also won a gold medal in her style of karate.\n\nIn 2022, Sensei Jade returned to the competition tatami to compete at the EKF Senior English Karate Championships, making a spectacular comeback to win the Senior English National title in the under 68kg category. The spotlight final on the centre tatami at Ponds Forge International Sports Centre, Sheffield, saw Sensei Jade win 4–0, scoring an excellent head kick in the final second — coached throughout by Sensei Anthoni Everitt.\n\nSensei Jade holds a first class BA (Hons) Degree in Sport, Leisure and Educational Development, holds the rank of 4th Dan, and is fully insured, DBS (enhanced) and first aid qualified. She works in partnership with many local primary schools.',
  },
  {
    name: 'Claire Buss',
    grade: '1st Kyu',
    role: 'Assistant Instructor & Para Head Coach',
    dojo: 'Rayleigh & Upminster',
    photo: '/instructors/claire-buss.jpg',
    bio: "Claire Buss returned to karate in her 40s with her two young children, including her autistic son. Having trained previously in her 20s, coming back to training had always been her goal, and the family-friendly atmosphere at Forza Karate was immediately welcoming. Muscle memory kicked in, and the other karateka in the dojo were always willing to demonstrate and explain. Forza Karate not only offered traditional Wado-Ryu karate but also opened up Claire's eyes to the world of Sport Karate and, more importantly, the Veteran Category! Being able to challenge herself in the dojo and on the tatami has only made Claire's love of karate grow, and now she can pass that passion on to a younger generation through assisting with training and encouraging students to challenge themselves. Karate has been immensely beneficial for her son, helping with confidence, body & spatial awareness, balance and fitness as well as being a place of acceptance and friendship. As a SEND parent, Claire is able to bring that extra level of understanding and awareness to the Para athletes that want to compete in her role as Para Head Coach. To any parent thinking about joining in with their kids or even just doing it for themselves, Claire would always say \"Go For It!\"",
  },
  {
    name: 'Y. Yogarajah',
    grade: '1st Dan',
    role: 'Assistant Instructor',
    dojo: 'Rayleigh & Upminster',
    photo: '/instructors/yuan-yogarajah.jpg',
    bio: '',
  },
  {
    name: 'Kobe Yogarajah',
    grade: '2nd Dan',
    role: 'England Karate Team Athlete | International Kumite Competitor',
    dojo: 'Rayleigh & Upminster',
    photo: '/instructors/kobe-yogarajah.jpg',
    bio: 'Kobe Yogarajah is one of England\'s leading young sport karate athletes, competing in WKF Kumite and representing England at the highest levels of international competition.\n\nBeginning his karate journey at Forza Karate Club, Kobe quickly established himself as one of the country\'s most promising competitors through a combination of technical excellence, determination, and consistent performances on both the national and international stage.\n\nOver the years, Kobe has earned selection for the England Karate Team and has represented his country at prestigious events including the EKF European Championships, Commonwealth Karate Championships, Karate1 Youth League events, and other major international tournaments.\n\nHis competitive achievements include:\n\n• Orléans, Bronze Medallist, Orléans, France (2023)\n• Active Essex Young Sport Personality of the Year (2022)\n• Central England International Open Champion (2022)\n• Commonwealth Karate Federation Bronze Medallist (2022)\n• BKF 4 Nations Champion (2022)\n• Multiple National and International Medal Winner\n• England Karate Team Representative\n\nCompeting in both Junior and U21 divisions, Kobe has consistently demonstrated the ability to perform against some of Europe\'s strongest athletes, earning recognition for his speed, tactical awareness, and fighting spirit.\n\nAs a member of the England programme, Kobe continues to pursue success at European and World level while inspiring the next generation of athletes through his commitment, professionalism, and dedication to excellence.\n\nHis journey from local club competitor to international medallist serves as an example of what can be achieved through hard work, perseverance, and a passion for karate.\n\nCareer Highlights\nClub: Forza Karate Club | Country: England | Discipline: WKF Kumite | England Team Competitor ID: ENG02903\n\nMajor Achievements\n• O\'leans, France, Bronze Medallist\n• Commonwealth Championships Bronze Medallist\n• BKF 4 Nations Champion\n• Active Essex Young Sport Personality of the Year\n• England International Athlete',
  },
]

export default function InstructorsPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Instructors</span>
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">Our instructors</h1>
          <p className="text-xl text-gray-500 max-w-2xl leading-relaxed">
            Experienced, qualified, and genuinely passionate about karate. Every Forza instructor
            is DBS enhanced, first aid certified, and fully insured.
          </p>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#fafaf9]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {credentials.map((cred) => (
              <div key={cred.title} className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <cred.icon className="h-5 w-5 text-[#dc2626]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111111] mb-1">{cred.title}</h3>
                  <p className="text-sm text-gray-500">{cred.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <InstructorsClient instructors={instructors} />
    </div>
  )
}
