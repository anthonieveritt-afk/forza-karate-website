'use client'

import { useEffect, useId, useState } from 'react'
import { SHARE_URL, shareLinks } from '@/lib/members/awards'

/**
 * Share a certificate: native share sheet with the picture on phones (Web Share API),
 * plus fallbacks — download the picture, copy the text, Facebook / X / WhatsApp links.
 * The link is always https://www.forzakarate.co.uk.
 */
export function ShareCertificate({
  getImage,
  filename,
  defaultText,
  label,
}: {
  getImage: () => Promise<Blob>
  filename: string
  defaultText: string
  label: string
}) {
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const [text, setText] = useState(defaultText)
  const [busy, setBusy] = useState<null | 'share' | 'download'>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [nativeFiles, setNativeFiles] = useState(false)

  useEffect(() => {
    try {
      const n = navigator as Navigator & { canShare?: (d: ShareData) => boolean }
      const probe = new File([new Uint8Array([0])], 'probe.png', { type: 'image/png' })
      // eslint-disable-next-line react-hooks/set-state-in-effect -- feature detection after mount (no SSR navigator)
      setNativeFiles(typeof n.share === 'function' && !!n.canShare?.({ files: [probe] }))
    } catch {
      setNativeFiles(false)
    }
  }, [])

  async function file(): Promise<File> {
    const blob = await getImage()
    return new File([blob], `${filename}.png`, { type: 'image/png' })
  }

  async function shareNative() {
    setBusy('share')
    setMsg(null)
    try {
      const f = await file()
      await navigator.share({ files: [f], text, title: label })
    } catch (e) {
      if ((e as Error)?.name !== 'AbortError') setMsg('Sharing did not work here. Download the picture and add it to your post instead.')
    } finally {
      setBusy(null)
    }
  }

  async function download() {
    setBusy('download')
    setMsg(null)
    try {
      const { downloadBlob } = await import('@/lib/members/share-image')
      downloadBlob(await getImage(), `${filename}.png`)
      setMsg('Picture saved. Add it to your post, then paste the text.')
    } catch {
      setMsg('Sorry, the picture could not be made. Please try again.')
    } finally {
      setBusy(null)
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      setMsg('Text copied.')
    } catch {
      setMsg('Copy did not work. Select the text and copy it.')
    }
  }

  const links = shareLinks(text, SHARE_URL)
  const btn =
    'inline-flex items-center justify-center gap-1 rounded-lg border px-3 py-2 text-sm font-semibold transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]/50'

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? `Close sharing for ${label}` : `Share ${label}`}
        className="inline-flex items-center gap-1 rounded-lg border border-[#111111] bg-[#111111] px-2.5 py-1 text-xs font-semibold text-white hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]/50"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="M8.6 13.5l6.8 4M15.4 6.5l-6.8 4" />
        </svg>
        {open ? 'Close share' : 'Share'}
      </button>
      {open && (
        <div id={panelId} className="mt-3 w-full basis-full rounded-xl border border-black/10 bg-white p-4 shadow-sm" role="region" aria-label={`Share ${label}`}>
          <p className="text-sm font-bold text-[#111111]">Share your certificate</p>
          <label className="mt-2 block text-xs font-semibold text-gray-600" htmlFor={`${panelId}-text`}>
            Your post
          </label>
          <textarea
            id={`${panelId}-text`}
            className="mt-1 w-full rounded-lg border border-black/15 p-2 text-sm text-[#111111]"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            {nativeFiles && (
              <button type="button" onClick={shareNative} disabled={busy !== null} className={`${btn} col-span-2 border-[#dc2626] bg-[#dc2626] text-white hover:bg-[#b91c1c]`}>
                {busy === 'share' ? 'Preparing…' : 'Share picture…'}
              </button>
            )}
            <button type="button" onClick={download} disabled={busy !== null} className={`${btn} ${nativeFiles ? 'border-black/10 bg-white text-[#111111]' : 'col-span-2 border-[#dc2626] bg-[#dc2626] text-white hover:bg-[#b91c1c]'}`}>
              {busy === 'download' ? 'Preparing…' : 'Download picture'}
            </button>
            <button type="button" onClick={copy} className={`${btn} border-black/10 bg-white text-[#111111] hover:bg-gray-50`}>
              Copy text
            </button>
            <a href={links.facebook} target="_blank" rel="noopener noreferrer" className={`${btn} border-[#1877f2]/30 bg-[#1877f2]/5 text-[#1559b5]`}>
              Facebook
            </a>
            <a href={links.x} target="_blank" rel="noopener noreferrer" className={`${btn} border-black/20 bg-black/5 text-black`}>
              X
            </a>
            <a href={links.whatsapp} target="_blank" rel="noopener noreferrer" className={`${btn} border-[#25d366]/40 bg-[#25d366]/10 text-[#128c4a]`}>
              WhatsApp
            </a>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Facebook, X and WhatsApp links share the club website ({SHARE_URL.replace('https://', '')}). To include the certificate picture, download it first and attach it to your post.
          </p>
          {msg && <p className="mt-2 text-xs font-medium text-[#111111]" role="status">{msg}</p>}
        </div>
      )}
    </>
  )
}
