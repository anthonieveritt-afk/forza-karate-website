import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/sempai/auth'
import { getKnowledgeRecord, setKnowledge, knowledgeHistory, restoreKnowledge } from '@/lib/sempai/store'
export const dynamic = 'force-dynamic'
const deny = () => NextResponse.json({ error: 'unauthorized' }, { status: 401 })

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return deny()
  if (req.nextUrl.searchParams.get('history')) return NextResponse.json({ versions: await knowledgeHistory() })
  return NextResponse.json(await getKnowledgeRecord(true))
}
export async function PUT(req: NextRequest) {
  if (!isAdmin(req)) return deny()
  const { text, updatedBy, restore } = await req.json().catch(() => ({}))
  try {
    if (restore) return NextResponse.json(await restoreKnowledge(String(restore)))
    if (typeof text !== 'string' || text.trim().length < 50 || text.length > 30000)
      return NextResponse.json({ error: 'text must be 50-30000 characters' }, { status: 400 })
    return NextResponse.json(await setKnowledge(text, String(updatedBy ?? 'admin').slice(0, 80)))
  } catch (e) { return NextResponse.json({ error: String(e) }, { status: 500 }) }
}
