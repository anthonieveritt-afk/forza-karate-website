const belts = [
  { kyu: '18th Kyu', name: 'White Belt',                   bg: '#ffffff', border: '#d1d5db', stripe: null },
  { kyu: '17th Kyu', name: 'White Belt / Red Stripe',      bg: '#ffffff', border: '#d1d5db', stripe: '#ef4444' },
  { kyu: '16th Kyu', name: 'White Belt / Yellow Stripe',   bg: '#ffffff', border: '#d1d5db', stripe: '#facc15' },
  { kyu: '15th Kyu', name: 'Red Belt',                     bg: '#ef4444', border: '#dc2626', stripe: null },
  { kyu: '14th Kyu', name: 'Red Belt / White Stripe',      bg: '#ef4444', border: '#dc2626', stripe: '#ffffff' },
  { kyu: '13th Kyu', name: 'Yellow Belt',                  bg: '#facc15', border: '#eab308', stripe: null },
  { kyu: '12th Kyu', name: 'Yellow Belt / White Stripe',   bg: '#facc15', border: '#eab308', stripe: '#ffffff' },
  { kyu: '11th Kyu', name: 'Orange Belt',                  bg: '#f97316', border: '#ea580c', stripe: null },
  { kyu: '10th Kyu', name: 'Orange Belt / White Stripe',   bg: '#f97316', border: '#ea580c', stripe: '#ffffff' },
  { kyu: '9th Kyu',  name: 'Green Belt',                   bg: '#22c55e', border: '#16a34a', stripe: null },
  { kyu: '8th Kyu',  name: 'Green Belt / White Stripe',    bg: '#22c55e', border: '#16a34a', stripe: '#ffffff' },
  { kyu: '7th Kyu',  name: 'Blue Belt',                    bg: '#3b82f6', border: '#2563eb', stripe: null },
  { kyu: '6th Kyu',  name: 'Blue Belt / White Stripe',     bg: '#3b82f6', border: '#2563eb', stripe: '#ffffff' },
  { kyu: '5th Kyu',  name: 'Purple Belt',                  bg: '#9333ea', border: '#7e22ce', stripe: null },
  { kyu: '4th Kyu',  name: 'Purple Belt / White Stripe',   bg: '#9333ea', border: '#7e22ce', stripe: '#ffffff' },
  { kyu: '3rd Kyu',  name: 'Brown Belt',                   bg: '#92400e', border: '#78350f', stripe: null },
  { kyu: '2nd Kyu',  name: 'Brown Belt / White Stripe',    bg: '#92400e', border: '#78350f', stripe: '#ffffff' },
  { kyu: '1st Kyu',  name: 'Brown Belt / Two Stripe',      bg: '#92400e', border: '#78350f', stripe: '#ffffff', doubleStripe: true },
  { kyu: '',         name: 'Brown Belt / Black Stripe',    bg: '#92400e', border: '#78350f', stripe: '#111111' },
  { kyu: '',         name: 'Black Belt / White Stripe',    bg: '#111111', border: '#000000', stripe: '#ffffff' },
  { kyu: '1st Dan',  name: 'Black Belt',                   bg: '#111111', border: '#000000', stripe: null },
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

        {/* Belt grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-4">
          {belts.map((belt, i) => {
            const textColor = belt.bg === '#ffffff' || belt.bg === '#facc15' ? '#111111' : '#ffffff'
            return (
              <div key={i} className="flex flex-col items-center gap-2">
                {/* Belt shape */}
                <div
                  className="relative w-full h-8 rounded-sm shadow-sm overflow-hidden"
                  style={{
                    backgroundColor: belt.bg,
                    border: `1.5px solid ${belt.border}`,
                  }}
                >
                  {/* Single stripe */}
                  {belt.stripe && !belt.doubleStripe && (
                    <div
                      className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[5px]"
                      style={{ backgroundColor: belt.stripe, opacity: 0.9 }}
                    />
                  )}
                  {/* Double stripe */}
                  {belt.doubleStripe && belt.stripe && (
                    <>
                      <div
                        className="absolute inset-x-0 h-[4px]"
                        style={{ backgroundColor: belt.stripe, top: '28%', opacity: 0.9 }}
                      />
                      <div
                        className="absolute inset-x-0 h-[4px]"
                        style={{ backgroundColor: belt.stripe, top: '58%', opacity: 0.9 }}
                      />
                    </>
                  )}
                </div>
                {/* Labels */}
                <div className="text-center">
                  {belt.kyu && (
                    <div className="text-[10px] text-gray-400 font-medium leading-tight">{belt.kyu}</div>
                  )}
                  <div
                    className="text-[10px] font-semibold leading-tight mt-0.5"
                    style={{ color: '#111111' }}
                  >
                    {belt.name}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
