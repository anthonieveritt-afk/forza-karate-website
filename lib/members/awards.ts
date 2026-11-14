// Awards won (portal) + social sharing for award and grading certificates.
// Pure helpers only (no browser APIs) so they can be unit-tested.

export const SHARE_URL = 'https://www.forzakarate.co.uk'
export const CLUB_NAME = 'Forza Karate Club'

export type PortalAward = {
  id: number
  studentName: string
  awardType: string
  awardTitle: string
  place: string
  club: string
  citation: string
  certificateDate: string
  eventName: string
  chiefSignature: string
  repSignature: string
  releasedAt: string | null
}

const str = (v: unknown) => (typeof v === 'string' ? v : '')

/** Keep only well-formed, released awards from the Forza Club Honbu response. */
export function normaliseAwards(d: unknown): PortalAward[] {
  const list = (d as { awards?: unknown })?.awards
  if (!Array.isArray(list)) return []
  return list
    .filter((a) => a && Number.isInteger((a as { id?: unknown }).id) && str((a as { awardTitle?: unknown }).awardTitle) && (a as { releasedAt?: unknown }).releasedAt)
    .map((a) => {
      const r = a as Record<string, unknown>
      return {
        id: Number(r.id),
        studentName: str(r.studentName),
        awardType: str(r.awardType) || 'custom',
        awardTitle: str(r.awardTitle),
        place: str(r.place),
        club: str(r.club),
        citation: str(r.citation),
        certificateDate: str(r.certificateDate).slice(0, 10),
        eventName: str(r.eventName),
        chiefSignature: str(r.chiefSignature),
        repSignature: str(r.repSignature),
        releasedAt: str(r.releasedAt),
      }
    })
}

export const PLACE_METAL: Record<string, 'Gold' | 'Silver' | 'Bronze'> = { '1st': 'Gold', '2nd': 'Silver', '3rd': 'Bronze' }

export function awardYear(a: Pick<PortalAward, 'certificateDate'>): string {
  return /^\d{4}/.exec(a.certificateDate)?.[0] ?? ''
}

/** "Gold – Student of the Year 2026" / "Bronze – Best Attendance (Rayleigh) 2026" / "Most Improved 2026". */
export function awardHeadline(a: Pick<PortalAward, 'awardTitle' | 'place' | 'club' | 'certificateDate'>): string {
  const metal = PLACE_METAL[a.place]
  const title = `${a.awardTitle}${a.club ? ` · ${a.club}` : ''}`
  const year = awardYear(a)
  return `${metal ? `${metal} – ` : ''}${title}${year && !title.includes(year) ? ` ${year}` : ''}`
}

/** Pre-written post text. The link is always the club website, never a preview/vercel URL. */
export function awardShareText(a: Pick<PortalAward, 'awardTitle' | 'place' | 'club' | 'certificateDate'>): string {
  return `Proud to receive ${awardHeadline(a)} at ${CLUB_NAME}! 🥋 www.forzakarate.co.uk`
}

export function gradingShareText(toBelt: string): string {
  const raw = toBelt.trim()
  const belt = !raw ? 'my next belt' : /belt|kyu|dan/i.test(raw) ? raw : `${raw} belt`
  return `Proud to have graded to ${belt} at ${CLUB_NAME}! 🥋 www.forzakarate.co.uk`
}

/** Share links for when the phone can't share the picture directly. */
export function shareLinks(text: string, url: string = SHARE_URL) {
  const textNoUrl = text.replace(/\s*www\.forzakarate\.co\.uk\s*$/, '').trim()
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    x: `https://x.com/intent/post?text=${encodeURIComponent(textNoUrl)}&url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${textNoUrl} ${url}`)}`,
  }
}

export function awardFileBase(a: Pick<PortalAward, 'studentName' | 'awardTitle' | 'place'>): string {
  const slug = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-')
  return ['forza', slug(a.awardTitle), a.place, slug(a.studentName)].filter(Boolean).join('-')
}

/** "27 November 2026" */
export function formatAwardDay(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!m) return iso
  return new Date(Date.UTC(Number(m[1]), Number(m[2]) - 1, Number(m[3]))).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })
}

export type UpcomingRelease = { eventName: string; releaseAt: string }

export function normaliseUpcoming(d: unknown): UpcomingRelease | null {
  const u = (d as { upcoming?: unknown })?.upcoming as Record<string, unknown> | null | undefined
  if (!u || typeof u.eventName !== 'string' || typeof u.releaseAt !== 'string' || Number.isNaN(Date.parse(u.releaseAt))) return null
  return { eventName: u.eventName, releaseAt: u.releaseAt }
}

/** "9pm" / "9:30pm" and "Fri 27 Nov 2026", in UK time. */
function ukTimeAndDay(iso: string): { time: string; day: string } {
  const d = new Date(iso)
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/London', hourCycle: 'h23', hour: '2-digit', minute: '2-digit', weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
      .formatToParts(d)
      .map((p) => [p.type, p.value]),
  ) as Record<string, string>
  const h = Number(parts.hour)
  const m = parts.minute
  const h12 = h % 12 === 0 ? 12 : h % 12
  const time = `${h12}${m === '00' ? '' : `:${m}`}${h < 12 ? 'am' : 'pm'}`
  return { time, day: `${parts.weekday} ${parts.day} ${parts.month} ${parts.year}` }
}

/** Empty-state line for Awards won. */
export function awardsEmptyText(upcoming: UpcomingRelease | null): string {
  if (!upcoming) return 'No awards yet — certificates the club awards you will appear here.'
  const name = upcoming.eventName.replace(/\s+\d{4}$/, '').trim() || 'the next presentation'
  const { time, day } = ukTimeAndDay(upcoming.releaseAt)
  return `No awards yet — certificates from the ${name} will appear here after ${time} on ${day}.`
}
