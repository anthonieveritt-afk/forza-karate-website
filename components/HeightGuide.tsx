// Small "measure from head to toe" guide for suit sizes (Forza red/black).
export function HeightGuide() {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-red-50 border border-[#dc2626]/15 p-2.5 mt-2">
      <svg viewBox="0 0 60 100" className="h-16 w-10 shrink-0" aria-hidden="true">
        <line x1="4" y1="6" x2="44" y2="6" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3 2" />
        <line x1="4" y1="96" x2="44" y2="96" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="3 2" />
        <g fill="none" stroke="#111111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="24" cy="14" r="7" />
          <path d="M24 21v36M24 30l-12 14M24 30l12 14M24 57l-9 38M24 57l9 38" />
        </g>
        <g fill="#dc2626">
          <line x1="53" y1="10" x2="53" y2="92" stroke="#dc2626" strokeWidth="1.5" />
          <path d="M53 6l-3.5 6h7z M53 96l-3.5-6h7z" />
        </g>
      </svg>
      <p className="text-xs text-[#111111] leading-snug">
        <strong className="block text-[#dc2626]">Please choose based on your height from head to toe</strong>
        Sizes run 100 cm to 210 cm in 10 cm steps. If between sizes, go up.
      </p>
    </div>
  )
}
