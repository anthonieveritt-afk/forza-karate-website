import type { NewsCardThumbnail } from '@/lib/news'
import SmartImage from '@/components/media/SmartImage'

/** Listing-card thumbnail. Badges/logos use object-contain on white so the whole mark stays visible. */
export default function NewsCardImage({
  thumb,
  hoverZoom = false,
}: {
  thumb: NewsCardThumbnail | null
  hoverZoom?: boolean
}) {
  const contain = !!thumb?.contain
  return (
    <div
      className={`relative aspect-[16/10] overflow-hidden ${
        contain ? 'bg-white p-4 sm:p-5 box-border' : 'bg-[#fafaf9]'
      }`}
    >
      {thumb ? (
        <SmartImage
          src={thumb.src}
          alt={thumb.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={
            contain
              ? 'object-contain object-center'
              : `object-cover${hoverZoom ? ' group-hover:scale-[1.02] transition-transform' : ''}`
          }
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-[#dc2626] font-bold">FORZA</div>
      )}
    </div>
  )
}
