'use client'

import { useState } from 'react'
import { CheckCircle, ArrowRight, ShoppingBag, CreditCard, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { submitTrialBooking } from '@/app/actions/trial-booking'

const rayleighClasses = [
  'Tuesday 6:15–7pm — 4 yrs+ (all grades)',
  'Tuesday 7–8pm — 11 yrs+ (all grades)',
  'Friday 3:30–4:30pm — 4 yrs+ (after school)',
  'Saturday 10–11am — 4 yrs+ (all ages)',
]

const upminsterClasses = [
  'Wednesday 4–4:30pm — Beginner infants (4–6 yrs)',
  'Wednesday 4:30–5pm — Infant all grades (4–6 yrs)',
  'Wednesday 5–5:45pm — Junior all grades (7–10 yrs)',
  'Wednesday 5:45–7pm — Senior all grades (11 yrs+)',
]

const nextSteps = [
  {
    icon: ShoppingBag,
    title: 'Order your official karate suit',
    desc: '2020 Forza Karate Gi — £40. Embroidered with the club logo.',
    href: 'https://forzakarate.co.uk/shop/2020ForzaKarateGi-p223518731',
    cta: 'Order Gi →',
  },
  {
    icon: Shield,
    title: 'Apply for your licence & insurance',
    desc: 'All members need an FKA licence. Takes a few minutes to complete.',
    href: 'https://forzakarate.co.uk/apply-for-your-first-licence/',
    cta: 'Apply for Licence →',
  },
  {
    icon: CreditCard,
    title: 'Set up your Direct Debit',
    desc: 'Pay monthly by Direct Debit via GoCardless. Safe, easy, cancel anytime.',
    href: 'https://pay.gocardless.com/AL00041KG22CVH',
    cta: 'Set up Direct Debit →',
  },
]

export default function JoinPage() {
  const [dojo, setDojo]           = useState('')
  const [classTime, setClassTime] = useState('')
  const [status, setStatus]       = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  const classes = dojo === 'rayleigh' ? rayleighClasses : dojo === 'upminster' ? upminsterClasses : []

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const form = e.currentTarget
    const data = new FormData(form)
    try {
      await submitTrialBooking({
        firstName:      data.get('firstName') as string,
        lastName:       data.get('lastName') as string,
        email:          data.get('email') as string,
        phone:          data.get('phone') as string,
        dateOfBirth:    data.get('dateOfBirth') as string,
        dojo:           data.get('dojo') as string,
        classTime:      data.get('classTime') as string,
        parentName:     data.get('parentName') as string || undefined,
        medicalNotes:   data.get('medicalNotes') as string || undefined,
      })
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  const input = 'w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition'

  return (
    <div className="bg-white">
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Join</span>
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">Join Forza Karate</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Start with a free trial class — no kit, no experience needed. Just show up.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">

          {status === 'done' ? (
            /* ── Success state ── */
            <div>
              <div className="text-center mb-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-[#111111] mb-2">You're booked in!</h2>
                <p className="text-gray-500">
                  We'll be in touch to confirm your trial class. In the meantime, here's what to do next.
                </p>
              </div>

              <h3 className="text-lg font-bold text-[#111111] mb-5">Complete your membership</h3>
              <div className="space-y-4">
                {nextSteps.map((step, i) => (
                  <a
                    key={i}
                    href={step.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-5 rounded-2xl border border-black/8 hover:border-[#dc2626] hover:shadow-sm transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                      <step.icon className="h-5 w-5 text-[#dc2626]" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-[#dc2626] bg-red-50 px-2 py-0.5 rounded-full">Step {i + 1}</span>
                      </div>
                      <p className="font-semibold text-[#111111] text-sm mb-1">{step.title}</p>
                      <p className="text-xs text-gray-500 mb-2">{step.desc}</p>
                      <span className="text-xs font-semibold text-[#dc2626] group-hover:underline">{step.cta}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#dc2626] flex-shrink-0 mt-3 transition-colors" />
                  </a>
                ))}
              </div>
            </div>

          ) : (
            /* ── Form ── */
            <form onSubmit={handleSubmit} className="space-y-6">
              {status === 'error' && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm text-center">
                  Something went wrong — please try again.
                </div>
              )}

              {/* Personal details */}
              <div>
                <h2 className="text-lg font-bold text-[#111111] mb-4">Personal details</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-1.5">First name <span className="text-[#dc2626]">*</span></label>
                    <input name="firstName" type="text" required placeholder="First name" className={input} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-1.5">Last name <span className="text-[#dc2626]">*</span></label>
                    <input name="lastName" type="text" required placeholder="Last name" className={input} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-1.5">Email <span className="text-[#dc2626]">*</span></label>
                    <input name="email" type="email" required placeholder="you@example.com" className={input} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-1.5">Phone <span className="text-[#dc2626]">*</span></label>
                    <input name="phone" type="tel" required placeholder="07700 000000" className={input} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#111111] mb-1.5">Date of birth <span className="text-[#dc2626]">*</span></label>
                  <input name="dateOfBirth" type="date" required className={input} />
                </div>
              </div>

              {/* Parent / guardian */}
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-1.5">
                  Parent / guardian name <span className="text-gray-400 font-normal">(if under 18)</span>
                </label>
                <input name="parentName" type="text" placeholder="Full name" className={input} />
              </div>

              {/* Dojo + class */}
              <div>
                <h2 className="text-lg font-bold text-[#111111] mb-4">Choose your dojo & class</h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#111111] mb-1.5">Dojo <span className="text-[#dc2626]">*</span></label>
                  <select
                    name="dojo"
                    required
                    value={dojo}
                    onChange={e => { setDojo(e.target.value); setClassTime('') }}
                    className={input}
                  >
                    <option value="">Select dojo</option>
                    <option value="rayleigh">Rayleigh — Rayleigh Primary School, SS6 7DD</option>
                    <option value="upminster">Upminster — St Lawrence Church Hall, RM14 2BB</option>
                  </select>
                </div>
                {dojo && (
                  <div>
                    <label className="block text-sm font-medium text-[#111111] mb-1.5">Class time <span className="text-[#dc2626]">*</span></label>
                    <select
                      name="classTime"
                      required
                      value={classTime}
                      onChange={e => setClassTime(e.target.value)}
                      className={input}
                    >
                      <option value="">Select class</option>
                      {classes.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                )}
              </div>

              {/* Medical */}
              <div>
                <label className="block text-sm font-medium text-[#111111] mb-1.5">
                  Medical conditions / notes <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea
                  name="medicalNotes"
                  rows={3}
                  placeholder="Any medical conditions, injuries, or allergies we should know about..."
                  className="w-full px-4 py-3 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition resize-none"
                />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={status === 'loading'}>
                {status === 'loading' ? 'Submitting…' : 'Book my free trial'}
                {status !== 'loading' && <ArrowRight className="h-4 w-4" />}
              </Button>

              <p className="text-xs text-gray-400 text-center">
                First class is free. No kit needed. Your instructor will guide you.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
