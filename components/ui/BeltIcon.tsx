interface BeltIconProps {
  color: string
  border: string
  stripe?: string | null
  doubleStripe?: boolean
}

export default function BeltIcon({ color, border, stripe, doubleStripe }: BeltIconProps) {
  // Darken the border slightly for knot depth lines
  const foldOpacity = color === '#ffffff' ? '0.12' : '0.22'

  return (
    <svg
      viewBox="0 0 100 46"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto drop-shadow-sm"
      aria-hidden="true"
    >
      {/* ── Left tail ── */}
      <rect x="1" y="14" width="36" height="18" rx="3"
        fill={color} stroke={border} strokeWidth="1.2" />

      {/* ── Right tail ── */}
      <rect x="63" y="14" width="36" height="18" rx="3"
        fill={color} stroke={border} strokeWidth="1.2" />

      {/* ── Knot background (slightly taller than tails) ── */}
      <rect x="33" y="8" width="34" height="30" rx="3"
        fill={color} stroke={border} strokeWidth="1.2" />

      {/* ── Knot fold lines (vertical crease marks) ── */}
      <rect x="44" y="8" width="3" height="30" rx="1"
        fill={border} opacity={foldOpacity} />
      <rect x="53" y="8" width="3" height="30" rx="1"
        fill={border} opacity={foldOpacity} />

      {/* ── Stripe: single ── */}
      {stripe && !doubleStripe && (
        <>
          {/* Left tail stripe */}
          <rect x="1" y="20.5" width="36" height="5" rx="0"
            fill={stripe} opacity="0.92" />
          {/* Right tail stripe */}
          <rect x="63" y="20.5" width="36" height="5" rx="0"
            fill={stripe} opacity="0.92" />
          {/* Knot stripe */}
          <rect x="33" y="20.5" width="34" height="5" rx="0"
            fill={stripe} opacity="0.92" />
        </>
      )}

      {/* ── Stripe: double (two stripe) ── */}
      {stripe && doubleStripe && (
        <>
          {/* Left tail */}
          <rect x="1" y="16" width="36" height="4" fill={stripe} opacity="0.92" />
          <rect x="1" y="26" width="36" height="4" fill={stripe} opacity="0.92" />
          {/* Right tail */}
          <rect x="63" y="16" width="36" height="4" fill={stripe} opacity="0.92" />
          <rect x="63" y="26" width="36" height="4" fill={stripe} opacity="0.92" />
          {/* Knot */}
          <rect x="33" y="16" width="34" height="4" fill={stripe} opacity="0.92" />
          <rect x="33" y="26" width="34" height="4" fill={stripe} opacity="0.92" />
        </>
      )}
    </svg>
  )
}
