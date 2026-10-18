import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  path: '/gallery',
  title: 'Gallery',
  description: 'Photos from competitions, gradings and club life at Forza Karate Club in Rayleigh and Upminster, Essex.',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
