'use server'

import { cookies } from 'next/headers'

const HONBU_API = process.env.NEXT_PUBLIC_CLUB_HONBU_API ?? 'https://forza-club-honbu-production.up.railway.app/api'
const COOKIE_NAME = 'forza-members-auth'

export async function getMemberPortalData() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null

  try {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 8000)
    let res: Response
    try {
      res = await fetch(`${HONBU_API}/portal/me`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
        signal: controller.signal,
      })
    } finally {
      clearTimeout(timeout)
    }
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}
