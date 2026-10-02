import type { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import NewsList from '@/components/news/NewsList'
import { getPageCount } from '@/lib/news'

export const dynamicParams = false

export function generateStaticParams() {
  return Array.from({ length: getPageCount() }, (_, i) => ({ page: String(i + 1) }))
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const { page } = await params
  return { title: `News — page ${page}` }
}

export default async function NewsPagedPage({ params }: { params: Promise<{ page: string }> }) {
  const { page } = await params
  const n = Number(page)
  if (!Number.isInteger(n) || n < 1 || n > getPageCount()) notFound()
  if (n === 1) redirect('/news')
  return <NewsList page={n} />
}
