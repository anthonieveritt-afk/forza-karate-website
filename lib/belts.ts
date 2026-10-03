// The Forza belt order (18th Kyu to 1st Dan), as shown on /gradings.
export interface BeltInfo {
  kyu: string
  name: string
  bg: string
  border: string
  stripe: string | null
  doubleStripe?: boolean
}

export const BELTS: BeltInfo[] = [
  { kyu: '18th Kyu', name: 'White Belt',                 bg: '#ffffff', border: '#d1d5db', stripe: null },
  { kyu: '17th Kyu', name: 'White Belt / Red Stripe',    bg: '#ffffff', border: '#d1d5db', stripe: '#ef4444' },
  { kyu: '16th Kyu', name: 'White Belt / Yellow Stripe', bg: '#ffffff', border: '#d1d5db', stripe: '#facc15' },
  { kyu: '15th Kyu', name: 'Red Belt',                   bg: '#ef4444', border: '#dc2626', stripe: null },
  { kyu: '14th Kyu', name: 'Red Belt / White Stripe',    bg: '#ef4444', border: '#dc2626', stripe: '#ffffff' },
  { kyu: '13th Kyu', name: 'Yellow Belt',                bg: '#facc15', border: '#eab308', stripe: null },
  { kyu: '12th Kyu', name: 'Yellow Belt / White Stripe', bg: '#facc15', border: '#eab308', stripe: '#ffffff' },
  { kyu: '11th Kyu', name: 'Orange Belt',                bg: '#f97316', border: '#ea580c', stripe: null },
  { kyu: '10th Kyu', name: 'Orange Belt / White Stripe', bg: '#f97316', border: '#ea580c', stripe: '#ffffff' },
  { kyu: '9th Kyu',  name: 'Green Belt',                 bg: '#22c55e', border: '#16a34a', stripe: null },
  { kyu: '8th Kyu',  name: 'Green Belt / White Stripe',  bg: '#22c55e', border: '#16a34a', stripe: '#ffffff' },
  { kyu: '7th Kyu',  name: 'Blue Belt',                  bg: '#3b82f6', border: '#2563eb', stripe: null },
  { kyu: '6th Kyu',  name: 'Blue Belt / White Stripe',   bg: '#3b82f6', border: '#2563eb', stripe: '#ffffff' },
  { kyu: '5th Kyu',  name: 'Purple Belt',                bg: '#9333ea', border: '#7e22ce', stripe: null },
  { kyu: '4th Kyu',  name: 'Purple Belt / White Stripe', bg: '#9333ea', border: '#7e22ce', stripe: '#ffffff' },
  { kyu: '3rd Kyu',  name: 'Brown Belt',                 bg: '#92400e', border: '#78350f', stripe: null },
  { kyu: '2nd Kyu',  name: 'Brown Belt / White Stripe',  bg: '#92400e', border: '#78350f', stripe: '#ffffff' },
  { kyu: '1st Kyu',  name: 'Brown Belt / Two Stripe',    bg: '#92400e', border: '#78350f', stripe: '#ffffff', doubleStripe: true },
  { kyu: '',         name: 'Brown Belt / Black Stripe',  bg: '#92400e', border: '#78350f', stripe: '#111111' },
  { kyu: '',         name: 'Black Belt / White Stripe',  bg: '#111111', border: '#000000', stripe: '#ffffff' },
  { kyu: '1st Dan',  name: 'Black Belt',                 bg: '#111111', border: '#000000', stripe: null },
]

/** "13th Kyu – Yellow Belt" style labels for form dropdowns. */
export const BELT_OPTIONS = BELTS.map((b) => (b.kyu ? `${b.kyu} – ${b.name}` : b.name))
