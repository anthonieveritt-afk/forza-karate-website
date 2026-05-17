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
