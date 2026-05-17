import type { Metadata } from 'next'
import { Shield, Phone, Mail } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Safeguarding',
  description: 'Forza Karate Club safeguarding policy — protecting the welfare of children and young people in our care.',
}

export default function SafeguardingPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Safeguarding</span>
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">Safeguarding</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            The welfare of every child and young person in our club is our highest priority.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-gray max-w-none">
            <h2 className="text-2xl font-bold text-[#111111] mb-4">Our commitment</h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Forza Karate Club is committed to safeguarding and promoting the welfare of children
              and young people. We expect all instructors, assistants, and volunteers to share this
              commitment.
            </p>

            <h2 className="text-2xl font-bold text-[#111111] mb-4 mt-10">DBS checks</h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              All instructors and adults working with children at Forza Karate Club hold a current
              <strong className="text-[#111111]"> Enhanced DBS (Disclosure and Barring Service)</strong> check.
              DBS certificates are renewed regularly and our records are kept up to date.
            </p>

            <h2 className="text-2xl font-bold text-[#111111] mb-4 mt-10">Our safeguarding officer</h2>
            <p className="text-gray-500 leading-relaxed mb-4">
              We have a designated safeguarding lead who handles any concerns raised about the
              welfare of children in the club.
            </p>
            <div className="bg-[#fafaf9] rounded-2xl border border-black/5 p-6 mb-8">
              <p className="text-sm font-semibold text-[#111111] mb-1">Safeguarding Lead</p>
              <p className="text-sm text-gray-500">Contact us for the name and details of our current safeguarding lead.</p>
            </div>

            <h2 className="text-2xl font-bold text-[#111111] mb-4 mt-10">If you have a concern</h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              If you have a concern about the welfare of a child — whether that child is a member
              of Forza Karate Club or not — please contact us immediately. All concerns are taken
              seriously and treated in confidence.
            </p>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-[#dc2626]" />
                <span className="text-gray-600">Contact us via the <a href="/contact" className="text-[#dc2626] hover:underline">contact page</a></span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-[#dc2626]" />
                <span className="text-gray-600">Email: contact details available on request</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Shield className="h-4 w-4 text-[#dc2626]" />
                <span className="text-gray-600">For urgent concerns, contact the NSPCC: <strong>0808 800 5000</strong></span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-[#111111] mb-4 mt-10">FKA affiliation</h2>
            <p className="text-gray-500 leading-relaxed">
              Forza Karate Club is affiliated to the FKA (Federation of Karate Associations).
              Our safeguarding policy is aligned with FKA guidelines and UK Sport requirements.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
