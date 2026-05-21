'use client'

import Image from 'next/image'
import { useCart } from '@/lib/cart-context'
import { X, Minus, Plus, ShoppingBag, Loader2 } from 'lucide-react'
import { useState } from 'react'

interface Props {
  open: boolean
  onClose: () => void
}

export default function CartDrawer({ open, onClose }: Props) {
  const { items, removeItem, updateQty, total, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleCheckout = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Something went wrong. Please try again.')
        setLoading(false)
      }
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-sm bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/8">
          <h2 className="text-base font-bold text-[#111111]">Your Cart</h2>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-black/5 transition-colors">
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-3">
              <ShoppingBag className="h-10 w-10 text-gray-200" />
              <p className="text-sm text-gray-400">Your cart is empty</p>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map(item => (
                <li key={item.id} className="flex gap-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#fafaf9] flex-shrink-0 border border-black/8">
                    <Image src={item.img} alt={item.name} fill className="object-contain p-1.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#111111] leading-tight">{item.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{item.size}</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full border border-black/12 flex items-center justify-center hover:border-black/25 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full border border-black/12 flex items-center justify-center hover:border-black/25 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#111111]">
                          {(item.price * item.quantity / 100).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-gray-300 hover:text-[#dc2626] transition-colors"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-black/8 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Total</span>
              <span className="text-lg font-bold text-[#111111]">
                {(total / 100).toLocaleString('en-GB', { style: 'currency', currency: 'GBP' })}
              </span>
            </div>
            {error && <p className="text-xs text-[#dc2626]">{error}</p>}
            <p className="text-xs text-gray-400 text-center">📦 Collection at class only — we don't post orders</p>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-60 text-white font-semibold py-3 rounded-2xl transition-colors text-sm"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? 'Redirecting…' : 'Checkout with Stripe'}
            </button>
            <button
              onClick={clearCart}
              className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
            >
              Clear cart
            </button>
          </div>
        )}
      </div>
    </>
  )
}
