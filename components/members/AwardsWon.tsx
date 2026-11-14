'use client'

import { useEffect, useId, useRef, useState } from 'react'
import { FitDocumentPreview } from './FitDocumentPreview'
import { ShareCertificate } from './ShareCertificate'
import { awardFileBase, awardHeadline, awardShareText, awardsEmptyText, formatAwardDay, type PortalAward, type UpcomingRelease } from '@/lib/members/awards'

const RING: Record<string, string> = { '1st': 'ring-amber-400', '2nd': 'ring-gray-300', '3rd': 'ring-orange-600' }

async function makePdf(a: PortalAward): Promise<Blob> {
  const [{ buildAwardCertificatesPdf, DESIGN_CITATION }, { loadAwardAssets }] = await Promise.all([
    import('@/lib/award-certificate'),
    import('@/lib/award-certificate-assets'),
  ])
  const assets = await loadAwardAssets()
  const metal = a.place === '2nd' ? 'silver' : a.place === '3rd' ? 'bronze' : 'gold'
  const doc = buildAwardCertificatesPdf(assets, [
    {
      studentName: a.studentName,
      awardTitle: a.awardTitle,
      place: a.place,
      metal,
      club: a.club || undefined,
      date: a.certificateDate,
      citation: a.citation || DESIGN_CITATION,
      style: 'classic',
      chiefSignature: a.chiefSignature ? { name: a.chiefSignature } : {},
      repSignature: a.repSignature ? { name: a.repSignature } : {},
      showBadges: true,
    },
  ])
  return doc.output('blob')
}

function AwardCard({ a }: { a: PortalAward }) {
  const panelId = useId()
  const [open, setOpen] = useState(false)
  const [busy, setBusy] = useState<null | 'view' | 'download'>(null)
  const [url, setUrl] = useState<string | null>(null)
  const pdfRef = useRef<Promise<Blob> | null>(null)
  const pngRef = useRef<Promise<Blob> | null>(null)
  const urlRef = useRef<string | null>(null)

  useEffect(
    () => () => {
      if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    },
    [],
  )

  const pdf = () => {
    if (!pdfRef.current) pdfRef.current = makePdf(a).catch((e) => { pdfRef.current = null; throw e })
    return pdfRef.current
  }
  const png = () => {
    if (!pngRef.current) {
      pngRef.current = (async () => {
        const { pdfToPng } = await import('@/lib/members/share-image')
        return pdfToPng(await pdf())
      })().catch((e) => { pngRef.current = null; throw e })
    }
    return pngRef.current
  }
  const ensureUrl = async () => {
    if (urlRef.current) return urlRef.current
    const u = URL.createObjectURL(await pdf())
    urlRef.current = u
    setUrl(u)
    return u
  }

  async function view() {
    if (open) return setOpen(false)
    setBusy('view')
    try {
      await ensureUrl()
      setOpen(true)
    } catch {
      alert('Sorry, the certificate could not be opened. Please try again.')
    } finally {
      setBusy(null)
    }
  }

  async function download() {
    setBusy('download')
    try {
      const { downloadBlob } = await import('@/lib/members/share-image')
      downloadBlob(await pdf(), `${awardFileBase(a)}.pdf`)
    } catch {
      alert('Sorry, the certificate could not be downloaded. Please try again.')
    } finally {
      setBusy(null)
    }
  }

  const btn =
    'inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]/50'

  return (
    <li className="rounded-xl border border-black/8 p-4">
      <div className="flex items-start gap-3">
        <span className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-full bg-[#111111] text-white ring-[3px] ${RING[a.place] ?? 'ring-gray-200'}`} aria-hidden>
          <span className="text-sm font-bold leading-none">{a.place || '★'}</span>
          {a.place && <span className="text-[8px] uppercase tracking-wider">place</span>}
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-[#111111]">{awardHeadline(a)}</p>
          <p className="text-sm text-gray-500">
            {a.eventName ? `${a.eventName} · ` : ''}
            {formatAwardDay(a.certificateDate)}
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={view} disabled={busy !== null} aria-expanded={open} aria-controls={panelId} className={`${btn} border-black/10 bg-white text-[#111111] hover:bg-gray-50`}>
          {busy === 'view' ? 'Opening…' : open ? 'Hide certificate' : 'View certificate'}
        </button>
        <button type="button" onClick={download} disabled={busy !== null} className={`${btn} border-[#dc2626]/30 bg-[#dc2626]/5 text-[#b91c1c] hover:bg-[#dc2626]/10`}>
          {busy === 'download' ? 'Preparing…' : 'Download PDF'}
        </button>
        <ShareCertificate getImage={png} filename={awardFileBase(a)} defaultText={awardShareText(a)} label={`${a.awardTitle} certificate`} />
      </div>
      {open && url && (
        <div id={panelId} className="mt-3 overflow-hidden rounded-xl border border-black/10 bg-gray-50">
          <FitDocumentPreview title={`${a.awardTitle} certificate`} src={url} />
        </div>
      )}
    </li>
  )
}

/** Portal: certificates the club has released to this profile. */
export function AwardsWon({ awards, upcoming }: { awards: PortalAward[]; upcoming: UpcomingRelease | null }) {
  return (
    <div className="rounded-2xl border border-black/8 bg-white p-6 shadow-sm sm:p-8" id="awards-won">
      <div className="mb-4 flex items-center gap-2">
        <div className="h-0.5 w-6 bg-[#dc2626]" />
        <h2 className="text-lg font-bold text-[#111111]">Awards won</h2>
      </div>
      {awards.length ? (
        <ul className="grid gap-3 md:grid-cols-2">
          {awards.map((a) => (
            <AwardCard key={a.id} a={a} />
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-black/15 bg-gray-50 p-4 text-sm text-gray-600">
          <span aria-hidden="true">🏆 </span>
          {awardsEmptyText(upcoming)}
        </p>
      )}
    </div>
  )
}
