export const GRADINGS = [
  {
    name: 'April Grading',
    registerBy: new Date('2026-03-27T23:59:59'),
    awardLabel: '13th – 18th April',
    registerDeadlineLabel: 'Friday 27th March 2026',
  },
  {
    name: 'July Grading',
    registerBy: new Date('2026-07-03T23:59:59'),
    awardLabel: '11th – 17th July',
    registerDeadlineLabel: 'Friday 3rd July 2026',
  },
  {
    name: 'November Grading',
    registerBy: new Date('2026-10-23T23:59:59'),
    awardLabel: '2nd – 6th November',
    registerDeadlineLabel: 'Friday 23rd October 2026',
  },
  {
    name: 'December Grading',
    registerBy: new Date('2026-12-04T23:59:59'),
    awardLabel: '14th – 18th December',
    registerDeadlineLabel: 'Thursday 4th December 2026',
  },
] as const

export type GradingEntry = typeof GRADINGS[number]

// Grading fees (GBP), taken from the old forzakarate.co.uk grading registration form.
// Shown on the grading form and /gradings. No payment is collected online.
export const GRADING_FEE_BANDS = [
  { label: '17th – 14th Kyu', grades: ['17th Kyu', '16th Kyu', '15th Kyu', '14th Kyu'], fee: 35 },
  { label: '13th – 8th Kyu', grades: ['13th Kyu', '12th Kyu', '11th Kyu', '10th Kyu', '9th Kyu', '8th Kyu'], fee: 40 },
  { label: '7th – 4th Kyu', grades: ['7th Kyu', '6th Kyu', '5th Kyu', '4th Kyu'], fee: 45 },
  { label: '3rd Kyu', grades: ['3rd Kyu'], fee: 70 },
  { label: '2nd Kyu', grades: ['2nd Kyu'], fee: 85 },
  { label: '1st Kyu', grades: ['1st Kyu'], fee: 90 },
  { label: 'Black Belt Probation', grades: ['Black Belt Probation'], fee: 150 },
  { label: '1st Dan', grades: ['1st Dan'], fee: 200 },
  { label: '2nd Dan', grades: ['2nd Dan'], fee: 250 },
  { label: '3rd Dan', grades: ['3rd Dan'], fee: 300 },
] as const

/** Fee in pounds for a grade label such as "13th Kyu – Yellow Belt" or "1st Dan". */
export function gradingFee(grade: string): number | null {
  const key = grade.split('–')[0].trim()
  for (const b of GRADING_FEE_BANDS) if ((b.grades as readonly string[]).includes(key)) return b.fee
  return null
}

export const GRADING_VENUES = [
  { value: 'RPS (Tuesday)', dojo: 'rayleigh' },
  { value: 'Upminster (Wednesday)', dojo: 'upminster' },
  { value: 'RPS (Friday)', dojo: 'rayleigh' },
  { value: 'RPS (Saturday)', dojo: 'rayleigh' },
] as const
