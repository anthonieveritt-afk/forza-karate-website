import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Calendar',
  description: 'Upcoming competitions, coaching, Super Champs and grading dates.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
