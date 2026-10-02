export default function PageHeader({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: React.ReactNode }) {
  return (
    <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8 border-b border-black/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-0.5 bg-[#dc2626]" />
          <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">{eyebrow}</span>
        </div>
        <h1 className="text-5xl font-bold text-[#111111] mb-4">{title}</h1>
        {intro && <p className="text-xl text-gray-500 max-w-2xl">{intro}</p>}
      </div>
    </section>
  )
}
