import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gallery',
  description: 'Photos from competitions, gradings and club life at Forza Karate Club.',
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
