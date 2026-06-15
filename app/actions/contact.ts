'use server'

import { GoogleGenerativeAI } from '@google/generative-ai'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const SYSTEM_PROMPT = `You are the friendly front-desk assistant for Forza Karate Club — a traditional Wado Ryu karate club based in Essex, England. You reply to enquiries sent via the club's website contact form.

KEY FACTS:
- Dojos: Rayleigh (Rayleigh Primary School) and Upminster (East London)
- Classes: term-time only, 40 weeks per year. Full timetable: https://forza-karate-website.vercel.app/classes
- Ages: children can start from 4 years old
- Trial class: FREE. Book at https://forza-karate-website.vercel.app/trial-class
- Join: https://forza-karate-website.vercel.app/join
- Pricing: £45/month (1 student), £75/month (siblings), £100/month (family 3+). Direct Debit only — no cash. One calendar month notice to cancel.
- Kit: come in a tracksuit for trial. When joining, must purchase the official Forza Karate Club suit (£40). No other suits accepted.
- Belt progression: https://forza-karate-website.vercel.app/gradings
- Parents can watch all classes EXCEPT the Friday after-school session at Rayleigh (3:40–4:40pm)
- Students may not train with other karate clubs whilst a member of Forza
- All instructors are DBS checked, first aid qualified, and fully insured

INTERNAL (do NOT share): if a child struggled at their first trial (nervous, sat out, cried), they may re-trial once. Do not advertise this.

Tone: warm, helpful, professional. Keep replies to 3–5 sentences. Always include the relevant link when directing someone. End with an encouraging nudge to book a free trial if relevant.`

export async function sendContactMessage(data: {
  name: string
  email: string
  message: string
}): Promise<{ reply: string }> {
  const userMessage = `Name: ${data.name}
Email: ${data.email}
Message: ${data.message}`

  // Generate AI reply
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: SYSTEM_PROMPT,
  })
  const result = await model.generateContent(userMessage)
  const reply = result.response.text() || "Thanks for your message — we'll be in touch soon!"

  // Send auto-reply email to the person
  await resend.emails.send({
    from: 'Forza Karate Club <hello@forzakarate.co.uk>',
    to: data.email,
    replyTo: 'hello@forzakarate.co.uk',
    subject: `Re: Your message to Forza Karate Club`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 32px 24px; color: #111111;">
        <img src="https://forza-karate-website.vercel.app/forza-logo.webp" alt="Forza Karate Club" style="height: 48px; margin-bottom: 32px;" />
        <p style="font-size: 15px; color: #555; margin-bottom: 8px;">Hi ${data.name},</p>
        <p style="font-size: 15px; color: #555; margin-bottom: 24px;">Thanks for getting in touch. Here's a quick reply to your message:</p>
        <div style="background: #fafaf9; border-left: 3px solid #dc2626; border-radius: 8px; padding: 16px 20px; margin-bottom: 24px;">
          <p style="font-size: 14px; color: #111; line-height: 1.7; margin: 0;">${reply.replace(/\n/g, '<br/>')}</p>
        </div>
        <p style="font-size: 13px; color: #888; margin-bottom: 4px;">Your original message:</p>
        <p style="font-size: 13px; color: #aaa; font-style: italic; border-left: 2px solid #eee; padding-left: 12px; margin-bottom: 32px;">${data.message.replace(/\n/g, '<br/>')}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin-bottom: 24px;" />
        <p style="font-size: 13px; color: #888;">Want to see the club for yourself? <a href="https://forza-karate-website.vercel.app/trial-class" style="color: #dc2626; text-decoration: none; font-weight: 600;">Book a free trial class →</a></p>
        <p style="font-size: 12px; color: #bbb; margin-top: 24px;">Forza Karate Club · Rayleigh & Upminster, Essex</p>
      </div>
    `,
  })

  // Also notify the club
  await resend.emails.send({
    from: 'Forza Website <hello@forzakarate.co.uk>',
    to: 'hello@forzakarate.co.uk',
    subject: `New contact form message from ${data.name}`,
    html: `
      <div style="font-family: sans-serif; max-width: 520px; padding: 24px; color: #111;">
        <h2 style="margin-bottom: 16px;">New contact message</h2>
        <p><strong>From:</strong> ${data.name} (${data.email})</p>
        <p><strong>Message:</strong><br/>${data.message.replace(/\n/g, '<br/>')}</p>
        <hr/>
        <p><strong>AI reply sent:</strong><br/>${reply.replace(/\n/g, '<br/>')}</p>
      </div>
    `,
  })

  return { reply }
}
