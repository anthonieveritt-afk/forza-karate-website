'use client'

import { useId } from 'react'

interface BeltIconProps {
  color: string
  border: string
  stripe?: string | null
  doubleStripe?: boolean
}

export default function BeltIcon({ color, border, stripe, doubleStripe }: BeltIconProps) {
  const uid = useId().replace(/:/g, '')
  const clipId = `bc-${uid}`

  // Three main shapes only — belt band, left tail, right tail
  // Knot body rendered separately as a plain filled block (no internal seams)
  const bandPath     = "M165.938,236.398c0,0,119.181,32.087,233.778,32.087c114.599,0,214.68-51.188,218.501-53.479c3.818-2.292,12.986,38.963,0.765,48.131c-12.225,9.168-80.983,48.896-216.208,48.896c-135.227,0-233.016-21.393-239.893-29.032C156.005,275.361,156.005,244.802,165.938,236.398z"
  const leftTailPath = "M178.924,365.513c0,0,125.293-76.398,200.929-106.959c75.635-30.56,30.561,29.031,30.561,29.031s-78.69,38.199-110.779,57.299c-32.088,19.101-81.745,50.424-87.857,51.188C205.664,396.835,178.924,365.513,178.924,365.513z"
  const rightTailPath= "M388.256,241.746c0,0,94.734,49.659,127.587,60.354c32.851,10.696,113.832,46.604,116.889,55.771s-27.503,30.559-27.503,30.559s-23.685-21.391-54.243-34.379c-30.56-12.986-83.273-34.379-112.306-48.131c-29.031-13.751-89.388-47.367-89.388-47.367L388.256,241.746z"
  // Plain knot block — single closed shape, no fold details
  const knotPath     = "M411.94,240.982c0,0-2.292,92.442-4.584,97.026c-2.293,4.584,42.783-12.988,43.546-18.336c0.765-5.349,6.877-50.423,2.293-55.007S416.523,238.69,411.94,240.982z"

  const allPaths = [bandPath, leftTailPath, rightTailPath, knotPath]

  // ── Stripe centerlines ──
  // Band stripe: bezier follows the mid-height curve of the horizontal band
  const bandStripe      = "M165,260 c0,0,119,32,234,30 c115,-1,215,-49,218,-51"
  // Left tail stripe: follows the diagonal angle of the left tail
  const leftTailStripe  = "M186,374 c52,-32,125,-66,200,-105"
  // Right tail stripe: follows the diagonal angle of the right tail
  const rightTailStripe = "M392,249 c80,42,138,62,202,108"

  // Double stripe offsets (upper and lower parallel to each centerline)
  const bandTop         = "M165,250 c0,0,119,31,234,29 c115,-1,215,-44,218,-46"
  const bandBot         = "M165,270 c0,0,119,33,234,31 c115,-1,215,-54,218,-56"
  const leftTop         = "M184,368 c52,-32,125,-66,200,-105"
  const leftBot         = "M188,380 c52,-32,125,-66,200,-105"
  const rightTop        = "M390,244 c80,42,138,62,202,108"
  const rightBot        = "M394,254 c80,42,138,62,202,108"

  return (
    <svg
      viewBox="145.5 205.5 500 200"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto drop-shadow-sm"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          {allPaths.map((d, i) => <path key={i} d={d} />)}
        </clipPath>
      </defs>

      {/* ── Belt body ── */}
      {/* Band, tails and knot all filled with same colour — knot merges cleanly */}
      <path d={bandPath}      fill={color} stroke={border} strokeWidth="3" strokeLinejoin="round" />
      <path d={leftTailPath}  fill={color} stroke={border} strokeWidth="3" strokeLinejoin="round" />
      <path d={rightTailPath} fill={color} stroke={border} strokeWidth="3" strokeLinejoin="round" />
      {/* Knot: filled + stroked, no inner details — plain block */}
      <path d={knotPath}      fill={color} stroke={border} strokeWidth="3" strokeLinejoin="round" />

      {/* ── Single stripe — curved lines clipped to belt ── */}
      {stripe && !doubleStripe && (
        <g clipPath={`url(#${clipId})`} stroke={stripe} fill="none" strokeWidth="17" strokeLinecap="butt" opacity="0.92">
          <path d={bandStripe} />
          <path d={leftTailStripe} />
          <path d={rightTailStripe} />
        </g>
      )}

      {/* ── Double stripe — two parallel curved lines ── */}
      {stripe && doubleStripe && (
        <g clipPath={`url(#${clipId})`} stroke={stripe} fill="none" strokeWidth="11" strokeLinecap="butt" opacity="0.92">
          <path d={bandTop} />
          <path d={bandBot} />
          <path d={leftTop} />
          <path d={leftBot} />
          <path d={rightTop} />
          <path d={rightBot} />
        </g>
      )}
    </svg>
  )
}
