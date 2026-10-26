// Forza HTML shell for the £10 trial booking emails (Designer tokens, 26 Oct 2026).
// Single 600px column, red header band (bgcolor fallback if images blocked), solid #111 footer.
import { esc } from '@/lib/email'

const SITE = 'https://forzakarate.co.uk'
const HEAD = "'Arial Black','Helvetica Neue',Helvetica,Arial,sans-serif"
const BODY = 'Helvetica,Arial,sans-serif'

type Shell = { header: 'welcome' | 'next-steps'; alt: string; title: string; preheader: string; body: string; cta?: { href: string; label: string }; footerLine: string }

export function forzaShell(o: Shell): string {
  const cta = o.cta
    ? `<tr><td style="padding:8px 40px 32px"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td bgcolor="#C41230" style="border-radius:6px;border:2px solid #8C0A20"><a href="${esc(o.cta.href)}" style="display:inline-block;padding:18px 36px;font-family:${HEAD};font-weight:900;font-size:18px;letter-spacing:0.5px;text-transform:uppercase;color:#FFFFFF;text-decoration:none">${esc(o.cta.label)}</a></td></tr></table></td></tr>`
    : ''
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(o.title)}</title></head>
<body style="margin:0;padding:0;background:#FFFFFF">
<div style="display:none;max-height:0;overflow:hidden">${esc(o.preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF"><tr><td align="center" style="padding:16px 8px">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background:#FAFAF8" bgcolor="#FAFAF8">
<tr><td bgcolor="#C41230" style="background:#C41230"><img src="${SITE}/email/${o.header}-header.png" width="600" height="180" alt="${esc(o.alt)}" style="display:block;width:100%;max-width:600px;height:auto;border:0;color:#FFFFFF;font-family:${HEAD};font-weight:900;font-size:22px"></td></tr>
<tr><td style="padding:32px 40px 8px;font-family:${HEAD};font-weight:900;font-size:36px;line-height:1.1;color:#111111">${esc(o.title)}</td></tr>
<tr><td style="padding:8px 40px 0"><table role="presentation" cellpadding="0" cellspacing="0"><tr><td width="100" height="6" bgcolor="#111111" style="font-size:0;line-height:0">&nbsp;</td></tr></table></td></tr>
<tr><td style="padding:16px 40px 8px;font-family:${BODY};font-size:17px;line-height:1.6;color:#111111">${o.body}</td></tr>
${cta}
<tr><td bgcolor="#111111" style="background:#111111;border-top:6px solid #C41230;padding:24px 40px;font-family:${BODY};font-size:13px;line-height:1.6;color:#FFFFFF"><div style="font-family:${HEAD};font-weight:900;font-size:15px;letter-spacing:1px">FORZA KARATE CLUB</div>${esc(o.footerLine)}<br><a href="${SITE}" style="color:#FFFFFF;text-decoration:none">forzakarate.co.uk</a> · <a href="mailto:hello@forzakarate.co.uk" style="color:#FFFFFF;text-decoration:none">hello@forzakarate.co.uk</a></td></tr>
</table></td></tr></table></body></html>`
}

const p = (s: string) => `<p style="margin:0 0 16px">${s}</p>`
const row = (k: string, v: string) => `<tr><td style="padding:8px 12px 8px 0;font-family:${HEAD};font-weight:900;font-size:13px;text-transform:uppercase;color:#C41230;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="padding:8px 0;font-family:${BODY};font-size:16px;color:#111111;border-bottom:1px solid #EEEEEA">${esc(v)}</td></tr>`

export type TrialInfo = { parentName?: string; childName?: string; age?: string; email?: string; phone?: string; dojo?: string; ageGroup?: string; message?: string; amount: string; sessionId: string; test: boolean; honbuOk: boolean }

export function parentConfirmationHtml(t: TrialInfo): string {
  const first = (t.parentName || '').split(' ')[0] || 'there'
  const body = [
    p(`Hi ${esc(first)},`),
    p(`Thanks for booking a trial class at Forza Karate${t.childName ? ` for <strong>${esc(t.childName)}</strong>` : ''} — your <strong>${esc(t.amount)}</strong> payment has gone through.`),
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px">${row('Class', t.ageGroup || '')}${row('Dojo', t.dojo || '')}${row('Paid', t.amount)}</table>`,
    p(`We'll be in touch <strong>within 72 hours</strong> to confirm the time.`),
    p(`<strong>No kit needed</strong> — just wear something comfy. Come and try it out, then ask questions!`),
    `<p style="margin:0 0 16px;padding:12px 16px;border-left:6px solid #C41230;background:#FFFFFF;font-size:15px;color:#555555">Please note: the £10 is for the trial class only and is not taken off membership. If you decide to join, membership starts the week after your trial at the full monthly rate.</p>`,
  ].join('')
  return forzaShell({ header: 'welcome', alt: 'Welcome to Forza — your £10 trial class is booked', title: "YOU'RE BOOKED IN!", preheader: `Your ${t.amount} Forza Karate trial class is booked.`, body, cta: { href: 'https://forzakarate.co.uk/trial-class', label: 'See trial class info' }, footerLine: "You're receiving this because you booked a £10 trial class." })
}

export function clubNotifyHtml(t: TrialInfo): string {
  const body = [
    p(`A <strong>${esc(t.amount)}</strong> trial class has been paid for online.${t.test ? ' <strong style="color:#C41230">[TEST MODE]</strong>' : ''}`),
    `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px;width:100%">${row('Student', `${t.childName || t.parentName || ''}${t.age ? ` (age ${t.age})` : ''}`)}${row('Contact', t.parentName || '')}${row('Email', t.email || '')}${row('Phone', t.phone || '')}${row('Class', `${t.ageGroup || ''} at ${t.dojo || ''}`)}${t.message ? row('Notes', t.message) : ''}${row('Stripe', t.sessionId)}</table>`,
    t.honbuOk
      ? `<p style="margin:0 0 16px;padding:12px 16px;background:#111111;color:#FFFFFF;font-weight:bold">✓ Added to Club Honbu trial list.</p>`
      : `<p style="margin:0 0 16px;padding:12px 16px;background:#C41230;color:#FFFFFF;font-weight:bold">⚠ Could NOT add to Club Honbu automatically — please add by hand.</p>`,
    `<p style="margin:0 0 16px;font-size:14px;color:#555555">Pricing: the £10 is for the trial only (not deducted from membership). If they join, membership starts the week after at the full monthly rate.</p>`,
  ].join('')
  return forzaShell({ header: 'next-steps', alt: 'New paid £10 trial booking', title: 'NEW PAID TRIAL', preheader: `Paid trial: ${t.childName || t.parentName || ''} (${t.dojo || ''})`, body, footerLine: 'Club notification — paid £10 trial booking from forzakarate.co.uk.' })
}
