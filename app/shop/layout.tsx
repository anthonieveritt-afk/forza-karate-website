import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  path: '/shop',
  title: 'Karate Kit & Club Shop',
  description: 'Official Forza Karate Club kit and equipment for students in Rayleigh and Upminster, Essex.',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
