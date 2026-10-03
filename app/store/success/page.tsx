import type { Metadata } from 'next'
import Link from 'next/link'
import Stripe from 'stripe'
import { CheckCircle, Clock } from 'lucide-react'
import ClearBasket from '@/components/store/ClearBasket'
import { formatPence } from '@/lib/store/pricing'

export const metadata: Metadata = {
  title: 'Order confirmed | Store',
  robots: { index: false, follow: false },
}

interface OrderSummary {
  paid: boolean
  orderRef?: string
  collectionClass?: string
  total?: number
  items: { description: string; quantity: number; amount: number }[]
}

async function loadOrder(sessionId: string | undefined): Promise<OrderSummary | null> {
  if (!sessionId || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId) || !process.env.STRIPE_SECRET_KEY) return null
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-04-22.dahlia' })
    const session = await stripe.checkout.sessions.retrieve(sessionId, { expand: ['line_items'] })
    if (session.metadata?.source !== 'forza-karate-website-store') return null
    return {
      paid: session.payment_status === 'paid',
      orderRef: session.client_reference_id ?? session.metadata?.orderRef,
      collectionClass: session.metadata?.collectionClass,
      total: session.amount_total ?? undefined,
      items: (session.line_items?.data ?? []).map(li => ({
        description: li.description ?? 'Item',
        quantity: li.quantity ?? 1,
        amount: li.amount_total,
      })),
    }
  } catch (err) {
    console.error('Store success: could not load session', err)
    return null
  }
}

export default async function StoreSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id } = await searchParams
  const order = await loadOrder(session_id)

  return (
    <section className="px-4 py-20">
      <ClearBasket />
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-10">
          {order && !order.paid
            ? <Clock className="h-14 w-14 text-amber-500 mx-auto mb-6" />
            : <CheckCircle className="h-14 w-14 text-green-500 mx-auto mb-6" />}
          <h1 className="text-3xl font-bold text-[#111111] mb-3">
            {order && !order.paid ? 'Payment processing' : 'Thank you for your order'}
          </h1>
          <p className="text-gray-500 leading-relaxed">
            {order && !order.paid
              ? 'Your payment is still being processed. We’ll confirm your order as soon as it completes.'
              : 'Your payment was successful and you’ll receive a receipt by email. We’ll let you know when your kit is ready to collect at class.'}
          </p>
        </div>

        {order && (
          <div className="rounded-2xl border border-black/8 p-6 space-y-4 text-sm">
            {order.orderRef && (
              <p className="flex justify-between"><span className="text-gray-500">Order reference</span><span className="font-semibold text-[#111111]">{order.orderRef}</span></p>
            )}
            {order.collectionClass && (
              <p className="flex justify-between gap-6"><span className="text-gray-500 shrink-0">Collect at</span><span className="font-medium text-[#111111] text-right">{order.collectionClass}</span></p>
            )}
            {order.items.length > 0 && (
              <ul className="border-t border-black/5 pt-4 space-y-2">
                {order.items.map((item, i) => (
                  <li key={i} className="flex justify-between gap-4">
                    <span className="text-gray-600">{item.quantity} × {item.description}</span>
                    <span className="text-[#111111]">{formatPence(item.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
            {order.total != null && (
              <p className="flex justify-between border-t border-black/5 pt-4"><span className="font-semibold">Total paid</span><span className="font-bold">{formatPence(order.total)}</span></p>
            )}
          </div>
        )}

        <div className="text-center mt-10 space-y-3 text-sm">
          <p><Link href="/store" className="text-[#dc2626] font-medium hover:underline">Back to the store</Link></p>
          <p className="text-gray-400">Questions about your order? <Link href="/store/help" className="hover:text-[#111111] underline">Customer help</Link></p>
        </div>
      </div>
    </section>
  )
}
