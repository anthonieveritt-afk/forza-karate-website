'use client'

import { useState } from 'react'

export function CertificateButtons({ studentName, toBelt, gradingDate }: { studentName: string; toBelt: string; gradingDate: string }) {
  const [busy, setBusy] = useState<null | 'view' | 'download'>(null)

  async function view() {
    setBusy('view')
    const win = window.open('', '_blank')
    try {
      const { generateCertificateBlobUrl } = await import('@/lib/certificate')
      const url = await generateCertificateBlobUrl(studentName, toBelt, gradingDate)
      if (win) win.location.href = url
      else window.open(url, '_blank')
    } catch {
      win?.close()
      alert('Sorry, the certificate could not be opened. Please try again.')
    } finally {
      setBusy(null)
    }
  }

  async function download() {
    setBusy('download')
    try {
      const { generateCertificateBlobUrl, getCertificateFilename } = await import('@/lib/certificate')
      const url = await generateCertificateBlobUrl(studentName, toBelt, gradingDate)
      const a = document.createElement('a')
      a.href = url
      a.download = getCertificateFilename(studentName, toBelt)
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 60_000)
    } catch {
      alert('Sorry, the certificate could not be downloaded. Please try again.')
    } finally {
      setBusy(null)
    }
  }

  const btn =
    'inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]/50'
  return (
    <div className="mt-3 flex flex-wrap gap-2">
      <button type="button" onClick={view} disabled={busy !== null} aria-label={`View certificate for ${toBelt}`}
        className={`${btn} border-black/10 bg-white text-[#111111] hover:bg-gray-50`}>
        {busy === 'view' ? 'Opening…' : 'View certificate'}
      </button>
      <button type="button" onClick={download} disabled={busy !== null} aria-label={`Download certificate for ${toBelt}`}
        className={`${btn} border-[#dc2626]/30 bg-[#dc2626]/5 text-[#b91c1c] hover:bg-[#dc2626]/10`}>
        {busy === 'download' ? 'Preparing…' : 'Download'}
      </button>
    </div>
  )
}
