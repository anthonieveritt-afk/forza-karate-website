const belts = [
  { kyu: '9th Kyu', name: 'White', color: 'bg-white border-2 border-gray-200' },
  { kyu: '8th Kyu', name: 'Orange', color: 'bg-orange-400' },
  { kyu: '7th Kyu', name: 'Red', color: 'bg-red-500' },
  { kyu: '6th Kyu', name: 'Yellow', color: 'bg-yellow-400' },
  { kyu: '5th Kyu', name: 'Green', color: 'bg-green-500' },
  { kyu: '4th Kyu', name: 'Blue', color: 'bg-blue-500' },
  { kyu: '3rd Kyu', name: 'Purple', color: 'bg-purple-600' },
  { kyu: '2nd Kyu', name: 'Brown', color: 'bg-amber-800' },
  { kyu: '1st Kyu', name: 'Brown', color: 'bg-amber-900' },
  { kyu: '1st Dan', name: 'Black', color: 'bg-black' },
]

export default function BeltJourney() {
  return (
    <section className="bg-[#fafaf9] py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-0.5 bg-[#dc2626]" />
            <span className="text-sm font-medium text-[#dc2626] uppercase tracking-wider">
              Belt Progression
            </span>
            <div className="w-8 h-0.5 bg-[#dc2626]" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#111111] mb-4">
            The journey to black belt
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Every champion started with a white belt. Progress is earned through
            consistent attendance, technical skill, and personal growth.
          </p>
        </div>

        {/* Belt dots */}
        <div className="flex flex-wrap justify-center gap-6">
          {belts.map((belt, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full ${belt.color} shadow-sm`}
                title={belt.name}
              />
              <span className="text-xs text-gray-500 font-medium">{belt.kyu}</span>
              <span className="text-xs text-[#111111] font-semibold">{belt.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
