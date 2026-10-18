'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { Loader2, Plus, Trash2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { DateInput } from '@/components/DateInput'
import { HeightGuide } from '@/components/HeightGuide'
import { TrialFinder, BookTrialFirst, type Verified } from './TrialFinder'
import { PLANS, pounds, applyDiscount, membershipStart, firstOfNextMonth, FIRST_MONTH_BANDS, bandForDate, bandAmountPence, suitOptions, REQUIRED_SUIT_KEY, planAllowed, licenceFeePence, LICENCE_TYPES, LICENCE_ADULT_AGE, type PlanKey, type LicenceType } from '@/lib/gocardless/plans'

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

/** Shown when Stripe Checkout sends someone back with ?cancelled=1. */
function CancelledNotice() {
  if (!useSearchParams().get('cancelled')) return null
  return <p className="text-sm text-amber-700">Card payment cancelled, nothing was charged. You can try again below.</p>
}

export default function MembershipSignup({ trialLookup = false }: { trialLookup?: boolean }) {
  const [planChoice, setPlanChoice] = useState<PlanKey | null>(null)
  const [dojo, setDojo] = useState('')
  const [classTime, setClassTime] = useState('')
  const [trialDate, setTrialDate] = useState('')
  // First month's payment (weekly band). Pre-selected from the start date; the server re-checks it.
  const [bandChoice, setBandChoice] = useState('')
  const [students, setStudents] = useState<Student[]>([blank()])
  // Trial lookup (flag on): the trials found, and which ones are joining (parallel to `students`).
  const [found, setFound] = useState<Verified | null>(null)
  const [pickedRefs, setPickedRefs] = useState<string[]>([])
  const [parent, setParent] = useState({ givenName: '', familyName: '', email: '', phone: '', address: '', city: '', postCode: '' })
  const [emergency, setEmergency] = useState({ name: '', phone: '' })
  const [terms, setTerms] = useState(false)
  const [photos, setPhotos] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  // Optional discount code (training fees only). The server re-checks it and recomputes all amounts.
  const [codeInput, setCodeInput] = useState('')
  const [applied, setApplied] = useState<{ code: string; percent: number; label: string } | null>(null)
  const [codeMsg, setCodeMsg] = useState<{ ok: boolean; text: string } | null>(null)
  const [codeBusy, setCodeBusy] = useState(false)
  async function applyCode() {
    const code = codeInput.trim()
    if (!code) { setApplied(null); setCodeMsg({ ok: false, text: 'Please enter a discount code.' }); return }
    setCodeBusy(true)
    try {
      const r = await fetch('/api/membership/discount-code', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) })
      const d = await r.json().catch(() => ({}))
      if (r.ok && d.valid) {
        setApplied({ code: d.code, percent: d.percent, label: d.label }); setCodeInput(d.code)
        setCodeMsg({ ok: true, text: `Code ${d.code} applied: ${d.percent}% off your training fees${d.percent === 100 ? ' (no monthly fee)' : ''}. The gi and licence are still charged in full.` })
      } else { setApplied(null); setCodeMsg({ ok: false, text: d.error ?? "Sorry, that discount code isn't valid." }) }
    } catch { setCodeMsg({ ok: false, text: 'Could not check the code. Please try again.' }) }
    finally { setCodeBusy(false) }
  }
  const pct = applied?.percent ?? 0

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
  function onVerified(v: Verified) {
    setFound(v)
    setParent(p => ({ ...p, email: p.email || v.email, phone: p.phone || v.mobile }))
    const club = v.trials.find(t => t.eligible)?.club?.toLowerCase() ?? ''
    if (!dojo && (club.includes('rayleigh') || club.includes('upminster'))) setDojo(club.includes('rayleigh') ? 'rayleigh' : 'upminster')
    const eligible = v.trials.filter(t => t.eligible)
    if (eligible.length === 1) pick([eligible[0].trialRef], v)
  }
  // Ticking students sets the students list, the package (by count) and the trial date (latest trial).
  function pick(refs: string[], v = found) {
    if (!v) return
    const chosen = v.trials.filter(t => t.eligible && refs.includes(t.trialRef))
    setPickedRefs(chosen.map(t => t.trialRef))
    setStudents(cur => chosen.map(t => {
      const i = pickedRefs.indexOf(t.trialRef)
      const keep = i >= 0 ? cur[i] : null
      return { ...(keep ?? blank()), firstName: t.firstName, surname: t.surname, dateOfBirth: t.dateOfBirth ?? keep?.dateOfBirth ?? '' }
    }))
    setPlanChoice(null)
    setTrialDate(chosen.map(t => t.trialDate!).sort().pop() ?? '')
    setBandChoice('')
  }
  const toggle = (ref: string) => pick(pickedRefs.includes(ref) ? pickedRefs.filter(r => r !== ref) : [...pickedRefs, ref])
  const lookupOn = trialLookup
  const trialOf = (i: number) => found?.trials.find(t => t.trialRef === pickedRefs[i])
  const setStudent = (i: number, k: keyof Student, v: string) =>
    setStudents(s => s.map((x, j) => (j === i ? { ...x, [k]: v } : x)))

  const startDate = trialDate ? membershipStart(trialDate) : ''
  const dateBand = startDate ? bandForDate(startDate) : null
  const bandKey = bandChoice || dateBand?.key || ''
  const band = FIRST_MONTH_BANDS.find(b => b.key === bandKey) ?? null
  const bandMismatch = !!(band && dateBand && band.key !== dateBand.key)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (students.some(st => !GI.sizes.includes(st.suitSize))) { setError('Please choose a suit size (by height) for each student. Every new member needs an Official Forza Karate Club Gi (£40).'); return }
    if (lookupOn && !found) return
    if (lookupOn && !pickedRefs.length) { setError('Please tick who is joining.'); return }
    if (!band) { setError("Please choose the first month's payment."); return }
    if (bandMismatch && dateBand) { setError(`Your membership starts on ${ukDate(startDate)}, so please choose "${dateBand.label}" for the first month's payment.`); return }
    setBusy(true)
    try {
      // Step 1: card payment (gi + licence + first month) in Stripe's secure checkout.
      // The monthly Direct Debit is set up straight after, on the page Stripe returns to.
      const res = await fetch('/api/membership/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, dojo, classTime, trialDate, parent, ...(lookupOn ? { trialToken: found?.token, trialRefs: pickedRefs } : {}), emergency, consent: { terms, photos }, discountCode: applied?.code ?? codeInput.trim(), firstMonthBand: bandKey,
          students: students.map(st => ({ ...st, suit: { key: REQUIRED_SUIT_KEY, size: st.suitSize }, licence: { type: 'first_time' } })) }),
      })
      const d = await res.json()
      if (!res.ok || !d.url) { setError(d.error ?? 'Something went wrong.'); setBusy(false); return }
      window.location.assign(d.url)
    } catch {
      setError('Could not connect. Please try again.')
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] pt-28 pb-20 px-4">
      <form onSubmit={submit} className="max-w-2xl mx-auto bg-white rounded-3xl border border-black/8 p-6 sm:p-10 space-y-10">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#dc2626] mb-2">Forza Karate Club</p>
          <h1 className="text-3xl font-bold text-[#111111]">Become a member</h1>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">
            Enjoyed your trial class? Fill in this page, then pay today by card for the licence and insurance, the karate suit and your first month.
            From then on, your monthly fee is collected by Direct Debit on the 1st, set up in the secure GoCardless window straight after. Membership starts the week after your trial.
          </p>
        </header>

        {lookupOn && !found && <TrialFinder onVerified={onVerified} />}
        {lookupOn && found && !found.trials.some(t => t.eligible) && (
          <section className="space-y-3">
            {found.trials.length > 0 && <ul className="text-sm text-gray-700 space-y-1">{found.trials.map(t => <li key={t.trialRef}><strong>{t.firstName}</strong>: {t.reason}</li>)}</ul>}
            <BookTrialFirst intro={found.trials.length ? 'We found your booking, but nobody on it can join yet.' : "We couldn't find a trial booking for those details."} />
          </section>
        )}
        {lookupOn && found && found.trials.some(t => t.eligible) && (
          <section id="trial-picker" className="space-y-3">
            <h2 className="text-lg font-bold">Who is joining?</h2>
            <p className="text-sm text-gray-600">We found your trial booking. Tick everyone who is joining; the package is chosen from the number of students.</p>
            {found.trials.map(t => (
              <label key={t.trialRef} className={`flex items-start gap-3 rounded-2xl border p-3 text-sm ${t.eligible ? 'border-black/10 cursor-pointer' : 'border-black/5 opacity-60'}`}>
                <input type="checkbox" className="mt-1 accent-[#dc2626]" disabled={!t.eligible} checked={pickedRefs.includes(t.trialRef)} onChange={() => toggle(t.trialRef)} />
                <span><strong>{t.firstName} {t.surname}</strong>{t.dateOfBirth && <> · born {ukDate(t.dateOfBirth)}</>}<br />
                  <span className="text-gray-500">{t.eligible && t.trialDate ? <>Trial class {ukDate(t.trialDate)} ({t.status === 'attended' ? 'attended' : 'booked'})</> : t.reason}</span></span>
              </label>
            ))}
          </section>
        )}
        {(!lookupOn || pickedRefs.length > 0) && <>
        <section className="space-y-4">
          <h2 className="text-lg font-bold">1. Membership</h2>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {(Object.keys(PLANS) as PlanKey[]).map(k => (
              <button type="button" key={k} onClick={() => choosePlan(k)} aria-pressed={plan === k} disabled={lookupOn && plan !== k}
                className={`text-left rounded-2xl border-2 p-3 sm:p-4 transition ${plan === k ? 'border-[#dc2626] bg-red-50' : 'border-black/10 hover:border-black/25'}`}>
                <div className="font-semibold text-sm">{PLANS[k].label}</div>
                <div className="text-xl sm:text-2xl font-bold">{pounds(PLANS[k].price)}<span className="text-xs sm:text-sm font-normal text-gray-500">/mo</span></div>
                <div className="text-xs text-gray-500">{PLANS[k].desc}</div>
              </button>
            ))}
          </div>
          {lookupOn && <p className="text-xs text-gray-500 -mt-2">Package set by the number of students joining.</p>}
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
            {lookupOn ? (
            <div id="trial-from-booking" className="text-sm text-gray-700 pb-1 sm:pt-7">Trial class <strong>{trialDate ? ukDate(trialDate) : ''}</strong>{pickedRefs.length > 1 && <span className="text-gray-500"> (most recent)</span>}</div>
            ) : (
            <div>
              <label className={lbl}>Date of trial class</label>
              <DateInput required className={input} value={trialDate} onChange={e => { setTrialDate(e.target.value); setBandChoice('') }} />
            </div>
            )}
            <div className="flex items-end text-sm text-gray-600 pb-3">
              {trialDate ? <>Membership starts <strong className="ml-1">{ukDate(membershipStart(trialDate))}</strong></> : 'Membership starts the week after your trial.'}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold">2. Student details</h2>
          {students.map((st, i) => (
            <div key={i} className="rounded-2xl border border-black/10 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm">Student {i + 1}</span>
                {i > 0 && !lookupOn && <button type="button" onClick={() => setStudents(s => s.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={lbl}>First name</label><input required readOnly={lookupOn} className={`${input} ${lookupOn ? 'bg-[#fafaf9]' : ''}`} value={st.firstName} onChange={e => setStudent(i, 'firstName', e.target.value)} /></div>
                <div><label className={lbl}>Surname</label><input required readOnly={lookupOn} className={`${input} ${lookupOn ? 'bg-[#fafaf9]' : ''}`} value={st.surname} onChange={e => setStudent(i, 'surname', e.target.value)} /></div>
                <div><label className={lbl}>Date of birth</label><DateInput required readOnly={lookupOn && !!trialOf(i)?.dateOfBirth} className={`${input} ${lookupOn && trialOf(i)?.dateOfBirth ? 'bg-[#fafaf9]' : ''}`} value={st.dateOfBirth} onChange={e => setStudent(i, 'dateOfBirth', e.target.value)} /></div>
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
          {lookupOn && <p className="text-xs text-gray-500">Names and dates of birth come from your trial booking. Something wrong? Email <a className="underline" href="mailto:hello@forzakarate.co.uk">hello@forzakarate.co.uk</a>.</p>}
          {students.length < 6 && !lookupOn && (
            <button type="button" onClick={() => setStudents(s => [...s, blank()])} className="flex items-center gap-1.5 text-sm font-medium text-[#dc2626]">
              <Plus className="h-4 w-4" /> Add another student
            </button>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold">3. Parent or guardian (account holder)</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className={lbl}>First name</label><input required className={input} value={parent.givenName} onChange={e => setParent({ ...parent, givenName: e.target.value })} /></div>
            <div><label className={lbl}>Surname</label><input required className={input} value={parent.familyName} onChange={e => setParent({ ...parent, familyName: e.target.value })} /></div>
            <div><label className={lbl}>Email</label><input required type="email" className={input} value={parent.email} onChange={e => setParent({ ...parent, email: e.target.value })} /></div>
            <div><label className={lbl}>Mobile</label><input required type="tel" className={input} value={parent.phone} onChange={e => setParent({ ...parent, phone: e.target.value })} /></div>
            <div className="sm:col-span-2"><label className={lbl}>Address</label><input required className={input} value={parent.address} onChange={e => setParent({ ...parent, address: e.target.value })} /></div>
            <div><label className={lbl}>Town</label><input required className={input} value={parent.city} onChange={e => setParent({ ...parent, city: e.target.value })} /></div>
            <div><label className={lbl}>Postcode</label><input required className={input} value={parent.postCode} onChange={e => setParent({ ...parent, postCode: e.target.value })} /></div>
            <div><label className={lbl}>Emergency contact name</label><input required className={input} value={emergency.name} onChange={e => setEmergency({ ...emergency, name: e.target.value })} /></div>
            <div><label className={lbl}>Emergency contact phone</label><input required type="tel" className={input} value={emergency.phone} onChange={e => setEmergency({ ...emergency, phone: e.target.value })} /></div>
          </div>
          <label className="flex gap-3 text-sm text-gray-600"><input type="checkbox" checked={photos} onChange={e => setPhotos(e.target.checked)} className="mt-1" /> I&apos;m happy for photos of the student(s) to appear on club social media.</label>
          <label className="flex gap-3 text-sm text-gray-600"><input required type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} className="mt-1" /> I agree to the club rules (including that only official Forza Karate Club uniforms may be worn in class) and the <a href="/privacy-policy" className="underline" target="_blank">privacy policy</a>.</label>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold">4. Payment</h2>
          <div>
            <label className={lbl} htmlFor="first-month-band">First month&apos;s payment ({PLAN_LABEL[plan]}) <span className="text-red-600">*</span></label>
            <select id="first-month-band" required className={input} value={bandKey} onChange={e => setBandChoice(e.target.value)}
              aria-invalid={bandMismatch} aria-describedby="first-month-band-help">
              <option value="" disabled>Select an option:</option>
              {FIRST_MONTH_BANDS.map(b => <option key={b.key} value={b.key}>{b.label} ({pounds(bandAmountPence(PLANS[plan].price, b))})</option>)}
            </select>
            <p id="first-month-band-help" className={`text-xs mt-1 ${bandMismatch ? 'text-red-600' : 'text-gray-400'}`}>
              {bandMismatch && dateBand
                ? <>Your membership starts on {ukDate(startDate)}, so the first month&apos;s payment is &ldquo;{dateBand.label}&rdquo;.</>
                : <>Based on the day of the month your membership starts{startDate ? ` (${ukDate(startDate)})` : ''}: 1st–7th full month, 8th–14th 75%, 15th–22nd 50%, 23rd onwards 25%. Your Direct Debit then starts on the 1st of the following month.</>}
            </p>
          </div>
          <div>
            <label className={lbl} htmlFor="discount-code">Discount code <span className="font-normal text-gray-400">(optional)</span></label>
            <div className="flex gap-2">
              <input id="discount-code" className={`${input} uppercase`} value={codeInput} autoComplete="off" spellCheck={false} maxLength={40} placeholder="Enter code"
                onChange={e => { setCodeInput(e.target.value); if (applied) setApplied(null); setCodeMsg(null) }}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); applyCode() } }} />
              <Button type="button" variant="outline" className="h-11 shrink-0" disabled={codeBusy} onClick={applyCode}>{codeBusy ? 'Checking…' : applied ? 'Applied ✓' : 'Apply'}</Button>
            </div>
            {codeMsg && <p role="status" className={`text-xs mt-1.5 ${codeMsg.ok ? 'text-green-700' : 'text-red-600'}`}>{codeMsg.text}</p>}
            <p className="text-xs text-gray-400 mt-1">Codes take money off training fees only, not the gi or the licence. One code per sign-up.</p>
          </div>
          <div className="rounded-2xl bg-[#fafaf9] border border-black/8 p-4 text-sm space-y-2">
            {(() => {
              const fullFee = PLANS[plan].price
              const fee = applyDiscount(fullFee, pct)
              const discountLine = applied && <div className="flex justify-between text-green-700"><span>Discount {applied.code} ({applied.percent}% off training fees)</span><strong>−{pounds(fullFee - fee)} a month</strong></div>
              const suits = students.reduce((t, x) => t + suitCost(x), 0)
              const lic = students.reduce((t, x) => t + licenceCost(x), 0)
              const start = startDate
              const banded = band ? bandAmountPence(fullFee, band) : 0
              const first = applyDiscount(banded, pct)
              const ddFrom = start ? firstOfNextMonth(start) : ''
              const fromLabel = ddFrom ? ukDate(ddFrom).replace(/ \d{4}$/, '') : ''
              return <>
                <p className="font-semibold">Pay today by card</p>
                <div className="flex justify-between"><span className="text-gray-500">Official Forza Karate Club Gi × {students.length}</span><strong>{pounds(suits)}</strong></div>
                <div className="flex justify-between"><span className="text-gray-500">Licence &amp; insurance</span><strong>{pounds(lic)}</strong></div>
                <div className="flex justify-between gap-3"><span className="text-gray-500">{band
                    ? <>First month (joining {band.short}, {band.percent}%){applied && <span className="text-green-700">, code {applied.code}</span>}</>
                    : <>First month (choose the first month&apos;s payment above)</>}</span>
                  <strong className="whitespace-nowrap">{band ? <>{applied && banded !== first && <s className="text-gray-400 font-normal mr-1">{pounds(banded)}</s>}{pounds(first)}</> : '–'}</strong></div>
                <div className="flex justify-between border-t border-black/10 pt-2"><span className="font-semibold">Pay today</span><strong className="text-[#dc2626]">{pounds(suits + lic + first)}</strong></div>
                <div className="flex justify-between pt-2"><span className="font-semibold">{fee > 0 ? `Monthly${fromLabel ? ` from 1 ${fromLabel.replace(/^1 /, '')}` : ''}, by Direct Debit` : 'Monthly'}</span>
                  {fee > 0 ? <strong>{applied && <s className="text-gray-400 font-normal mr-1">{pounds(fullFee)}</s>}{pounds(fee)}</strong> : <strong>£0, no Direct Debit</strong>}</div>
                {discountLine}
                <p className="text-xs text-gray-500">{fee > 0
                  ? <>Pay today by card: licence and insurance, suit and first month. From then on, your monthly fee is collected by Direct Debit on the 1st{ddFrom ? `, starting ${ukDate(ddFrom)}` : ''}.{!trialDate && ' Enter your trial date to see the dates.'}</>
                  : <>Pay today by card: licence and insurance and suit. With your code your training fees are £0, so there is no monthly Direct Debit.</>}</p>
              </>
            })()}
          </div>
          <p className="flex gap-2 text-xs text-gray-500"><ShieldCheck className="h-4 w-4 shrink-0 text-green-600" /> Card details are entered on Stripe&apos;s secure checkout and bank details in GoCardless&apos;s secure window (protected by the Direct Debit Guarantee). Forza Karate Club never sees your card or account number.</p>
          <Suspense><CancelledNotice /></Suspense>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Opening secure checkout…</> : 'Continue to pay by card'}
          </Button>
        </section>
        </>}
      </form>
    </div>
  )
}
