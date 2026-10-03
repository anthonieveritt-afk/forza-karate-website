'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Loader2, Minus, Plus, ShoppingBag, X } from 'lucide-react'
import { removeFromBasket, setQuantity, useBasket } from '@/lib/store/basket'
import { MAX_QTY_PER_LINE, formatPence } from '@/lib/store/pricing'
import { startStoreCheckout } from '@/app/actions/store-checkout'
import type { CollectionOption } from '@/lib/store/collection'

interface Props {
  collectionOptions: CollectionOption[]
  /** slug → reason the item can't be cancelled, for the notice above the form. */
  noCancellation: Record<string, 'personalised' | 'hygiene'>
  cancelled: boolean
}

const input = 'w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition'
const label = 'block text-sm font-medium text-[#111111] mb-1.5'

export default function CheckoutClient({ collectionOptions, noCancellation, cancelled }: Props) {
  const { lines, total } = useBasket()
  const [studentName, setStudentName] = useState('')
  const [collectionId, setCollectionId] = useState('')
  const [guardianConfirmed, setGuardianConfirmed] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const dojos = [...new Set(collectionOptions.map(o => o.dojoName))]
  const hasPersonalised = lines.some(l => noCancellation[l.slug] === 'personalised')
  const hasHygiene = lines.some(l => noCancellation[l.slug] === 'hygiene')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const result = await startStoreCheckout({
        lines: lines.map(l => ({ slug: l.slug, options: l.options, personalisation: l.personalisation, quantity: l.quantity })),
        studentName,
        collectionId,
        guardianConfirmed,
        termsAccepted,
      })
      if ('url' in result) {
        window.location.href = result.url
        return
      }
      setError(result.error)
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  if (lines.length === 0) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="h-12 w-12 text-gray-200 mx-auto mb-4" />
        <p className="text-gray-500 mb-6">Your basket is empty.</p>
        <Link href="/store" className="inline-flex h-11 px-7 items-center rounded-full bg-[#dc2626] hover:bg-[#b91c1c] text-white text-sm font-semibold">
          Browse the store
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
      {/* Basket */}
      <section className="lg:col-span-3" aria-labelledby="basket-heading">
        <h2 id="basket-heading" className="text-xl font-bold text-[#111111] mb-4">Your basket</h2>
        {cancelled && (
          <p className="mb-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
            Payment was cancelled. Your basket has been kept, so you can try again when you’re ready.
          </p>
        )}
        <ul className="divide-y divide-black/5 border-y border-black/5">
          {lines.map(line => (
            <li key={line.id} className="flex gap-4 py-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-[#fafaf9] border border-black/8 shrink-0">
                {line.image && <Image src={line.image} alt="" fill className="object-contain p-1.5" sizes="80px" />}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/store/${line.slug}`} className="text-sm font-semibold text-[#111111] hover:text-[#dc2626]">{line.name}</Link>
                {line.optionSummary && <p className="text-xs text-gray-500 mt-0.5">{line.optionSummary}</p>}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-2">
                    <button type="button" aria-label={`One fewer ${line.name}`} onClick={() => setQuantity(line.id, line.quantity - 1)}
                      className="w-7 h-7 rounded-full border border-black/12 flex items-center justify-center hover:border-black/30"><Minus className="h-3 w-3" /></button>
                    <span className="text-sm font-medium w-5 text-center">{line.quantity}</span>
                    <button type="button" aria-label={`One more ${line.name}`} disabled={line.quantity >= MAX_QTY_PER_LINE}
                      onClick={() => setQuantity(line.id, line.quantity + 1)}
                      className="w-7 h-7 rounded-full border border-black/12 flex items-center justify-center hover:border-black/30 disabled:opacity-40"><Plus className="h-3 w-3" /></button>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#111111]">{formatPence(line.unitPrice * line.quantity)}</span>
                    <button type="button" aria-label={`Remove ${line.name}`} onClick={() => removeFromBasket(line.id)}
                      className="p-1 text-gray-300 hover:text-[#dc2626]"><X className="h-4 w-4" /></button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between py-4">
          <span className="text-sm text-gray-500">Total (collection at class, no delivery charge)</span>
          <span className="text-xl font-bold text-[#111111]">{formatPence(total)}</span>
        </div>
        <p className="text-xs text-gray-400">Prices are checked again when you pay. Most items are ordered in for you and are usually ready to collect within 3–4 weeks.</p>
      </section>

      {/* Details */}
      <section className="lg:col-span-2" aria-labelledby="details-heading">
        <form onSubmit={handleSubmit} className="rounded-2xl border border-black/8 p-6 space-y-5">
          <h2 id="details-heading" className="text-xl font-bold text-[#111111]">Collection details</h2>

          <div>
            <label htmlFor="studentName" className={label}>Student’s name <span className="text-[#dc2626]">*</span></label>
            <input id="studentName" className={input} required maxLength={80} autoComplete="off"
              value={studentName} onChange={e => setStudentName(e.target.value)} placeholder="So we can label the order" />
          </div>

          <div>
            <label htmlFor="collectionId" className={label}>Collect at <span className="text-[#dc2626]">*</span></label>
            <select id="collectionId" className={`${input} cursor-pointer`} required value={collectionId} onChange={e => setCollectionId(e.target.value)}>
              <option value="" disabled>Choose a class</option>
              {dojos.map(d => (
                <optgroup key={d} label={d}>
                  {collectionOptions.filter(o => o.dojoName === d).map(o => (
                    <option key={o.id} value={o.id}>{o.label.replace(`${d}: `, '')}</option>
                  ))}
                </optgroup>
              ))}
            </select>
            <p className="text-xs text-gray-400 mt-1.5">We don’t post orders. Your kit will be brought to this class.</p>
          </div>

          {(hasPersonalised || hasHygiene) && (
            <div className="p-3 rounded-xl bg-[#fafaf9] border border-black/5 text-xs text-gray-600 space-y-1">
              {hasPersonalised && <p>Personalised and made-to-order items can’t be cancelled or returned once ordered, unless they are faulty.</p>}
              {hasHygiene && <p>For hygiene reasons, mouthguards can’t be returned once unsealed, unless they are faulty.</p>}
            </div>
          )}

          <label className="flex items-start gap-3 text-sm text-gray-600">
            <input type="checkbox" className="mt-1 accent-[#dc2626]" required checked={guardianConfirmed} onChange={e => setGuardianConfirmed(e.target.checked)} />
            <span>I’m the student’s parent or guardian, or the student is 18 or over and is placing this order.</span>
          </label>
          <label className="flex items-start gap-3 text-sm text-gray-600">
            <input type="checkbox" className="mt-1 accent-[#dc2626]" required checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} />
            <span>
              I agree to the <Link href="/store/terms" target="_blank" className="text-[#dc2626] hover:underline">Terms of Sale</Link>, including the
              14-day cancellation rules, and have read the <Link href="/privacy-policy" target="_blank" className="text-[#dc2626] hover:underline">Privacy Policy</Link>.
            </span>
          </label>

          {error && <p role="alert" className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full h-12 rounded-full bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-60 text-white text-sm font-semibold inline-flex items-center justify-center gap-2">
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {loading ? 'Taking you to secure payment…' : `Pay ${formatPence(total)} securely`}
          </button>
          <p className="text-xs text-gray-400 text-center">
            You’ll pay on Stripe’s secure page. Your card details never reach this website. We only ask for the student’s name and class so we can label and deliver your order at class.
          </p>
        </form>
      </section>
    </div>
  )
}
