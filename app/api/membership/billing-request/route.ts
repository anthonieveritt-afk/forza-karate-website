import { NextResponse } from 'next/server'
import { gc, gcEnv, gcConfigured, GcError } from '@/lib/gocardless/client'
import { PLANS, DOJOS, planAllowed, membershipStart, suitPrice, licenceFeePence, LICENCE_TYPES, type PlanKey, type DojoKey, type LicenceType } from '@/lib/gocardless/plans'
import { saveSignup, type Signup } from '@/lib/gocardless/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const s = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '')
const DATE = /^\d{4}-\d{2}-\d{2}$/

export async function POST(req: Request) {
  if (!gcConfigured()) return NextResponse.json({ error: 'Direct Debit sign-up is not available yet.' }, { status: 503 })
  const b = await req.json().catch(() => null)
  if (!b) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const plan = s(b.plan) as PlanKey
  const dojo = s(b.dojo) as DojoKey
  if (!(plan in PLANS)) return NextResponse.json({ error: 'Please choose a membership.' }, { status: 400 })
  if (!(dojo in DOJOS)) return NextResponse.json({ error: 'Please choose a dojo.' }, { status: 400 })
  const trialDate = s(b.trialDate, 10)
  if (!DATE.test(trialDate)) return NextResponse.json({ error: 'Please enter the date of the trial class.' }, { status: 400 })

  let bad = ''
  const students = (Array.isArray(b.students) ? b.students : []).slice(0, 6).map((x: any) => {
    const dateOfBirth = s(x?.dateOfBirth, 10)
    let suit = null
    if (x?.suit?.key) {
      const pricePence = suitPrice(s(x.suit.key, 40), s(x.suit.size, 20))
      if (pricePence == null) bad = 'Please choose a size for each karate suit.'
      else suit = { key: s(x.suit.key, 40), size: s(x.suit.size, 20), pricePence }
    }
    // Joining students always get a first licence (paid). Any client-sent type is ignored.
    const t: LicenceType = 'first_time'
    const licence: { type: string; feePence: number } = { type: t, feePence: licenceFeePence(t, dateOfBirth) }
    return { firstName: s(x?.firstName, 60), surname: s(x?.surname, 60), dateOfBirth,
      belt: s(x?.belt, 40) || 'White', medical: s(x?.medical, 500), suit, licence }
  }).filter((x: any) => x.firstName && x.surname)
  if (bad) return NextResponse.json({ error: bad }, { status: 400 })
  if (students.length && !planAllowed(plan, students.length))
    return NextResponse.json({ error: 'That package doesn\'t match the number of students: Single is 1 student, Siblings is 2, Family is 3 or more.' }, { status: 400 })
  if (!students.length || students.some((x: any) => !DATE.test(x.dateOfBirth)))
    return NextResponse.json({ error: "Please enter each student's name and date of birth." }, { status: 400 })

  const p = b.parent ?? {}
  const parent = {
    givenName: s(p.givenName, 60), familyName: s(p.familyName, 60), email: s(p.email, 120).toLowerCase(),
    phone: s(p.phone, 30), address: s(p.address, 200), city: s(p.city, 60), postCode: s(p.postCode, 10).toUpperCase(),
  }
  if (!parent.givenName || !parent.familyName || !/^\S+@\S+\.\S+$/.test(parent.email) || !parent.phone || !parent.address || !parent.postCode)
    return NextResponse.json({ error: 'Please complete the parent or guardian details.' }, { status: 400 })
  const emergency = { name: s(b.emergency?.name, 80), phone: s(b.emergency?.phone, 30) }
  if (!emergency.name || !emergency.phone) return NextResponse.json({ error: 'Please add an emergency contact.' }, { status: 400 })
  if (!b.consent?.terms) return NextResponse.json({ error: 'Please accept the club terms.' }, { status: 400 })

  const signup: Signup = {
    plan, dojo, classTime: s(b.classTime, 120), trialDate, startDate: membershipStart(trialDate),
    students, parent, emergency, consent: { photos: !!b.consent?.photos, terms: true },
    extrasPence: students.reduce((t: number, x: any) => t + (x.suit?.pricePence ?? 0) + (x.licence?.feePence ?? 0), 0),
    createdAt: new Date().toISOString(),
  }

  try {
    const { billing_requests: br } = await gc('/billing_requests', {
      method: 'POST',
      body: {
        billing_requests: {
          mandate_request: { scheme: 'bacs', currency: 'GBP', description: `Forza Karate membership — ${PLANS[plan].label}` },
          metadata: { source: 'forza-website-signup', plan, dojo },
        },
      },
    })
    const origin = new URL(req.url).origin
    const { billing_request_flows: flow } = await gc('/billing_request_flows', {
      method: 'POST',
      body: {
        billing_request_flows: {
          redirect_uri: `${origin}/join/membership/done?br=${br.id}`,
          exit_uri: `${origin}/join/membership`,
          lock_customer_details: false,
          show_redirect_buttons: false,
          prefilled_customer: {
            given_name: parent.givenName, family_name: parent.familyName, email: parent.email,
            address_line1: parent.address, city: parent.city, postal_code: parent.postCode, country_code: 'GB',
          },
          links: { billing_request: br.id },
        },
      },
    })
    await saveSignup(br.id, signup)
    return NextResponse.json({ billingRequestId: br.id, flowId: flow.id, environment: gcEnv(), startDate: signup.startDate, extrasPence: signup.extrasPence })
  } catch (e) {
    console.error('billing-request error', e instanceof GcError ? JSON.stringify(e.body).slice(0, 500) : e)
    return NextResponse.json({ error: 'We could not start the Direct Debit set-up. Please try again.' }, { status: 502 })
  }
}
