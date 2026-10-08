import Link from 'next/link'
import type { Metadata } from 'next'
import { ExternalLink, ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Gallery management',
  robots: { index: false, follow: false },
}

const ADMIN_URL =
  process.env.NEXT_PUBLIC_FORZA_ADMIN_URL ??
  'https://forza-club-honbu-production.up.railway.app'

export default function GalleryAdminRemovedPage() {
  return (
    <div className="min-h-screen bg-[#111111] text-white flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-md w-full text-center">
        <p className="text-xs uppercase tracking-widest text-white/30 mb-4">Staff only</p>
        <h1 className="text-3xl font-bold mb-3">Gallery is managed in Club Honbu</h1>
        <p className="text-white/50 text-sm leading-relaxed mb-8">
          For security, the old on-site gallery editor has been removed. Sign in to Club Honbu
          to add, edit or remove albums and photos. The public gallery on this website still
          shows albums from Club Honbu automatically.
        </p>
        <a
          href={`${ADMIN_URL}/login`}
          className="inline-flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold px-6 py-3 rounded-2xl text-sm transition-colors"
        >
          Open Club Honbu admin
          <ExternalLink className="h-4 w-4" />
        </a>
        <div className="mt-8">
          <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Club Management
          </Link>
        </div>
      </div>
    </div>
  )
}
