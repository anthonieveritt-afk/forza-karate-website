'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ShoppingBag } from 'lucide-react'

// ─── PRICES ── edit here to update shop prices ───────────────────────────────
const PRICES: Record<string, string> = {
  'smai-shin-red':      '£65.00',
  'chest-guard':        '£35.00',
  'mouthguards':        '£5.00',
  'smai-mitts':         '£45.00',
  'forza-tshirt':       '£20.00',
  'forza-gi-student':   '£35.00',
  'blitz-shin-blue':    '£45.00',
  'blitz-gi':           '£40.00',
}
// ──────────────────────────────────────────────────────────────────────────────

const products = [
  {
    name: 'SMAI WKF Shin & Instep Guards',
    price: PRICES['smai-shin-red'],
    category: 'Equipment',
    colour: 'Red',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    img: '/shop/smai-shin-red.jpg',
    badge: 'WKF Approved',
  },
  {
    name: 'Chest Guard / Body Protector',
    price: PRICES['chest-guard'],
    category: 'Equipment',
    colour: 'White',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    img: '/shop/chest-guard-white.jpg',
  },
  {
    name: 'Mouthguards',
    price: PRICES['mouthguards'],
    category: 'Equipment',
    colour: 'Assorted colours',
    sizes: ['Junior', 'Senior'],
    img: '/shop/mouthguards.jpg',
  },
  {
    name: 'SMAI WKF Kumite Mitts',
    price: PRICES['smai-mitts'],
    category: 'Equipment',
    colour: 'Red & Blue pair',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    img: '/shop/smai-mitts.jpg',
    badge: 'WKF Approved',
  },
  {
    name: 'Forza Karate T-Shirt',
    price: PRICES['forza-tshirt'],
    category: 'Clothing',
    sizes: ['Age 3–4', 'Age 5–6', 'Age 7–8', 'Age 9–10', 'Age 11–12', 'S', 'M', 'L', 'XL'],
    img: '/shop/forza-tshirt.jpg',
  },
  {
    name: 'Forza Karate Student Gi',
    price: PRICES['forza-gi-student'],
    category: 'Clothing',
    sizes: ['100cm', '110cm', '120cm', '130cm', '140cm', '150cm', '160cm', '170cm', '180cm', '190cm'],
    img: '/shop/forza-gi-student.jpg',
    desc: 'Sized by height. If between sizes, go up.',
  },
  {
    name: 'Blitz Shin & Instep Guards',
    price: PRICES['blitz-shin-blue'],
    category: 'Equipment',
    colour: 'Blue',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    img: '/shop/blitz-shin-blue.jpg',
  },
  {
    name: 'Blitz Karate Gi',
    price: PRICES['blitz-gi'],
    category: 'Clothing',
    sizes: ['100cm', '110cm', '120cm', '130cm', '140cm', '150cm', '160cm', '170cm', '180cm', '190cm'],
    img: '/shop/blitz-gi.jpg',
    desc: 'Sized by height. If between sizes, go up.',
  },
]

const categories = ['All', 'Clothing', 'Equipment']

export default function ShopPage() {
  const [active, setActive] = useState('All')
  const [selected, setSelected] = useState<{ [key: string]: string }>({})

  const filtered = active === 'All' ? products : products.filter((p) => p.category === active)

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

      {/* Category tabs */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                active === cat
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'bg-white text-gray-600 border-black/12 hover:border-black/25'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Product grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <div
                key={product.name}
                className="flex flex-col rounded-2xl border border-black/8 overflow-hidden hover:border-black/20 hover:shadow-md transition-all"
              >
                {/* Image */}
                <div className="relative aspect-square bg-[#fafaf9]">
                  <Image
                    src={product.img}
                    alt={product.name}
                    fill
                    className="object-contain p-4"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  {product.badge && (
                    <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#dc2626] text-white">
                      {product.badge}
                    </span>
                  )}
                  <span className="absolute top-2 right-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white border border-black/8 text-gray-500">
                    {product.category}
                  </span>
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col flex-1">
                  <p className="text-sm font-semibold text-[#111111] leading-tight mb-1">{product.name}</p>
                  {product.colour && (
                    <p className="text-xs text-gray-400 mb-1">{product.colour}</p>
                  )}
                  {product.desc && (
                    <p className="text-xs text-gray-400 leading-relaxed mb-2">{product.desc}</p>
                  )}

                  {/* Size picker */}
                  <div className="flex flex-wrap gap-1 my-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelected((prev) => ({ ...prev, [product.name]: size }))}
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full border transition-colors ${
                          selected[product.name] === size
                            ? 'bg-[#111111] text-white border-[#111111]'
                            : 'bg-white text-gray-600 border-black/12 hover:border-black/30'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-2">
                    <span className="text-sm font-bold text-[#111111]">{product.price}</span>
                    <button className="text-xs font-medium px-3 py-1.5 rounded-full bg-[#dc2626] text-white hover:bg-[#b91c1c] transition-colors">
                      Enquire
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Footer note */}
          <div className="mt-12 p-6 rounded-2xl bg-[#fafaf9] border border-black/5 text-center">
            <ShoppingBag className="h-6 w-6 text-[#dc2626] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#111111] mb-1">To order, speak to your instructor</p>
            <p className="text-sm text-gray-500">
              Kit can be ordered at class or by contacting us directly. Full checkout coming soon.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
