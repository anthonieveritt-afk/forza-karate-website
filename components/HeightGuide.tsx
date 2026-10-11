// "Measure from head to toe" guide for suit sizes (Forza red/black).
// Plain <img> of a static SVG file with fixed width/height attributes, so it renders
// in every browser (Safari, in-car browsers) without relying on inline SVG + CSS sizing.
/* eslint-disable @next/next/no-img-element */
export function HeightGuide() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }} className="rounded-xl bg-red-50 border border-[#dc2626]/20 p-3 mt-2">
      <img src="/height-guide.svg" width={48} height={80} alt="Figure showing height measured from the top of the head to the feet" style={{ width: 48, height: 80, flexShrink: 0, display: 'block' }} />
      <p className="text-xs text-[#111111] leading-snug">
        <strong className="block text-sm text-[#dc2626]">Please choose based on your height from head to toe</strong>
        Sizes run 100 cm to 210 cm in 10 cm steps. If between sizes, go up.
      </p>
    </div>
  )
}
