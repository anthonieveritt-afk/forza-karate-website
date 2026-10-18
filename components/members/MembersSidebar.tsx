'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { membersCoreLinks, membersEventLinks, type MembersLink } from '@/lib/members/links'
import LogoutButton from '@/components/members/LogoutButton'

function target(l: MembersLink) {
  return l.sidebar ?? { href: l.href, label: l.label }
}

function Item({ link, current }: { link: MembersLink; current: string }) {
  const { href, label } = target(link)
  const active = current === href || current.startsWith(href + '/')
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? 'page' : undefined}
        className={`block rounded-xl px-3 py-2 text-sm transition-colors border-l-2 ${
          active
            ? 'border-[#dc2626] bg-red-50 text-[#dc2626] font-semibold'
            : 'border-transparent text-gray-600 hover:bg-[#fafaf9] hover:text-[#dc2626]'
        }`}
      >
        {label}
      </Link>
    </li>
  )
}

/** Logged-in members navigation: the same links as the site's Members menu. */
export default function MembersSidebar() {
  const current = usePathname() ?? ''
  return (
    <nav aria-label="Members" className="bg-white rounded-2xl border border-black/8 p-4 shadow-sm lg:sticky lg:top-28">
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="w-6 h-0.5 bg-[#dc2626]" />
        <p className="text-xs font-semibold text-[#dc2626] uppercase tracking-wider">Members</p>
      </div>
      <ul className="space-y-1">
        {membersCoreLinks.map((l) => <Item key={l.href} link={l} current={current} />)}
      </ul>
      <p className="mt-4 mb-2 px-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">Events</p>
      <ul className="space-y-1">
        {membersEventLinks.map((l) => <Item key={l.href} link={l} current={current} />)}
      </ul>
      <div className="mt-4 pt-4 border-t border-black/5 px-1">
        <LogoutButton />
      </div>
    </nav>
  )
}
