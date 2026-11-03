import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Join Today',
  description: 'Join Forza Karate Club — enrol for classes in Rayleigh and Upminster.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
