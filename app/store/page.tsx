import type { Metadata } from 'next'
import Link from 'next/link'
import StoreHeader from '@/components/store/StoreHeader'
import StoreGrid, { type ProductCardData } from '@/components/store/StoreGrid'
import { getStoreProducts } from '@/lib/store/catalogue'
import { priceRange } from '@/lib/store/pricing'

export const metadata: Metadata = {
  title: 'Store',
  description: 'Official Forza Karate Club uniforms, sparring kit, clothing and personalised belts. Pay online and collect at class.',
}

export default async function StorePage() {
  const products = await getStoreProducts()
  const cards: ProductCardData[] = products.map(p => {
    const { min, max } = priceRange(p)
    return {
      slug: p.slug, name: p.name, category: p.category, summary: p.summary, image: p.image, badge: p.badge,
      minPrice: min, maxPrice: max, availableOnline: p.availableOnline,
    }
  })

  return (
    <>
      <StoreHeader
        title="Store"
        intro={<>
          <p>Official Forza Karate kit, uniforms and equipment. Pay online and collect at your class.</p>
          <p className="text-sm mt-3">
            Need an embroidered belt? <Link href="/store/personalised-belt" className="text-[#dc2626] font-medium hover:underline">Order a personalised belt</Link>
          </p>
        </>}
      />
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <StoreGrid products={cards} />
        </div>
      </section>
    </>
  )
}
