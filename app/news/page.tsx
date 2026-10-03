import type { Metadata } from 'next'
import NewsList from '@/components/news/NewsList'

export const metadata: Metadata = {
  title: 'News',
  description: 'Latest news from Forza Karate Club — competition results, grading updates, and club announcements.',
}

export default function NewsPage() {
  return <NewsList page={1} />
}
