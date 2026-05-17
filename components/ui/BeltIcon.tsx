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

  // All belt paths from reference SVG (viewBox 145.5 205.5 500 200)
  const beltPaths = [
    // Knot loop detail
    "M348.15,259.254c0,0-1.476,4.952,0.21,7.375s24.86,1.791,24.86,1.791l-11.27-10.22L348.15,259.254z",
    // Main belt band
    "M165.938,236.398c0,0,119.181,32.087,233.778,32.087c114.599,0,214.68-51.188,218.501-53.479c3.818-2.292,12.986,38.963,0.765,48.131c-12.225,9.168-80.983,48.896-216.208,48.896c-135.227,0-233.016-21.393-239.893-29.032C156.005,275.361,156.005,244.802,165.938,236.398z",
    // Knot right junction
    "M408.12,339.536c0,0-22.156-6.111-28.268-21.393c-6.111-15.278,58.827-29.795,58.827-29.795l-6.112,31.324L408.12,339.536z",
    // Knot centre
    "M351.585,315.852c0,0,30.561,21.393,35.144,19.101c4.584-2.292,58.827-36.671,58.827-36.671l-45.84-33.616l-50.423,38.2L351.585,315.852z",
    // Left tail
    "M178.924,365.513c0,0,125.293-76.398,200.929-106.959c75.635-30.56,30.561,29.031,30.561,29.031s-78.69,38.199-110.779,57.299c-32.088,19.101-81.745,50.424-87.857,51.188C205.664,396.835,178.924,365.513,178.924,365.513z",
    // Small knot piece
    "M412.073,240.503c0,0-5.29-1.851-14.146,8.46c-8.856,10.313,15.07,8.197,15.07,8.197L412.073,240.503z",
    // Right tail
    "M388.256,241.746c0,0,94.734,49.659,127.587,60.354c32.851,10.696,113.832,46.604,116.889,55.771s-27.503,30.559-27.503,30.559s-23.685-21.391-54.243-34.379c-30.56-12.986-83.273-34.379-112.306-48.131c-29.031-13.751-89.388-47.367-89.388-47.367L388.256,241.746z",
    // Knot body
    "M411.94,240.982c0,0-2.292,92.442-4.584,97.026c-2.293,4.584,42.783-12.988,43.546-18.336c0.765-5.349,6.877-50.423,2.293-55.007S416.523,238.69,411.94,240.982z",
  ]

  const clipId = `belt-clip-${uid}`

  return (
    <svg
      viewBox="145.5 205.5 500 200"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto drop-shadow-sm"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          {beltPaths.map((d, i) => (
            <path key={i} d={d} />
          ))}
        </clipPath>
      </defs>

      {/* Belt body — all paths filled with belt colour */}
      <g fill={color} stroke={border} strokeWidth="3" strokeLinejoin="round">
        {beltPaths.map((d, i) => (
          <path key={i} d={d} />
        ))}
      </g>

      {/* Single stripe — horizontal band clipped to belt shape */}
      {stripe && !doubleStripe && (
        <rect
          x="145.5" y="277" width="500" height="22"
          fill={stripe} opacity="0.9"
          clipPath={`url(#${clipId})`}
        />
      )}

      {/* Double stripe — two horizontal bands */}
      {stripe && doubleStripe && (
        <>
          <rect x="145.5" y="262" width="500" height="14"
            fill={stripe} opacity="0.9" clipPath={`url(#${clipId})`} />
          <rect x="145.5" y="284" width="500" height="14"
            fill={stripe} opacity="0.9" clipPath={`url(#${clipId})`} />
        </>
      )}
    </svg>
  )
}
