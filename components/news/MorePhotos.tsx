import type { NewsBodyPhoto } from '@/lib/news'

// In-body photos from the old WordPress posts. Photos that have been copied to
// Vercel Blob use their `blob` URL; the rest still load from the old site.
//
// IMPORTANT: any photo without a `blob` URL is served from
// https://forzakarate.co.uk/wp-content/uploads/ and will break if the old
// WordPress hosting is switched off. Thumbnails are WordPress's own ~300px
// sizes, lazy-loaded, and are deliberately plain <img> tags so they don't go
// through (and use up) Next.js image optimisation.
export default function MorePhotos({ photos, title }: { photos: NewsBodyPhoto[]; title: string }) {
  if (photos.length === 0) return null
  return (
    <section aria-labelledby="more-photos" className="mt-12 border-t border-black/5 pt-10">
      <div className="flex items-baseline justify-between gap-4 mb-5">
        <h2 id="more-photos" className="text-xl font-bold text-[#111111]">More photos from this post</h2>
        <span className="text-xs text-gray-400">
          {photos.length} {photos.length === 1 ? 'photo' : 'photos'}
        </span>
      </div>
      <ul className="grid grid-cols-3 sm:grid-cols-4 gap-2 sm:gap-3">
        {photos.map((p, i) => {
          const full = p.blob ?? p.src
          const thumb = p.blob ?? p.thumb
          return (
            <li key={p.src}>
              <a
                href={full}
                target="_blank"
                rel="noopener noreferrer"
                className="block aspect-square overflow-hidden rounded-xl border border-black/5 bg-[#fafaf9] hover:opacity-90 transition-opacity"
                aria-label={`Open photo ${i + 1} of ${photos.length} in a new tab`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={thumb}
                  alt={`${title} – photo ${i + 1}`}
                  loading="lazy"
                  decoding="async"
                  width={300}
                  height={300}
                  className="h-full w-full object-cover"
                />
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
