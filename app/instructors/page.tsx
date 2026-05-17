import type { Metadata } from 'next'
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

// Placeholder instructors — replace with real data
const instructors = [
  { name: 'Instructor name TBC', role: 'Head Instructor', dojo: 'Rayleigh & Upminster', bio: 'Bio to be added.' },
  { name: 'Instructor name TBC', role: 'Senior Instructor', dojo: 'Rayleigh', bio: 'Bio to be added.' },
  { name: 'Instructor name TBC', role: 'Instructor', dojo: 'Upminster', bio: 'Bio to be added.' },
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
                {/* Photo placeholder */}
                <div className="w-full h-48 bg-[#fafaf9] flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-3xl font-bold text-gray-400">
                      {instructor.name.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-[#111111] text-lg mb-0.5">{instructor.name}</h3>
                  <p className="text-sm text-[#dc2626] font-medium mb-1">{instructor.role}</p>
                  <p className="text-xs text-gray-400 mb-4">{instructor.dojo}</p>
                  <p className="text-sm text-gray-500">{instructor.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
