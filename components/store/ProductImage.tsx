import Image from 'next/image'
import BeltIcon from '@/components/ui/BeltIcon'
import type { StoreProduct } from '@/lib/store/types'

/** Product photo, or a belt graphic for belts without a photo. */
export default function ProductImage({ product, sizes, priority }: { product: Pick<StoreProduct, 'name' | 'image'>; sizes: string; priority?: boolean }) {
  return (
    <div className="relative aspect-square bg-[#fafaf9]">
      {product.image ? (
        <Image src={product.image} alt={product.name} fill className="object-contain p-4" sizes={sizes} priority={priority} />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-8" aria-hidden="true">
          <div className="w-full max-w-[220px]">
            <BeltIcon color="#111111" border="#000000" stripe="#dc2626" />
          </div>
        </div>
      )}
    </div>
  )
}
