import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Clock, ShieldCheck } from 'lucide-react'
import AddToBasket from '@/components/store/AddToBasket'
import BasketButton from '@/components/store/BasketButton'
import ProductImage from '@/components/store/ProductImage'
import { getStoreProduct, getStoreProducts } from '@/lib/store/catalogue'
import { CATEGORY_LABELS } from '@/lib/store/types'

export async function generateStaticParams() {
  return (await getStoreProducts()).map(p => ({ slug: p.slug }))
}

export const dynamicParams = false

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const product = await getStoreProduct((await params).slug)
  if (!product) return {}
  return { title: `${product.name} | Store`, description: product.summary }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const product = await getStoreProduct((await params).slug)
  if (!product) notFound()

  return (
    <section className="pt-10 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/store" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#111111]">
            <ArrowLeft className="h-4 w-4" /> Back to the store
          </Link>
          <BasketButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          <div className="relative rounded-2xl border border-black/8 overflow-hidden">
            <ProductImage product={product} sizes="(max-width: 768px) 100vw, 50vw" priority />
            {product.badge && (
              <span className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-full bg-[#dc2626] text-white">{product.badge}</span>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-[#dc2626] uppercase tracking-wider mb-3">{CATEGORY_LABELS[product.category]}</p>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#111111] mb-4">{product.name}</h1>
            <div className="space-y-3 text-gray-600 mb-6">
              {product.description.map((para, i) => <p key={i}>{para}</p>)}
            </div>

            <AddToBasket product={product} />

            <ul className="mt-8 space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-[#dc2626] mt-0.5 shrink-0" />
                <span>
                  {product.availability === 'in-stock' ? 'In stock at the dojo.' : `Ordered in for you. ${product.leadTime ?? ''}`.trim()}{' '}
                  Collection at class only. We don’t post orders.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ShieldCheck className="h-4 w-4 text-[#dc2626] mt-0.5 shrink-0" />
                <span>
                  {product.noCancellation === 'personalised'
                    ? 'Made to order and personalised, so it can’t be cancelled or returned once ordered unless it’s faulty.'
                    : product.noCancellation === 'hygiene'
                      ? 'Can be cancelled within 14 days of collection while still sealed. Not returnable once unsealed (unless faulty), for hygiene reasons.'
                      : 'You can cancel within 14 days of collecting your order.'}{' '}
                  <Link href="/store/terms" className="text-[#dc2626] hover:underline">Terms of Sale</Link>
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
