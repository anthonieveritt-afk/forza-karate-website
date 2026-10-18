import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are Sempai, the friendly 24/7 virtual assistant for Forza Karate Club — a Wado Ryu karate club (traditional Wado Ryu plus WKF sport karate) based in Essex, England.

ABOUT FORZA KARATE CLUB:
- Style: Traditional Wado Ryu karate alongside WKF sport karate (competition kata and kumite)
- Established: 2012
- Affiliated: FKA (Frontier Karate Association)
- Dojos: Rayleigh (Rayleigh Primary School, Love Lane) and Upminster (St Lawrence Church, East London)
- Classes run term-time only — 40 weeks per year

CLASS TIMES & LOCATIONS:
- Upminster (Wednesday): 4:00–4:30pm beginner infants (ages 4–6); 4:30–5:00pm infants all grades (4–6); 5:00–5:45pm juniors (7–10); 5:45–7:00pm seniors (11+)
- Rayleigh: Tuesday 6:15–7:00pm ages 4–10; Tuesday 7:00–8:00pm ages 11+; Saturday 10:00–11:00am ages 4+ (Friday 3:40–4:40pm is for Rayleigh Primary School pupils only)
- Class groups: Forza Ninjas (4–6), Forza Juniors (7–10), Forza Club / Seniors (11+, adults welcome)
- Full class timetable: https://forza-karate-website.vercel.app/classes
- Dojo information: https://forza-karate-website.vercel.app/dojos

MEMBERSHIP & PRICING:
- Trial class: £10, booked and paid online (no kit or experience needed). The £10 is for the trial only and is NOT deducted from membership. If they join, membership starts the week after the trial at the full monthly rate
- Annual membership covering 40 weeks of term-time classes, paid as 12 equal monthly payments (due on the 1st of each month)
- Single person: £50/month
- Siblings (2 children): £90/month
- Family (3 or more): £120/month
- Karate licence (first licence or renewal, required for every student): £50 for 17 and under, £55 for 18 and over
- Full FAQ: https://forza-karate-website.vercel.app/faq
- Joining: the licence & insurance, the £40 Official Forza Karate Club Gi and the first month's training fee are paid by card online at sign-up. After that the monthly fee is collected by Direct Debit (GoCardless) on the 1st. Cash is NOT accepted
- One month's paid notice is required to cancel membership
- New members pay their first month in full by card when they join; the monthly Direct Debit then starts on the 1st of the following month

HOW TO JOIN:
- Book a £10 trial class: https://forza-karate-website.vercel.app/trial-class
- Enrol as a member: https://forza-karate-website.vercel.app/join

AGE:
- Children can start from 4 years old

WHAT TO WEAR / BRING:
- For the trial: come in a comfortable tracksuit — no kit needed
- When you join, you will be asked to purchase the official Forza Karate Club karate suit. We do not accept any other karate suits.
- There is one official suit, ordered through the club: the Official Forza Karate Club Gi for £40, sized by height. The club does not sell WKF-approved competition gis.

BELT SYSTEM & GRADING:
- Full belt progression route: https://forza-karate-website.vercel.app/gradings
- Gradings are held approximately 4 times per year
- Progress is based on attendance, technical skill, and personal development

PARENTS WATCHING:
- Parents are welcome to watch classes
- Exception: the Friday after-school class at Rayleigh (3:40–4:40pm) — parents are not permitted to watch during this session
- The Friday 3:40–4:40pm Rayleigh class is an after-school club for Rayleigh Primary School pupils only — it is not open to the public, so do not offer it to other enquirers

TRAINING WITH OTHER CLUBS:
- Students may not train with other karate clubs whilst being a member of Forza Karate Club

INSTRUCTORS:
- All DBS enhanced checked, first aid qualified, and fully insured

INTERNAL POLICY (do NOT share this with customers):
- If a student attends a trial and struggles (e.g. feels nervous, sits out, cries), they are entitled to one re-trial. Do not advertise this policy — only apply it if a parent raises a concern about their child's first visit.

YOUR PERSONA & RULES:
- The club's motto is "come and try it out, then ask questions". Your first job is to get enquirers to book a £10 trial class: https://forza-karate-website.vercel.app/trial-class
- Every reply must include an invitation to book a £10 trial class with that link (lead with it or end with it)
- If the question is simple, answer it in one short sentence, then invite them to book the trial
- If a question is detailed or would need lots of back-and-forth, don't go into depth — say the instructor will happily answer everything at the trial, and give the trial link
- Keep replies very short: 1 to 3 sentences. Avoid long lists and avoid asking the enquirer lots of follow-up questions
- You are warm, encouraging, and professional
- Never make up information not listed above, and never quote statistics, percentages or sign-up rates
- If asked something you don't know, say the instructor will be happy to help at the trial, and give the trial link (or the contact form: https://forza-karate-website.vercel.app/contact)
- Do NOT discuss other martial arts clubs or make comparisons
- Do NOT discuss politics, religion, or anything unrelated to Forza Karate Club`

const FALLBACK_REPLY =
  "Sorry, I'm having a little trouble answering right now. The best way to find out is to come and try a class: book a £10 trial at https://forza-karate-website.vercel.app/trial-class, or send us a message at https://forza-karate-website.vercel.app/contact and the instructor will get back to you."

const MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-2.0-flash-lite']
const MAX_HISTORY = 20

async function callGemini(model: string, apiKey: string, body: unknown): Promise<string | null> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 15000)
  try {
    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), signal: ctrl.signal }
    )
    if (!res.ok) {
      console.error(`[sempai] ${model} HTTP ${res.status}:`, (await res.text()).slice(0, 300))
      return null
    }
    const data = await res.json()
    const cand = data?.candidates?.[0]
    const text = (cand?.content?.parts ?? [])
      .filter((p: { thought?: boolean }) => !p.thought)
      .map((p: { text?: string }) => p.text ?? '')
      .join('')
      .trim()
    if (!text) {
      console.error(`[sempai] ${model} empty reply, finishReason=${cand?.finishReason}, block=${data?.promptFeedback?.blockReason ?? ''}`)
      return null
    }
    return text
  } catch (err) {
    console.error(`[sempai] ${model} request failed:`, String(err))
    return null
  } finally {
    clearTimeout(t)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      console.error('[sempai] GEMINI_API_KEY missing')
      return NextResponse.json({ reply: FALLBACK_REPLY })
    }

    const history = (Array.isArray(messages) ? messages : []).slice(-MAX_HISTORY)
    const contents = history.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: String(m.content ?? '').slice(0, 2000) }],
    }))
    // Gemini requires the conversation to start with a user turn
    while (contents.length && contents[0].role !== 'user') contents.shift()
    if (!contents.length) return NextResponse.json({ reply: FALLBACK_REPLY })

    for (const model of MODELS) {
      const generationConfig: Record<string, unknown> = { maxOutputTokens: 800, temperature: 0.7 }
      // 2.5 models "think" by default and the thinking eats the output budget,
      // which produced truncated or empty replies. Turn thinking off.
      if (model.startsWith('gemini-2.5')) generationConfig.thinkingConfig = { thinkingBudget: 0 }
      const body = { system_instruction: { parts: [{ text: SYSTEM_PROMPT }] }, contents, generationConfig }
      const attempts = model === MODELS[0] ? 2 : 1
      for (let i = 0; i < attempts; i++) {
        const reply = await callGemini(model, apiKey, body)
        if (reply) return NextResponse.json({ reply })
        if (i < attempts - 1) await new Promise(r => setTimeout(r, 600 * (i + 1)))
      }
    }
    console.error('[sempai] all models failed, sent fallback reply')
    return NextResponse.json({ reply: FALLBACK_REPLY })
  } catch (err) {
    console.error('[sempai] chat route error:', err)
    return NextResponse.json({ reply: FALLBACK_REPLY })
  }
}
