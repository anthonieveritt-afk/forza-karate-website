import SecretaryBot from '@/components/SecretaryBot'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Contact — Forza Karate Club' }

export default function ContactPage() {
  return (
    <div className="bg-white min-h-screen">
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Contact</span>
            <div className="w-8 h-0.5 bg-[#dc2626]" />
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">Get in touch</h1>
          <p className="text-xl text-gray-500">
            Our virtual assistant is available 24/7 to answer questions about classes, membership, locations, and more. Click the chat bubble below to get started.
          </p>
        </div>
      </section>
      <SecretaryBot />
    </div>
  )
}
