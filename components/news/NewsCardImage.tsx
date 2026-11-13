import type { NewsCardThumbnail } from '@/lib/news'

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
      className={`aspect-[16/10] overflow-hidden ${
        contain ? 'bg-white p-4 sm:p-5 box-border' : 'bg-[#fafaf9]'
      }`}
    >
      {thumb ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumb.src}
          alt={thumb.alt}
          loading="lazy"
          className={
            contain
              ? 'h-full w-full object-contain object-center'
              : `h-full w-full object-cover${hoverZoom ? ' group-hover:scale-[1.02] transition-transform' : ''}`
          }
        />
      ) : (
        <div className="h-full w-full flex items-center justify-center text-[#dc2626] font-bold">FORZA</div>
      )}
    </div>
  )
}
