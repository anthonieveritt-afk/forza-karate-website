import 'server-only'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { checkMemberSession, MEMBERS_COOKIE, safeMembersRedirect } from '@/lib/members/session'

/**
 * Server-side member check for members-only pages (defence in depth: middleware.ts already
 * redirects logged-out visitors). Sends anyone without a valid portal session to the login
 * page, with a safe return path back to `returnTo`.
 */
export async function requireMemberPage(returnTo: string): Promise<void> {
  const token = (await cookies()).get(MEMBERS_COOKIE)?.value
  const check = await checkMemberSession(token)
  if (check === 'valid') return
  const back = safeMembersRedirect(returnTo)
  redirect(`/members?redirect=${encodeURIComponent(back)}${check === 'unavailable' ? '&error=unavailable' : ''}`)
}

/** For server actions: true only with a valid portal session. */
export async function hasMemberSession(): Promise<boolean> {
  const token = (await cookies()).get(MEMBERS_COOKIE)?.value
  return (await checkMemberSession(token)) === 'valid'
}
