'use client'

import { usePathname } from 'next/navigation'

/** Hide the site header, footer, ticker and music player on the projector poster. */
export default function HideOnVotePoster({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const path = (pathname || '').replace(/\/+$/, '') || '/'
  if (path === '/vote-poster') return null
  return <>{children}</>
}
