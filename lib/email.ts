// Minimal Resend client (REST API).
// Required env: RESEND_API_KEY and RESEND_FROM (e.g. "Forza Website <hello@forzakarate.co.uk>"
// on a domain verified in Resend). Recipients come from env vars set by the caller.

export type EmailMessage = {
  to: string | string[]
  subject: string
  text: string
  html?: string
  replyTo?: string
}

export type SendResult =
  | { ok: true; id?: string }
  | { ok: false; reason: 'not-configured' | 'failed'; detail?: string }

export function emailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.RESEND_FROM?.trim())
}

export function envAddresses(name: string): string[] {
  return (process.env[name] || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
}

export async function sendEmail(msg: EmailMessage, timeoutMs = 8000): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim()
  const from = process.env.RESEND_FROM?.trim()
  if (!apiKey || !from) return { ok: false, reason: 'not-configured' }

  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: msg.to,
        subject: msg.subject,
        text: msg.text,
        ...(msg.html ? { html: msg.html } : {}),
        ...(msg.replyTo ? { reply_to: msg.replyTo } : {}),
      }),
      signal: controller.signal,
      cache: 'no-store',
    })
    if (!res.ok) {
      let detail = `HTTP ${res.status}`
      try {
        const body = (await res.json()) as { message?: string }
        detail += body?.message ? `: ${String(body.message).slice(0, 200)}` : ''
      } catch { /* not JSON */ }
      return { ok: false, reason: 'failed', detail }
    }
    const body = (await res.json().catch(() => ({}))) as { id?: string }
    return { ok: true, id: body.id }
  } catch (err) {
    return { ok: false, reason: 'failed', detail: err instanceof Error ? err.message : String(err) }
  } finally {
    clearTimeout(timer)
  }
}

export function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!)
}

export function oneLine(s: string, max = 120): string {
  return s.replace(/[\r\n]+/g, ' ').trim().slice(0, max)
}
