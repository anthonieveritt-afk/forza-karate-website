'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Check, Minus, Plus } from 'lucide-react'
import { addToBasket } from '@/lib/store/basket'
import {
  MAX_QTY_PER_LINE, cleanPersonalisation, describeSelections, formatPence, lineKey, priceRange, unitPrice,
  type Selections,
} from '@/lib/store/pricing'
import type { StoreProduct } from '@/lib/store/types'

export default function AddToBasket({ product }: { product: StoreProduct }) {
  const [selections, setSelections] = useState<Selections>({})
  const [text, setText] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [touched, setTouched] = useState(false)

  const price = unitPrice(product, selections)
  const range = priceRange(product)
  const personalisation = product.personalisation ? cleanPersonalisation(text, product.personalisation) : undefined
  const missing = product.options.filter(o => !selections[o.key])
  const textMissing = !!product.personalisation && !personalisation
  const ready = price != null && !textMissing

  function choose(key: string, value: string) {
    setSelections(prev => ({ ...prev, [key]: value }))
    setAdded(false)
  }

  function handleAdd() {
    setTouched(true)
    if (!ready || price == null) return
    const p = personalisation ?? undefined
    addToBasket({
      id: lineKey(product.slug, selections, p),
      slug: product.slug,
      options: selections,
      personalisation: p,
      name: product.name,
      optionSummary: [describeSelections(product, selections), p && `${product.personalisation!.label}: ${p}`].filter(Boolean).join(' · '),
      unitPrice: price,
      image: product.image,
    }, quantity)
    setAdded(true)
  }

  if (!product.availableOnline) {
    return (
      <div className="rounded-2xl bg-[#fafaf9] border border-black/5 p-5 text-sm text-gray-600">
        This item isn’t available to buy online. Please ask your instructor at class, or{' '}
        <Link href="/store/help" className="text-[#dc2626] font-medium hover:underline">send us a message</Link>.
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <p className="text-3xl font-bold text-[#111111]">
        {price != null ? formatPence(price) : range.min === range.max ? formatPence(range.min) : `${formatPence(range.min)} – ${formatPence(range.max)}`}
      </p>

      {product.options.map(option => (
        <fieldset key={option.key}>
          <legend className="text-sm font-medium text-[#111111] mb-2">{option.label}</legend>
          {option.values.length > 12 ? (
            <select
              value={selections[option.key] ?? ''}
              onChange={e => choose(option.key, e.target.value)}
              className="w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
            >
              <option value="" disabled>Choose {option.label.toLowerCase()}</option>
              {option.values.map(v => <option key={v.value} value={v.value}>{v.label ?? v.value}</option>)}
            </select>
          ) : (
            <div className="flex flex-wrap gap-2">
              {option.values.map(v => {
                const selected = selections[option.key] === v.value
                return (
                  <button
                    key={v.value}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => choose(option.key, v.value)}
                    className={`text-sm px-3.5 py-1.5 rounded-full border transition-colors ${
                      selected ? 'bg-[#111111] text-white border-[#111111]' : 'bg-white text-gray-700 border-black/12 hover:border-black/30'
                    }`}
                  >
                    {v.label ?? v.value}
                  </button>
                )
              })}
            </div>
          )}
          {option.help && <p className="text-xs text-gray-400 mt-2">{option.help}</p>}
          {touched && !selections[option.key] && <p className="text-xs text-[#dc2626] mt-1">Please choose {option.label.toLowerCase()}.</p>}
        </fieldset>
      ))}

      {product.personalisation && (
        <div>
          <label htmlFor="personalisation" className="block text-sm font-medium text-[#111111] mb-2">{product.personalisation.label}</label>
          <input
            id="personalisation"
            value={text}
            maxLength={product.personalisation.maxLength}
            onChange={e => { setText(e.target.value); setAdded(false) }}
            className="w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
          />
          {product.personalisation.help && <p className="text-xs text-gray-400 mt-2">{product.personalisation.help}</p>}
          {touched && textMissing && <p className="text-xs text-[#dc2626] mt-1">Please check the {product.personalisation.label.toLowerCase()}.</p>}
        </div>
      )}

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2" aria-label="Quantity">
          <button type="button" aria-label="Fewer" onClick={() => setQuantity(q => Math.max(1, q - 1))}
            className="w-9 h-9 rounded-full border border-black/12 flex items-center justify-center hover:border-black/30"><Minus className="h-4 w-4" /></button>
          <span className="w-6 text-center font-medium" aria-live="polite">{quantity}</span>
          <button type="button" aria-label="More" onClick={() => setQuantity(q => Math.min(MAX_QTY_PER_LINE, q + 1))}
            className="w-9 h-9 rounded-full border border-black/12 flex items-center justify-center hover:border-black/30"><Plus className="h-4 w-4" /></button>
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className={`flex-1 h-11 rounded-full text-sm font-semibold transition-colors ${
            added ? 'bg-green-600 text-white' : 'bg-[#dc2626] hover:bg-[#b91c1c] text-white'
          }`}
        >
          {added ? <span className="inline-flex items-center gap-2"><Check className="h-4 w-4" /> Added to basket</span> : 'Add to basket'}
        </button>
      </div>
      {touched && missing.length === 0 && !textMissing && price == null && (
        <p className="text-xs text-[#dc2626]">This combination isn’t available.</p>
      )}
      {added && (
        <p className="text-sm">
          <Link href="/store/checkout" className="text-[#dc2626] font-medium hover:underline">Go to basket and checkout →</Link>
        </p>
      )}
    </div>
  )
}
