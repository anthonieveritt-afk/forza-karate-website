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

  // All belt shape paths (from reference SVG, viewBox 145.5 205.5 500 200)
  const beltPaths = [
    "M348.15,259.254c0,0-1.476,4.952,0.21,7.375s24.86,1.791,24.86,1.791l-11.27-10.22L348.15,259.254z",
    "M165.938,236.398c0,0,119.181,32.087,233.778,32.087c114.599,0,214.68-51.188,218.501-53.479c3.818-2.292,12.986,38.963,0.765,48.131c-12.225,9.168-80.983,48.896-216.208,48.896c-135.227,0-233.016-21.393-239.893-29.032C156.005,275.361,156.005,244.802,165.938,236.398z",
    "M408.12,339.536c0,0-22.156-6.111-28.268-21.393c-6.111-15.278,58.827-29.795,58.827-29.795l-6.112,31.324L408.12,339.536z",
    "M351.585,315.852c0,0,30.561,21.393,35.144,19.101c4.584-2.292,58.827-36.671,58.827-36.671l-45.84-33.616l-50.423,38.2L351.585,315.852z",
    "M178.924,365.513c0,0,125.293-76.398,200.929-106.959c75.635-30.56,30.561,29.031,30.561,29.031s-78.69,38.199-110.779,57.299c-32.088,19.101-81.745,50.424-87.857,51.188C205.664,396.835,178.924,365.513,178.924,365.513z",
    "M412.073,240.503c0,0-5.29-1.851-14.146,8.46c-8.856,10.313,15.07,8.197,15.07,8.197L412.073,240.503z",
    "M388.256,241.746c0,0,94.734,49.659,127.587,60.354c32.851,10.696,113.832,46.604,116.889,55.771s-27.503,30.559-27.503,30.559s-23.685-21.391-54.243-34.379c-30.56-12.986-83.273-34.379-112.306-48.131c-29.031-13.751-89.388-47.367-89.388-47.367L388.256,241.746z",
    "M411.94,240.982c0,0-2.292,92.442-4.584,97.026c-2.293,4.584,42.783-12.988,43.546-18.336c0.765-5.349,6.877-50.423,2.293-55.007S416.523,238.69,411.94,240.982z",
  ]

  // Centerline paths that follow the curve of each belt section.
  // These are stroked (not filled) and clipped to the belt outline —
  // so the stroke naturally conforms to the belt shape.

  // Main belt band: centerline runs along the mid-height of the curved band
  const bandCenter   = "M165,260 c0,0,119,32,234,30 c115,-1,215,-49,218,-51"
  // Left tail: diagonal line through the centre of the hanging left tail
  const leftTail     = "M186,374 c50,-31,124,-65,200,-105"
  // Right tail: diagonal through the centre of the right tail
  const rightTail    = "M392,249 c80,42,138,63,202,108"
  // Knot centre: short horizontal run across the knot face
  const knotCenter   = "M353,300 l82,-7"
  // Knot body (vertical element): short vertical run down the centre column
  const knotBody     = "M421,248 l3,84"

  // For double stripe: two parallel paths offset ~1/3 and ~2/3 of belt height
  const bandTop      = "M165,250 c0,0,119,31,234,30 c115,-1,215,-45,218,-47"
  const bandBottom   = "M165,270 c0,0,119,32,234,31 c115,-1,215,-53,218,-54"
  const leftTailTop  = "M184,368 c50,-31,124,-65,200,-105"
  const leftTailBot  = "M188,381 c50,-31,124,-65,200,-105"
  const rightTailTop = "M390,244 c80,42,138,63,202,108"
  const rightTailBot = "M394,254 c80,42,138,63,202,108"
  const knotTop      = "M353,294 l82,-7"
  const knotBot      = "M353,306 l82,-7"
  const knotBodyTop  = "M418,248 l3,84"
  const knotBodyBot  = "M425,248 l3,84"

  return (
    <svg
      viewBox="145.5 205.5 500 200"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto drop-shadow-sm"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          {beltPaths.map((d, i) => <path key={i} d={d} />)}
        </clipPath>
      </defs>

      {/* ── Belt body ── */}
      <g fill={color} stroke={border} strokeWidth="3" strokeLinejoin="round">
        {beltPaths.map((d, i) => <path key={i} d={d} />)}
      </g>

      {/* ── Single stripe — follows belt curves ── */}
      {stripe && !doubleStripe && (
        <g clipPath={`url(#${clipId})`} stroke={stripe} fill="none" strokeWidth="17" strokeLinecap="butt" opacity="0.92">
          <path d={bandCenter} />
          <path d={leftTail} />
          <path d={rightTail} />
          <path d={knotCenter} />
          <path d={knotBody} />
        </g>
      )}

      {/* ── Double stripe — two curved lines ── */}
      {stripe && doubleStripe && (
        <g clipPath={`url(#${clipId})`} stroke={stripe} fill="none" strokeWidth="11" strokeLinecap="butt" opacity="0.92">
          <path d={bandTop} />
          <path d={bandBottom} />
          <path d={leftTailTop} />
          <path d={leftTailBot} />
          <path d={rightTailTop} />
          <path d={rightTailBot} />
          <path d={knotTop} />
          <path d={knotBot} />
          <path d={knotBodyTop} />
          <path d={knotBodyBot} />
        </g>
      )}
    </svg>
  )
}
