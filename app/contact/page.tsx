import type { Metadata } from 'next'
import { Mail, MapPin, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with Forza Karate Club. Two dojos — Rayleigh and Upminster.',
}

export default function ContactPage() {
  return (
    <div className="bg-white">
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Contact</span>
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">Get in touch</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Questions about classes, membership, or anything else — we&apos;re happy to help.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact info */}
          <div>
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-[#dc2626]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111111] mb-1">Email</h3>
                  <p className="text-gray-500 text-sm">Contact us via the form or find our email on social media.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-[#dc2626]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111111] mb-1">Locations</h3>
                  <p className="text-gray-500 text-sm mb-1">Rayleigh Primary School, Rayleigh, Essex</p>
                  <p className="text-gray-500 text-sm">Upminster, East London</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-[#dc2626]" />
                </div>
                <div>
                  <h3 className="font-semibold text-[#111111] mb-1">When we train</h3>
                  <p className="text-gray-500 text-sm">Term time only — 40 weeks per year. Contact us for current class times.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Simple contact form */}
          <div>
            <h2 className="text-xl font-bold text-[#111111] mb-6">Send a message</h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-1.5">Name</label>
                <input
                  type="text"
                  placeholder="Your name"
                  className="w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-1.5">Email</label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-1.5">Message</label>
                <textarea
                  rows={5}
                  placeholder="What would you like to know?"
                  className="w-full px-4 py-3 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full h-11 bg-[#dc2626] text-white font-medium rounded-full text-sm hover:bg-red-700 transition-colors"
              >
                Send Message
              </button>
              <p className="text-xs text-gray-400 text-center">
                Or book a free trial class — it&apos;s the easiest way to see if Forza is for you.
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
