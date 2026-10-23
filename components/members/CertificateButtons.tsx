'use client'

import { useEffect, useId, useRef, useState } from 'react'

export function CertificateButtons({
  studentName,
  toBelt,
  gradingDate,
}: {
  studentName: string
  toBelt: string
  gradingDate: string
}) {
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState<null | 'view' | 'download'>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const urlRef = useRef<string | null>(null)
  const openRef = useRef(false)

  function revokePreview() {
    if (urlRef.current) {
      URL.revokeObjectURL(urlRef.current)
      urlRef.current = null
    }
    setPreviewUrl(null)
  }

  useEffect(() => {
    openRef.current = open
  }, [open])

  useEffect(() => () => revokePreview(), [])

  async function ensurePreviewUrl(): Promise<string> {
    if (urlRef.current) return urlRef.current
    const { generateCertificateBlobUrl } = await import('@/lib/certificate')
    const url = await generateCertificateBlobUrl(studentName, toBelt, gradingDate)
    urlRef.current = url
    setPreviewUrl(url)
    return url
  }

  async function toggleView() {
    if (open) {
      setOpen(false)
      revokePreview()
      return
    }
    setBusy('view')
    try {
      await ensurePreviewUrl()
      setOpen(true)
    } catch {
      revokePreview()
      alert('Sorry, the certificate could not be opened. Please try again.')
    } finally {
      setBusy(null)
    }
  }

  async function download() {
    setBusy('download')
    try {
      const { getCertificateFilename } = await import('@/lib/certificate')
      const url = await ensurePreviewUrl()
      const a = document.createElement('a')
      a.href = url
      a.download = getCertificateFilename(studentName, toBelt)
      document.body.appendChild(a)
      a.click()
      a.remove()
      // Keep the object URL if the accordion is open; otherwise revoke shortly after download.
      if (!openRef.current) {
        setTimeout(() => {
          if (!openRef.current && urlRef.current === url) revokePreview()
        }, 60_000)
      }
    } catch {
      alert('Sorry, the certificate could not be downloaded. Please try again.')
    } finally {
      setBusy(null)
    }
  }

  const btn =
    'inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]/50'

  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={toggleView}
          disabled={busy !== null}
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={open ? `Hide certificate for ${toBelt}` : `View certificate for ${toBelt}`}
          className={`${btn} border-black/10 bg-white text-[#111111] hover:bg-gray-50`}
        >
          {busy === 'view' ? 'Opening…' : open ? 'Hide certificate' : 'View certificate'}
        </button>
        <button
          type="button"
          onClick={download}
          disabled={busy !== null}
          aria-label={`Download certificate for ${toBelt}`}
          className={`${btn} border-[#dc2626]/30 bg-[#dc2626]/5 text-[#b91c1c] hover:bg-[#dc2626]/10`}
        >
          {busy === 'download' ? 'Preparing…' : 'Download'}
        </button>
      </div>

      <div
        id={panelId}
        className={`grid transition-[grid-template-rows] duration-300 ease-out ${
          open ? 'grid-rows-[1fr] mt-3' : 'grid-rows-[0fr]'
        }`}
        aria-hidden={!open}
      >
        <div className="overflow-hidden min-h-0">
          <div className="overflow-hidden rounded-xl border border-black/10 bg-gray-50">
            {previewUrl ? (
              <iframe
                title={`Grading certificate — ${toBelt}`}
                src={previewUrl}
                className="h-[min(70vh,560px)] min-h-[420px] w-full border-0"
              />
            ) : (
              <div className="flex min-h-[420px] items-center justify-center text-sm text-gray-500">
                Preparing certificate…
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
