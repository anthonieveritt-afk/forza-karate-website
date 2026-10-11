import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Join Today',
  description: 'Start your Forza Karate Club journey — £10 trial class and enrolment for Rayleigh and Upminster.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
