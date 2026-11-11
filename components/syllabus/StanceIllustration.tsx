import type { StanceId } from '@/lib/syllabus'

// Simple stylised figure (white gi, white belt) plus a top-down feet diagram.
// To use a real photo instead, set `photo` on the item in lib/syllabus.ts.

type Cfg = { feetGap: number; toeAngle: number; knee: number; heelsTogether: boolean; toesTogether?: boolean; fists?: boolean; hands: 'side' | 'front' }

const cfg: Record<StanceId, Cfg> = {
  formal: { feetGap: 0, toeAngle: 0, knee: 0, heelsTogether: true, toesTogether: true, hands: 'side' },
  attention: { feetGap: 0, toeAngle: 30, knee: 0, heelsTogether: true, hands: 'side' },
  ready: { feetGap: 14, toeAngle: 0, knee: 0, heelsTogether: false, fists: true, hands: 'front' },
  sumo: { feetGap: 30, toeAngle: 45, knee: 14, heelsTogether: false, fists: true, hands: 'front' },
  horse: { feetGap: 30, toeAngle: 0, knee: 14, heelsTogether: false, fists: true, hands: 'front' },
}

function Foot({ x, angle, flip }: { x: number; angle: number; flip?: boolean }) {
  const a = flip ? -angle : angle
  return (
    <g transform={`translate(${x} 70) rotate(${a})`}>
      <path d="M0 0 C -7 0 -8 -14 -7 -24 C -6 -34 6 -34 7 -24 C 8 -14 7 0 0 0 Z" fill="#111111" />
    </g>
  )
}

export function StanceIllustration({ stance, label }: { stance: StanceId; label: string }) {
  const c = cfg[stance]
  const half = c.feetGap
  const kneeOut = c.knee
  const hipY = 108 + c.knee * 0.6
  const lx = 60 - half - 4
  const rx = 60 + half + 4
  const lFootX = c.heelsTogether ? 54 : 60 - half - 8
  const rFootX = c.heelsTogether ? 66 : 60 + half + 8
  return (
    <div className="grid grid-cols-2 gap-2 items-end" role="img" aria-label={`${label}: figure and feet position from above`}>
      <svg viewBox="0 0 120 200" className="w-full h-auto">
        <rect x="0" y="0" width="120" height="200" rx="10" fill="#fafaf9" />
        {/* head */}
        <circle cx="60" cy="28" r="12" fill="#f1d3b3" stroke="#111111" strokeWidth="1.5" />
        {/* jacket */}
        <path d={`M44 44 L76 44 L80 ${hipY} L40 ${hipY} Z`} fill="#ffffff" stroke="#111111" strokeWidth="1.5" />
        <path d="M52 44 L60 64 L68 44" fill="none" stroke="#111111" strokeWidth="1.2" />
        {/* belt */}
        <rect x="40" y={hipY - 16} width="40" height="6" fill="#ffffff" stroke="#111111" strokeWidth="1.2" />
        <path d={`M58 ${hipY - 10} l-4 12 M62 ${hipY - 10} l4 12`} stroke="#111111" strokeWidth="1.2" />
        {/* arms */}
        {c.hands === 'side' ? (
          <>
            <path d={`M44 46 L36 ${hipY + 4}`} stroke="#111111" strokeWidth="9" strokeLinecap="round" />
            <path d={`M44 46 L36 ${hipY + 4}`} stroke="#ffffff" strokeWidth="6.5" strokeLinecap="round" />
            <path d={`M76 46 L84 ${hipY + 4}`} stroke="#111111" strokeWidth="9" strokeLinecap="round" />
            <path d={`M76 46 L84 ${hipY + 4}`} stroke="#ffffff" strokeWidth="6.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            <path d={`M44 46 L38 ${hipY - 6}`} stroke="#111111" strokeWidth="9" strokeLinecap="round" />
            <path d={`M44 46 L38 ${hipY - 6}`} stroke="#ffffff" strokeWidth="6.5" strokeLinecap="round" />
            <path d={`M76 46 L82 ${hipY - 6}`} stroke="#111111" strokeWidth="9" strokeLinecap="round" />
            <path d={`M76 46 L82 ${hipY - 6}`} stroke="#ffffff" strokeWidth="6.5" strokeLinecap="round" />
            <circle cx="38" cy={hipY - 2} r="4.5" fill="#f1d3b3" stroke="#111111" strokeWidth="1.2" />
            <circle cx="82" cy={hipY - 2} r="4.5" fill="#f1d3b3" stroke="#111111" strokeWidth="1.2" />
          </>
        )}
        {/* legs */}
        {[
          [52, lx - kneeOut, lx],
          [68, rx + kneeOut, rx],
        ].map(([hx, kx, fx], i) => (
          <g key={i}>
            <path d={`M${hx} ${hipY} L${kx} ${hipY + 32 - c.knee} L${fx} 184`} fill="none" stroke="#111111" strokeWidth="12" strokeLinejoin="round" strokeLinecap="round" />
            <path d={`M${hx} ${hipY} L${kx} ${hipY + 32 - c.knee} L${fx} 184`} fill="none" stroke="#ffffff" strokeWidth="9.5" strokeLinejoin="round" strokeLinecap="round" />
          </g>
        ))}
        <rect x="0" y="186" width="120" height="2" fill="#dc2626" />
      </svg>
      <svg viewBox="0 0 120 100" className="w-full h-auto">
        <rect x="0" y="0" width="120" height="100" rx="10" fill="#fafaf9" />
        <text x="60" y="14" textAnchor="middle" fontSize="9" fill="#6b7280">Feet from above</text>
        <line x1="10" y1="72" x2="110" y2="72" stroke="#dc2626" strokeDasharray="3 3" strokeWidth="1" />
        <Foot x={lFootX} angle={c.toesTogether ? 0 : c.toeAngle} flip />
        <Foot x={rFootX} angle={c.toesTogether ? 0 : c.toeAngle} />
        <text x="60" y="92" textAnchor="middle" fontSize="8" fill="#6b7280">toes point up the page</text>
      </svg>
    </div>
  )
}
