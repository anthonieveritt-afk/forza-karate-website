import {
  PLANS, DOJOS, planAllowed, membershipStart, requiredSuit, extrasLineItems,
  licenceFeePence, proRataPence, type PlanKey, type DojoKey, type LicenceType,
} from './plans'
import type { Signup } from './store'

const s = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const DATE = /^\d{4}-\d{2}-\d{2}$/

export type ParseOk = { ok: true; signup: Omit<Signup, 'createdAt' | 'signupId' | 'stripe' | 'billingRequestId'> & { proRataPence: number } }
export type ParseErr = { ok: false; error: string }

/** Shared validation for membership checkout / billing-request bodies. */
export function parseMembershipBody(b: unknown): ParseOk | ParseErr {
  if (!b || typeof b !== 'object') return { ok: false, error: 'Invalid request' }
  const body = b as Record<string, any>

  const plan = s(body.plan) as PlanKey
  const dojo = s(body.dojo) as DojoKey
  if (!(plan in PLANS)) return { ok: false, error: 'Please choose a membership.' }
  if (!(dojo in DOJOS)) return { ok: false, error: 'Please choose a dojo.' }
  const trialDate = s(body.trialDate, 10)
  if (!DATE.test(trialDate)) return { ok: false, error: 'Please enter the date of the trial class.' }

  let bad = ''
  const students = (Array.isArray(body.students) ? body.students : []).slice(0, 6).map((x: any) => {
    const dateOfBirth = s(x?.dateOfBirth, 10)
    const suit = requiredSuit(x?.suit)
    if (!suit && (s(x?.firstName, 60) || s(x?.surname, 60)))
      bad = 'Every new member needs an Official Forza Karate Club Gi (£40). Please choose a suit size (by height) for each student.'
    const t: LicenceType = 'first_time'
    const licence: { type: string; feePence: number } = { type: t, feePence: licenceFeePence(t, dateOfBirth) }
    return {
      firstName: s(x?.firstName, 60), surname: s(x?.surname, 60), dateOfBirth,
      belt: s(x?.belt, 40) || 'White', medical: s(x?.medical, 500), suit, licence,
    }
  }).filter((x: any) => x.firstName && x.surname)

  if (bad) return { ok: false, error: bad }
  if (students.length && !planAllowed(plan, students.length))
    return { ok: false, error: 'That package doesn\'t match the number of students: Single is 1 student, Siblings is 2, Family is 3 or more.' }
  if (!students.length || students.some((x: any) => !DATE.test(x.dateOfBirth)))
    return { ok: false, error: "Please enter each student's name and date of birth." }

  const p = body.parent ?? {}
  const parent = {
    givenName: s(p.givenName, 60), familyName: s(p.familyName, 60), email: s(p.email, 120).toLowerCase(),
    phone: s(p.phone, 30), address: s(p.address, 200), city: s(p.city, 60), postCode: s(p.postCode, 10).toUpperCase(),
  }
  if (!parent.givenName || !parent.familyName || !/^\S+@\S+\.\S+$/.test(parent.email) || !parent.phone || !parent.address || !parent.postCode)
    return { ok: false, error: 'Please complete the parent or guardian details.' }
  // Parent/guardian is the primary emergency contact by default; a second contact is optional.
  const extra = { name: s(body.emergency?.name, 80), phone: s(body.emergency?.phone, 30), email: s(body.emergency?.email, 120).toLowerCase() }
  if ((extra.name && !extra.phone) || (!extra.name && extra.phone)) return { ok: false, error: 'Please give both a name and phone for the extra emergency contact.' }
  const emergency = extra.name ? { name: extra.name, phone: extra.phone } : { name: `${parent.givenName} ${parent.familyName}`.trim(), phone: parent.phone }
  const emergency2 = extra.name ? extra : undefined
  if (!body.consent?.terms) return { ok: false, error: 'Please accept the club terms.' }
  if (students.some((x: any) => !x.suit)) return { ok: false, error: 'Please choose a suit size (by height) for each student.' }

  const startDate = membershipStart(trialDate)
  const extras = extrasLineItems(students).reduce((t, item) => t + item.pricePence, 0)
  const proRata = proRataPence(PLANS[plan].price, startDate)

  return {
    ok: true,
    signup: {
      plan, dojo, classTime: s(body.classTime, 120), trialDate, startDate,
      students, parent, emergency, ...(emergency2 ? { emergency2 } : {}), consent: { photos: !!body.consent?.photos, terms: true },
      extrasPence: extras, proRataPence: proRata,
    },
  }
}
