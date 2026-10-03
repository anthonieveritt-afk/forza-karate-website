import type { Metadata } from 'next'
import Link from 'next/link'
import StoreHeader from '@/components/store/StoreHeader'
import HelpForm from '@/components/store/HelpForm'

export const metadata: Metadata = {
  title: 'Customer help | Store',
  description: 'Help with Forza Karate Club store orders: collection, sizes, cancellations and faulty items.',
}

const faqs = [
  {
    q: 'When will my order be ready?',
    a: 'Most items are ordered in for you and are usually ready to collect within 3–4 weeks. We’ll let you know when your order is ready to collect at the class you chose.',
  },
  {
    q: 'Can you post my order?',
    a: 'No. All orders are collected at class.',
  },
  {
    q: 'I ordered the wrong size.',
    a: 'Send us a message with your order reference. We’ll try to help if the item is unused and in its original packaging.',
  },
  {
    q: 'How do I cancel?',
    a: 'You can cancel within 14 days of collecting your order (personalised items and opened mouthguards excepted). Send us a message below or tell your instructor at class.',
  },
  {
    q: 'Something is faulty.',
    a: 'Sorry about that. Send us a message with your order reference and what’s wrong, and we’ll put it right.',
  },
]

export default function StoreHelpPage() {
  return (
    <>
      <StoreHeader title="Customer help" intro="Questions about a store order? Check the answers below, send us a message, or ask your instructor at class." />
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold text-[#111111]">Common questions</h2>
            <dl className="space-y-5">
              {faqs.map(f => (
                <div key={f.q}>
                  <dt className="text-sm font-semibold text-[#111111]">{f.q}</dt>
                  <dd className="text-sm text-gray-600 mt-1">{f.a}</dd>
                </div>
              ))}
            </dl>
            <p className="text-sm text-gray-500">
              Full details are in our <Link href="/store/terms" className="text-[#dc2626] hover:underline">Terms of Sale</Link>.
            </p>
          </div>
          <div className="lg:col-span-3">
            <div className="rounded-2xl border border-black/8 p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#111111] mb-6">Send us a message</h2>
              <HelpForm />
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
