import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

/** Shown at the bottom of every store page. */
export default function StoreFooter() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-16">
      <div className="max-w-7xl mx-auto rounded-2xl bg-[#fafaf9] border border-black/5 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <ShoppingBag className="h-5 w-5 text-[#dc2626] mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-[#111111]">Collection at class only</p>
            <p className="text-sm text-gray-500">We don’t post orders. Pay online and collect your kit at the class you choose.</p>
          </div>
        </div>
        <nav aria-label="Store information" className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          <Link href="/store/terms" className="text-gray-600 hover:text-[#dc2626]">Terms of Sale</Link>
          <Link href="/store/help" className="text-gray-600 hover:text-[#dc2626]">Customer help</Link>
          <Link href="/privacy-policy" className="text-gray-600 hover:text-[#dc2626]">Privacy Policy</Link>
        </nav>
      </div>
    </section>
  )
}
