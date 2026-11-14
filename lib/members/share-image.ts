// Browser-only: turn a certificate PDF into a PNG and share it (Web Share API with a file where supported).

/** Render page 1 of a PDF blob to a PNG blob (about 1600px wide — good for social posts). */
export async function pdfToPng(pdf: Blob, width = 1600): Promise<Blob> {
  const pdfjs = await import('pdfjs-dist')
  pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await pdf.arrayBuffer()) }).promise
  const page = await doc.getPage(1)
  const base = page.getViewport({ scale: 1 })
  const viewport = page.getViewport({ scale: width / base.width })
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(viewport.width)
  canvas.height = Math.round(viewport.height)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas not available')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  await page.render({ canvasContext: ctx, viewport }).promise
  await doc.destroy()
  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Could not make the image'))), 'image/png'))
}

export function canShareFiles(file: File): boolean {
  const n = typeof navigator !== 'undefined' ? (navigator as Navigator & { canShare?: (d: ShareData) => boolean }) : null
  return !!(n && typeof n.share === 'function' && n.canShare && n.canShare({ files: [file] }))
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
}
