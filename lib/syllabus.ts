// Forza Karate Club syllabus data.
// Stripe colours are plain data: change `colour` (name) and `hex` here to update the page.
// Anything marked instructorOnly is NEVER rendered on the public page.

export type StanceId = 'formal' | 'attention' | 'ready' | 'sumo' | 'horse'

export type SyllabusItem = {
  name: string
  japanese?: string
  description?: string
  /** Stance illustration key. Set `photo` to a /public path to replace the SVG with a real photo. */
  stance?: StanceId
  photo?: string
}

export type Stripe = {
  number: number
  colour: string
  hex: string
  title: string
  intro?: string
  items: SyllabusItem[]
  instructorOnly?: { note: string }
}

export type Belt = {
  id: string
  name: string
  beltHex: string
  stripes: Stripe[]
}

export const belts: Belt[] = [
  {
    id: 'belt-1',
    name: 'First belt (name to be confirmed)',
    beltHex: '#ffffff',
    stripes: [
      {
        number: 1,
        colour: 'Black',
        hex: '#111111',
        title: 'Blocks and punches',
        intro: 'Performed on the spot in ready stance (fudo dachi).',
        items: [
          { name: 'Upper block' },
          { name: 'Outer block' },
          { name: 'Basic punches', description: 'On the spot in ready stance (fudo dachi).' },
        ],
      },
      {
        number: 2,
        colour: 'Red',
        hex: '#dc2626',
        title: 'Keri waza (kicking techniques)',
        intro: 'Performed in ready stance.',
        items: [
          { name: 'Kin geri', japanese: 'Kin geri', description: 'Groin kick.' },
          { name: 'Hiza geri', japanese: 'Hiza geri', description: 'Knee kick.' },
        ],
      },
      {
        number: 3,
        colour: 'Blue',
        hex: '#2563eb',
        title: 'Stances',
        items: [
          { name: 'Formal stance', description: 'Heels together, toes together.', stance: 'formal' },
          { name: 'Attention stance', description: 'Heels together, toes apart.', stance: 'attention' },
          { name: 'Ready stance', description: 'Feet apart, hands resting by your sides in fists.', stance: 'ready' },
          { name: 'Sumo stance', description: 'Squat-like, toes turned out at 45 degrees, heels flat on the floor, knees bent.', stance: 'sumo' },
          { name: 'Horse riding stance', description: 'Like sumo stance but with feet pointing forwards, the outsides of the feet in line.', stance: 'horse' },
        ],
      },
      {
        number: 4,
        colour: 'White',
        hex: '#ffffff',
        title: 'Numbers one to five in Japanese',
        items: [
          { name: 'One', japanese: 'Ichi' },
          { name: 'Two', japanese: 'Ni' },
          { name: 'Three', japanese: 'San' },
          { name: 'Four', japanese: 'Shi' },
          { name: 'Five', japanese: 'Go' },
        ],
      },
      {
        number: 5,
        colour: 'Green',
        hex: '#16a34a',
        title: 'Kime (focus)',
        items: [
          { name: 'Kime', japanese: 'Kime', description: 'Focus: listening and staying focused throughout class.' },
        ],
        instructorOnly: {
          note: "Green stripe is usually awarded towards the end, leading up to a grading, as a 'well done, you're ready to grade'.",
        },
      },
    ],
  },
]
