import type { Metadata } from 'next'
import Image from 'next/image'
import { Shield, Award, Heart } from 'lucide-react'

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
    name: 'Sensei Jade Honeywood',
    grade: '4th Dan',
    role: 'Instructor',
    dojo: 'Rayleigh & Upminster',
    photo: '',
    bio: '',
  },
  {
    name: 'Sensei Anthoni Everitt',
    grade: '6th Dan',
    role: 'Head Instructor',
    dojo: 'Rayleigh & Upminster',
    photo: '/team/anthoni-everitt.jpg',
    bio: 'Dedicated and accomplished karate coach with four decades of experience in traditional and sport karate. Proven record of developing athletes from grassroots to world-class level. Renowned for mentoring national and international champions, promoting karate through community-based initiatives and fostering discipline, technical excellence and mental resilience. Skilled in designing structured training programmes for athletes of all ages and abilities.\n\nFormer England Assistant Coach\nFormer Southern Regional Coach',
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

      {/* Instructor cards */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {instructors.map((instructor, i) => (
              <div key={i} className="rounded-2xl border border-black/8 overflow-hidden">
                <div className="w-full aspect-[4/3] bg-[#fafaf9] relative overflow-hidden">
                  {instructor.photo ? (
                    <Image
                      src={instructor.photo}
                      alt={instructor.name}
                      fill
                      className="object-cover object-top"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-bold text-gray-400">{instructor.name.charAt(0)}</span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <h3 className="font-bold text-[#111111] text-lg">{instructor.name}</h3>
                    {'grade' in instructor && <span className="text-xs font-semibold text-gray-400">{instructor.grade}</span>}
                  </div>
                  <p className="text-sm text-[#dc2626] font-medium mb-1">{instructor.role}</p>
                  <p className="text-xs text-gray-400 mb-4">{instructor.dojo}</p>
                  <p className="text-sm text-gray-500 whitespace-pre-line">{instructor.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
