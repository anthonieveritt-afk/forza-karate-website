import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Become a Member',
  description: 'Join Forza Karate Club after your trial class: pay today by card for the licence, suit and first month, then monthly by Direct Debit.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
