'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2, Plus, Trash2, ShieldCheck, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { DateInput } from '@/components/DateInput'
import { HeightGuide } from '@/components/HeightGuide'
import { PLANS, pounds, membershipStart, proRataPence, proRataLabel, firstOfNextMonth, suitOptions, REQUIRED_SUIT_KEY, planAllowed, licenceFeePence, LICENCE_TYPES, LICENCE_ADULT_AGE, ageOn, type PlanKey, type LicenceType } from '@/lib/gocardless/plans'

const CLASSES: Record<string, string[]> = {
  rayleigh: [
    'Tuesday 6:15–7pm — Ages 4–10 (all grades)',
    'Tuesday 7–8pm — 11 yrs+ (all grades)',
    'Friday 3:40–4:40pm — after-school club (Rayleigh Primary School pupils only)',
    'Saturday 10–11am — 4 yrs+ (all ages)',
  ],
  upminster: [
    'Wednesday 4–4:30pm — Beginner infants (4–6 yrs)',
    'Wednesday 4:30–5pm — Infant all grades (4–6 yrs)',
    'Wednesday 5–5:45pm — Junior all grades (7–10 yrs)',
    'Wednesday 5:45–7pm — Senior all grades (11 yrs+)',
  ],
}
const BELTS = ['White', 'Red', 'Yellow', 'Orange', 'Green', 'Blue', 'Purple', 'Brown', 'Black']
const input = 'w-full h-11 px-4 rounded-xl border border-black/15 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent'
const lbl = 'block text-sm font-medium text-[#111111] mb-1.5'

type Student = { firstName: string; surname: string; dateOfBirth: string; belt: string; medical: string; suitKey: string; suitSize: string; licence: LicenceType }
const blank = (): Student => ({ firstName: '', surname: '', dateOfBirth: '', belt: 'White', medical: '', suitKey: REQUIRED_SUIT_KEY, suitSize: '', licence: 'first_time' })
const SUITS = suitOptions()
// Every new member buys the Official Forza Karate Club Gi (£40); there is no "I already have one" option.
const GI = SUITS.find(x => x.key === REQUIRED_SUIT_KEY)!
const PLAN_LABEL: Record<PlanKey, string> = { monthly_single: 'Single (1 student)', monthly_two: 'Siblings (2 students)', monthly_family: 'Family (3 or more)' }
const suitCost = (_st: Student) => GI.price // always added, one gi per student
const licenceCost = (st: Student) => licenceFeePence('first_time', st.dateOfBirth)
const ukDate = (iso: string) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

/** Known under-18 only when DOB parses and age is under 18. Empty DOB is not treated as a child. */
function knownUnder18(dob: string): boolean {
  const a = ageOn(dob)
  return a !== null && a < LICENCE_ADULT_AGE
}

function MembershipSignup() {
  const cancelled = useSearchParams().get('cancelled') === '1'
  const [planChoice, setPlanChoice] = useState<PlanKey | null>(null)
  const [dojo, setDojo] = useState('')
  const [classTime, setClassTime] = useState('')
  const [trialDate, setTrialDate] = useState('')
  const [students, setStudents] = useState<Student[]>([blank()])
  const [parent, setParent] = useState({ givenName: '', familyName: '', email: '', phone: '', address: '', city: '', postCode: '' })
  const [emergency, setEmergency] = useState({ name: '', phone: '' })
  const [terms, setTerms] = useState(false)
  const [photos, setPhotos] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  // One form page (details + live totals), then Stripe card, then GoCardless DD, then done.
  const step = 1
  const totalSteps = 3

  // Adult solo = one student who is not known under-18 (empty DOB → optimistic adult path).
  // Account-holder name is derived from the student (single source of truth).
  const adultSolo = students.length === 1 && !knownUnder18(students[0].dateOfBirth)
  const anyKnownChild = students.some(st => knownUnder18(st.dateOfBirth))
  const photoConsentLabel = anyKnownChild
    ? "I'm happy for photos of the student(s) to appear on club social media."
    : (students.length > 1
        ? "I'm happy for photos of us to appear on club social media."
        : "I'm happy for photos of me to appear on club social media.")

  /** Map student identity → account-holder for GoCardless / Club Honbu (adults: same person). */
  function accountHolderFromStudents() {
    if (!adultSolo) return parent
    const st = students[0]
    return { ...parent, givenName: st.firstName, familyName: st.surname }
  }

  const autoPlan: PlanKey = students.length >= 3 ? 'monthly_family' : students.length === 2 ? 'monthly_two' : 'monthly_single'
  const plan: PlanKey = planChoice && planAllowed(planChoice, students.length) ? planChoice : autoPlan
  // Picking a package sets the number of student slots (Single 1, Siblings 2, Family 3+).
  function choosePlan(k: PlanKey) {
    const want = k === 'monthly_single' ? 1 : k === 'monthly_two' ? 2 : Math.max(3, students.length)
    if (students.length > want) {
      const extra = students.slice(want)
      const filled = extra.some(x => x.firstName || x.surname || x.dateOfBirth)
      if (filled && !window.confirm(`${PLAN_LABEL[k]} is for ${want} student${want > 1 ? 's' : ''}. Remove the extra student details?`)) return
    }
    setStudents(s => s.length > want ? s.slice(0, want) : [...s, ...Array.from({ length: want - s.length }, blank)])
    setPlanChoice(k)
  }
  const setStudent = (i: number, k: keyof Student, v: string) =>
    setStudents(s => s.map((x, j) => (j === i ? { ...x, [k]: v } : x)))

  function contactIncomplete() {
    return !parent.email || !parent.phone || !parent.address || !parent.city || !parent.postCode || !emergency.name || !emergency.phone
  }

  function validateSignupStep(): string | null {
    if (!dojo || !classTime || !trialDate) return 'Please choose a dojo, class and trial date.'
    if (students.some(st => !st.firstName || !st.surname || !st.dateOfBirth || !st.suitSize)) {
      return 'Please complete each student\'s name, date of birth and suit size.'
    }
    if (students.some(st => !GI.sizes.includes(st.suitSize))) {
      return 'Please choose a suit size (by height) for each student. Every new member needs an Official Forza Karate Club Gi (£40).'
    }
    if (adultSolo) {
      if (contactIncomplete()) return 'Please complete your contact and emergency details.'
    } else {
      if (!parent.givenName || !parent.familyName || contactIncomplete()) {
        return 'Please complete the parent or guardian contact and emergency details.'
      }
    }
    if (!terms) return 'Please agree to the club rules and privacy policy.'
    return null
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    const msg = validateSignupStep()
    if (msg) { setError(msg); return }
    if (students.some(st => !GI.sizes.includes(st.suitSize))) { setError('Please choose a suit size (by height) for each student. Every new member needs an Official Forza Karate Club Gi (£40).'); return }
    setBusy(true)
    try {
      const account = accountHolderFromStudents()
      const res = await fetch('/api/membership/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, dojo, classTime, trialDate, parent: account, emergency, consent: { terms, photos },
          students: students.map(st => ({ ...st, suit: { key: REQUIRED_SUIT_KEY, size: st.suitSize }, licence: { type: 'first_time' } })) }),
      })
      const d = await res.json()
      if (!res.ok) { setError(d.error ?? 'Something went wrong.'); setBusy(false); return }
      if (!d.url) { setError('Could not open card payment.'); setBusy(false); return }
      // Leave this page for Stripe Checkout; after pay, pay-done opens GoCardless for monthly DD only.
      window.location.href = d.url
    } catch {
      setError('Could not connect. Please try again.')
      setBusy(false)
    }
  }

  const showSignup = true
  const showDd = true

  const contactFields = (
    <div className="grid sm:grid-cols-2 gap-4">
      <div><label className={lbl}>Email</label><input required type="email" autoComplete="email" inputMode="email" className={input} value={parent.email} onChange={e => setParent({ ...parent, email: e.target.value })} /></div>
      <div><label className={lbl}>Mobile</label><input required type="tel" autoComplete="tel" className={input} value={parent.phone} onChange={e => setParent({ ...parent, phone: e.target.value })} /></div>
      <div className="sm:col-span-2"><label className={lbl}>Address</label><input required autoComplete="street-address" className={input} value={parent.address} onChange={e => setParent({ ...parent, address: e.target.value })} /></div>
      <div><label className={lbl}>Town</label><input required autoComplete="address-level2" className={input} value={parent.city} onChange={e => setParent({ ...parent, city: e.target.value })} /></div>
      <div><label className={lbl}>Postcode</label><input required autoComplete="postal-code" className={input} value={parent.postCode} onChange={e => setParent({ ...parent, postCode: e.target.value.toUpperCase() })} /></div>
      <div><label className={lbl}>Emergency contact name</label><input required autoComplete="off" className={input} value={emergency.name} onChange={e => setEmergency({ ...emergency, name: e.target.value })} /></div>
      <div><label className={lbl}>Emergency contact phone</label><input required type="tel" autoComplete="off" className={input} value={emergency.phone} onChange={e => setEmergency({ ...emergency, phone: e.target.value })} /></div>
    </div>
  )

  const consentFields = (
    <>
      <label className="flex gap-3 text-sm text-gray-600"><input type="checkbox" checked={photos} onChange={e => setPhotos(e.target.checked)} className="mt-1" /> {photoConsentLabel}</label>
      <label className="flex gap-3 text-sm text-gray-600"><input required type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} className="mt-1" /> I agree to the club rules (including that only official Forza Karate Club uniforms may be worn in class) and the <a href="/privacy-policy" className="underline" target="_blank">privacy policy</a>.</label>
    </>
  )

  return (
    <div className="min-h-screen bg-[#fafaf9] pt-28 pb-20 px-4">
      <form onSubmit={submit} className="max-w-2xl mx-auto bg-white rounded-3xl border border-black/8 p-6 sm:p-10 space-y-10">
        <header>
          {cancelled && <p className="mb-4 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">Card payment was cancelled — nothing was charged. You can try again when ready.</p>}
          <p className="text-xs font-semibold uppercase tracking-widest text-[#dc2626] mb-2">Forza Karate Club</p>
          <h1 className="text-3xl font-bold text-[#111111]">Become a member</h1>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">
            Enjoyed your trial class? Pay suit, licence and your first (pro-rata) month by card, then set up Direct Debit for monthly lesson fees only.
            Membership starts the week after your trial.
          </p>
        </header>

        <div className="space-y-2" aria-label="Progress">
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }, (_, i) => i + 1).map(n => (
              <span key={n} className={`flex-1 h-1 rounded-full ${step >= n ? 'bg-[#dc2626]' : 'bg-black/10'}`} />
            ))}
          </div>
          <p className="text-xs text-gray-400">Step 1 of 3: your details · then card payment · then Direct Debit</p>
        </div>

        {showSignup && (
        <section className="space-y-8">
          <h2 className="text-lg font-bold">1. Your signup</h2>

          <div className="space-y-4">
            <h3 className="text-base font-semibold text-[#111111]">Membership</h3>
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {(Object.keys(PLANS) as PlanKey[]).map(k => (
                <button type="button" key={k} onClick={() => choosePlan(k)} aria-pressed={plan === k}
                  className={`text-left rounded-2xl border-2 p-3 sm:p-4 transition ${plan === k ? 'border-[#dc2626] bg-red-50' : 'border-black/10 hover:border-black/25'}`}>
                  <div className="font-semibold text-sm">{PLANS[k].label}</div>
                  <div className="text-xl sm:text-2xl font-bold">{pounds(PLANS[k].price)}<span className="text-xs sm:text-sm font-normal text-gray-500">/mo</span></div>
                  <div className="text-xs text-gray-500">{PLANS[k].desc}</div>
                </button>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={lbl}>Dojo</label>
                <select required className={input} value={dojo} onChange={e => { setDojo(e.target.value); setClassTime('') }}>
                  <option value="">Choose a dojo</option>
                  <option value="rayleigh">Rayleigh</option>
                  <option value="upminster">Upminster</option>
                </select>
              </div>
              <div>
                <label className={lbl}>Class</label>
                <select required className={input} value={classTime} onChange={e => setClassTime(e.target.value)} disabled={!dojo}>
                  <option value="">Choose a class</option>
                  {(CLASSES[dojo] ?? []).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className={lbl}>Date of trial class</label>
                <DateInput required className={input} value={trialDate} onChange={e => setTrialDate(e.target.value)} />
              </div>
              <div className="flex items-end text-sm text-gray-600 pb-3">
                {trialDate ? <>Membership starts <strong className="ml-1">{ukDate(membershipStart(trialDate))}</strong></> : 'Membership starts the week after your trial.'}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-semibold text-[#111111]">{adultSolo ? 'About you' : 'Student details'}</h3>
            {students.map((st, i) => (
              <div key={i} className="rounded-2xl border border-black/10 p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm">{adultSolo ? 'Your details' : `Student ${i + 1}`}</span>
                  {i > 0 && <button type="button" onClick={() => setStudents(s => s.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>}
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><label className={lbl}>First name</label><input required autoComplete={i === 0 && adultSolo ? 'given-name' : 'off'} className={input} value={st.firstName} onChange={e => setStudent(i, 'firstName', e.target.value)} /></div>
                  <div><label className={lbl}>Surname</label><input required autoComplete={i === 0 && adultSolo ? 'family-name' : 'off'} className={input} value={st.surname} onChange={e => setStudent(i, 'surname', e.target.value)} /></div>
                  <div><label className={lbl}>Date of birth</label><DateInput required className={input} value={st.dateOfBirth} onChange={e => setStudent(i, 'dateOfBirth', e.target.value)} /></div>
                  <div><label className={lbl}>Current belt</label>
                    <select className={input} value={st.belt} onChange={e => setStudent(i, 'belt', e.target.value)}>{BELTS.map(b => <option key={b}>{b}</option>)}</select></div>
                </div>
                <div><label className={lbl}>Medical conditions or allergies (optional)</label><input className={input} value={st.medical} onChange={e => setStudent(i, 'medical', e.target.value)} placeholder="Leave blank if none" /></div>
                <p className="flex items-center gap-2 text-xs font-semibold text-[#111111] bg-[#fafaf9] border-l-4 border-[#dc2626] rounded-r-lg px-3 py-2">Only official Forza Karate Club uniforms may be worn in class.</p>
                <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-black/5">
                  <div><label className={lbl}>Karate suit</label>
                    <p className="text-xs text-gray-500 -mt-0.5 mb-1.5">All members need an official Forza Karate suit (£40)</p>
                    <div className={`${input} flex items-center justify-between bg-[#fafaf9]`} aria-live="polite">
                      <span>{GI.name}</span><strong>{pounds(GI.price)}</strong>
                    </div></div>
                  <div><label className={lbl} htmlFor={`suit-size-${i}`}>Suit size (by height) <span className="text-[#dc2626]">*</span></label>
                    <select id={`suit-size-${i}`} className={input} required value={st.suitSize} onChange={e => setStudent(i, 'suitSize', e.target.value)}>
                      <option value="">Choose a size</option>
                      {GI.sizes.map(z => <option key={z} value={z}>{/^\d+cm$/.test(z) ? `${z.replace('cm', '')} cm tall` : z}</option>)}
                    </select>
                    </div>
                  <div className="sm:col-span-2 -mt-2"><HeightGuide /></div>
                  <div className="sm:col-span-2"><div className={lbl}>FKA licence &amp; insurance (required)</div>
                    <p className="text-sm text-gray-700 mt-1">Licence: {LICENCE_TYPES.first_time}{st.dateOfBirth ? <> · <strong>{pounds(licenceCost(st))}</strong></> : <span className="text-gray-400"> (price shows once date of birth is entered)</span>}</p>
                    <p className="text-xs text-gray-400 mt-1">All students must have a valid and up-to-date licence to train, grade, attend courses and competitions. It is the student/parent&apos;s responsibility to make sure the licence is in date at all times.</p></div>
                </div>
              </div>
            ))}
            {students.length < 6 && (
              <button type="button" onClick={() => setStudents(s => [...s, blank()])} className="flex items-center gap-1.5 text-sm font-medium text-[#dc2626]">
                <Plus className="h-4 w-4" /> Add another student
              </button>
            )}
          </div>

          {/* Adult solo: contact + consent once — name is the student name above, never re-asked */}
          {adultSolo ? (
            <div className="space-y-4 pt-2 border-t border-black/8">
              <h3 className="text-base font-semibold text-[#111111]">Contact &amp; account holder</h3>
              <p className="text-xs text-gray-500">Your name above is used for membership and as the Direct Debit account holder for monthly fees — we won&apos;t ask for it again.</p>
              {contactFields}
              {consentFields}
            </div>
          ) : (
            <div className="space-y-4 pt-2 border-t border-black/8">
              <h3 className="text-base font-semibold text-[#111111]">Parent or guardian (account holder)</h3>
              <p className="text-xs text-gray-500">This person pays by card for the one-off total and is the Direct Debit account holder for monthly fees. Student names are already above.</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={lbl}>First name</label><input required autoComplete="given-name" className={input} value={parent.givenName} onChange={e => setParent({ ...parent, givenName: e.target.value })} /></div>
                <div><label className={lbl}>Surname</label><input required autoComplete="family-name" className={input} value={parent.familyName} onChange={e => setParent({ ...parent, familyName: e.target.value })} /></div>
              </div>
              {contactFields}
              {consentFields}
            </div>
          )}

        </section>
        )}

        {showDd && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold">Your total</h2>
          <div className="rounded-2xl bg-[#fafaf9] border border-black/8 p-4 text-sm space-y-4">
            {(() => {
              const fee = PLANS[plan].price
              if (!trialDate) return <>
                <div className="flex justify-between"><span className="text-gray-500">Package</span><strong>{PLAN_LABEL[plan]}</strong></div>
                <p className="text-xs text-gray-500">Enter your trial date above to see exact amounts.</p>
              </>
              const start = membershipStart(trialDate)
              const pr = proRataPence(fee, start)
              const suits = students.reduce((t, x) => t + suitCost(x), 0)
              const lic = students.reduce((t, x) => t + licenceCost(x), 0)
              const oneOff = pr + suits + lic
              return <>
                <div className="flex justify-between"><span className="text-gray-500">Package</span><strong>{PLAN_LABEL[plan]}</strong></div>

                <div className="rounded-xl bg-white border border-black/8 p-3 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-[#dc2626] flex items-center gap-1.5">
                    <CreditCard className="h-3.5 w-3.5" /> Pay now by card (Stripe)
                  </p>
                  <div className="flex justify-between"><span className="text-gray-500">First month, part month ({proRataLabel(start)} from {ukDate(start)})</span><strong>{pounds(pr)}</strong></div>
                  <div className="flex justify-between"><span className="text-gray-500">Official Forza Karate Club Gi × {students.length}</span><strong>{pounds(suits)}</strong></div>
                  <div className="flex justify-between"><span className="text-gray-500">Licence &amp; insurance</span><strong>{pounds(lic)}</strong></div>
                  <div className="flex justify-between border-t border-black/10 pt-2"><span className="font-semibold">Card total today</span><strong className="text-[#dc2626]">{pounds(oneOff)}</strong></div>
                </div>

                <div className="rounded-xl bg-white border border-black/8 p-3 space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-700 flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5 text-green-600" /> Then Direct Debit (GoCardless)
                  </p>
                  <div className="flex justify-between"><span className="text-gray-500">Monthly lesson fees</span><strong>{pounds(fee)} on the 1st, from {ukDate(firstOfNextMonth(start))}</strong></div>
                  <p className="text-xs text-gray-500">Suit, licence and first month are <strong>not</strong> taken on Direct Debit — only the ongoing monthly membership.</p>
                </div>
              </>
            })()}
          </div>
          <p className="flex gap-2 text-xs text-gray-500"><CreditCard className="h-4 w-4 shrink-0 text-[#dc2626]" /> You&apos;ll pay the one-off total securely with Stripe. After that, GoCardless opens so you can set up the monthly Direct Debit (bank details protected by the Direct Debit Guarantee).</p>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Opening card payment…</> : 'Pay now by card'}
          </Button>
        </section>
        )}
      </form>
    </div>
  )
}


export default function Page() {
  return <Suspense fallback={<div className="min-h-screen bg-[#fafaf9] pt-28" />}><MembershipSignup /></Suspense>
}
