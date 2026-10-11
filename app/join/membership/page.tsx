'use client'

import { useState } from 'react'
import Script from 'next/script'
import { useRouter } from 'next/navigation'
import { Loader2, Plus, Trash2, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { DateInput } from '@/components/DateInput'
import { PLANS, pounds, membershipStart, proRataPence, proRataLabel, firstOfNextMonth, suitOptions, planAllowed, licenceFeePence, LICENCE_TYPES, LICENCE_ADULT_AGE, type PlanKey, type LicenceType } from '@/lib/gocardless/plans'

declare global {
  interface Window {
    GoCardlessDropin?: {
      create: (o: {
        billingRequestFlowID: string
        environment: 'live' | 'sandbox'
        onSuccess: (br: { id: string }) => void
        onExit: (error: unknown, metadata: unknown) => void
      }) => { open: () => void; exit: () => void }
    }
  }
}

const CLASSES: Record<string, string[]> = {
  rayleigh: [
    'Tuesday 6:15–7pm — 4 yrs+ (all grades)',
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

type Student = { firstName: string; surname: string; dateOfBirth: string; belt: string; medical: string; suitKey: string; suitSize: string; licence: LicenceType; licenceExpiry: string }
const blank = (): Student => ({ firstName: '', surname: '', dateOfBirth: '', belt: 'White', medical: '', suitKey: '', suitSize: '', licence: 'first_time', licenceExpiry: '' })
const SUITS = suitOptions()
const PLAN_LABEL: Record<PlanKey, string> = { monthly_single: 'Single (1 student)', monthly_two: 'Siblings (2 students)', monthly_family: 'Family (3 or more)' }
const suitCost = (st: Student) => (st.suitKey && st.suitSize ? SUITS.find(x => x.key === st.suitKey)?.price ?? 0 : 0)
const licenceCost = (st: Student) => licenceFeePence(st.licence, st.dateOfBirth)
const ukDate = (iso: string) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

export default function MembershipSignup() {
  const router = useRouter()
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
  const [scriptReady, setScriptReady] = useState(false)

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

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!window.GoCardlessDropin) { setError('The secure Direct Debit form is still loading. Please try again in a moment.'); return }
    setBusy(true)
    try {
      const res = await fetch('/api/membership/billing-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, dojo, classTime, trialDate, parent, emergency, consent: { terms, photos },
          students: students.map(st => ({ ...st, suit: st.suitKey ? { key: st.suitKey, size: st.suitSize } : null, licence: { type: st.licence, expiry: st.licenceExpiry } })) }),
      })
      const d = await res.json()
      if (!res.ok) { setError(d.error ?? 'Something went wrong.'); setBusy(false); return }
      const brId: string = d.billingRequestId
      window.GoCardlessDropin.create({
        billingRequestFlowID: d.flowId,
        environment: d.environment,
        onSuccess: () => router.push(`/join/membership/done?br=${brId}`),
        onExit: () => {
          fetch('/api/membership/cancel', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ billingRequestId: brId }) }).catch(() => {})
          setBusy(false)
        },
      }).open()
    } catch {
      setError('Could not connect. Please try again.')
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] pt-28 pb-20 px-4">
      <Script src="https://pay.gocardless.com/billing/static/dropin/v2/initialise.js" onReady={() => setScriptReady(true)} />
      <form onSubmit={submit} className="max-w-2xl mx-auto bg-white rounded-3xl border border-black/8 p-6 sm:p-10 space-y-10">
        <header>
          <p className="text-xs font-semibold uppercase tracking-widest text-[#dc2626] mb-2">Forza Karate Club</p>
          <h1 className="text-3xl font-bold text-[#111111]">Become a member</h1>
          <p className="text-gray-500 mt-2 text-sm leading-relaxed">
            Enjoyed your trial class? Everything is on this one page: membership, karate suit, FKA licence and your monthly Direct Debit, set up in the secure
            GoCardless window, all without leaving this page. Membership starts the week after your trial.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-lg font-bold">1. Membership</h2>
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
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold">2. Student details</h2>
          {students.map((st, i) => (
            <div key={i} className="rounded-2xl border border-black/10 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm">Student {i + 1}</span>
                {i > 0 && <button type="button" onClick={() => setStudents(s => s.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>}
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><label className={lbl}>First name</label><input required className={input} value={st.firstName} onChange={e => setStudent(i, 'firstName', e.target.value)} /></div>
                <div><label className={lbl}>Surname</label><input required className={input} value={st.surname} onChange={e => setStudent(i, 'surname', e.target.value)} /></div>
                <div><label className={lbl}>Date of birth</label><DateInput required className={input} value={st.dateOfBirth} onChange={e => setStudent(i, 'dateOfBirth', e.target.value)} /></div>
                <div><label className={lbl}>Current belt</label>
                  <select className={input} value={st.belt} onChange={e => setStudent(i, 'belt', e.target.value)}>{BELTS.map(b => <option key={b}>{b}</option>)}</select></div>
              </div>
              <div><label className={lbl}>Medical conditions or allergies (optional)</label><input className={input} value={st.medical} onChange={e => setStudent(i, 'medical', e.target.value)} placeholder="Leave blank if none" /></div>
              <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-black/5">
                <div><label className={lbl}>Karate suit (optional)</label>
                  <select className={input} value={st.suitKey} onChange={e => { setStudent(i, 'suitKey', e.target.value); setStudent(i, 'suitSize', '') }}>
                    <option value="">No suit needed</option>
                    {SUITS.map(x => <option key={x.key} value={x.key}>{x.name} ({pounds(x.price)})</option>)}
                  </select></div>
                <div><label className={lbl}>Suit size (by height)</label>
                  <select className={input} required={!!st.suitKey} disabled={!st.suitKey} value={st.suitSize} onChange={e => setStudent(i, 'suitSize', e.target.value)}>
                    <option value="">{st.suitKey ? 'Choose a size' : '—'}</option>
                    {(SUITS.find(x => x.key === st.suitKey)?.sizes ?? []).map(z => <option key={z}>{z}</option>)}
                  </select>
                  {st.suitKey && <p className="text-xs text-gray-400 mt-1">If between sizes, go up.</p>}</div>
                <div className="sm:col-span-2"><label className={lbl}>FKA licence &amp; insurance (required)</label>
                  <select className={input} value={st.licence} onChange={e => setStudent(i, 'licence', e.target.value)}>
                    {(Object.keys(LICENCE_TYPES) as LicenceType[]).map(k => <option key={k} value={k}>{LICENCE_TYPES[k]}</option>)}
                  </select>
                  {st.licence === 'valid' ? (
                    <div className="mt-2"><label className={lbl}>Current licence expiry date</label>
                      <DateInput required className={input} value={st.licenceExpiry} onChange={e => setStudent(i, 'licenceExpiry', e.target.value)} /></div>
                  ) : (
                    <p className="text-xs text-gray-400 mt-1">Every member needs an FKA licence: £50 under {LICENCE_ADULT_AGE}, £55 for {LICENCE_ADULT_AGE}+.{st.dateOfBirth ? ` This student: ${pounds(licenceCost(st))}.` : ''}</p>
                  )}</div>
              </div>
            </div>
          ))}
          {students.length < 6 && (
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
          <label className="flex gap-3 text-sm text-gray-600"><input required type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} className="mt-1" /> I agree to the club rules and the <a href="/privacy-policy" className="underline" target="_blank">privacy policy</a>.</label>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-bold">4. Direct Debit</h2>
          <div className="rounded-2xl bg-[#fafaf9] border border-black/8 p-4 text-sm space-y-2">
            {(() => {
              const fee = PLANS[plan].price
              if (!trialDate) return <>
                <div className="flex justify-between"><span className="text-gray-500">Package</span><strong>{PLAN_LABEL[plan]}</strong></div>
                <div className="flex justify-between"><span className="text-gray-500">Monthly fee</span><strong>{pounds(fee)} on the 1st of each month</strong></div>
                <p className="text-xs text-gray-500">Enter your trial date to see your first payment. Your first payment covers the rest of the month you start in.</p>
              </>
              const start = membershipStart(trialDate)
              const pr = proRataPence(fee, start)
              const suits = students.reduce((t, x) => t + suitCost(x), 0)
              const lic = students.reduce((t, x) => t + licenceCost(x), 0)
              return <>
                <div className="flex justify-between"><span className="text-gray-500">Package</span><strong>{PLAN_LABEL[plan]}</strong></div>
                <div className="flex justify-between"><span className="text-gray-500">Monthly fee</span><strong>{pounds(fee)} on the 1st, from {ukDate(firstOfNextMonth(start))}</strong></div>
                <div className="flex justify-between"><span className="text-gray-500">First payment, part month ({proRataLabel(start)} from {ukDate(start)})</span><strong>{pounds(pr)}</strong></div>
                <div className="flex justify-between"><span className="text-gray-500">Karate suits ({students.filter(x => suitCost(x)).length})</span><strong>{pounds(suits)}</strong></div>
                <div className="flex justify-between"><span className="text-gray-500">Licence &amp; insurance</span><strong>{pounds(lic)}</strong></div>
                <div className="flex justify-between border-t border-black/10 pt-2"><span className="font-semibold">One-off total, collected first</span><strong className="text-[#dc2626]">{pounds(pr + suits + lic)}</strong></div>
                <p className="text-xs text-gray-500">Everything is collected by Direct Debit, no card needed. The part-month payment is taken from your start date and the suit and licence as soon as the Direct Debit is ready (usually a few working days); monthly fees then come out on the 1st.</p>
              </>
            })()}
          </div>
          <p className="flex gap-2 text-xs text-gray-500"><ShieldCheck className="h-4 w-4 shrink-0 text-green-600" /> Bank details are entered in GoCardless&apos;s secure window and are protected by the Direct Debit Guarantee. Forza Karate Club never sees your account number.</p>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" size="lg" className="w-full" disabled={busy}>
            {busy ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Opening secure form…</> : 'Continue to set up Direct Debit'}
          </Button>
          {!scriptReady && <p className="text-xs text-gray-400 text-center">Loading secure payment form…</p>}
        </section>
      </form>
    </div>
  )
}
