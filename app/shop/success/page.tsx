import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Order Confirmed — Forza Karate Shop' }

export default function SuccessPage() {
  return (
    <div className="bg-white min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-[#111111] mb-3">Order confirmed!</h1>
        <p className="text-gray-500 leading-relaxed mb-8">
          Thanks for your order. You'll receive a confirmation email shortly.
          We'll be in touch when your kit is ready to collect or dispatch.
        </p>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold px-6 py-3 rounded-2xl transition-colors text-sm"
        >
          Back to Shop
        </Link>
      </div>
    </div>
  )
}
