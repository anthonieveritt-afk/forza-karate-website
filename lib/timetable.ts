// Weekly class timetable for both dojos: the single source of truth for class
// times and age groups. Used by the dojo pages, class pages, join and enrol
// forms and the chat assistant. Term time only, 40 weeks a year.
//
// Times and age groups confirmed by Anthoni Everitt (October 2026).

export type DojoKey = 'rayleigh' | 'upminster'
export type ClassKey = 'ninjas' | 'juniors' | 'seniors'

export interface ClassSession {
  id: string
  dojo: DojoKey
  day: string
  time: string
  /** Age group for this session, e.g. "Ages 4–10". */
  ages: string
  /** Optional extra detail, e.g. "Class 1" or "After school club". */
  note?: string
  /** Ages plus note, for timetable tables. */
  desc: string
  /** Which programmes (Ninjas / Juniors / Club) this session covers. */
  classes: ClassKey[]
}

export const DOJO_NAMES: Record<DojoKey, string> = {
  rayleigh: 'Rayleigh',
  upminster: 'Upminster',
}

type SessionInput = Omit<ClassSession, 'desc'>

const SESSIONS: SessionInput[] = [
  // Rayleigh
  { id: 'r-tue-1', dojo: 'rayleigh',  day: 'Tuesday',   time: '6:15 – 7:00pm',   ages: 'Ages 4–10',  classes: ['ninjas', 'juniors'] },
  { id: 'r-tue-2', dojo: 'rayleigh',  day: 'Tuesday',   time: '7:00 – 8:00pm',   ages: 'Ages 11+',   classes: ['seniors'] },
  { id: 'r-fri',   dojo: 'rayleigh',  day: 'Friday',    time: '3:45 – 4:45pm',   ages: 'Ages 4–10',  note: 'After school club', classes: ['ninjas', 'juniors'] },
  { id: 'r-sat',   dojo: 'rayleigh',  day: 'Saturday',  time: '10:00 – 11:00am', ages: 'All ages',   classes: ['ninjas', 'juniors', 'seniors'] },
  // Upminster
  { id: 'u-wed-1', dojo: 'upminster', day: 'Wednesday', time: '4:00 – 4:45pm',   ages: 'Ages 4–9',   note: 'Class 1', classes: ['ninjas', 'juniors'] },
  { id: 'u-wed-2', dojo: 'upminster', day: 'Wednesday', time: '5:00 – 5:45pm',   ages: 'Ages 10–13', note: 'Class 2', classes: ['juniors'] },
  { id: 'u-wed-3', dojo: 'upminster', day: 'Wednesday', time: '6:00 – 7:00pm',   ages: 'Ages 14+',   note: 'Class 3', classes: ['seniors'] },
]

export const TIMETABLE: ClassSession[] = SESSIONS.map((s) => ({
  ...s,
  desc: s.note ? `${s.ages} · ${s.note}` : s.ages,
}))

/**
 * How the three programmes map onto the real classes. Children's classes run
 * up to age 10 at Rayleigh and up to 13 at Upminster; the senior classes are
 * 11+ at Rayleigh and 14+ at Upminster.
 */
export const PROGRAMME_AGES: Record<ClassKey, string> = {
  ninjas: 'From age 4',
  juniors: 'Up to age 10 (13 at Upminster)',
  seniors: 'Ages 11+ (14+ at Upminster)',
}

export function sessionsForDojo(dojo: DojoKey) {
  return TIMETABLE.filter((s) => s.dojo === dojo)
}

export function sessionsForClass(cls: ClassKey) {
  return TIMETABLE.filter((s) => s.classes.includes(cls))
}

/** One-line label, e.g. "Tuesday 6:15 – 7:00pm — Ages 4–10". */
export function sessionLabel(s: ClassSession) {
  return `${s.day} ${s.time} — ${s.desc}`
}

/** Plain-text timetable, e.g. for the chat assistant's knowledge. */
export function timetableText() {
  return (Object.keys(DOJO_NAMES) as DojoKey[])
    .map((d) => `${DOJO_NAMES[d]}:\n` + sessionsForDojo(d).map((s) => `  - ${sessionLabel(s)}`).join('\n'))
    .join('\n')
}
