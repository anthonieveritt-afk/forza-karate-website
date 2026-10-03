'use client'

import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { useBasket } from '@/lib/store/basket'

export default function BasketButton() {
  const { count } = useBasket()
  return (
    <Link
      href="/store/checkout"
      aria-label={count > 0 ? `Basket, ${count} item${count === 1 ? '' : 's'}` : 'Basket'}
      className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full border border-black/10 hover:border-black/25 text-sm font-medium text-[#111111] transition-colors"
    >
      <ShoppingBag className="h-4 w-4" />
      Basket
      {count > 0 && (
        <span className="ml-1 min-w-5 h-5 px-1.5 rounded-full bg-[#dc2626] text-white text-[11px] font-bold flex items-center justify-center">
          {count}
        </span>
      )}
    </Link>
  )
}
