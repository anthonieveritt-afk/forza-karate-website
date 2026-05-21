import type { Metadata } from 'next'
import { ShoppingBag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Forza Karate Club shop — uniforms, equipment, and club merchandise.',
}

export default function ShopPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Shop</span>
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">Shop</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Official Forza Karate kit, uniforms, and equipment.
          </p>
        </div>
      </section>

      {/* Coming soon */}
      <section className="py-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#fafaf9] border border-black/8 flex items-center justify-center mb-6">
            <ShoppingBag className="h-7 w-7 text-[#dc2626]" />
          </div>
          <h2 className="text-2xl font-bold text-[#111111] mb-3">Shop coming soon</h2>
          <p className="text-gray-500 max-w-md leading-relaxed">
            Our new shop is on its way. For kit and equipment in the meantime, speak to your instructor at class.
          </p>
        </div>
      </section>
    </div>
  )
}
