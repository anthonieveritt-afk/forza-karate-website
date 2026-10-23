import { NextResponse } from 'next/server'
import { gc, gcEnv, gcConfigured, GcError } from '@/lib/gocardless/client'
import { PLANS } from '@/lib/gocardless/plans'
import { parseMembershipBody } from '@/lib/gocardless/parse-signup'
import { saveSignup, type Signup } from '@/lib/gocardless/store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/**
 * Legacy: create a GoCardless billing request immediately (mandate + later GC one-offs).
 * Prefer POST /api/membership/checkout (Stripe one-off, then start-dd for mandate only).
 */
export async function POST(req: Request) {
  const b = await req.json().catch(() => null)
  const parsed = parseMembershipBody(b)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })
  if (!gcConfigured()) return NextResponse.json({ error: 'Direct Debit sign-up is not available yet.' }, { status: 503 })

  const core = parsed.signup
  const signup: Signup = {
    ...core,
    stripe: null,
    billingRequestId: null,
    createdAt: new Date().toISOString(),
  }

  try {
    const { billing_requests: br } = await gc('/billing_requests', {
      method: 'POST',
      body: {
        billing_requests: {
          mandate_request: { scheme: 'bacs', currency: 'GBP', description: `Forza Karate membership — ${PLANS[core.plan].label}` },
          metadata: { source: 'forza-website-signup', plan: core.plan, dojo: core.dojo },
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
            given_name: core.parent.givenName, family_name: core.parent.familyName, email: core.parent.email,
            address_line1: core.parent.address, city: core.parent.city, postal_code: core.parent.postCode, country_code: 'GB',
          },
          links: { billing_request: br.id },
        },
      },
    })
    await saveSignup(br.id, { ...signup, billingRequestId: br.id })
    return NextResponse.json({ billingRequestId: br.id, flowId: flow.id, environment: gcEnv(), startDate: signup.startDate, extrasPence: signup.extrasPence })
  } catch (e) {
    console.error('billing-request error', e instanceof GcError ? JSON.stringify(e.body).slice(0, 500) : e)
    return NextResponse.json({ error: 'We could not start the Direct Debit set-up. Please try again.' }, { status: 502 })
  }
}
