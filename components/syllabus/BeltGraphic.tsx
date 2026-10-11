import { TRAINED_STRIPES, type Grade } from '@/lib/syllabus-full'

// Belt with optional automatic stripe running along it, and the 5 trained progress stripes as small bars at the tip.
export function BeltGraphic({ g, className = 'w-40' }: { g: Grade; className?: string }) {
  const count = g.autoStripe?.count ?? 1
  return (
    <svg viewBox="0 0 160 28" className={`${className} h-auto`} role="img"
      aria-label={`${g.belt}${g.trainedStripes ? ', with 5 progress stripes at the end' : ''}`}>
      <rect x="1" y="4" width="158" height="20" rx="3" fill={g.hex} stroke="#111111" strokeWidth="1.5" />
      {g.autoStripe && Array.from({ length: count }).map((_, i) => {
        const h = count === 1 ? 5 : 3.5
        const y = count === 1 ? 11.5 : 9 + i * 6
        return <rect key={i} x="2" y={y} width={g.trainedStripes ? 114 : 156} height={h} fill={g.autoStripe!.hex}
          stroke="#111111" strokeWidth="0.5" strokeDasharray={g.autoStripe!.unknown ? '3 2' : undefined} />
      })}
      {g.trainedStripes && (
        <>
          <rect x="118" y="4" width="41" height="20" fill="#111111" opacity="0.08" />
          {TRAINED_STRIPES.map((s, i) => (
            <rect key={s.n} x={121 + i * 7.5} y="6" width="5" height="16" fill={s.hex} stroke="#111111" strokeWidth="0.75" />
          ))}
        </>
      )}
    </svg>
  )
}
