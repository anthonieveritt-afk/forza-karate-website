import type { NewsCardThumbnail } from '@/lib/news'

/** Listing-card thumbnail. Badges/logos use object-contain on white so they are not cropped. */
export default function NewsCardImage({
  thumb,
  hoverZoom = false,
}: {
  thumb: NewsCardThumbnail | null
  hoverZoom?: boolean
}) {
  return (
    <div className={`aspect-[16/10] overflow-hidden ${thumb?.contain ? 'bg-white' : 'bg-[#fafaf9]'}`}>
      {thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumb.src}
          alt={thumb.alt}
          loading="lazy"
          className={
            thumb.contain
              ? 'h-full w-full object-contain p-3'
              : `h-full w-full object-cover${hoverZoom ? ' group-hover:scale-[1.02] transition-transform' : ''}`
          }
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-[#dc2626] font-bold">FORZA</div>
      )}
    </div>
  )
}
