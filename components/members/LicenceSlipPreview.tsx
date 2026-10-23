/**
 * Inline PDF preview + Download for a member's EKNGB / FKA licence slip.
 * Shown under the members sidebar when a slip is on file (any student).
 * Half-size preview: h-[min(35vh,320px)] min-h-[240px] (PR #57).
 */
export function LicenceSlipPreview({
  slipId,
  slipFileName,
}: {
  slipId: number
  slipFileName?: string | null
}) {
  if (!Number.isInteger(slipId) || slipId <= 0) return null

  return (
    <div className="bg-white rounded-2xl border border-black/8 p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm text-gray-600">Your EKNGB / FKA licence certificate</p>
        <a
          href={`/members/licence-slip/${slipId}?download=1`}
          className="inline-flex items-center rounded-lg border border-[#111111]/15 bg-white px-3 py-1.5 text-sm font-semibold text-[#111111] hover:bg-gray-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]/50"
          download={slipFileName || 'licence-slip.pdf'}
        >
          Download
        </a>
      </div>
      <div className="overflow-hidden rounded-xl border border-black/10 bg-gray-50">
        <iframe
          title="EKNGB / FKA licence certificate"
          src={`/members/licence-slip/${slipId}`}
          className="h-[min(35vh,320px)] min-h-[240px] w-full border-0"
        />
      </div>
    </div>
  )
}
