import { put, list, del } from '@vercel/blob'
import crypto from 'crypto'
import { DEFAULT_KNOWLEDGE } from './default-knowledge'

// Everything is stored in Vercel Blob, AES-256-GCM encrypted with SEMPAI_DATA_KEY,
// so blob URLs never expose chat contents or internal notes. Preview and production
// use separate prefixes so testing on a preview never touches live data.
const ENV = process.env.VERCEL_ENV === 'production' ? 'production' : 'preview'
const ROOT = `sempai/${ENV}`
const KNOWLEDGE_PATH = `${ROOT}/knowledge.enc`
export const RETENTION_DAYS = Number(process.env.SEMPAI_RETENTION_DAYS || 90)

function key(): Buffer | null {
  const k = process.env.SEMPAI_DATA_KEY
  return k ? crypto.createHash('sha256').update(k).digest() : null
}
function enc(text: string): string {
  const k = key(); if (!k) throw new Error('SEMPAI_DATA_KEY missing')
  const iv = crypto.randomBytes(12)
  const c = crypto.createCipheriv('aes-256-gcm', k, iv)
  const body = Buffer.concat([c.update(text, 'utf8'), c.final()])
  return Buffer.concat([iv, c.getAuthTag(), body]).toString('base64')
}
function dec(b64: string): string {
  const k = key(); if (!k) throw new Error('SEMPAI_DATA_KEY missing')
  const raw = Buffer.from(b64, 'base64')
  const d = crypto.createDecipheriv('aes-256-gcm', k, raw.subarray(0, 12))
  d.setAuthTag(raw.subarray(12, 28))
  return Buffer.concat([d.update(raw.subarray(28)), d.final()]).toString('utf8')
}
const enabled = () => !!process.env.BLOB_READ_WRITE_TOKEN && !!key()

async function readBlob(pathname: string): Promise<string | null> {
  const { blobs } = await list({ prefix: pathname, limit: 1 })
  const b = blobs.find(x => x.pathname === pathname)
  if (!b) return null
  const res = await fetch(`${b.url}?t=${Date.now()}`, { cache: 'no-store' })
  return res.ok ? dec(await res.text()) : null
}
async function writeBlob(pathname: string, text: string) {
  await put(pathname, enc(text), {
    access: 'public', addRandomSuffix: false, allowOverwrite: true,
    contentType: 'text/plain', cacheControlMaxAge: 60,
  })
}

// ---------- Knowledge ----------
type Knowledge = { text: string; updatedAt: string | null; updatedBy: string | null }
let cache: { k: Knowledge; at: number } | null = null

export async function getKnowledgeRecord(fresh = false): Promise<Knowledge> {
  if (!fresh && cache && Date.now() - cache.at < 60_000) return cache.k
  let k: Knowledge = { text: DEFAULT_KNOWLEDGE, updatedAt: null, updatedBy: null }
  if (enabled()) {
    try {
      const raw = await readBlob(KNOWLEDGE_PATH)
      if (raw) { const j = JSON.parse(raw); if (j?.text?.trim()) k = j }
    } catch (e) { console.error('[sempai] knowledge read failed, using default:', String(e)) }
  }
  cache = { k, at: Date.now() }
  return k
}
export async function getKnowledge() { return (await getKnowledgeRecord()).text }

export async function setKnowledge(text: string, updatedBy: string) {
  if (!enabled()) throw new Error('storage not configured')
  const prev = await getKnowledgeRecord(true)
  const stamp = new Date().toISOString()
  // keep a backup of the previous version so a bad edit can be undone
  if (prev.updatedAt || prev.text) await writeBlob(`${ROOT}/knowledge-history/${stamp}.enc`, JSON.stringify(prev))
  const k = { text, updatedAt: stamp, updatedBy }
  await writeBlob(KNOWLEDGE_PATH, JSON.stringify(k))
  cache = { k, at: Date.now() }
  return k
}
export async function knowledgeHistory() {
  const { blobs } = await list({ prefix: `${ROOT}/knowledge-history/` })
  return blobs.map(b => b.pathname.split('/').pop()!.replace('.enc', '')).sort().reverse()
}
export async function restoreKnowledge(stamp: string) {
  const raw = await readBlob(`${ROOT}/knowledge-history/${stamp}.enc`)
  if (!raw) throw new Error('version not found')
  return setKnowledge(JSON.parse(raw).text, `restore:${stamp}`)
}

// ---------- Chat logs ----------
type Msg = { role: string; content: string }
export type Lead = { name?: string; email?: string; phone?: string }

export function extractLead(messages: Msg[]): Lead {
  const text = messages.filter(m => m.role === 'user').map(m => m.content).join('\n')
  const lead: Lead = {}
  const email = text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i); if (email) lead.email = email[0]
  const phone = text.match(/(?:\+44\s?7\d{3}|\(?07\d{3}\)?|\+44\s?\(?0?\d{2,4}\)?|0\d{2,4})[\s-]?\d{3}[\s-]?\d{3,4}/)
  if (phone) lead.phone = phone[0].trim()
  const name = text.match(/\b(?:my name is|my name's|i am|i'm|this is|it's)\s+([A-Z][a-z'-]+(?:\s+[A-Z][a-z'-]+)?)/)
  if (name && !/^(Interested|Looking|Wondering|Not|Just|Here|Asking|Trying)$/.test(name[1].split(' ')[0])) lead.name = name[1]
  return lead
}

const SAFE_ID = /^[a-zA-Z0-9-]{8,64}$/

export async function saveChat(sessionId: unknown, messages: Msg[], failed = false) {
  if (!enabled() || typeof sessionId !== 'string' || !SAFE_ID.test(sessionId)) return
  try {
    const now = new Date().toISOString()
    const day = now.slice(0, 10)
    const path = `${ROOT}/chats/${day}/${sessionId}.enc`
    let startedAt = now
    try { const old = await readBlob(path); if (old) startedAt = JSON.parse(old).startedAt ?? now } catch {}
    const rec = { sessionId, startedAt, updatedAt: now, failed, lead: extractLead(messages),
      messages: messages.map(m => ({ role: m.role, content: String(m.content).slice(0, 4000) })) }
    await writeBlob(path, JSON.stringify(rec))
    if (Math.random() < 0.05) purgeOldChats().catch(() => {})
  } catch (e) { console.error('[sempai] chat save failed:', String(e)) }
}

export async function purgeOldChats() {
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 864e5).toISOString().slice(0, 10)
  let cursor: string | undefined, removed = 0
  do {
    const r = await list({ prefix: `${ROOT}/chats/`, cursor, limit: 1000 })
    const old = r.blobs.filter(b => (b.pathname.split('/')[3] ?? '9') < cutoff).map(b => b.url)
    if (old.length) { await del(old); removed += old.length }
    cursor = r.hasMore ? r.cursor : undefined
  } while (cursor)
  return removed
}

export async function fetchChats(sinceHours: number) {
  const since = Date.now() - sinceHours * 36e5
  const days = new Set<string>()
  for (let t = since; t <= Date.now() + 864e5; t += 864e5) days.add(new Date(t).toISOString().slice(0, 10))
  const out: unknown[] = []
  for (const d of days) {
    const { blobs } = await list({ prefix: `${ROOT}/chats/${d}/`, limit: 1000 })
    for (const b of blobs) {
      if (new Date(b.uploadedAt).getTime() < since) continue
      try { const raw = await readBlob(b.pathname); if (raw) out.push(JSON.parse(raw)) } catch {}
    }
  }
  return (out as { updatedAt: string }[]).sort((a, b) => a.updatedAt.localeCompare(b.updatedAt))
}
