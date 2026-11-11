// Full Forza Karate Club syllabus (DRAFT). Source: Forza_Karate_Syllabus_DRAFT.docx.
// Anything in `toConfirm` is shown as a highlighted draft note until Anthoni confirms.
// Edit colours here: belt `hex`, automatic stripe `autoStripe`, and TRAINED_STRIPES.

export const DRAFT = true

/** The 5 trained progress stripes earned on every belt up to 1st Kyu, shown at the belt's end. */
export const TRAINED_STRIPES = [
  { n: 1, colour: 'Black', hex: '#111111' },
  { n: 2, colour: 'Red', hex: '#dc2626' },
  { n: 3, colour: 'Blue', hex: '#2563eb' },
  { n: 4, colour: 'White', hex: '#ffffff' },
  { n: 5, colour: 'Green', hex: '#16a34a' },
]

export type AutoStripe = { label: string; hex: string; count?: number; unknown?: boolean }

export type Grade = {
  grade: string
  belt: string
  hex: string
  autoStripe?: AutoStripe
  kata: string
  minTime: string
  trainedStripes: boolean
  /** Link to stripe tasks page, if tasks exist. */
  tasksHref?: string
  toConfirm?: string[]
}

const UNKNOWN = '#9ca3af'

export const grades: Grade[] = [
  { grade: '18th Kyu', belt: 'White Belt (Beginner)', hex: '#ffffff', kata: 'None', minTime: 'Starting grade: no grading. Awarded on joining with a valid licence.', trainedStripes: true, tasksHref: '/members/syllabus/first-belt' },
  { grade: '17th Kyu', belt: 'White Belt / Red Stripe', hex: '#ffffff', autoStripe: { label: 'Red stripe', hex: '#dc2626' }, kata: 'Kihon moves only, no kata yet (or the first 4 moves of Pinan Nidan if ready, at instructor discretion)', minTime: 'About 2–3 months from starting, with all 5 progress stripes earned', trainedStripes: true,
    toConfirm: ['The automatic red stripe at 17th Kyu clashes with the trained stripe order (Black, Red, Blue, White, Green), where red is stripe 2. Please confirm how these should look side by side.'] },
  { grade: '16th Kyu', belt: 'White Belt / Yellow Stripe', hex: '#ffffff', autoStripe: { label: 'Yellow stripe', hex: '#facc15' }, kata: 'Pinan Nidan: first half (to the first kiai), counted', minTime: 'Minimum 3 months / approx 24 classes since last grading', trainedStripes: true },
  { grade: '15th Kyu', belt: 'Red Belt', hex: '#dc2626', kata: 'Pinan Nidan (complete)', minTime: 'Minimum 3 months / approx 24 classes', trainedStripes: true },
  { grade: '14th Kyu', belt: 'Red Belt / Stripe', hex: '#dc2626', autoStripe: { label: 'Stripe (colour to confirm)', hex: UNKNOWN, unknown: true }, kata: 'Pinan Nidan; Pinan Shodan: first half', minTime: 'Minimum 3 months / approx 24 classes', trainedStripes: true },
  { grade: '13th Kyu', belt: 'Yellow Belt', hex: '#facc15', kata: 'Pinan Shodan (complete); Pinan Nidan', minTime: 'Minimum 3 months / approx 24 classes', trainedStripes: true },
  { grade: '12th Kyu', belt: 'Yellow Belt / Stripe', hex: '#facc15', autoStripe: { label: 'Stripe (colour to confirm)', hex: UNKNOWN, unknown: true }, kata: 'Pinan Shodan; Pinan Nidan; Pinan Sandan: first half', minTime: 'Minimum 3 months / approx 24 classes', trainedStripes: true },
  { grade: '11th Kyu', belt: 'Orange Belt', hex: '#f97316', kata: 'Pinan Sandan (complete); any lower Pinan on request', minTime: 'Minimum 3 months / approx 24 classes', trainedStripes: true },
  { grade: '10th Kyu', belt: 'Orange Belt / Stripe', hex: '#f97316', autoStripe: { label: 'Stripe (colour to confirm)', hex: UNKNOWN, unknown: true }, kata: 'Pinan Sandan; Pinan Nidan, Pinan Shodan', minTime: 'Minimum 3 months / approx 24 classes', trainedStripes: true },
  { grade: '9th Kyu', belt: 'Green Belt', hex: '#16a34a', kata: 'Pinan Yondan (complete); any lower Pinan on request', minTime: 'Minimum 3 months / approx 24 classes', trainedStripes: true },
  { grade: '8th Kyu', belt: 'Green Belt / Stripe', hex: '#16a34a', autoStripe: { label: 'Stripe (colour to confirm)', hex: UNKNOWN, unknown: true }, kata: 'Pinan Yondan; Pinan Sandan, Pinan Nidan', minTime: 'Minimum 3 months / approx 24 classes', trainedStripes: true },
  { grade: '7th Kyu', belt: 'Blue Belt', hex: '#2563eb', kata: 'Pinan Godan (complete); all Pinan on request', minTime: 'Minimum 4 months / approx 30 classes', trainedStripes: true },
  { grade: '6th Kyu', belt: 'Blue Belt / Stripe', hex: '#2563eb', autoStripe: { label: 'Stripe (colour to confirm)', hex: UNKNOWN, unknown: true }, kata: 'Pinan Godan; any Pinan on request, with bunkai for one', minTime: 'Minimum 4 months / approx 30 classes', trainedStripes: true },
  { grade: '5th Kyu', belt: 'Purple Belt', hex: '#7c3aed', kata: 'Kushanku; all Pinan on request', minTime: 'Minimum 4 months / approx 30 classes', trainedStripes: true },
  { grade: '4th Kyu', belt: 'Purple Belt / Stripe', hex: '#7c3aed', autoStripe: { label: 'Stripe (colour to confirm)', hex: UNKNOWN, unknown: true }, kata: 'Naihanchi; Kushanku', minTime: 'Minimum 4 months / approx 30 classes', trainedStripes: true,
    toConfirm: ['4th Kyu is not in the club records; assumed Purple Belt / Stripe.'] },
  { grade: '3rd Kyu', belt: 'Brown Belt', hex: '#78350f', kata: 'Seishan; Naihanchi, Kushanku and all Pinan on request', minTime: 'Minimum 6 months / approx 45 classes', trainedStripes: true },
  { grade: '2nd Kyu', belt: 'Brown Belt / White Stripe', hex: '#78350f', autoStripe: { label: 'White stripe', hex: '#ffffff' }, kata: 'Chinto; Seishan, Naihanchi, Kushanku on request', minTime: 'Minimum 6 months / approx 45 classes', trainedStripes: true },
  { grade: '1st Kyu', belt: 'Brown Belt / 2 Stripes', hex: '#78350f', autoStripe: { label: '2 stripes (colour to confirm)', hex: UNKNOWN, count: 2, unknown: true }, kata: 'Bassai (or Niseishi / Rohai, as agreed with the instructor); Chinto, Seishan and all lower kata on request', minTime: 'Minimum 6 months / approx 45 classes', trainedStripes: true },
  { grade: 'Shodan', belt: 'Black Belt (1st Dan)', hex: '#111111', kata: 'Tokui kata + all syllabus kata', minTime: '12 months at 1st Kyu', trainedStripes: false },
]

export type Rule = { text: string; toConfirm?: string }

export const gradingRules: Rule[] = [
  { text: 'All gradings are held at Forza Karate Club (Rayleigh or Upminster) and assessed by Forza instructors. Results from outside gradings are not recognised without the Chief Instructor’s agreement.', toConfirm: 'Outside gradings policy.' },
  { text: 'Gradings run in term time only, normally once per term (about 3 a year).', toConfirm: 'Grading dates and frequency.' },
  { text: 'Students may only grade when invited by their instructor, after meeting the minimum training time and attendance and earning all 5 progress stripes for their current belt.' },
  { text: 'Uniform: only official Forza Karate Club uniforms may be worn. A clean white Forza karate gi and belt, bought from the Forza store only. Club patch where required. No other brands or club badges.' },
  { text: 'A valid club licence must be in date on the day of grading.' },
  { text: 'The grading fee is paid in advance. Fees are non-refundable unless the grading is cancelled by the club.', toConfirm: 'Grading fee amounts.' },
  { text: 'No jewellery; nails short; long hair tied back with a soft band. Medical conditions must be shared with the instructor beforehand.' },
  { text: 'Arrive at least 15 minutes early. Bow on and off the mat. Show respect to the panel and other students at all times.' },
  { text: 'Protective kit for kumite (mitts, gum shield and others as required) must be the student’s own and approved by the club.', toConfirm: 'Whether kumite kit must also come from the Forza store.' },
  { text: 'Results: pass, pass with merit, or ‘not yet’ (re-grade at the next grading). Certificates and belts are presented at the club.' },
  { text: 'Juniors (under 16) are graded to the junior standard; the panel may make reasonable adjustments for age, ability and additional needs.' },
  { text: 'Double or accelerated grading is at the Chief Instructor’s discretion only.' },
]

export const generalToConfirm = [
  'Belt colours and order (taken from the club’s membership records).',
  'Stripe colours may change later. Are they the same on every belt, and what are the tasks for the higher belts?',
]
