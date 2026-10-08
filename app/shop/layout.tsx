import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Official Forza Karate Club kit and equipment.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
