'use client'

import { useEffect, useState } from 'react'

/**
 * Renders a PDF or image document as a responsive image that always fits the
 * available width (phone, iPad portrait/landscape, Android tablets, desktop),
 * so the WHOLE document is visible with no cropping or inner scrolling.
 *
 * PDFs are rasterised with pdf.js because mobile/tablet browsers (iOS Safari,
 * Android Chrome) show PDFs in iframes at native size or not at all.
 */
export function FitDocumentPreview({ src, title }: { src: string; title: string }) {
  const [imgUrl, setImgUrl] = useState<string | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    let objectUrl: string | null = null
    setImgUrl(null)
    setError(false)
    ;(async () => {
      try {
        const res = await fetch(src)
        if (!res.ok) throw new Error(String(res.status))
        const blob = await res.blob()
        const type = (blob.type || res.headers.get('content-type') || '').toLowerCase()
        if (type.startsWith('image/')) {
          objectUrl = URL.createObjectURL(blob)
          if (!cancelled) setImgUrl(objectUrl)
          return
        }
        const pdfjs = await import('pdfjs-dist')
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
        const pdf = await pdfjs.getDocument({ data: new Uint8Array(await blob.arrayBuffer()) }).promise
        const page = await pdf.getPage(1)
        const base = page.getViewport({ scale: 1 })
        // Render crisp enough for retina tablets/desktop (~2000px wide).
        const scale = Math.min(4, 2000 / base.width)
        const viewport = page.getViewport({ scale })
        const canvas = document.createElement('canvas')
        canvas.width = Math.ceil(viewport.width)
        canvas.height = Math.ceil(viewport.height)
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('no canvas')
        await page.render({ canvasContext: ctx, viewport }).promise
        const out: Blob | null = await new Promise((r) => canvas.toBlob(r, 'image/png'))
        if (!out) throw new Error('render failed')
        objectUrl = URL.createObjectURL(out)
        if (!cancelled) setImgUrl(objectUrl)
      } catch {
        if (!cancelled) setError(true)
      }
    })()
    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [src])

  if (error) {
    return (
      <div className="flex min-h-[160px] items-center justify-center p-4 text-center text-sm text-gray-500">
        Preview unavailable on this device — use Download to view the full document.
      </div>
    )
  }
  if (!imgUrl) {
    return (
      <div className="flex aspect-[297/210] w-full items-center justify-center text-sm text-gray-500">
        Preparing preview…
      </div>
    )
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imgUrl}
      alt={title}
      className="mx-auto block h-auto w-full max-w-full max-h-[85vh] object-contain"
    />
  )
}
