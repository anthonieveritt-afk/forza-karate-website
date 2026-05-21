import type { Metadata } from 'next'
import Image from 'next/image'
import { Shield, Award, Heart } from 'lucide-react'
import InstructorsClient from './InstructorsClient'

export const metadata: Metadata = {
  title: 'Instructors',
  description: 'Meet the experienced, DBS enhanced, and fully insured instructors at Forza Karate Club.',
}

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
    photo: '/instructors/anthoni-everitt.png',
    bio: 'Dedicated and accomplished karate coach with four decades of experience in traditional and sport karate. Proven record of developing athletes from grassroots to world-class level. Renowned for mentoring national and international champions, promoting karate through community-based initiatives and fostering discipline, technical excellence and mental resilience. Skilled in designing structured training programmes for athletes of all ages and abilities.\n\nFormer England Assistant Coach\nFormer Southern Regional Coach',
  },
  {
    name: 'Sensei Jade Honeywood',
    grade: '4th Dan',
    role: 'Senior Instructor',
    dojo: 'Rayleigh & Upminster',
    photo: '/instructors/jade-honeywood.png',
    bio: 'Sensei Jade\'s experience in Karate began at the age of 5. Her love of kumite (competition fighting) helped her to establish herself and gain selection onto the England National Karate Team from 2006–2008. Sensei Jade has been coached by many of Great Britain\'s elite karate ka and coaches — Sensei Ticky Donavan (OBE), Sensei Wayne Otto (OBE), Sensei Willie Thomas, Sensei Molly Samuels, Sensei Tyrone Whyte and Sensei Ian Cole. Sensei Jade has won numerous medals at both English and British International Championships and was a finalist at the EKF European Karate Championships in Izmir, Turkey.\n\nSensei Jade competed in the Wado International Karate Federation (WIKF) World Championships in Texas, USA at the age of 15, winning a gold medal. She later competed at the WIKF European Championships in Amsterdam, Holland, where she also won a gold medal in her style of karate.\n\nIn 2022, Sensei Jade returned to the competition tatami to compete at the EKF Senior English Karate Championships, making a spectacular comeback to win the Senior English National title in the under 68kg category. The spotlight final on the centre tatami at Ponds Forge International Sports Centre, Sheffield, saw Sensei Jade win 4–0, scoring an excellent head kick in the final second — coached throughout by Sensei Anthoni Everitt.\n\nSensei Jade holds a first class BA (Hons) Degree in Sport, Leisure and Educational Development, holds the rank of 4th Dan, and is fully insured, DBS (enhanced) and first aid qualified. She works in partnership with many local primary schools.',
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
