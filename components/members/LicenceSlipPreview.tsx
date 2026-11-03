/**
 * Inline PDF preview + Download for a member's EKNGB / FKA licence slip.
 * Shown under the members sidebar when a slip is on file (any student).
 * Preview renders as a fit-to-width image (phones, iPad, Android tablets, desktop).
 */
import { FitDocumentPreview } from './FitDocumentPreview'
export function LicenceSlipPreview({
  slipId,
  slipFileName,
  title = 'Your EKNGB / FKA licence certificate',
}: {
  slipId: number
  slipFileName?: string | null
  /** Heading + preview title, e.g. "Sporting licence (Sport:80)". */
  title?: string
}) {
  if (!Number.isInteger(slipId) || slipId <= 0) return null
  // Apple Wallet passes can't be previewed inline — offer the file only.
  const isPass = /\.pkpass$/i.test(slipFileName ?? '')

  return (
    <div className="bg-white rounded-2xl border border-black/8 p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-600">{title}</p>
        <a
          href={`/members/licence-slip/${slipId}?download=1`}
          className="inline-flex items-center rounded-lg border border-[#111111]/15 bg-white px-3 py-1.5 text-sm font-semibold text-[#111111] hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]/50"
          download={slipFileName || 'licence-slip.pdf'}
        >
          {isPass ? 'Open pass' : 'Download'}
        </a>
        {isPass && (
          <a
            href={`/members/licence-slip/${slipId}/image?download=1`}
            className="inline-flex items-center rounded-lg border border-[#111111]/15 bg-white px-3 py-1.5 text-sm font-semibold text-[#111111] hover:bg-gray-50"
            download={`sporting-licence-${slipId}.png`}
          >
            Download image
          </a>
        )}
      </div>
      {isPass ? (
        <div className="space-y-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/members/licence-slip/${slipId}/image`}
            alt={title}
            className="mx-auto w-full max-w-xs rounded-xl border border-black/10"
          />
          <p className="text-xs text-gray-500">Open pass adds it to Apple Wallet on iPhone. Download image saves a picture you can show on any phone.</p>
        </div>
      ) : (
      <div className="overflow-hidden rounded-xl border border-black/10 bg-gray-50">
        <FitDocumentPreview title={title} src={`/members/licence-slip/${slipId}`} />
      </div>
      )}
    </div>
  )
}
