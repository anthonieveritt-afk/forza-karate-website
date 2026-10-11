import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/sempai/auth'
import { fetchChats, purgeOldChats, RETENTION_DAYS } from '@/lib/sempai/store'
export const dynamic = 'force-dynamic'
export const maxDuration = 60

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  const hours = Math.min(Math.max(Number(req.nextUrl.searchParams.get('hours') ?? 24), 1), RETENTION_DAYS * 24)
  const purged = await purgeOldChats().catch(() => 0)
  const chats = await fetchChats(hours)
  return NextResponse.json({ generatedAt: new Date().toISOString(), hours, retentionDays: RETENTION_DAYS, purged,
    count: chats.length, leads: chats.filter((c: any) => Object.keys(c.lead ?? {}).length).length, chats })
}
