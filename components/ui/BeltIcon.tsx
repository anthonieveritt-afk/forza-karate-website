'use client'

import { useId } from 'react'

interface BeltIconProps {
  color: string
  border: string
  stripe?: string | null
  doubleStripe?: boolean
}

export default function BeltIcon({ color, border, stripe, doubleStripe }: BeltIconProps) {
  const uid    = useId().replace(/:/g, '')
  const clipId = `bc-${uid}`
  const maskId = `bm-${uid}`

  const bandPath      = "M165.938,236.398c0,0,119.181,32.087,233.778,32.087c114.599,0,214.68-51.188,218.501-53.479c3.818-2.292,12.986,38.963,0.765,48.131c-12.225,9.168-80.983,48.896-216.208,48.896c-135.227,0-233.016-21.393-239.893-29.032C156.005,275.361,156.005,244.802,165.938,236.398z"
  const leftTailPath  = "M178.924,365.513c0,0,125.293-76.398,200.929-106.959c75.635-30.56,30.561,29.031,30.561,29.031s-78.69,38.199-110.779,57.299c-32.088,19.101-81.745,50.424-87.857,51.188C205.664,396.835,178.924,365.513,178.924,365.513z"
  const rightTailPath = "M388.256,241.746c0,0,94.734,49.659,127.587,60.354c32.851,10.696,113.832,46.604,116.889,55.771s-27.503,30.559-27.503,30.559s-23.685-21.391-54.243-34.379c-30.56-12.986-83.273-34.379-112.306-48.131c-29.031-13.751-89.388-47.367-89.388-47.367L388.256,241.746z"
  const knotPath      = "M411.94,240.982c0,0-2.292,92.442-4.584,97.026c-2.293,4.584,42.783-12.988,43.546-18.336c0.765-5.349,6.877-50.423,2.293-55.007S416.523,238.69,411.94,240.982z"

  const allPaths = [bandPath, leftTailPath, rightTailPath, knotPath]

  // The knot sits in roughly this bounding box (viewBox coords).
  // The mask blacks this zone out so stripes never cross it.
  const KX = 330   // knot left edge
  const KY = 230   // knot top edge
  const KW = 140   // knot width
  const KH = 120   // knot height

  // ── Stripe centerlines (follow belt curves, clipped to belt + masked away from knot) ──

  // Left half of band: stops before the knot
  const bandLeft        = "M165,260 c0,0,95,28,170,32"
  // Right half of band: picks up after the knot — y=275 is the true belt centre at x=472
  const bandRight       = "M472,275 c60,-8,100,-22,146,-36"
  // Left tail: centred down the diagonal belt
  const leftTailStripe  = "M190,382 c40,-25,90,-52,140,-82"
  // Right tail: slope corrected to follow the belt centre (dy/dx ≈ 0.48)
  const rightTailStripe = "M490,305 c50,26,90,44,143,68"

  // Double stripe offsets (either side of each centreline)
  const bandLeftTop     = "M165,250 c0,0,95,27,170,31"
  const bandLeftBot     = "M165,270 c0,0,95,29,170,33"
  const bandRightTop    = "M472,267 c60,-8,100,-22,146,-38"
  const bandRightBot    = "M472,283 c60,-8,100,-22,146,-34"
  const leftTop         = "M190,374 c40,-25,90,-52,140,-82"
  const leftBot         = "M190,390 c40,-25,90,-52,140,-82"
  const rightTop        = "M490,297 c50,26,90,44,143,68"
  const rightBot        = "M490,313 c50,26,90,44,143,68"

  return (
    <svg
      viewBox="145.5 205.5 500 200"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto drop-shadow-sm"
      aria-hidden="true"
    >
      <defs>
        {/* Clip to belt outline */}
        <clipPath id={clipId}>
          {allPaths.map((d, i) => <path key={i} d={d} />)}
        </clipPath>

        {/* Mask: white everywhere EXCEPT the knot zone (black = hidden) */}
        <mask id={maskId}>
          <rect x="145.5" y="205.5" width="500" height="200" fill="white" />
          <rect x={KX} y={KY} width={KW} height={KH} fill="black" />
        </mask>
      </defs>

      {/* ── Belt body ── */}
      <path d={bandPath}      fill={color} stroke={border} strokeWidth="3" strokeLinejoin="round" />
      <path d={leftTailPath}  fill={color} stroke={border} strokeWidth="3" strokeLinejoin="round" />
      <path d={rightTailPath} fill={color} stroke={border} strokeWidth="3" strokeLinejoin="round" />
      {/* Knot: plain block, no inner detail */}
      <path d={knotPath}      fill={color} stroke={border} strokeWidth="3" strokeLinejoin="round" />

      {/* ── Single stripe — clipped to belt, masked away from knot ── */}
      {stripe && !doubleStripe && (
        <g
          clipPath={`url(#${clipId})`}
          mask={`url(#${maskId})`}
          stroke={stripe} fill="none" strokeWidth="17" strokeLinecap="butt" opacity="0.92"
        >
          <path d={bandLeft} />
          <path d={bandRight} />
          <path d={leftTailStripe} />
          <path d={rightTailStripe} />
        </g>
      )}

      {/* ── Double stripe — clipped to belt, masked away from knot ── */}
      {stripe && doubleStripe && (
        <g
          clipPath={`url(#${clipId})`}
          mask={`url(#${maskId})`}
          stroke={stripe} fill="none" strokeWidth="11" strokeLinecap="butt" opacity="0.92"
        >
          <path d={bandLeftTop} />
          <path d={bandLeftBot} />
          <path d={bandRightTop} />
          <path d={bandRightBot} />
          <path d={leftTop} />
          <path d={leftBot} />
          <path d={rightTop} />
          <path d={rightBot} />
        </g>
      )}
    </svg>
  )
}
