import crypto from 'crypto'
import { NextRequest } from 'next/server'
export function isAdmin(req: NextRequest): boolean {
  const expected = process.env.SEMPAI_ADMIN_TOKEN
  if (!expected || expected.length < 24) return false
  const got = (req.headers.get('authorization') ?? '').replace(/^Bearer\s+/i, '')
  const a = crypto.createHash('sha256').update(got).digest()
  const b = crypto.createHash('sha256').update(expected).digest()
  return crypto.timingSafeEqual(a, b)
}
