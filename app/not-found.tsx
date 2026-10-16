import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page not found | Forza Karate Club',
  robots: { index: false, follow: true },
}

export default function NotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-3xl font-bold mb-4">Page not found</h1>
      <p className="mb-8">Sorry, we can&apos;t find that page. It may have moved when we updated our website.</p>
      <div className="flex flex-wrap justify-center gap-4">
        <Link href="/" className="underline">Home</Link>
        <Link href="/classes" className="underline">Classes</Link>
        <Link href="/news" className="underline">News</Link>
        <Link href="/trial-class" className="underline">Book a trial class</Link>
        <Link href="/contact" className="underline">Contact us</Link>
      </div>
    </main>
  )
}
