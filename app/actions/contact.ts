'use server'

import Anthropic from '@anthropic-ai/sdk'
import { Resend } from 'resend'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const resend = new Resend(process.env.RESEND_API_KEY)

const SYSTEM_PROMPT = `You are the friendly front-desk assistant for Forza Karate Club — a traditional Wado Ryu karate club based in Essex, England. You reply to enquiries sent via the club's website contact form.

Key facts about Forza Karate Club:
- Style: Traditional Wado Ryu karate
- Dojos: Rayleigh (Rayleigh Primary School) and Upminster (East London)
- Classes run term-time only — approximately 40 weeks per year
- Age groups:
  - Forza Ninjas: ages 4–7 (play-based, fun, confidence building)
  - Forza Kids / Juniors: ages 8–10 (kata, kumite, belt progression)
  - Forza Club: ages 11+ including adults (technical, competitive, serious training)
- First trial class is FREE — no kit or experience needed, just show up
- Belt system: White (18th Kyu) through to Black Belt (1st Dan and beyond)
- Gradings are held approximately 4 times per year
- All instructors are DBS checked, first aid qualified, and fully insured
- The club competes nationally and internationally
- To book a free trial: visit the Trial Class page on the website

Your tone: warm, helpful, encouraging, and concise. You represent the club professionally.
Keep replies to 3–5 sentences maximum. If you don't know something specific (like exact class times or pricing), tell them to book a free trial or ask at their first class — the instructors are happy to chat.
Do not make up specific prices, dates, or timetable details you haven't been given.
End every reply with an encouraging nudge to come try a free class if relevant.`

export async function sendContactMessage(data: {
  name: string
  email: string
  message: string
}): Promise<{ reply: string }> {
  const userMessage = `Name: ${data.name}
Email: ${data.email}
Message: ${data.message}`

  // Generate AI reply
  const response = await client.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 300,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userMessage }],
  })

  const reply = response.content[0].type === 'text'
    ? response.content[0].text
    : "Thanks for your message — we'll be in touch soon!"

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
