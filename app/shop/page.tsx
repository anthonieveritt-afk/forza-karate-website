import type { Metadata } from 'next'
import { ShoppingBag } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Shop',
  description: 'Forza Karate Club shop — uniforms, equipment, and club merchandise. Coming soon.',
}

export default function ShopPage() {
  return (
    <div className="bg-white">
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Shop</span>
          </div>
          <h1 className="text-5xl font-bold text-[#111111] mb-4">Shop</h1>
          <p className="text-xl text-gray-500 max-w-2xl">
            Kit, uniforms, and equipment — coming soon.
          </p>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 rounded-2xl bg-red-50 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="h-8 w-8 text-[#dc2626]" />
          </div>
          <h2 className="text-2xl font-bold text-[#111111] mb-4">Coming soon</h2>
          <p className="text-gray-500 mb-8">
            Our online shop is under development. We&apos;ll be selling gi (uniforms), belts, protective
            equipment, and club merchandise. Enter your email to be notified when we launch.
          </p>

          {/* Email capture */}
          <form className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 h-11 px-4 rounded-full border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition"
            />
            <button
              type="submit"
              className="h-11 px-6 bg-[#dc2626] text-white font-medium rounded-full text-sm hover:bg-red-700 transition-colors whitespace-nowrap"
            >
              Notify me
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-4">
            Stripe integration launching Phase 2. No spam, ever.
          </p>
        </div>
      </section>
    </div>
  )
}
