import 'server-only'
import { sendEmail, emailConfigured } from '@/lib/email'

export async function sendTrialCode(to: string, code: string): Promise<boolean> {
  if (!emailConfigured()) { console.error('[trial-lookup] email not configured'); return false }
  const text = [
    'Hello,',
    '',
    `Your Forza Karate joining code is: ${code}`,
    '',
    'Enter it on the "Become a member" page to continue. It works for 10 minutes.',
    'If you didn\'t ask for this, you can ignore this email.',
    '',
    'Forza Karate Club',
  ].join('\n')
  const r = await sendEmail({
    to, subject: `${code} is your Forza Karate joining code`, text,
    html: `<p>Hello,</p><p>Your Forza Karate joining code is:</p><p style="font-size:28px;font-weight:700;letter-spacing:6px">${code}</p><p>Enter it on the &ldquo;Become a member&rdquo; page to continue. It works for 10 minutes.<br/>If you didn&rsquo;t ask for this, you can ignore this email.</p><p>Forza Karate Club</p>`,
    replyTo: 'hello@forzakarate.co.uk',
  })
  if (!r.ok) console.error('[trial-lookup] code email failed')
  return r.ok
}
