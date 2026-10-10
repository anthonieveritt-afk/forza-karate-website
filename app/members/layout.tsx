import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Members',
  description: 'Members login for the Forza Karate Club student portal.',
  robots: { index: false, follow: false },
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
