import type { Metadata } from 'next'
import StoreHeader from '@/components/store/StoreHeader'
import CheckoutClient from '@/components/store/CheckoutClient'
import { getStoreProducts } from '@/lib/store/catalogue'
import { COLLECTION_OPTIONS } from '@/lib/store/collection'

export const metadata: Metadata = {
  title: 'Basket and checkout | Store',
  robots: { index: false, follow: false },
}

export default async function CheckoutPage({ searchParams }: { searchParams: Promise<{ cancelled?: string }> }) {
  const { cancelled } = await searchParams
  const products = await getStoreProducts()
  const noCancellation = Object.fromEntries(
    products.filter(p => p.noCancellation).map(p => [p.slug, p.noCancellation!]),
  )

  return (
    <>
      <StoreHeader eyebrow="Store" title="Basket and checkout" intro="Check your basket, tell us who it’s for and where to collect it, then pay securely." />
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <CheckoutClient collectionOptions={COLLECTION_OPTIONS} noCancellation={noCancellation} cancelled={cancelled === '1'} />
        </div>
      </section>
    </>
  )
}
