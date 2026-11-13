"use client"

import { useEffect, useState } from "react"

type Photo = { url: string; caption?: string | null }

export default function NewsPhotoGallery({ photos }: { photos: Photo[] }) {
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    if (open == null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null)
      if (e.key === "ArrowRight") setOpen((i) => (i == null ? i : (i + 1) % photos.length))
      if (e.key === "ArrowLeft") setOpen((i) => (i == null ? i : (i - 1 + photos.length) % photos.length))
    }
    window.addEventListener("keydown", onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = prev
    }
  }, [open, photos.length])

  if (!photos.length) return null
  const current = open != null ? photos[open] : null

  return (
    <>
      <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 gap-3">
        {photos.map((ph, i) => (
          <button
            key={`${ph.url}-${i}`}
            type="button"
            onClick={() => setOpen(i)}
            className="block rounded-xl overflow-hidden border border-black/5 bg-[#fafaf9] text-left"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ph.url} alt={ph.caption || ""} className="aspect-square w-full object-contain bg-white" />
            {ph.caption && <span className="block p-2 text-xs text-gray-500">{ph.caption}</span>}
          </button>
        ))}
      </div>

      {current && open != null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={current.caption || "Photo"}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setOpen(null)}
        >
          <button type="button" className="absolute top-4 right-4 text-white text-sm px-3 py-2" onClick={() => setOpen(null)}>
            Close
          </button>
          {photos.length > 1 && (
            <>
              <button
                type="button"
                className="absolute left-2 sm:left-4 text-white text-3xl px-3 py-2"
                onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + photos.length) % photos.length) }}
                aria-label="Previous photo"
              >
                ‹
              </button>
              <button
                type="button"
                className="absolute right-2 sm:right-4 text-white text-3xl px-3 py-2"
                onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % photos.length) }}
                aria-label="Next photo"
              >
                ›
              </button>
            </>
          )}
          <figure className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={current.url} alt={current.caption || ""} className="max-h-[80vh] w-full object-contain mx-auto" />
            {current.caption && <figcaption className="mt-3 text-center text-sm text-white/80">{current.caption}</figcaption>}
          </figure>
        </div>
      )}
    </>
  )
}
