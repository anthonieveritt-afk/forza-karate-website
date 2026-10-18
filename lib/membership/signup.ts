// Validates the become-a-member form and works out every amount on the server.
// Payment model (Anthoni, 18 Oct 2026):
//   * Pay today by CARD (Stripe Checkout): licence & insurance + the £40 gi (per student)
//     + the FIRST MONTH of training (after any discount code).
//   * From the following 1st of the month: the monthly training fee by GoCardless DIRECT DEBIT.
//   * A 100% code (FAMILY100) makes training £0: the card still takes the gi and licence,
//     and no Direct Debit mandate or subscription is set up.
import 'server-only'
import { randomBytes } from 'crypto'
import { PLANS, DOJOS, planAllowed, membershipStart, requiredSuit, extrasLineItems, licenceFeePence, firstOfNextMonth, type PlanKey, type DojoKey, type LicenceType } from '@/lib/gocardless/plans'
import type { Signup } from '@/lib/gocardless/store'
import { findDiscount, normaliseCode, trainingFees } from '@/lib/gocardless/discounts'

const s = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const DATE = /^\d{4}-\d{2}-\d{2}$/

export type ParseResult = { ok: true; signup: Signup } | { ok: false; status: 400; error: string }
const bad400 = (error: string): ParseResult => ({ ok: false, status: 400, error })

export function newSignupId(): string {
  return 'SU' + randomBytes(12).toString('hex').toUpperCase()
}
export const SIGNUP_ID = /^SU[0-9A-F]{24}$/

/**
 * Everything paid by card today, one line per item (pence, server prices only). Students are
 * "Student 1", "Student 2"... so no names go to Stripe.
 */
export function upfrontItems(signup: Pick<Signup, 'students' | 'firstPaymentPence' | 'plan' | 'discount'>) {
  const items: { label: string; kind: 'suit' | 'licence' | 'first_month'; pricePence: number }[] = []
  signup.students.forEach((x, i) => {
    if (x.suit) items.push({ label: `Official Forza Karate Club Gi - Student ${i + 1} (${x.suit.size})`, kind: 'suit', pricePence: x.suit.pricePence })
    if (x.licence?.feePence) items.push({ label: `FKA licence & insurance - Student ${i + 1}`, kind: 'licence', pricePence: x.licence.feePence })
  })
  const first = signup.firstPaymentPence ?? 0
  if (first > 0) items.push({ label: `First month of training - ${PLANS[signup.plan].label} package${signup.discount ? ` (code ${signup.discount.code}, ${signup.discount.percent}% off)` : ''}`, kind: 'first_month', pricePence: first })
  return { items, totalPence: items.reduce((t, i) => t + i.pricePence, 0) }
}

// Loose shape of the JSON body: every field is re-checked below.
type Body = { [k: string]: any } // eslint-disable-line @typescript-eslint/no-explicit-any -- untrusted JSON, every field validated below

export function parseSignupBody(input: unknown): ParseResult {
  if (!input || typeof input !== 'object') return bad400('Invalid request')
  const b = input as Body
  const plan = s(b.plan) as PlanKey
  const dojo = s(b.dojo) as DojoKey
  if (!(plan in PLANS)) return bad400('Please choose a membership.')
  if (!(dojo in DOJOS)) return bad400('Please choose a dojo.')
  const trialDate = s(b.trialDate, 10)
  if (!DATE.test(trialDate)) return bad400('Please enter the date of the trial class.')

  let bad = ''
  const students = (Array.isArray(b.students) ? b.students : []).slice(0, 6).map((x: Body) => {
    const dateOfBirth = s(x?.dateOfBirth, 10)
    // Every new member must buy the Official Forza Karate Club Gi (£40): no "already have one" path.
    const suit = requiredSuit(x?.suit)
    if (!suit && (s(x?.firstName, 60) || s(x?.surname, 60)))
      bad = 'Every new member needs an Official Forza Karate Club Gi (£40). Please choose a suit size (by height) for each student.'
    // Joining students always get a first licence (paid). Any client-sent type is ignored.
    const t: LicenceType = 'first_time'
    const licence: { type: string; feePence: number } = { type: t, feePence: licenceFeePence(t, dateOfBirth) }
    return { firstName: s(x?.firstName, 60), surname: s(x?.surname, 60), dateOfBirth,
      belt: s(x?.belt, 40) || 'White', medical: s(x?.medical, 500), suit, licence }
  }).filter((x) => x.firstName && x.surname)
  if (bad) return bad400(bad)
  if (students.length && !planAllowed(plan, students.length))
    return bad400('That package doesn\'t match the number of students: Single is 1 student, Siblings is 2, Family is 3 or more.')
  if (!students.length || students.some((x) => !DATE.test(x.dateOfBirth)))
    return bad400("Please enter each student's name and date of birth.")

  const p = b.parent ?? {}
  const parent = {
    givenName: s(p.givenName, 60), familyName: s(p.familyName, 60), email: s(p.email, 120).toLowerCase(),
    phone: s(p.phone, 30), address: s(p.address, 200), city: s(p.city, 60), postCode: s(p.postCode, 10).toUpperCase(),
  }
  if (!parent.givenName || !parent.familyName || !/^\S+@\S+\.\S+$/.test(parent.email) || !parent.phone || !parent.address || !parent.postCode)
    return bad400('Please complete the parent or guardian details.')
  const emergency = { name: s(b.emergency?.name, 80), phone: s(b.emergency?.phone, 30) }
  if (!emergency.name || !emergency.phone) return bad400('Please add an emergency contact.')
  if (!b.consent?.terms) return bad400('Please accept the club terms.')
  if (students.some((x) => !x.suit)) return bad400('Please choose a suit size (by height) for each student.')

  // One optional discount code per sign-up, re-checked here (never trust the browser's amounts).
  // It applies to the training fees only: the package's monthly fee (which already includes the
  // Siblings/Family saving) and the first month paid by card. Never to the gi or the licence.
  const rawCode = normaliseCode(b.discountCode)
  const discount = rawCode ? findDiscount(rawCode) : null
  if (rawCode && !discount) return bad400("Sorry, that discount code isn't valid.")


  const startDate = membershipStart(trialDate)
  const fees = trainingFees(PLANS[plan].price, startDate, discount)
  const signup: Signup = {
    signupId: newSignupId(), model: 'card-then-dd',
    plan, dojo, classTime: s(b.classTime, 120), trialDate, startDate,
    monthlyFeePence: fees.monthlyPence, firstPaymentPence: fees.firstPaymentPence, discount: fees.applied,
    directDebitStart: fees.monthlyPence > 0 ? firstOfNextMonth(startDate) : null,
    students, parent, emergency, consent: { photos: !!b.consent?.photos, terms: true },
    extrasPence: extrasLineItems(students).reduce((t, item) => t + item.pricePence, 0),
    createdAt: new Date().toISOString(),
  }
  const up = upfrontItems(signup)
  signup.upfrontPence = up.totalPence
  return { ok: true, signup }
}
