import { CertificateButtons } from './CertificateButtons'

/** 1st/2nd Class and Pass all count as passes. */
export function isPassResult(result: string | null | undefined): boolean {
  if (!result) return false
  const r = result.toLowerCase()
  if (/fail|refer|defer|not pass|unsuccess/.test(r)) return false
  return /pass|class|merit|distinction/.test(r)
}


export type Grading = {
  id: number
  gradingDate: string
  fromBelt: string | null
  toBelt: string | null
  result: string | null
  examiner?: string | null
}

/** Tidy imported belt text: "11th Kyu ‚Orange Belt" -> "11th Kyu – Orange Belt". */
export function cleanBelt(belt: string | null | undefined): string {
  if (!belt) return ''
  return belt
    .replace(/\s*[‚,]\s*/, ' – ')
    .replace(/\s+-\s+/g, ' – ')
    .replace(/\s*[–-]\s*$/, '')
    .replace(/\b14h\b/, '14th')
    .replace(/\s+/g, ' ')
    .trim()
}

function gradeKey(belt: string): string {
  return cleanBelt(belt).split('–')[0].trim().toLowerCase()
}

function isDan(belt: string): boolean {
  return /\bdan\b/i.test(belt)
}

type Swatch = { base: string; stripe?: string }

const COLOURS: Record<string, string> = {
  black: '#111111',
  brown: '#7c4a1e',
  purple: '#7e22ce',
  blue: '#1d4ed8',
  green: '#15803d',
  orange: '#ea580c',
  yellow: '#facc15',
  red: '#dc2626',
  white: '#f5f5f4',
}

/** Belt colour from the stored belt text (Dan = black). Plain "9th Kyu" with no colour gets a neutral swatch. */
export function beltSwatch(belt: string): Swatch {
  if (isDan(belt)) return { base: COLOURS.black, stripe: '#dc2626' }
  const parts = cleanBelt(belt).toLowerCase().split('–')[1] ?? ''
  const [main, stripePart] = parts.split('/')
  const find = (s?: string) => {
    if (!s) return undefined
    for (const c of Object.keys(COLOURS)) if (s.includes(c)) return COLOURS[c]
    return undefined
  }
  const base = find(main)
  if (!base) return { base: '#d6d3d1' }
  let stripe = find(stripePart)
  if (!stripe && /stripe/.test(parts)) stripe = base === COLOURS.white ? COLOURS.red : COLOURS.white
  if (!stripe && /stripe/.test(main) && base) stripe = COLOURS.white
  return { base, stripe }
}

function formatDate(d: string): string {
  const dt = new Date(d)
  if (isNaN(dt.getTime())) return d
  return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function BeltStripe({ belt, size = 'md' }: { belt: string; size?: 'md' | 'lg' }) {
  const s = beltSwatch(belt)
  const h = size === 'lg' ? 'h-4 w-16' : 'h-3 w-12'
  return (
    <span
      aria-hidden="true"
      className={`relative inline-block ${h} rounded-sm ring-1 ring-black/15 shrink-0 overflow-hidden`}
      style={{ backgroundColor: s.base }}
    >
      {s.stripe && <span className="absolute inset-y-0 right-2 w-1.5" style={{ backgroundColor: s.stripe }} />}
    </span>
  )
}

function ClassBadge({ result }: { result: string | null }) {
  if (!result) return null
  const first = /^1st/i.test(result)
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold tracking-wide ${
        first ? 'bg-[#dc2626]/10 text-[#b91c1c]' : 'bg-gray-100 text-gray-600'
      }`}
    >
      {result}
    </span>
  )
}

type Step = { g: Grading; from: string | null; to: string; first: boolean }

function StepCard({ step, isCurrent, studentName }: { step: Step; isCurrent: boolean; studentName?: string }) {
  const { g, from, to, first } = step
  return (
    <li className="relative pl-8">
      <span
        aria-hidden="true"
        className={`absolute left-[7px] top-6 h-3 w-3 rounded-full ring-4 ring-white ${isCurrent ? 'bg-[#dc2626]' : 'bg-gray-300'}`}
      />
      <div className={`rounded-xl border bg-white p-4 shadow-sm ${isCurrent ? 'border-[#dc2626]/40' : 'border-black/8'}`}>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <time dateTime={g.gradingDate} className="text-xs font-medium uppercase tracking-wider text-gray-400">
            {formatDate(g.gradingDate)}
          </time>
          <ClassBadge result={g.result} />
        </div>
        <div className="mt-2 flex items-center gap-3">
          <BeltStripe belt={to} />
          <p className="text-base font-semibold text-[#111111]">
            {first ? <span className="font-normal text-gray-500">Started — </span> : null}
            {to}
          </p>
        </div>
        {!first && from && (
          <p className="mt-1 text-xs text-gray-400">
            <span className="sr-only">Graded </span>from {from}
          </p>
        )}
        {studentName && isPassResult(g.result) && (
          <CertificateButtons studentName={studentName} toBelt={g.toBelt ?? to} gradingDate={g.gradingDate.slice(0, 10)} />
        )}
      </div>
    </li>
  )
}

export function BeltJourney({ gradings, currentBelt, studentName }: { gradings: Grading[]; currentBelt?: string | null; studentName?: string }) {
  const sorted = [...gradings]
    .filter((g) => g.toBelt)
    .sort((a, b) => a.gradingDate.localeCompare(b.gradingDate) || a.id - b.id)

  const steps: Step[] = sorted.map((g, i) => {
    const to = cleanBelt(g.toBelt)
    let from: string | null = cleanBelt(g.fromBelt) || null
    // First entry: never show a "from" grade (imports stored the member's current belt there).
    if (i === 0) from = null
    if (from && gradeKey(from) === gradeKey(to)) from = null
    return { g, from, to, first: i === 0 }
  })

  if (steps.length === 0) return <p className="text-sm text-gray-400">No gradings recorded yet.</p>

  const latest = steps[steps.length - 1]
  const current = cleanBelt(currentBelt) || latest.to
  const kyu = steps.filter((s) => !isDan(s.to))
  const dan = steps.filter((s) => isDan(s.to))

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 rounded-xl border border-[#dc2626]/30 bg-gradient-to-br from-white to-[#dc2626]/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <BeltStripe belt={current} size="lg" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#dc2626]">Current grade</p>
            <p className="text-xl font-bold text-[#111111]">{current}</p>
          </div>
        </div>
        <div className="text-sm text-gray-500 sm:text-right">
          <p>
            Since <span className="font-medium text-[#111111]">{formatDate(latest.g.gradingDate)}</span>
          </p>
          <p>
            {steps.length} grading{steps.length === 1 ? '' : 's'} · started {formatDate(steps[0].g.gradingDate)}
          </p>
        </div>
      </div>

      {[
        { title: 'Kyu grades', items: kyu },
        { title: 'Dan grades', items: dan },
      ]
        .filter((sec) => sec.items.length > 0)
        .map((sec) => (
          <section key={sec.title} aria-label={sec.title}>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
              {sec.title} <span className="font-normal text-gray-400">({sec.items.length})</span>
            </h3>
            <ol className="relative space-y-3 before:absolute before:left-[12px] before:top-2 before:bottom-2 before:w-px before:bg-gray-200">
              {sec.items.map((s) => (
                <StepCard key={s.g.id} step={s} isCurrent={s === latest} studentName={studentName} />
              ))}
            </ol>
          </section>
        ))}
    </div>
  )
}
