// One list of Members links, used by the site nav (Members menu) and the members sidebar,
// so the two can never drift apart. Everything here except the login page needs a member login
// (enforced in middleware.ts via isMembersOnlyPath).

export type MembersLink = {
  href: string
  label: string
  /** Off-site link: opens in a new tab (rel=noopener) and needs no login. */
  external?: boolean
  /** How the link reads in the logged-in sidebar, when it should differ from the nav. */
  sidebar?: { href: string; label: string }
}

export const membersCoreLinks: MembersLink[] = [
  { href: '/members', label: '🔐 Members Login', sidebar: { href: '/members/portal', label: 'My portal' } },
  { href: '/members/grading', label: 'Register to Grade' },
  // Syllabus hidden for now (Anthoni, Oct 2026) — re-add: { href: '/members/syllabus', label: 'Syllabus' },
  { href: '/members/licence', label: 'Renew your licence' },
]

export const FIKC_URL = 'https://www.fikc.co.uk'

/** Old invitational pages on this site; next.config.ts sends them permanently to FIKC_URL. */
export const INVITATIONAL_PATHS = ['/register/invitational', '/members/events/invitational']

export const membersEventLinks: MembersLink[] = [
  { href: '/members/events/super-champs', label: 'Register for Super Champs' },
  { href: '/members/events/prep-training', label: 'Register for Preparation Training' },
  { href: '/members/events/championships', label: 'Register for Club Championships' },
  // The Invitational Cup is run on the FIKC site (Anthoni, 18 Oct 2026).
  { href: FIKC_URL, label: 'Register for Invitational Cup', external: true },
]

/** Extra anchor props for off-site links (new tab, no opener). */
export function externalProps(l: MembersLink) {
  return l.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
}

/** Old public event URLs, now redirected to the members-only pages above. */
export const legacyEventPaths: Record<string, string> = {
  '/register/super-champs': '/members/events/super-champs',
  '/register/prep-training': '/members/events/prep-training',
  '/register/championships': '/members/events/championships',
}

/** Pages under /members that stay reachable without a portal login. */
export const PUBLIC_MEMBERS_PATHS = [
  '/members', // the login page itself
  '/members/syllabus', // hidden: next.config redirects it to /gradings
  '/members/videos', // does its own check (portal login OR Stripe video subscriber)
  '/members/videos/welcome',
]

export function isMembersOnlyPath(pathname: string): boolean {
  const p = pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname
  if (p !== '/members' && !p.startsWith('/members/')) return false
  return !PUBLIC_MEMBERS_PATHS.includes(p)
}
