'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { CheckCircle, ChevronRight, User, ShoppingBag, CreditCard, Zap, Tag, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'

// ─── Constants ───────────────────────────────────────────────────────────────

const HONBU_API = process.env.NEXT_PUBLIC_CLUB_HONBU_API ?? 'https://forza-club-honbu-production.up.railway.app/api'

const MEMBERSHIP_OPTIONS = [
  { key: 'yearly',          label: 'Annual — £540',          desc: '1 student · one payment · best value' },
  { key: 'monthly_single',  label: 'Monthly — £45/mo',        desc: '1 student · 12 monthly payments' },
  { key: 'monthly_two',     label: 'Family (2) — £75/mo',     desc: '2 students · 12 monthly payments' },
  { key: 'monthly_family',  label: 'Family (3+) — £100/mo',   desc: '3+ students · 12 monthly payments' },
]

const RAYLEIGH_CLASSES = [
  'Tuesday 6:15–7pm — 4 yrs+ (all grades)',
  'Tuesday 7–8pm — 11 yrs+ (all grades)',
  'Friday 3:30–4:30pm — 4 yrs+ (after school)',
  'Saturday 10–11am — 4 yrs+ (all ages)',
]

const UPMINSTER_CLASSES = [
  'Wednesday 4–4:30pm — Beginner infants (4–6 yrs)',
  'Wednesday 4:30–5pm — Infant all grades (4–6 yrs)',
  'Wednesday 5–5:45pm — Junior all grades (7–10 yrs)',
  'Wednesday 5:45–7pm — Senior all grades (11 yrs+)',
]

const SUIT_SIZES = ['100cm','110cm','120cm','130cm','140cm','150cm','160cm','170cm','180cm','190cm']
const SUIT_PRICE_PENCE = 4000 // £40

const BELTS = ['None (complete beginner)', 'White', 'Red', 'Yellow', 'Orange', 'Green', 'Blue', 'Purple', 'Brown', 'Black']

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = [
  { icon: User,        label: 'About you' },
  { icon: ShoppingBag, label: 'Kit & membership' },
  { icon: CreditCard,  label: 'Direct Debit' },
  { icon: Zap,         label: 'Pay now' },
]

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((s, i) => (
        <div key={i} className="flex items-center flex-1 last:flex-none">
          <div className={`flex items-center gap-2 ${i < current ? 'text-green-600' : i === current ? 'text-[#dc2626]' : 'text-gray-300'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
              i < current ? 'bg-green-600 border-green-600' :
              i === current ? 'bg-[#dc2626] border-[#dc2626]' : 'border-gray-200'
            }`}>
              {i < current
                ? <CheckCircle className="h-4 w-4 text-white" />
                : <s.icon className={`h-4 w-4 ${i === current ? 'text-white' : 'text-gray-300'}`} />
              }
            </div>
            <span className={`text-xs font-medium hidden sm:block ${i === current ? 'text-[#111111]' : i < current ? 'text-green-600' : 'text-gray-300'}`}>
              {s.label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-px mx-2 ${i < current ? 'bg-green-400' : 'bg-gray-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Field helpers ────────────────────────────────────────────────────────────

const inputClass = 'w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition'
const labelClass = 'block text-sm font-medium text-[#111111] mb-1.5'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className={labelClass}>{label}</label>{children}</div>
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function EnrolPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Step 1 fields
  const [firstName, setFirstName]               = useState('')
  const [surname, setSurname]                   = useState('')
  const [dob, setDob]                           = useState('')
  const [address, setAddress]                   = useState('')
  const [postCode, setPostCode]                 = useState('')
  const [email, setEmail]                       = useState('')
  const [phone, setPhone]                       = useState('')
  const [belt, setBelt]                         = useState('None (complete beginner)')
  const [dojo, setDojo]                         = useState('')
  const [classTime, setClassTime]               = useState('')
  const [medicalCondition, setMedicalCondition] = useState('')
  const [isMinor, setIsMinor]                   = useState(false)
  const [parentName, setParentName]             = useState('')
  const [parentPhone, setParentPhone]           = useState('')
  const [parentEmail, setParentEmail]           = useState('')
  const [emergencyContact, setEmergencyContact] = useState('')
  const [emergencyPhone, setEmergencyPhone]     = useState('')

  // Step 2 fields
  const [membershipType, setMembershipType] = useState('monthly_single')
  const [suitSize, setSuitSize]             = useState('')
  const [wantSuit, setWantSuit]             = useState(true)

  // Access code
  const [accessCodeInput, setAccessCodeInput]   = useState('')
  const [accessCodeApplied, setAccessCodeApplied] = useState('')
  const [accessCodeDiscount, setAccessCodeDiscount] = useState<{ discountPence: number; discountLabel: string } | null>(null)
  const [accessCodeError, setAccessCodeError]   = useState('')
  const [accessCodeLoading, setAccessCodeLoading] = useState(false)

  // Returned from API
  const [memberId, setMemberId]             = useState<number | null>(null)
  const [proRataPence, setProRataPence]     = useState(0)

  const classes = dojo === 'rayleigh' ? RAYLEIGH_CLASSES : dojo === 'upminster' ? UPMINSTER_CLASSES : []
  const isMonthly = membershipType !== 'yearly'

  // ── Step 1 submit ──────────────────────────────────────────────────────────
  async function submitStep1() {
    setLoading(true); setError('')
    try {
      const res = await fetch(`${HONBU_API}/enrolment/student`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName, surname, dateOfBirth: dob,
          address, postCode, email, telephone: phone,
          currentBelt: belt === 'None (complete beginner)' ? 'White' : belt,
          clubName: dojo === 'rayleigh' ? 'Forza Karate — Rayleigh' : 'Forza Karate — Upminster',
          classTime, medicalCondition,
          parentName: isMinor ? parentName : null,
          emergencyContact, emergencyPhone,
          membershipType, licenceType: 'Student',
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Something went wrong'); return }
      setMemberId(data.memberId)
      setProRataPence(data.proRataPence)
      setStep(1)
    } catch { setError('Could not connect. Please try again.') }
    finally { setLoading(false) }
  }

  // ── Step 2: Validate access code ─────────────────────────────────────────
  async function validateAccessCode() {
    if (!accessCodeInput.trim()) return
    setAccessCodeLoading(true)
    setAccessCodeError('')
    setAccessCodeDiscount(null)
    try {
      const membershipPrices: Record<string, number> = {
        yearly: 54000,
        monthly_single: 4500,
        monthly_two: 7500,
        monthly_family: 10000,
      }
      const amountPence = membershipPrices[membershipType] ?? 4500
      const res = await fetch(`${HONBU_API}/public/validate-access-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: accessCodeInput.trim().toUpperCase(), amountPence }),
      })
      const data = await res.json()
      if (data.valid) {
        setAccessCodeDiscount({ discountPence: data.discountPence, discountLabel: data.discountLabel })
        setAccessCodeApplied(accessCodeInput.trim().toUpperCase())
        setAccessCodeError('')
      } else {
        setAccessCodeError(data.message ?? 'Invalid or expired access code')
        setAccessCodeApplied('')
      }
    } catch {
      setAccessCodeError('Could not validate code. Please try again.')
    } finally {
      setAccessCodeLoading(false)
    }
  }

  function clearAccessCode() {
    setAccessCodeInput('')
    setAccessCodeApplied('')
    setAccessCodeDiscount(null)
    setAccessCodeError('')
  }

  // ── Step 3: Start GoCardless redirect ─────────────────────────────────────
  async function startGoCardless() {
    if (!memberId) return
    setLoading(true); setError('')
    try {
      const successUrl = `${window.location.origin}/join/enrol/dd-return?memberId=${memberId}`
      const res = await fetch(`${HONBU_API}/enrolment/gocardless/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ memberId, successUrl }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Could not start Direct Debit setup'); return }
      window.location.href = data.redirectUrl
    } catch { setError('Could not connect. Please try again.') }
    finally { setLoading(false) }
  }

  // ── Step 4: Stripe checkout ───────────────────────────────────────────────
  async function startStripeCheckout() {
    if (!memberId) return
    setLoading(true); setError('')
    try {
      const successUrl = `${window.location.origin}/join/enrol/complete?memberId=${memberId}`
      const cancelUrl  = `${window.location.origin}/join/enrol?resume=${memberId}`
      const res = await fetch(`${HONBU_API}/enrolment/stripe/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memberId,
          suitKey: wantSuit && suitSize ? 'blitz-gi' : null,
          suitSizePence: wantSuit && suitSize ? SUIT_PRICE_PENCE : null,
          successUrl, cancelUrl, membershipType,
          accessCode: accessCodeApplied || null,
        }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Could not start payment'); return }
      if (data.skip) { router.push(`/join/enrol/complete?memberId=${memberId}`); return }
      window.location.href = data.checkoutUrl
    } catch { setError('Could not connect. Please try again.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-white px-4 py-16">
      <div className="max-w-xl mx-auto">

        {/* Header */}
        <div className="flex justify-center mb-8">
          <Image src="/forza-logo.webp" alt="Forza Karate Club" width={120} height={48} className="h-12 w-auto" />
        </div>
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#111111] mb-2">Join Forza Karate Club</h1>
          <p className="text-gray-500 text-sm">Complete all 4 steps to finish your enrolment.</p>
        </div>

        <StepBar current={step} />

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm text-center">{error}</div>
        )}

        {/* ── STEP 0: Student details ───────────────────────────────────────── */}
        {step === 0 && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-[#111111] mb-4">About the student</h2>

            <div className="grid grid-cols-2 gap-3">
              <Field label="First name">
                <input className={inputClass} value={firstName} onChange={e => setFirstName(e.target.value)} required placeholder="First name" />
              </Field>
              <Field label="Surname">
                <input className={inputClass} value={surname} onChange={e => setSurname(e.target.value)} required placeholder="Surname" />
              </Field>
            </div>

            <Field label="Date of birth">
              <input type="date" className={inputClass} value={dob} min="1900-01-01" max={new Date().toISOString().split('T')[0]} onChange={e => { setDob(e.target.value); const age = new Date().getFullYear() - new Date(e.target.value).getFullYear(); setIsMinor(age < 18) }} required />
            </Field>

            <Field label="Email">
              <input type="email" className={inputClass} value={email} onChange={e => setEmail(e.target.value)} required placeholder="email@example.com" />
            </Field>

            <Field label="Phone">
              <input type="tel" className={inputClass} value={phone} onChange={e => setPhone(e.target.value)} required placeholder="07700 000000" />
            </Field>

            <Field label="Address">
              <input className={inputClass} value={address} onChange={e => setAddress(e.target.value)} required placeholder="123 High Street" />
            </Field>

            <Field label="Postcode">
              <input className={inputClass} value={postCode} onChange={e => setPostCode(e.target.value)} required placeholder="SS6 1AA" />
            </Field>

            <Field label="Current belt">
              <select className={inputClass} value={belt} onChange={e => setBelt(e.target.value)}>
                {BELTS.map(b => <option key={b}>{b}</option>)}
              </select>
            </Field>

            <Field label="Which dojo?">
              <select className={inputClass} value={dojo} onChange={e => { setDojo(e.target.value); setClassTime('') }}>
                <option value="">Select location…</option>
                <option value="rayleigh">Rayleigh</option>
                <option value="upminster">Upminster</option>
              </select>
            </Field>

            {dojo && (
              <Field label="Preferred class time">
                <select className={inputClass} value={classTime} onChange={e => setClassTime(e.target.value)}>
                  <option value="">Select class…</option>
                  {classes.map(c => <option key={c}>{c}</option>)}
                </select>
              </Field>
            )}

            <Field label="Medical conditions / notes (optional)">
              <textarea className={`${inputClass} h-20 py-2.5 resize-none`} value={medicalCondition} onChange={e => setMedicalCondition(e.target.value)} placeholder="Asthma, allergies, injuries…" />
            </Field>

            {isMinor && (
              <div className="p-4 rounded-xl bg-[#fafaf9] border border-black/8 space-y-3">
                <p className="text-sm font-semibold text-[#111111]">Parent / Guardian details</p>
                <Field label="Parent name">
                  <input className={inputClass} value={parentName} onChange={e => setParentName(e.target.value)} placeholder="Full name" />
                </Field>
                <Field label="Parent phone">
                  <input type="tel" className={inputClass} value={parentPhone} onChange={e => setParentPhone(e.target.value)} placeholder="07700 000000" />
                </Field>
                <Field label="Parent email">
                  <input type="email" className={inputClass} value={parentEmail} onChange={e => setParentEmail(e.target.value)} placeholder="parent@email.com" />
                </Field>
              </div>
            )}

            <div className="p-4 rounded-xl bg-[#fafaf9] border border-black/8 space-y-3">
              <p className="text-sm font-semibold text-[#111111]">Emergency contact</p>
              <Field label="Name">
                <input className={inputClass} value={emergencyContact} onChange={e => setEmergencyContact(e.target.value)} placeholder="Emergency contact name" />
              </Field>
              <Field label="Phone">
                <input type="tel" className={inputClass} value={emergencyPhone} onChange={e => setEmergencyPhone(e.target.value)} placeholder="07700 000000" />
              </Field>
            </div>

            <Button
              size="lg" className="w-full mt-2"
              disabled={loading || !firstName || !surname || !dob || !email || !phone || !address || !postCode || !dojo || !classTime}
              onClick={submitStep1}
            >
              {loading ? 'Saving…' : 'Continue'} <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

        {/* ── STEP 1: Kit & membership ──────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#111111] mb-4">Kit & membership</h2>

            {/* Suit */}
            <div>
              <p className={labelClass}>Karate suit</p>
              <div className="mb-3 p-3 rounded-xl bg-[#fafaf9] border border-black/8">
                <p className="text-sm font-semibold text-[#111111]">Blitz Karate Gi — £40</p>
                <p className="text-xs text-gray-500 mt-0.5">Our basic club suit package. Includes jacket and trousers.</p>
              </div>
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setWantSuit(true)}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors ${wantSuit ? 'bg-[#111111] text-white border-[#111111]' : 'border-black/12 text-gray-600'}`}
                >
                  Yes, I need one
                </button>
                <button
                  onClick={() => { setWantSuit(false); setSuitSize('') }}
                  className={`flex-1 py-2.5 rounded-xl border text-sm font-medium transition-colors ${!wantSuit ? 'bg-[#111111] text-white border-[#111111]' : 'border-black/12 text-gray-600'}`}
                >
                  I already have one
                </button>
              </div>
              {wantSuit && (
                <div className="flex flex-wrap gap-1.5">
                  {SUIT_SIZES.map(s => (
                    <button
                      key={s}
                      onClick={() => setSuitSize(s)}
                      className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${suitSize === s ? 'bg-[#111111] text-white border-[#111111]' : 'border-black/12 text-gray-600 hover:border-black/30'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Membership */}
            <div>
              <p className={labelClass}>Membership</p>
              <div className="space-y-2">
                {MEMBERSHIP_OPTIONS.map(opt => (
                  <button
                    key={opt.key}
                    onClick={() => setMembershipType(opt.key)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border text-left transition-colors ${membershipType === opt.key ? 'bg-[#dc2626] border-[#dc2626] text-white' : 'border-black/12 hover:border-black/25'}`}
                  >
                    <div>
                      <p className="text-sm font-semibold">{opt.label}</p>
                      <p className={`text-xs ${membershipType === opt.key ? 'text-white/80' : 'text-gray-400'}`}>{opt.desc}</p>
                    </div>
                    {membershipType === opt.key && <CheckCircle className="h-5 w-5 text-white flex-shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Access Code */}
            <div>
              <p className={labelClass}>Access Code <span className="text-gray-400 text-xs">(optional)</span></p>
              {accessCodeDiscount ? (
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-green-700">✓ {accessCodeDiscount.discountLabel} applied</span>
                    <span className="text-xs text-green-600 font-mono">{accessCodeApplied}</span>
                  </div>
                  <button onClick={clearAccessCode} className="text-green-400 hover:text-green-700 transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    className={`${inputClass} flex-1 uppercase`}
                    placeholder="Enter access code"
                    value={accessCodeInput}
                    onChange={e => { setAccessCodeInput(e.target.value.toUpperCase()); setAccessCodeError('') }}
                    onKeyDown={e => e.key === 'Enter' && validateAccessCode()}
                  />
                  <button
                    type="button"
                    onClick={validateAccessCode}
                    disabled={accessCodeLoading || !accessCodeInput.trim()}
                    className="px-4 py-2 rounded-xl bg-[#111111] text-white text-sm font-medium disabled:opacity-40 transition-opacity flex items-center gap-1.5 shrink-0"
                  >
                    {accessCodeLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Apply'}
                  </button>
                </div>
              )}
              {accessCodeError && (
                <p className="mt-1.5 text-xs text-red-600">{accessCodeError}</p>
              )}
            </div>

            <Button
              size="lg" className="w-full"
              disabled={wantSuit && !suitSize}
              onClick={() => setStep(isMonthly ? 2 : 3)}
            >
              Continue <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}

        {/* ── STEP 2: GoCardless Direct Debit ──────────────────────────────── */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#111111]">Set up your Direct Debit</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your monthly membership fee will be collected by Direct Debit. You'll be taken to GoCardless (our payment partner) to authorise the mandate. It takes about 60 seconds.
            </p>
            <div className="p-4 rounded-xl bg-[#fafaf9] border border-black/8 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Monthly amount</span>
                <span className="font-semibold text-[#111111]">
                  {MEMBERSHIP_OPTIONS.find(o => o.key === membershipType)?.label.split('—')[1]?.trim() ?? '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">First collection</span>
                <span className="font-semibold text-[#111111]">1st of next month</span>
              </div>
            </div>
            <p className="text-xs text-gray-400">
              The bank account holder name can be a parent or guardian — it doesn't need to match the student's name.
            </p>
            <Button size="lg" className="w-full" disabled={loading} onClick={startGoCardless}>
              {loading ? 'Redirecting…' : 'Set up Direct Debit with GoCardless →'}
            </Button>
            <button onClick={() => setStep(1)} className="w-full text-sm text-gray-400 hover:text-[#111111] transition-colors text-center mt-2">
              ← Back
            </button>
          </div>
        )}

        {/* ── STEP 3: Pay now (Stripe) ──────────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#111111]">Pay now</h2>

            <div className="p-4 rounded-xl bg-[#fafaf9] border border-black/8 space-y-2 text-sm">
              {wantSuit && suitSize && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Blitz Karate Gi ({suitSize})</span>
                  <span className="font-semibold text-[#111111]">£40.00</span>
                </div>
              )}
              {isMonthly ? (
                <div className="flex justify-between">
                  <span className="text-gray-500">First month (pro-rata)</span>
                  <span className="font-semibold text-[#111111]">
                    £{(proRataPence / 100).toFixed(2)}
                  </span>
                </div>
              ) : (
                <div className="flex justify-between">
                  <span className="text-gray-500">Annual membership</span>
                  <span className="font-semibold text-[#111111]">£540.00</span>
                </div>
              )}
              {accessCodeDiscount && (
                <div className="flex justify-between text-green-700">
                  <span className="flex items-center gap-1"><Tag className="h-3.5 w-3.5" /> Access code ({accessCodeApplied})</span>
                  <span className="font-semibold">− £{(accessCodeDiscount.discountPence / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-black/8 pt-2 flex justify-between font-semibold">
                <span>Total today</span>
                <span className="text-[#dc2626]">
                  £{(((wantSuit && suitSize ? SUIT_PRICE_PENCE : 0) + (isMonthly ? proRataPence : 54000) - (accessCodeDiscount?.discountPence ?? 0)) / 100).toFixed(2)}
                </span>
              </div>
            </div>

            <Button size="lg" className="w-full" disabled={loading} onClick={startStripeCheckout}>
              {loading ? 'Redirecting to Stripe…' : 'Pay securely with Stripe →'}
            </Button>

            <button onClick={() => setStep(isMonthly ? 2 : 1)} className="w-full text-sm text-gray-400 hover:text-[#111111] transition-colors text-center mt-2">
              ← Back
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
