'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ShoppingBag, ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import CartDrawer from '@/components/shop/CartDrawer'
import { PRICES, SIZE_PRICES, WKF_CATEGORY, getPriceRange, orderName, products, type Product } from '@/lib/shop/catalogue'

const categories = ['All', 'Clothing', 'Equipment', WKF_CATEGORY]

function priceLabel(pence: number) {
  return (pence / 100).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })
}

export default function ShopPage() {
  const [active, setActive] = useState('All')
  const [selected, setSelected] = useState<Record<string, string>>({})
  const [selectedColour, setSelectedColour] = useState<Record<string, string>>({})
  const [added, setAdded] = useState<Record<string, boolean>>({})
  const [cartOpen, setCartOpen] = useState(false)
  const { addItem, count } = useCart()

  const filtered = active === 'All' ? products : products.filter(p => p.category === active)

  const getEffectivePrice = (productKey: string, size?: string): number | null => {
    if (SIZE_PRICES[productKey] && size) return SIZE_PRICES[productKey][size] ?? null
    return PRICES[productKey] ?? null
  }

  const handleAdd = (product: Product) => {
    const size = selected[product.key]
    const colour = product.colours?.length ? selectedColour[product.key] : undefined
    if (!size || product.priceOnRequest) return
    if (product.colours?.length && !colour) return
    const price = getEffectivePrice(product.key, size)
    if (price == null) return
    addItem({
      id: colour ? `${product.key}-${size}-${colour}` : `${product.key}-${size}`,
      productKey: product.key,
      name: orderName(product),
      size,
      ...(colour ? { colour } : {}),
      price,
      priceLabel: priceLabel(price),
      img: product.img,
    })
    setAdded(prev => ({ ...prev, [product.key]: true }))
    setTimeout(() => setAdded(prev => ({ ...prev, [product.key]: false })), 1500)
    setCartOpen(true)
  }

  return (
    <div className="bg-white">
      {/* Header */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-0.5 bg-[#dc2626]" />
              <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">Shop</span>
            </div>
            <h1 className="text-5xl font-bold text-[#111111] mb-4">Shop</h1>
            <p className="text-xl text-gray-500 max-w-2xl">
              Official Forza Karate kit, uniforms, and equipment.
            </p>
          </div>
          {/* Cart button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative mt-2 p-3 rounded-2xl border border-black/8 hover:border-black/20 transition-colors"
          >
            <ShoppingCart className="h-5 w-5 text-[#111111]" />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#dc2626] text-white text-[10px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Category tabs */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-b border-black/5">
        <div className="max-w-7xl mx-auto flex gap-2 flex-wrap">
          {categories.map(cat => (
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
          {active === WKF_CATEGORY && (
            <div className="mb-8 p-5 rounded-2xl bg-[#fafaf9] border border-black/5">
              <p className="text-sm font-semibold text-[#111111] mb-1">WKF approved competition suits</p>
              <p className="text-sm text-gray-500">
                Kumite and kata suits for tournaments, sized by height. These are extra to the
                Official Forza Karate Club Gi, which every member needs for training.
              </p>
            </div>
          )}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(product => {
              const size = selected[product.key]
              const colour = selectedColour[product.key]
              const needsColour = Boolean(product.colours?.length)
              const canAdd = Boolean(size) && (!needsColour || Boolean(colour))
              const isAdded = added[product.key]
              const addLabel = product.priceOnRequest
                ? 'Contact us'
                : isAdded
                ? '✓ Added'
                : !size
                ? 'Pick size'
                : needsColour && !colour
                ? 'Pick colour'
                : 'Add to Cart'
              return (
                <div
                  key={product.key}
                  id={product.key}
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
                    <span className={`absolute top-2 right-2 text-[10px] font-medium px-2 py-0.5 rounded-full bg-white border border-black/8 text-gray-500 ${product.badge ? 'hidden sm:inline' : ''}`}>
                      {product.category === WKF_CATEGORY ? 'Competition' : product.category}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="p-3 flex flex-col flex-1">
                    <p className="text-sm font-semibold text-[#111111] leading-tight mb-1">{product.name}</p>
                    {!needsColour && 'colour' in product && product.colour && (
                      <p className="text-xs text-gray-400 mb-1">{product.colour}</p>
                    )}
                    {product.desc && (
                      <p className="text-xs text-gray-400 leading-relaxed mb-1">{product.desc}</p>
                    )}

                    {/* Colour picker (required on pad products) */}
                    {needsColour && (
                      <div className="my-2">
                        <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">Colour</p>
                        <div className="flex flex-wrap gap-1">
                          {product.colours!.map(c => (
                            <button
                              key={c}
                              type="button"
                              onClick={() => setSelectedColour(prev => ({ ...prev, [product.key]: c }))}
                              className={`text-[10px] font-medium px-2 py-0.5 rounded-full border transition-colors ${
                                colour === c
                                  ? 'bg-[#111111] text-white border-[#111111]'
                                  : 'bg-white text-gray-600 border-black/12 hover:border-black/30'
                              }`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Size picker */}
                    <div className={`flex flex-wrap gap-1 ${needsColour ? 'mb-2' : 'my-2'}`}>
                      {product.sizes.map(s => (
                        <button
                          key={s}
                          onClick={() => setSelected(prev => ({ ...prev, [product.key]: s }))}
                          className={`text-[10px] font-medium px-2 py-0.5 rounded-full border transition-colors ${
                            size === s
                              ? 'bg-[#111111] text-white border-[#111111]'
                              : 'bg-white text-gray-600 border-black/12 hover:border-black/30'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 mt-auto pt-2">
                      {product.priceOnRequest ? (
                        <span className="text-sm font-semibold text-gray-400">POA</span>
                      ) : SIZE_PRICES[product.key] ? (
                        <span className="text-sm font-bold text-[#111111]">
                          {size && SIZE_PRICES[product.key][size]
                            ? priceLabel(SIZE_PRICES[product.key][size])
                            : (() => {
                                const r = getPriceRange(product.key)
                                if (!r) return '—'
                                return r.min === r.max ? priceLabel(r.min) : `${priceLabel(r.min)}–${priceLabel(r.max)}`
                              })()}
                        </span>
                      ) : (
                        <span className="text-sm font-bold text-[#111111]">
                          {PRICES[product.key] != null ? priceLabel(PRICES[product.key]) : '—'}
                        </span>
                      )}
                      <button
                        onClick={() => handleAdd(product)}
                        disabled={!canAdd || !!product.priceOnRequest}
                        className={`whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                          product.priceOnRequest
                            ? 'bg-black/5 text-gray-400 cursor-not-allowed'
                            : isAdded
                            ? 'bg-green-500 text-white'
                            : canAdd
                            ? 'bg-[#dc2626] hover:bg-[#b91c1c] text-white'
                            : 'bg-black/5 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        {addLabel}
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Footer note */}
          <div className="mt-12 p-6 rounded-2xl bg-[#fafaf9] border border-black/5 text-center">
            <ShoppingBag className="h-6 w-6 text-[#dc2626] mx-auto mb-3" />
            <p className="text-sm font-semibold text-[#111111] mb-1">Collection at class only</p>
            <p className="text-sm text-gray-500">
              We don&apos;t post orders — all items are collected at your next class.
              Pay securely online and we&apos;ll have your kit ready at the dojo.
            </p>
          </div>
        </div>
      </section>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </div>
  )
}
