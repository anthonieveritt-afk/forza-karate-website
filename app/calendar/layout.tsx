import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'

export const metadata: Metadata = pageMeta({
  path: '/calendar',
  title: 'Events Calendar',
  description: 'Upcoming karate competitions, coaching, Super Champs and grading dates for Forza Karate Club, Rayleigh and Upminster.',
})

export default function Layout({ children }: { children: React.ReactNode }) {
  return children
}
