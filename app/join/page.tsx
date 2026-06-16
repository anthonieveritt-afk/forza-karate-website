'use client'

import { useState } from 'react'
import { CheckCircle, ArrowRight, ShoppingBag, CreditCard, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { submitEnrolment } from '@/app/actions/enrolment'

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

const licenceStep = {
  icon: Shield,
  title: 'Apply for your licence & insurance',
  desc: 'All members need an FKA licence. Takes a few minutes to complete.',
  href: '/join/apply-licence',
  cta: 'Apply for Licence →',
}

const ddStep = {
  icon: CreditCard,
  title: 'Set up your Direct Debit',
  desc: 'Pay monthly via GoCardless. Safe, easy, cancel anytime.',
  href: 'https://pay.gocardless.com/AL00041KG22CVH',
  cta: 'Set up Direct Debit →',
}

const belts = ['None (complete beginner)', 'White', 'Red', 'Yellow', 'Orange', 'Green', 'Blue', 'Purple', 'Brown', 'Black']
const heardOptions = ['Google / Search', 'Social media', 'Friend or family', 'School', 'Local leaflet / poster', 'Walked past the dojo', 'Other']

export default function JoinPage() {
  const [dojo, setDojo] = useState('')
  const [membershipType, setMembershipType] = useState('trial')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [enrolMemberId, setEnrolMemberId] = useState<number | null>(null)

  const classes = dojo === 'rayleigh' ? rayleighClasses : dojo === 'upminster' ? upminsterClasses : []

  const nextSteps = [
    {
      icon: ShoppingBag,
      title: 'Order your official karate suit',
      desc: 'Blitz Karate Gi — choose your size and add to order.',
      href: enrolMemberId ? `/join/enrol?memberId=${enrolMemberId}` : '/join/enrol',
      cta: 'Order Gi →',
    },
    licenceStep,
    ddStep,
  ]

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    const f = new FormData(e.currentTarget)
    const g = (k: string) => f.get(k) as string
    try {
      const result = await submitEnrolment({
        firstName: g('firstName'),
        lastName: g('lastName'),
        dateOfBirth: g('dateOfBirth'),
        gender: g('gender'),
        email: g('email'),
        phone: g('phone'),
        addressLine1: g('addressLine1'),
        addressLine2: g('addressLine2') || undefined,
        town: g('town'),
        postcode: g('postcode'),
        parentFirstName: g('parentFirstName') || undefined,
        parentLastName: g('parentLastName') || undefined,
        parentEmail: g('parentEmail') || undefined,
        parentPhone: g('parentPhone') || undefined,
        parentRelationship: g('parentRelationship') || undefined,
        emergencyName: g('emergencyName'),
        emergencyPhone: g('emergencyPhone'),
        emergencyRelationship: g('emergencyRelationship'),
        medicalConditions: g('medicalConditions') || undefined,
        dojo: g('dojo'),
        classTime: g('classTime'),
        currentBelt: g('currentBelt'),
        membershipType: g('membershipType'),
        heardAboutUs: g('heardAboutUs') || undefined,
        discountCode: g('discountCode') || undefined,
      })
      setEnrolMemberId(result.memberId || null)
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  const input = 'w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition'
  const label = 'block text-sm font-medium text-[#111111] mb-1.5'
  const req = <span className="text-[#dc2626]">*</span>
  const sectionTitle = 'text-base font-bold text-[#111111] mb-4 pt-2 border-t border-black/6 mt-2'

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Join</span>
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">Join Forza Karate Club</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Start with a free trial or enrol directly. Fill in your details below and we'll be in touch to confirm your place.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">

          {status === 'done' ? (
            <div>
              <div className="text-center mb-12">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-[#111111] mb-2">Enrolment received!</h2>
                <p className="text-gray-500 max-w-md mx-auto">
                  Thank you — we'll be in touch shortly to confirm your place. In the meantime, get ahead with the steps below.
                </p>
              </div>
              <h3 className="text-lg font-bold text-[#111111] mb-5">Complete your membership</h3>
              <div className="space-y-4">
                {nextSteps.map((step, i) => (
                  <a key={i} href={step.href} target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-4 p-5 rounded-2xl border border-black/8 hover:border-[#dc2626] hover:shadow-sm transition-all group">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
                      <step.icon className="h-5 w-5 text-[#dc2626]" />
                    </div>
                    <div className="flex-1">
                      <span className="text-xs font-bold text-[#dc2626] bg-red-50 px-2 py-0.5 rounded-full">Step {i + 1}</span>
                      <p className="font-semibold text-[#111111] text-sm mt-1 mb-1">{step.title}</p>
                      <p className="text-xs text-gray-500 mb-2">{step.desc}</p>
                      <span className="text-xs font-semibold text-[#dc2626] group-hover:underline">{step.cta}</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-[#dc2626] flex-shrink-0 mt-3 transition-colors" />
                  </a>
                ))}
              </div>

              {/* Family discount note */}
              <div className="mt-8 p-4 rounded-xl bg-[#fafaf9] border border-black/6 text-xs text-gray-500 leading-relaxed">
                <strong className="text-[#111111]">Family discount</strong> — available for immediate family (parent + child/children) registering together. Extended family members (cousins, aunts, uncles, grandparents) are not eligible.
              </div>
            </div>

          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">

              {status === 'error' && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm text-center">
                  Something went wrong — please try again or email us at info@forzakarate.co.uk
                </div>
              )}

              {/* ── Membership type ── */}
              <div>
                <p className={label}>Membership type {req}</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'trial', label: 'Free Trial Class', sub: 'No commitment' },
                    { value: 'single', label: 'Single Membership', sub: '1 person' },
                    { value: 'family2', label: 'Family — 2 Members', sub: 'Immediate family only' },
                    { value: 'family3plus', label: 'Family — 3+ Members', sub: 'Immediate family only' },
                  ].map((opt) => (
                    <label key={opt.value}
                      className={`flex flex-col gap-0.5 p-3.5 rounded-xl border cursor-pointer transition-all ${membershipType === opt.value ? 'border-[#dc2626] bg-red-50' : 'border-black/10 hover:border-black/20'}`}>
                      <input type="radio" name="membershipType" value={opt.value} checked={membershipType === opt.value}
                        onChange={() => setMembershipType(opt.value)} className="sr-only" />
                      <span className="text-sm font-semibold text-[#111111]">{opt.label}</span>
                      <span className="text-xs text-gray-400">{opt.sub}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* ── Student details ── */}
              <p className={sectionTitle}>Student details</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={label}>First name {req}</label>
                  <input name="firstName" type="text" required placeholder="First name" className={input} />
                </div>
                <div>
                  <label className={label}>Last name {req}</label>
                  <input name="lastName" type="text" required placeholder="Last name" className={input} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={label}>Date of birth {req}</label>
                  <input name="dateOfBirth" type="date" required min="1900-01-01" max={new Date().toISOString().split('T')[0]} className={input} />
                </div>
                <div>
                  <label className={label}>Gender</label>
                  <select name="gender" className={input}>
                    <option value="">Select</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="prefer_not">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={label}>Email {req}</label>
                  <input name="email" type="email" required placeholder="you@example.com" className={input} />
                </div>
                <div>
                  <label className={label}>Phone {req}</label>
                  <input name="phone" type="tel" required placeholder="07700 000000" className={input} />
                </div>
              </div>

              <div>
                <label className={label}>Address line 1 {req}</label>
                <input name="addressLine1" type="text" required placeholder="House number and street" className={input} />
              </div>
              <div>
                <label className={label}>Address line 2 <span className="text-gray-400 font-normal">(optional)</span></label>
                <input name="addressLine2" type="text" placeholder="Flat, building, etc." className={input} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={label}>Town / City {req}</label>
                  <input name="town" type="text" required placeholder="Town" className={input} />
                </div>
                <div>
                  <label className={label}>Postcode {req}</label>
                  <input name="postcode" type="text" required placeholder="SS6 7DD" className={input} />
                </div>
              </div>

              {/* ── Parent / Guardian ── */}
              <p className={sectionTitle}>Parent / Guardian <span className="text-gray-400 font-normal text-sm">(if student is under 18)</span></p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={label}>Parent first name</label>
                  <input name="parentFirstName" type="text" placeholder="First name" className={input} />
                </div>
                <div>
                  <label className={label}>Parent last name</label>
                  <input name="parentLastName" type="text" placeholder="Last name" className={input} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={label}>Parent email</label>
                  <input name="parentEmail" type="email" placeholder="parent@example.com" className={input} />
                </div>
                <div>
                  <label className={label}>Parent phone</label>
                  <input name="parentPhone" type="tel" placeholder="07700 000000" className={input} />
                </div>
              </div>
              <div>
                <label className={label}>Relationship to student</label>
                <select name="parentRelationship" className={input}>
                  <option value="">Select</option>
                  <option value="mother">Mother</option>
                  <option value="father">Father</option>
                  <option value="guardian">Guardian</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* ── Emergency contact ── */}
              <p className={sectionTitle}>Emergency contact {req}</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={label}>Name {req}</label>
                  <input name="emergencyName" type="text" required placeholder="Full name" className={input} />
                </div>
                <div>
                  <label className={label}>Phone {req}</label>
                  <input name="emergencyPhone" type="tel" required placeholder="07700 000000" className={input} />
                </div>
              </div>
              <div>
                <label className={label}>Relationship to student {req}</label>
                <select name="emergencyRelationship" required className={input}>
                  <option value="">Select</option>
                  <option value="mother">Mother</option>
                  <option value="father">Father</option>
                  <option value="guardian">Guardian</option>
                  <option value="spouse">Spouse / Partner</option>
                  <option value="sibling">Sibling</option>
                  <option value="friend">Friend</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* ── Medical ── */}
              <p className={sectionTitle}>Medical information</p>

              <div>
                <label className={label}>Medical conditions / notes <span className="text-gray-400 font-normal">(optional)</span></label>
                <textarea name="medicalConditions" rows={3}
                  placeholder="Asthma, epilepsy, allergies, injuries, or anything else we should know..."
                  className="w-full px-4 py-3 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition resize-none" />
              </div>

              {/* ── Training preferences ── */}
              <p className={sectionTitle}>Training preferences</p>

              <div>
                <label className={label}>Dojo {req}</label>
                <select name="dojo" required value={dojo} onChange={e => setDojo(e.target.value)} className={input}>
                  <option value="">Select dojo</option>
                  <option value="rayleigh">Rayleigh — Rayleigh Primary School, SS6 7DD</option>
                  <option value="upminster">Upminster — St Lawrence Church Hall, RM14 2BB</option>
                </select>
              </div>

              {dojo && (
                <div>
                  <label className={label}>Preferred class time {req}</label>
                  <select name="classTime" required className={input}>
                    <option value="">Select class</option>
                    {classes.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              )}

              <div>
                <label className={label}>Current belt / experience</label>
                <select name="currentBelt" className={input}>
                  {belts.map(b => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>

              <div>
                <label className={label}>How did you hear about us?</label>
                <select name="heardAboutUs" className={input}>
                  <option value="">Select</option>
                  {heardOptions.map(h => <option key={h} value={h}>{h}</option>)}
                </select>
              </div>

              {/* ── Discount / members code ── */}
              <div>
                <label className={label}>Members / discount code <span className="text-gray-400 font-normal">(optional)</span></label>
                <input name="discountCode" type="text" placeholder="Enter code if you have one" className={input} />
              </div>

              {/* ── Submit ── */}
              <div className="pt-2">
                <Button type="submit" size="lg" className="w-full" disabled={status === 'loading'}>
                  {status === 'loading' ? 'Submitting…' : membershipType === 'trial' ? 'Book my free trial' : 'Submit enrolment'}
                  {status !== 'loading' && <ArrowRight className="h-4 w-4" />}
                </Button>
                <p className="text-xs text-gray-400 text-center mt-3">
                  {membershipType === 'trial'
                    ? 'No kit needed. No commitment. Your instructor will guide you.'
                    : 'We\'ll be in touch within 24 hours to confirm your enrolment and next steps.'}
                </p>
              </div>

            </form>
          )}
        </div>
      </section>
    </div>
  )
}
