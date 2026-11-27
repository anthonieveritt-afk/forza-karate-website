import type { Metadata } from 'next'
import VotePoster from '@/components/vote-poster/VotePoster'

export const metadata: Metadata = {
  title: "Karate-ka's Karate-ka Student of the Year",
  description:
    "Scan to vote for the Forza Karate Club Karate-ka's Karate-ka Student of the Year Award.",
  robots: { index: false, follow: false },
  alternates: { canonical: '/vote-poster' },
}

export default function VotePosterPage() {
  return <VotePoster />
}
