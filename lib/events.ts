export type EventCategory = 'Competition' | 'Coaching' | 'Super Champs' | 'Grading' | 'Para Karate'

export interface ClubEvent {
  id: string
  title: string
  date: string        // ISO YYYY-MM-DD (start)
  dateEnd?: string    // ISO YYYY-MM-DD (end, multi-day)
  time?: string
  venue: string
  category: EventCategory
  eligibility?: string
  notes?: string
  registrationHref?: string
  cancelled?: boolean
}

export const EVENTS: ClubEvent[] = [
  // ── JANUARY ──
  { id: 'orleans-sel',  title: 'Orleans Jeunes — Training & Selections',        date: '2026-01-23', venue: 'Chigwell, Essex',                                      category: 'Coaching',   eligibility: 'Open to all squad' },
  { id: 'sc-jan',       title: 'Saturday Super Champs',                        date: '2026-01-10', time: '2:00pm',  venue: 'Rayleigh',                             category: 'Super Champs', registrationHref: 'https://f8s.co/26cd' },
  { id: 'para-jan',     title: 'Para Karate — Inclusive Session',               date: '2026-01-10', time: '2:00pm',  venue: 'Rayleigh',                             category: 'Para Karate', registrationHref: 'https://formsmarts.com/form/2fhs', notes: 'Open to all with additional needs, learning difficulties & disabilities' },
  { id: 'kata-jan',     title: 'Kata Coaching',                                date: '2026-01-10', time: '3:00pm',  venue: 'Rayleigh',                             category: 'Coaching',   eligibility: 'All ages', registrationHref: 'https://f8s.co/21zc' },
  { id: 'kum-u12-jan',  title: 'Kumite Coaching',                              date: '2026-01-11', time: '11:00am', venue: 'Rayleigh',                             category: 'Coaching',   eligibility: '12 years & below' },
  { id: 'kum-s-jan',    title: 'Kumite Coaching',                              date: '2026-01-11', time: '1:00pm',  venue: 'Rayleigh',                             category: 'Coaching',   eligibility: '13 years+' },

  // ── FEBRUARY ──
  { id: 'grad-feb-dl',  title: 'February Grading — Registration Deadline',      date: '2026-02-13', venue: 'Rayleigh & Upminster',                                  category: 'Grading',    notes: 'Belts awarded 23rd–28th February', registrationHref: 'https://forzakarate.co.uk/grading/' },
  { id: 'grad-feb-w',   title: 'February Grading — Belts Awarded',              date: '2026-02-23', dateEnd: '2026-02-28', venue: 'Rayleigh & Upminster',           category: 'Grading' },
  { id: 'sc-feb',       title: 'Saturday Super Champs',                        date: '2026-02-14', time: '2:00pm',  venue: 'Chingford',                            category: 'Super Champs', registrationHref: 'https://f8s.co/26cd' },
  { id: 'para-feb',     title: 'Para Karate — Inclusive Session',               date: '2026-02-14', time: '2:00pm',  venue: 'Chingford',                            category: 'Para Karate', registrationHref: 'https://formsmarts.com/form/2fhs' },
  { id: 'kata-feb',     title: 'Kata Coaching',                                date: '2026-02-14', time: '3:00pm',  venue: 'Chingford',                            category: 'Coaching',   eligibility: 'All ages' },
  { id: 'kum-u12-feb',  title: 'Kumite Coaching',                              date: '2026-02-15', time: '2:30pm',  venue: 'Chingford',                            category: 'Coaching',   eligibility: '12 years & below' },
  { id: 'kum-s-feb',    title: 'Kumite Coaching',                              date: '2026-02-15', time: '4:30pm',  venue: 'Chingford',                            category: 'Coaching',   eligibility: '13 years+' },
  { id: 'inter-feb-d2', title: 'Forza Inter Club Championships (Division 2)',  date: '2026-02-28', venue: 'Rayleigh Primary School',                              category: 'Competition' },

  // ── MARCH ──
  { id: 'inter-mar-d1', title: 'Forza Inter Club Championships (Division 1)',  date: '2026-03-01', venue: 'Rayleigh Primary School',                              category: 'Competition' },
  { id: 'orleans-pre1', title: 'Orleans Jeunes — Pre-Training',                date: '2026-03-01', venue: 'Rayleigh, Essex',                                      category: 'Coaching',   eligibility: 'Selected squad only' },
  { id: 'kum-u12-mar',  title: 'Kumite Training & Selections (BKF)',           date: '2026-03-08', time: '11:00am', venue: 'Rayleigh',                             category: 'Coaching',   eligibility: '12 years & below' },
  { id: 'kum-s-mar',    title: 'Kumite Training & Selections (BKF)',           date: '2026-03-08', time: '1:00pm',  venue: 'Rayleigh',                             category: 'Coaching',   eligibility: '13 years+' },
  { id: 'sc-mar',       title: 'Saturday Super Champs',                        date: '2026-03-14', time: '2:00pm',  venue: 'Rayleigh',                             category: 'Super Champs' },
  { id: 'kata-mar',     title: 'Kata Training & Selections (BKF)',             date: '2026-03-14', time: '3:00pm',  venue: 'Rayleigh',                             category: 'Coaching',   eligibility: 'All ages' },
  { id: 'orleans-pre2', title: 'Orleans Jeunes — Additional Pre-Training',     date: '2026-03-20', venue: 'Chigwell, Essex',                                      category: 'Coaching',   eligibility: 'Compulsory for selected team' },
  { id: 'grad-apr',     title: 'April Grading — Registration Deadline',        date: '2026-03-27', venue: 'Rayleigh & Upminster',                                 category: 'Grading',    notes: 'Belts awarded 13th–18th April', registrationHref: 'https://forzakarate.co.uk/grading/' },
  { id: 'orleans',      title: 'Open International Orleans Jeunes — France',   date: '2026-03-28', dateEnd: '2026-03-29', venue: 'France',                        category: 'Competition', eligibility: 'Selected squad only' },

  // ── APRIL ──
  { id: 'grad-apr-w',   title: 'April Grading — Belts Awarded',               date: '2026-04-13', dateEnd: '2026-04-18', venue: 'Rayleigh & Upminster',           category: 'Grading' },
  { id: 'sc-apr',       title: 'Saturday Super Champs',                        date: '2026-04-25', time: '2:00pm',  venue: 'Chingford',                            category: 'Super Champs' },
  { id: 'kata-apr',     title: 'Kata Training & Selections',                   date: '2026-04-25', time: '3:00pm',  venue: 'Chingford',                            category: 'Coaching',   eligibility: 'All ages' },
  { id: 'kum-u12-apr',  title: 'Kumite Training & Selections',                 date: '2026-04-26', time: '2:00pm',  venue: 'Chingford',                            category: 'Coaching',   eligibility: '12 years & below' },
  { id: 'kum-s-apr',    title: 'Kumite Training & Selections',                 date: '2026-04-26', time: '4:00pm',  venue: 'Chingford',                            category: 'Coaching',   eligibility: '13 years+' },

  // ── MAY ──
  { id: 'sc-may',       title: 'Saturday Super Champs',                        date: '2026-05-09', time: '2:00pm',  venue: 'Rayleigh',                             category: 'Super Champs' },
  { id: 'kata-may',     title: 'Kata Training (BKF)',                          date: '2026-05-09', time: '3:00pm',  venue: 'Rayleigh',                             category: 'Coaching',   eligibility: 'All ages' },
  { id: 'wkf-sel',      title: 'WKF Youth Camp & U12 — Training & Selection', date: '2026-05-09', venue: 'Rayleigh, Essex',                                      category: 'Coaching',   eligibility: '11 years & below, 12yr olds welcome' },
  { id: 'jhka-6th',     title: 'JHKA 6th Open Championships',                 date: '2026-05-16', venue: 'Romford',                                               category: 'Competition', eligibility: 'Open to all FKA students incl. beginners' },
  { id: 'kum-u12-may',  title: 'Kumite Training',                              date: '2026-05-17', time: '11:00am', venue: 'Rayleigh',                             category: 'Coaching',   eligibility: '12 years & below' },
  { id: 'kum-s-may',    title: 'Kumite Training',                              date: '2026-05-17', time: '1:00pm',  venue: 'Rayleigh',                             category: 'Coaching',   eligibility: '13 years+' },

  // ── JUNE ──
  { id: 'sc-jun',       title: 'Saturday Super Champs',                        date: '2026-06-06', time: '2:30pm',  venue: 'Chingford',                            category: 'Super Champs' },
  { id: 'wkf-pre',      title: 'WKF Youth Camp — Pre-Training',                date: '2026-06-06', venue: 'Chingford, London',                                    category: 'Coaching',   eligibility: 'Selected squad only' },
  { id: 'kata-jun',     title: 'Kata Training (British International Open)',   date: '2026-06-06', time: '3:30pm',  venue: 'Chingford',                            category: 'Coaching',   eligibility: 'All ages' },
  { id: 'kum-u12-jun',  title: 'Kumite Training (British International Open)', date: '2026-06-07', time: '2:00pm',  venue: 'Chingford',                            category: 'Coaching',   eligibility: '12 years & below' },
  { id: 'kum-s-jun',    title: 'Kumite Training (British International Open)', date: '2026-06-07', time: '4:00pm',  venue: 'Chingford',                            category: 'Coaching',   eligibility: '13 years+' },
  { id: 'inter-jun-d2', title: 'Forza Inter Club Championships (Division 2)',  date: '2026-06-13', venue: 'Rayleigh Primary School',                              category: 'Competition' },
  { id: 'inter-jun-d1', title: 'Forza Inter Club Championships (Division 1)',  date: '2026-06-14', venue: 'Rayleigh Primary School',                              category: 'Competition' },
  { id: 'ceo',          title: 'Central England Open Championships',           date: '2026-06-28', venue: 'University of Worcester Arena',                        category: 'Competition', eligibility: 'Selected squad only' },
  { id: 'wkf-croatia1', title: 'WKF Youth Camp & U12 Youth Cup — Croatia',     date: '2026-06-29', dateEnd: '2026-07-01', venue: 'Porec, Croatia',                category: 'Competition', eligibility: 'Selected squad only' },

  // ── JULY ──
  { id: 'wkf-croatia2', title: 'WKF Youth League 2026 — Croatia',              date: '2026-07-02', dateEnd: '2026-07-05', venue: 'Porec, Croatia',                category: 'Competition', eligibility: 'Selected Elite squad only' },
  { id: 'grad-jul-dl',  title: 'July Grading — Registration Deadline',         date: '2026-07-03', venue: 'Rayleigh & Upminster',                                 category: 'Grading',    notes: 'Belts awarded 11th–17th July', registrationHref: 'https://forzakarate.co.uk/grading/' },
  { id: 'sc-jul',       title: 'Saturday Super Champs',                        date: '2026-07-11', time: '2:00pm',  venue: 'Rayleigh',                             category: 'Super Champs' },
  { id: 'kata-jul',     title: 'Kata Training (British International Open)',   date: '2026-07-11', time: '3:00pm',  venue: 'Rayleigh',                             category: 'Coaching',   eligibility: 'All ages' },
  { id: 'grad-jul-w',   title: 'July Grading — Belts Awarded',                date: '2026-07-11', dateEnd: '2026-07-17', venue: 'Rayleigh & Upminster',           category: 'Grading' },
  { id: 'kum-u12-jul',  title: 'Kumite Training (British International Open)', date: '2026-07-26', time: '11:00am', venue: 'Rayleigh',                             category: 'Coaching',   eligibility: '12 years & below' },
  { id: 'kum-s-jul',    title: 'Kumite Training (British International Open)', date: '2026-07-26', time: '1:00pm',  venue: 'Rayleigh',                             category: 'Coaching',   eligibility: '13 years+' },

  // ── AUGUST ──
  { id: 'sc-aug',       title: 'Saturday Super Champs',                        date: '2026-08-01', time: '2:00pm',  venue: 'Chingford',                            category: 'Super Champs' },
  { id: 'kata-aug',     title: 'Kata Training (British International Open)',   date: '2026-08-01', time: '3:00pm',  venue: 'Chingford',                            category: 'Coaching',   eligibility: 'All ages' },
  { id: 'kum-aug',      title: 'Kumite Training (British International Open)', date: '2026-08-02', time: '2:00pm',  venue: 'Chingford',                            category: 'Coaching',   eligibility: 'All ages' },
  { id: 'bkf-pre',      title: 'BKF British International Open — Pre-Training', date: '2026-08-27', dateEnd: '2026-08-28', venue: 'Sheffield',                    category: 'Coaching',   eligibility: 'Elite squad only' },
  { id: 'bkf',          title: 'BKF British International Open Championships', date: '2026-08-30', dateEnd: '2026-08-31', venue: 'Sheffield',                     category: 'Competition', eligibility: 'Selected squad only' },

  // ── SEPTEMBER ──
  { id: 'sc-sep',       title: 'Saturday Super Champs',                        date: '2026-09-12', time: '2:00pm',  venue: 'Rayleigh',                             category: 'Super Champs' },
  { id: 'kata-sep',     title: 'Kata Training (Commonwealth)',                 date: '2026-09-12', time: '3:00pm',  venue: 'Rayleigh',                             category: 'Coaching',   eligibility: 'All ages' },
  { id: 'kum-u12-sep',  title: 'Kumite Training (Commonwealth)',               date: '2026-09-13', time: '11:00am', venue: 'Rayleigh',                             category: 'Coaching',   eligibility: '12 years & below' },
  { id: 'kum-s-sep',    title: 'Kumite Training (Commonwealth)',               date: '2026-09-13', time: '1:00pm',  venue: 'Rayleigh',                             category: 'Coaching',   eligibility: '13 years+' },
  { id: 'inter-sep-d2', title: 'Forza Inter Club Championships (Division 2)',  date: '2026-09-19', venue: 'Rayleigh Primary School',                              category: 'Competition' },
  { id: 'inter-sep-d1', title: 'Forza Inter Club Championships (Division 1)',  date: '2026-09-20', venue: 'Rayleigh Primary School',                              category: 'Competition' },
  { id: 'ekngb',        title: 'EKNGB Children\'s Championships',              date: '2026-09-26', dateEnd: '2026-09-27', venue: 'Venue TBC',                     category: 'Competition', eligibility: 'Selected squad only' },

  // ── OCTOBER ──
  { id: 'cwsel',        title: 'Commonwealth Club Championships — Selections', date: '2026-10-02', venue: 'Chigwell, Essex',                                      category: 'Coaching',   eligibility: 'Open to all squad' },
  { id: 'kum-u12-oct',  title: 'Kumite Training (Commonwealth)',               date: '2026-10-04', time: '2:00pm',  venue: 'Chingford',                            category: 'Coaching',   eligibility: '12 years & below' },
  { id: 'kum-s-oct',    title: 'Kumite Training (Commonwealth)',               date: '2026-10-04', time: '4:00pm',  venue: 'Chingford',                            category: 'Coaching',   eligibility: '13 years+' },
  { id: 'jhka-8th',     title: 'JHKA 8th Junior Championships',               date: '2026-10-10', venue: 'Enfield',                                               category: 'Competition', eligibility: 'Open to all JHKA students incl. beginners' },
  { id: 'sc-oct',       title: 'Saturday Super Champs',                        date: '2026-10-24', time: '2:00pm',  venue: 'Chingford',                            category: 'Super Champs' },
  { id: 'kata-oct',     title: 'Kata Training (Commonwealth)',                 date: '2026-10-24', time: '3:00pm',  venue: 'Chingford',                            category: 'Coaching',   eligibility: 'All ages' },
  { id: 'grad-nov-dl',  title: 'November Grading — Registration Deadline',    date: '2026-10-23', venue: 'Rayleigh & Upminster',                                  category: 'Grading',    notes: 'Belts awarded 2nd–6th November', registrationHref: 'https://forzakarate.co.uk/grading/' },

  // ── NOVEMBER ──
  { id: 'kum-u12-nov',  title: 'Kumite Training (Commonwealth)',               date: '2026-11-01', time: '11:00am', venue: 'Rayleigh',                             category: 'Coaching',   eligibility: '12 years & below' },
  { id: 'kum-s-nov',    title: 'Kumite Training (Commonwealth)',               date: '2026-11-01', time: '1:00pm',  venue: 'Rayleigh',                             category: 'Coaching',   eligibility: '13 years+' },
  { id: 'grad-nov-w',   title: 'November Grading — Belts Awarded',            date: '2026-11-02', dateEnd: '2026-11-06', venue: 'Rayleigh & Upminster',           category: 'Grading' },
  { id: 'cw',           title: 'Commonwealth Club Championships',              date: '2026-11-07', dateEnd: '2026-11-08', venue: 'Emirates Arena, Glasgow',        category: 'Competition', eligibility: 'Selected squad only' },
  { id: 'sc-nov',       title: 'Saturday Super Champs',                        date: '2026-11-14', time: '2:00pm',  venue: 'Rayleigh',                             category: 'Super Champs' },
  { id: 'kata-nov',     title: 'Kata Training (End of Year)',                  date: '2026-11-14', time: '3:00pm',  venue: 'Rayleigh',                             category: 'Coaching',   eligibility: 'All ages' },

  // ── DECEMBER ──
  { id: 'grad-dec-dl',  title: 'December Grading — Registration Deadline',    date: '2026-12-04', venue: 'Rayleigh & Upminster',                                  category: 'Grading',    notes: 'Belts awarded 14th–18th December', registrationHref: 'https://forzakarate.co.uk/grading/' },
  { id: 'sc-dec',       title: 'Saturday Super Champs',                        date: '2026-12-05', time: '2:00pm',  venue: 'Chingford',                            category: 'Super Champs' },
  { id: 'kata-dec',     title: 'Kata Coaching (End of Year)',                  date: '2026-12-05', time: '3:00pm',  venue: 'Chingford',                            category: 'Coaching',   eligibility: 'All ages' },
  { id: 'grad-dec-w',   title: 'December Grading — Belts Awarded',            date: '2026-12-14', dateEnd: '2026-12-18', venue: 'Rayleigh & Upminster',           category: 'Grading' },
  { id: 'kum-dec',      title: 'Kumite Coaching (End of Year)',                date: '2026-12-20', time: '2:00pm',  venue: 'Chingford',                            category: 'Coaching',   eligibility: 'All ages' },
]

export const CATEGORY_COLOURS: Record<EventCategory, { bg: string; text: string; border: string }> = {
  Competition:   { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200' },
  Coaching:      { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
  'Super Champs':{ bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  Grading:       { bg: 'bg-red-50',    text: 'text-[#dc2626]',  border: 'border-red-200' },
  'Para Karate': { bg: 'bg-green-50',  text: 'text-green-700',  border: 'border-green-200' },
}

export function formatEventDate(date: string, dateEnd?: string): string {
  const d = new Date(date + 'T12:00:00')
  const opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
  if (!dateEnd) return d.toLocaleDateString('en-GB', opts)
  const e = new Date(dateEnd + 'T12:00:00')
  if (d.getMonth() === e.getMonth()) {
    return `${d.getDate()}–${e.toLocaleDateString('en-GB', opts)}`
  }
  return `${d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} – ${e.toLocaleDateString('en-GB', opts)}`
}

export function groupByMonth(events: ClubEvent[]): Record<string, ClubEvent[]> {
  return events.reduce((acc, ev) => {
    const d = new Date(ev.date + 'T12:00:00')
    const key = d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    if (!acc[key]) acc[key] = []
    acc[key].push(ev)
    return acc
  }, {} as Record<string, ClubEvent[]>)
}
