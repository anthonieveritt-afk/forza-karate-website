const stats = [
  { value: '200+', label: 'Members' },
  { value: '2', label: 'Dojos' },
  { value: '40', label: 'Weeks per Year' },
  { value: 'FKA', label: 'Affiliated' },
]

export default function StatsBand() {
  return (
    <section className="bg-[#111111] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
