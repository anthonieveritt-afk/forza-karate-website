import { NextRequest, NextResponse } from 'next/server'

import { getKnowledge } from '@/lib/sempai/store'
import { saveChat } from '@/lib/sempai/store'
import { PERSONA_INTRO, PERSONA_RULES } from '@/lib/sempai/persona'

async function systemPrompt() {
  const knowledge = await getKnowledge()
  return `${PERSONA_INTRO}\n\n${knowledge.trim()}\n\n${PERSONA_RULES}`
}


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
    const { messages, sessionId } = await req.json()
    const SYSTEM_PROMPT = await systemPrompt()

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
        if (reply) {
          await saveChat(sessionId, [...history, { role: 'assistant', content: reply }])
          return NextResponse.json({ reply })
        }
        if (i < attempts - 1) await new Promise(r => setTimeout(r, 600 * (i + 1)))
      }
    }
    console.error('[sempai] all models failed, sent fallback reply')
    await saveChat(sessionId, [...history, { role: 'assistant', content: FALLBACK_REPLY }], true)
    return NextResponse.json({ reply: FALLBACK_REPLY })
  } catch (err) {
    console.error('[sempai] chat route error:', err)
    return NextResponse.json({ reply: FALLBACK_REPLY })
  }
}
