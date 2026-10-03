import BasketButton from './BasketButton'

export default function StoreHeader({ eyebrow = 'Store', title, intro }: { eyebrow?: string; title: string; intro?: React.ReactNode }) {
  return (
    <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 border-b border-black/5">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">{eyebrow}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#111111] mb-4">{title}</h1>
          {intro && <div className="text-lg text-gray-500 max-w-2xl">{intro}</div>}
        </div>
        <div className="shrink-0">
          <BasketButton />
        </div>
      </div>
    </section>
  )
}
