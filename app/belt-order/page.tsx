import type { Metadata } from 'next'
import EventRegForm from '@/components/forms/EventRegForm'
import PageHeader from '@/components/sections/PageHeader'
import { BELT_OPTIONS } from '@/lib/belts'

export const metadata: Metadata = {
  title: 'Personalised Belt Order Form',
  description: 'Order a personalised, embroidered Forza Karate Club belt.',
}

// Prices from the old site's personalised belt order form.
const embroidery = [
  { value: 'Name only, 1 side (£17.00)', label: 'Name only, 1 side — £17.00' },
  { value: 'Club and your name (£18.00)', label: 'Club and your name — £18.00' },
  { value: 'Your name and nickname (£18.00)', label: 'Your name and nickname — £18.00' },
]

const newBelt = [
  { value: 'Yes (£9.99)', label: 'Yes — £9.99' },
  { value: 'No (I will hand my belt to my instructor)', label: 'No — I’ll hand my belt to my instructor' },
]

export default function BeltOrderPage() {
  return (
    <div className="bg-white min-h-screen">
      <PageHeader
        eyebrow="Shop"
        title="Personalised belt order"
        intro="Order an embroidered Forza belt with your name on it."
      />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-black/8 p-6 sm:p-8">
              <EventRegForm
                event="belt-order"
                eventLabel="belt order"
                beltLabel="Belt colour"
                beltOptions={BELT_OPTIONS}
                beltRequired
                hideFields={['dateOfBirth', 'medicalNotes']}
                extraFields={[
                  { name: 'nameOnBelt', label: 'Name on belt', required: true, placeholder: 'Exactly as it should be embroidered' },
                  { name: 'embroidery', label: 'Embroidery', type: 'select', options: embroidery, required: true },
                  { name: 'newBelt', label: 'Do you need a new belt?', type: 'select', options: newBelt, required: true },
                  { name: 'preOrder', label: 'I’ve passed my grading and would like my belt pre-ordered', type: 'checkbox' },
                ]}
                submitLabel="Send belt order"
                successTitle="Belt order received"
                successMessage="Thank you. Your personalised belt order has been received."
              />
            </div>
          </div>

          <aside>
            <div className="rounded-2xl bg-[#fafaf9] border border-black/5 p-6">
              <h2 className="text-lg font-bold text-[#111111] mb-4">Prices</h2>
              <ul className="divide-y divide-black/5 text-sm">
                {embroidery.map((e) => (
                  <li key={e.value} className="py-2.5 text-gray-600">{e.label}</li>
                ))}
                <li className="py-2.5 text-gray-600">New belt — £9.99 (optional)</li>
              </ul>
              <p className="text-xs text-gray-400 mt-4">
                If you don’t need a new belt, hand your current belt to your instructor to be embroidered.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </div>
  )
}
