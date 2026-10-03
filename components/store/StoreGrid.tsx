'use client'

import Link from 'next/link'
import { useState } from 'react'
import ProductImage from './ProductImage'
import { CATEGORY_LABELS, type StoreCategory } from '@/lib/store/types'
import { formatPence } from '@/lib/store/pricing'

export interface ProductCardData {
  slug: string
  name: string
  category: StoreCategory
  summary: string
  image?: string
  badge?: string
  minPrice: number
  maxPrice: number
  availableOnline: boolean
}

export default function StoreGrid({ products }: { products: ProductCardData[] }) {
  const categories = (Object.keys(CATEGORY_LABELS) as StoreCategory[]).filter(c => products.some(p => p.category === c))
  const [active, setActive] = useState<StoreCategory | 'all'>('all')
  const shown = active === 'all' ? products : products.filter(p => p.category === active)

  const tab = (selected: boolean) =>
    `px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
      selected ? 'bg-[#111111] text-white border-[#111111]' : 'bg-white text-gray-600 border-black/12 hover:border-black/25'
    }`

  return (
    <>
      <div className="flex gap-2 flex-wrap mb-8" role="group" aria-label="Filter by category">
        <button type="button" className={tab(active === 'all')} aria-pressed={active === 'all'} onClick={() => setActive('all')}>All</button>
        {categories.map(c => (
          <button key={c} type="button" className={tab(active === c)} aria-pressed={active === c} onClick={() => setActive(c)}>
            {CATEGORY_LABELS[c]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {shown.map(p => (
          <Link
            key={p.slug}
            href={`/store/${p.slug}`}
            className="group flex flex-col rounded-2xl border border-black/8 overflow-hidden hover:border-black/20 hover:shadow-md transition-all"
          >
            <div className="relative">
              <ProductImage product={p} sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
              {p.badge && (
                <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#dc2626] text-white">{p.badge}</span>
              )}
            </div>
            <div className="p-3 flex flex-col flex-1">
              <p className="text-sm font-semibold text-[#111111] leading-tight mb-1 group-hover:text-[#dc2626]">{p.name}</p>
              <p className="text-xs text-gray-400 leading-relaxed mb-2">{p.summary}</p>
              <p className="mt-auto text-sm font-bold text-[#111111]">
                {!p.availableOnline
                  ? <span className="text-gray-400 font-semibold">Not available online</span>
                  : p.minPrice === p.maxPrice ? formatPence(p.minPrice) : `From ${formatPence(p.minPrice)}`}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </>
  )
}
