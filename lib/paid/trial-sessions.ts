/** Official Forza trial-class sessions. Keep this file in sync with the copy in
 *  forzakarate.co.uk `lib/paid/trial-sessions.ts` and club-honbu `artifacts/api-server/src/lib/trial-sessions.ts`.
 *
 *  `id` must match Forza Club Honbu classSessions / trialSessions exactly (en-dashes).
 *  Friday 3:40 Rayleigh is Rayleigh Primary School pupils only — never offered as a trial.
 */
export type DojoKey = "rayleigh" | "upminster"
export type AgeGroupKey = "ninjas" | "juniors" | "seniors" | "adult"

export type TrialSession = {
  id: string
  dojo: DojoKey
  day: string
  time: string
  venueName: string
  venueAddress: string
  ageGroups: AgeGroupKey[]
  trialEligible: boolean
}

export const RAYLEIGH_VENUE = {
  venueName: "Rayleigh Primary School",
  venueAddress: "Love Lane, Rayleigh, Essex SS6 7DD",
}
export const UPMINSTER_VENUE = {
  venueName: "St Lawrence Church Hall",
  venueAddress: "Corbets Tey Road, Upminster, Essex RM14 2BB",
}

export const TRIAL_SESSIONS: TrialSession[] = [
  {
    id: "Tuesday Rayleigh – 6.15–7pm",
    dojo: "rayleigh",
    day: "Tuesday",
    time: "6:15–7:00pm",
    ...RAYLEIGH_VENUE,
    ageGroups: ["ninjas", "juniors"],
    trialEligible: true,
  },
  {
    id: "Tuesday Rayleigh – 7–8pm",
    dojo: "rayleigh",
    day: "Tuesday",
    time: "7:00–8:00pm",
    ...RAYLEIGH_VENUE,
    ageGroups: ["seniors", "adult"],
    trialEligible: true,
  },
  {
    id: "Wednesday Upminster – 4–4.30pm",
    dojo: "upminster",
    day: "Wednesday",
    time: "4:00–4:30pm",
    ...UPMINSTER_VENUE,
    ageGroups: ["ninjas"],
    trialEligible: true,
  },
  {
    id: "Wednesday Upminster – 4.30–5pm",
    dojo: "upminster",
    day: "Wednesday",
    time: "4:30–5:00pm",
    ...UPMINSTER_VENUE,
    ageGroups: ["ninjas"],
    trialEligible: true,
  },
  {
    id: "Wednesday Upminster – 5–5.45pm",
    dojo: "upminster",
    day: "Wednesday",
    time: "5:00–5:45pm",
    ...UPMINSTER_VENUE,
    ageGroups: ["juniors"],
    trialEligible: true,
  },
  {
    id: "Wednesday Upminster – 5.45–7pm",
    dojo: "upminster",
    day: "Wednesday",
    time: "5:45–7:00pm",
    ...UPMINSTER_VENUE,
    ageGroups: ["seniors", "adult"],
    trialEligible: true,
  },
  {
    id: "Friday Rayleigh – 3.40–4.40pm",
    dojo: "rayleigh",
    day: "Friday",
    time: "3:40–4:40pm",
    ...RAYLEIGH_VENUE,
    ageGroups: ["ninjas", "juniors"],
    trialEligible: false, // RPS after-school club — pupils only
  },
  {
    id: "Saturday – 10–11am",
    dojo: "rayleigh",
    day: "Saturday",
    time: "10:00–11:00am",
    ...RAYLEIGH_VENUE,
    ageGroups: ["ninjas", "juniors", "seniors", "adult"],
    trialEligible: true,
  },
]

const SESSION_BY_ID = new Map(TRIAL_SESSIONS.map((s) => [s.id, s]))

export function sessionById(id?: string | null): TrialSession | undefined {
  const t = (id || "").trim()
  if (!t) return undefined
  return SESSION_BY_ID.get(t)
}

export function isOfficialSessionId(id?: string | null): boolean {
  return !!sessionById(id)
}

/** Normalize a dojo label from the website form, a bare Honbu value, or an official session id. */
export function parseDojoKey(value?: string | null): DojoKey | null {
  const s = sessionById(value)
  if (s) return s.dojo
  const t = (value || "").trim().toLowerCase()
  if (!t || t === "no-preference" || t === "no preference") return null
  if (t === "rayleigh" || t.startsWith("rayleigh ")) return "rayleigh"
  if (t === "upminster" || t.startsWith("upminster")) return "upminster"
  if (t.includes("rayleigh")) return "rayleigh"
  if (t.includes("upminster")) return "upminster"
  return null
}

export function parseAgeGroupKey(value?: string | null): AgeGroupKey | null {
  const t = (value || "").trim().toLowerCase()
  if (!t) return null
  if (t === "ninjas" || t.includes("ninja") || t.includes("(4") || t.includes("4–6") || t.includes("4-6")) return "ninjas"
  if (t === "juniors" || t.includes("junior") || t.includes("7–10") || t.includes("7-10")) return "juniors"
  if (t === "adult" || t.includes("adult")) return "adult"
  if (t === "seniors" || t.includes("senior") || t.includes("11+")) return "seniors"
  return null
}

export function ageGroupFromAge(age?: string | number | null): AgeGroupKey | null {
  if (age == null || age === "") return null
  const n = typeof age === "number" ? age : Number(String(age).replace(/[^\d.]/g, ""))
  if (!Number.isFinite(n)) return null
  if (n <= 6) return "ninjas"
  if (n <= 10) return "juniors"
  if (n <= 17) return "seniors"
  return "adult"
}

export function inferAgeGroup(extras?: { notes?: string | null; age?: string | number | null; dateOfBirth?: string | null; ageGroup?: string | null }): AgeGroupKey | null {
  if (!extras) return null
  const direct = parseAgeGroupKey(extras.ageGroup)
  if (direct) return direct
  const fromAge = ageGroupFromAge(extras.age)
  if (fromAge) return fromAge
  const notes = extras.notes || ""
  const ageNote = notes.match(/\bAge:\s*(\d{1,2})\b/i)
  if (ageNote) return ageGroupFromAge(ageNote[1])
  const fromNotes = parseAgeGroupKey(notes)
  if (fromNotes) return fromNotes
  const dob = (extras.dateOfBirth || "").trim()
  if (/^\d{4}-\d{2}-\d{2}/.test(dob)) {
    const born = new Date(dob.slice(0, 10) + "T12:00:00Z")
    if (!Number.isNaN(+born)) {
      const now = new Date()
      let years = now.getUTCFullYear() - born.getUTCFullYear()
      const md = now.getUTCMonth() - born.getUTCMonth()
      if (md < 0 || (md === 0 && now.getUTCDate() < born.getUTCDate())) years--
      return ageGroupFromAge(years)
    }
  }
  return null
}

/** Bare dojo-only values stored by the old webhook (e.g. "Rayleigh"), not an official session id. */
export function bareDojoOf(sessionAttended?: string | null): DojoKey | null {
  if (!sessionAttended || sessionById(sessionAttended)) return null
  const t = sessionAttended.trim().toLowerCase()
  if (t === "rayleigh") return "rayleigh"
  if (t === "upminster") return "upminster"
  // Don't treat longer club names / official-looking strings as bare dojo unless it's just the town.
  if (/^rayleigh(\s+primary.*)?$/i.test(sessionAttended.trim())) return "rayleigh"
  if (/^upminster(\s+-?\s*st\s+lawrence.*)?$/i.test(sessionAttended.trim())) return "upminster"
  return null
}

export function eligibleSessions(opts: { dojo?: string | null; ageGroup?: string | null }): TrialSession[] {
  const dojo = parseDojoKey(opts.dojo)
  const age = parseAgeGroupKey(opts.ageGroup)
  return TRIAL_SESSIONS.filter((s) => {
    if (!s.trialEligible) return false
    if (dojo && s.dojo !== dojo) return false
    if (age && !s.ageGroups.includes(age)) return false
    return true
  })
}

export function resolveBookedSession(opts: { bookedSession?: string | null; dojo?: string | null; ageGroup?: string | null }): string | null {
  const booked = sessionById(opts.bookedSession)
  if (booked?.trialEligible) return booked.id
  const matches = eligibleSessions({ dojo: opts.dojo, ageGroup: opts.ageGroup })
  if (matches.length === 1) return matches[0].id
  return null
}

export type SessionMatchExtras = { notes?: string | null; age?: string | number | null; dateOfBirth?: string | null; ageGroup?: string | null }

/** True if this trialist should appear on the register / add-trialist list for `registerSession`. */
export function trialMatchesSession(sessionAttended: string | null | undefined, registerSession: string, extras?: SessionMatchExtras): boolean {
  if (!registerSession) return false
  if ((sessionAttended || "") === registerSession) return true
  const register = sessionById(registerSession)
  if (!register || !register.trialEligible) return false
  if (sessionById(sessionAttended)?.id === register.id) return true
  const bare = bareDojoOf(sessionAttended)
  if (!bare || bare !== register.dojo) return false
  const age = inferAgeGroup(extras)
  if (!age) return true // unknown age: still show on every trial-eligible class at that dojo
  return register.ageGroups.includes(age)
}

export function formatSessionLabel(session: TrialSession): string {
  return `${session.day} ${session.time} at ${session.venueName}, ${session.venueAddress}`
}

export function formatSessionShort(session: TrialSession): string {
  return `${session.day} ${session.time}`
}

/** Human line for emails / {{session}} merge field. Bare dojo values list matching classes. */
export function formatBookedSessionText(sessionAttended?: string | null, extras?: SessionMatchExtras): string {
  const official = sessionById(sessionAttended)
  if (official) return formatSessionLabel(official)
  const bare = bareDojoOf(sessionAttended)
  if (bare) {
    const age = inferAgeGroup(extras)
    const list = eligibleSessions({ dojo: bare, ageGroup: age || undefined })
    if (list.length) return list.map((s) => formatSessionLabel(s)).join("; ")
  }
  return (sessionAttended || "").trim() || "your trial class"
}
