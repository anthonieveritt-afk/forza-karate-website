// Weekly class timetable for both dojos. Matches the dojo pages and the old club list
// (https://forzakarate.co.uk/club-list/). Term time only, 40 weeks a year.

export type DojoKey = 'rayleigh' | 'upminster'
export type ClassKey = 'ninjas' | 'juniors' | 'seniors'

export interface ClassSession {
  id: string
  dojo: DojoKey
  day: string
  time: string
  desc: string
  /** Which age-group classes this session is suitable for. */
  classes: ClassKey[]
}

export const DOJO_NAMES: Record<DojoKey, string> = {
  rayleigh: 'Rayleigh',
  upminster: 'Upminster',
}

export const TIMETABLE: ClassSession[] = [
  { id: 'r-tue-1', dojo: 'rayleigh',  day: 'Tuesday',   time: '6:15 – 7:00pm',   desc: '4 years+ · 10 yrs all grades',     classes: ['ninjas', 'juniors'] },
  { id: 'r-tue-2', dojo: 'rayleigh',  day: 'Tuesday',   time: '7:00 – 8:00pm',   desc: '11 years+ · all grades',           classes: ['seniors'] },
  { id: 'r-fri',   dojo: 'rayleigh',  day: 'Friday',    time: '3:30 – 4:30pm',   desc: '4 years+ · after school club',     classes: ['ninjas', 'juniors'] },
  { id: 'r-sat',   dojo: 'rayleigh',  day: 'Saturday',  time: '10:00 – 11:00am', desc: '4 years+ · all grades and ages',   classes: ['ninjas', 'juniors', 'seniors'] },
  { id: 'u-wed-1', dojo: 'upminster', day: 'Wednesday', time: '4:00 – 4:30pm',   desc: 'Beginner infants (4–6 yrs)',       classes: ['ninjas'] },
  { id: 'u-wed-2', dojo: 'upminster', day: 'Wednesday', time: '4:30 – 5:00pm',   desc: 'Infant all grades (4–6 yrs)',      classes: ['ninjas'] },
  { id: 'u-wed-3', dojo: 'upminster', day: 'Wednesday', time: '5:00 – 5:45pm',   desc: 'Junior all grades (7–10 yrs)',     classes: ['juniors'] },
  { id: 'u-wed-4', dojo: 'upminster', day: 'Wednesday', time: '5:45 – 7:00pm',   desc: 'Senior all grades (11 years+)',    classes: ['seniors'] },
]

export function sessionsForDojo(dojo: DojoKey) {
  return TIMETABLE.filter((s) => s.dojo === dojo)
}

export function sessionsForClass(cls: ClassKey) {
  return TIMETABLE.filter((s) => s.classes.includes(cls))
}
