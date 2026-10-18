// Approve / Reject links for tester-code sign-ups (emailed to Anthoni, see lib/membership/tester.ts).
// GET only shows a confirmation page: email security scanners open links automatically, so the
// decision is made by the POST from that page's button. Both check the HMAC signature and expiry.
import { decide, loadRecord, verify, type Action } from '@/lib/membership/tester'
import { PLANS, DOJOS } from '@/lib/gocardless/plans'
import { esc } from '@/lib/email'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function page(title: string, body: string, status = 200) {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>${esc(title)} | Forza Karate Club</title>
<style>body{font-family:system-ui,sans-serif;background:#fafaf9;color:#111;margin:0;padding:48px 16px}main{max-width:560px;margin:auto;background:#fff;border:1px solid #0001;border-radius:24px;padding:32px}h1{font-size:24px;margin:0 0 12px}p{line-height:1.5}small{color:#666}.k{font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#dc2626}button{font:inherit;font-weight:600;border:0;border-radius:12px;padding:12px 20px;cursor:pointer;color:#fff}.approve{background:#16a34a}.reject{background:#dc2626}</style></head>
<body><main><p class="k">Forza Karate Club</p><h1>${esc(title)}</h1>${body}</main></body></html>`
  return new Response(html, { status, headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store', 'x-robots-tag': 'noindex, nofollow', 'referrer-policy': 'no-referrer' } })
}

const ukDate = (iso: string) => new Date(iso + 'T12:00:00Z').toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })

function check(p: { get(k: string): string | null }) {
  const id = p.get('id') ?? '', a = p.get('a') ?? '', exp = p.get('exp') ?? '', sig = p.get('sig') ?? ''
  return { id, a: a as Action, exp, sig, v: verify(id, a, exp, sig) }
}
function bad(v: 'invalid' | 'expired') {
  return v === 'expired'
    ? page('This link has expired', '<p>Approval links work for 14 days. The sign-up has not been confirmed. Ask the member to fill in the form again if needed.</p>', 410)
    : page('Link not valid', '<p>This approval link isn\'t valid. Please use the link from the email exactly as sent.</p>', 400)
}

export async function GET(req: Request) {
  const c = check(new URL(req.url).searchParams)
  if (c.v !== 'ok') return bad(c.v)
  const rec = await loadRecord(c.id).catch(() => null)
  if (!rec) return page('Sign-up not found', '<p>This sign-up is no longer stored.</p>', 404)
  const s = rec.signup
  const who = `<p><strong>${esc(s.parent.givenName)} ${esc(s.parent.familyName)}</strong> (${esc(s.parent.email)})<br/>${esc(PLANS[s.plan].label)} package, ${s.students.length} student${s.students.length > 1 ? 's' : ''}, ${esc(DOJOS[s.dojo])}<br/>Membership starts ${esc(ukDate(s.startDate))}</p>`
  if (rec.status !== 'pending' && !(rec.status === 'approved' && c.a === 'approve' && !rec.honbu?.ok))
    return page(`Already ${rec.status}`, `${who}<p>This sign-up was already ${rec.status}${rec.decidedAt ? ` on ${esc(new Date(rec.decidedAt).toLocaleString('en-GB', { timeZone: 'Europe/London', dateStyle: 'medium', timeStyle: 'short' }))} (UK time)` : ''}. Nothing more to do.</p>`)
  const hidden = ['id', 'a', 'exp', 'sig'].map((k) => `<input type="hidden" name="${k}" value="${esc(String((c as Record<string, string>)[k]))}"/>`).join('')
  const approve = c.a === 'approve'
  return page(approve ? 'Approve this tester sign-up?' : 'Reject this tester sign-up?', `${who}
<p>${approve ? 'Approving sends this sign-up to Club Honbu as paid (tester code, £0, reference TESTER-APPROVED) and emails the member their membership confirmation.' : 'Rejecting means nothing goes to Club Honbu, and the member gets a polite email saying the code couldn\'t be applied.'}</p>
<form method="post">${hidden}<button class="${approve ? 'approve' : 'reject'}" type="submit">${approve ? 'Approve sign-up' : 'Reject sign-up'}</button></form>
<p><small>This can only be done once.</small></p>`)
}

export async function POST(req: Request) {
  const form = await req.formData().catch(() => null)
  if (!form) return bad('invalid')
  const c = check({ get: (k) => { const v = form.get(k); return typeof v === 'string' ? v : null } })
  if (c.v !== 'ok') return bad(c.v)
  try {
    const r = await decide(c.id, c.a)
    if (r.state === 'not_found') return page('Sign-up not found', '<p>This sign-up is no longer stored.</p>', 404)
    if (r.state === 'conflict') return page(`Already ${r.status}`, `<p>This sign-up was already ${r.status}, so nothing was changed.</p>`, 409)
    if (r.state === 'rejected') return page('Sign-up rejected', `<p>${r.already ? 'This sign-up was already rejected.' : 'Done. Nothing was sent to Club Honbu, and the member has been told the code couldn\'t be applied.'}</p>`)
    return r.honbu.ok
      ? page('Sign-up approved', `<p>${r.already ? 'This sign-up was already approved.' : 'Done. It is in Club Honbu (tester code, £0, reference TESTER-APPROVED) and the member has their confirmation email.'}</p>`)
      : page('Approved, but Club Honbu didn\'t take it', `<p>The sign-up is approved, but it couldn't be sent to Club Honbu automatically (${esc(r.honbu.detail ?? 'unknown error')}). Open this link again later to retry, or add the member by hand.</p>`, 502)
  } catch (e) {
    console.error('[tester] approval error', c.id, e instanceof Error ? e.message : 'unknown')
    return page('Something went wrong', '<p>Please try the link again in a minute.</p>', 500)
  }
}
