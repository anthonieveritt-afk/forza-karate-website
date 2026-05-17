interface BeltIconProps {
  color: string
  border: string
  stripe?: string | null
  doubleStripe?: boolean
}

export default function BeltIcon({ color, border, stripe, doubleStripe }: BeltIconProps) {
  const foldOpacity = color === '#ffffff' ? '0.12' : '0.20'

  return (
    <svg
      viewBox="0 0 80 92"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto drop-shadow-sm"
      aria-hidden="true"
    >
      {/* ── Horizontal wrap (belt around the waist) ── */}
      <rect x="1" y="3" width="78" height="16" rx="3"
        fill={color} stroke={border} strokeWidth="1.2" />

      {/* ── Knot (front centre, overlaps the wrap) ── */}
      <rect x="22" y="10" width="36" height="28" rx="3"
        fill={color} stroke={border} strokeWidth="1.2" />

      {/* Knot fold lines */}
      <rect x="33" y="10" width="3" height="28" rx="1"
        fill={border} opacity={foldOpacity} />
      <rect x="44" y="10" width="3" height="28" rx="1"
        fill={border} opacity={foldOpacity} />

      {/* ── Left tail hanging down ── */}
      <rect x="26" y="36" width="12" height="52" rx="3"
        fill={color} stroke={border} strokeWidth="1.2" />

      {/* ── Right tail hanging down ── */}
      <rect x="42" y="36" width="12" height="52" rx="3"
        fill={color} stroke={border} strokeWidth="1.2" />

      {/* ── Single stripe ── */}
      {stripe && !doubleStripe && (
        <>
          {/* Wrap */}
          <rect x="1"  y="9"  width="78" height="4" fill={stripe} opacity="0.92" />
          {/* Knot */}
          <rect x="22" y="22" width="36" height="4" fill={stripe} opacity="0.92" />
          {/* Left tail */}
          <rect x="26" y="56" width="12" height="4" fill={stripe} opacity="0.92" />
          {/* Right tail */}
          <rect x="42" y="56" width="12" height="4" fill={stripe} opacity="0.92" />
        </>
      )}

      {/* ── Double stripe ── */}
      {stripe && doubleStripe && (
        <>
          {/* Wrap */}
          <rect x="1"  y="7"  width="78" height="3.5" fill={stripe} opacity="0.92" />
          <rect x="1"  y="13" width="78" height="3.5" fill={stripe} opacity="0.92" />
          {/* Knot */}
          <rect x="22" y="18" width="36" height="3.5" fill={stripe} opacity="0.92" />
          <rect x="22" y="26" width="36" height="3.5" fill={stripe} opacity="0.92" />
          {/* Left tail */}
          <rect x="26" y="50" width="12" height="3.5" fill={stripe} opacity="0.92" />
          <rect x="26" y="60" width="12" height="3.5" fill={stripe} opacity="0.92" />
          {/* Right tail */}
          <rect x="42" y="50" width="12" height="3.5" fill={stripe} opacity="0.92" />
          <rect x="42" y="60" width="12" height="3.5" fill={stripe} opacity="0.92" />
        </>
      )}
    </svg>
  )
}
