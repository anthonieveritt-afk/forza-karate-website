'use server'

import { emailConfigured, envAddresses, esc, oneLine, sendEmail } from '@/lib/email'

export type ContactInput = {
  name: string
  email: string
  phone?: string
  message: string
  website?: string // honeypot
}

export type ContactResult = { success: true } | { success: false; error: string }

const DIRECT = 'Please email us directly at hello@forzakarate.co.uk.'
const s = (v: unknown, max = 200) => (typeof v === 'string' ? v.trim().slice(0, max) : '')

/**
 * Sends a contact-form message to the club by email (Resend).
 * Env: RESEND_API_KEY, RESEND_FROM, CONTACT_TO_EMAIL (comma-separated allowed).
 * Reply-To is set to the sender so the club can just hit Reply.
 *
 * Note: the old site publicly listed scott.nicholls@ for safeguarding; the previous
 * Next.js contact action used hello@. info@ appears only as a fallback on /join.
 * Confirm with Anthoni which addresses are real mailboxes before going live.
 */
export async function sendContactMessage(input: ContactInput): Promise<ContactResult> {
  if (s(input?.website)) return { success: true }

  const name = oneLine(s(input?.name, 120), 120)
  const email = s(input?.email, 200)
  const phone = oneLine(s(input?.phone, 40), 40)
  const message = s(input?.message, 5000)

  if (name.length < 2) return { success: false, error: 'Please enter your name.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || /[\r\n,;<>]/.test(email)) {
    return { success: false, error: 'Please enter a valid email address.' }
  }
  if (message.length < 10) {
    return { success: false, error: 'Please write a short message (at least 10 characters).' }
  }

  const to = envAddresses('CONTACT_TO_EMAIL')
  if (!emailConfigured() || to.length === 0) {
    console.error(
      'Contact form: email is not configured (need RESEND_API_KEY, RESEND_FROM and CONTACT_TO_EMAIL). Message NOT sent.',
    )
    return { success: false, error: `Sorry, our contact form isn't working just now. ${DIRECT}` }
  }

  const text = [
    'New message from the Forza Karate Club website contact form',
    '',
    `Name:  ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : '',
    '',
    message,
    '',
    '— Reply to this email to answer the sender directly.',
  ]
    .filter((l, i, a) => l !== '' || a[i - 1] !== '')
    .join('\n')

  const html = `<p><strong>New message from the Forza Karate Club website contact form</strong></p>
<p>Name: ${esc(name)}<br>Email: ${esc(email)}${phone ? `<br>Phone: ${esc(phone)}` : ''}</p>
<p style="white-space:pre-wrap">${esc(message)}</p>
<p style="color:#666;font-size:12px">Reply to this email to answer the sender directly.</p>`

  const result = await sendEmail({
    to,
    subject: `Website enquiry from ${name}`,
    text,
    html,
    replyTo: email,
  })
  if (!result.ok) {
    console.error('Contact form: Resend send failed:', result.detail || result.reason)
    return {
      success: false,
      error: `Sorry, we couldn't send your message just now. Please try again in a minute, or ${DIRECT.charAt(0).toLowerCase()}${DIRECT.slice(1)}`,
    }
  }
  return { success: true }
}
