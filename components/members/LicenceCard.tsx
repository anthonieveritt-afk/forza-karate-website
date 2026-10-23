import { LicenceEditor } from './LicenceEditor'

function parseDate(d: string | null | undefined): Date | null {
  if (!d) return null
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(d)
  const dt = m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : new Date(d)
  return isNaN(dt.getTime()) ? null : dt
}

function fmt(d: Date | null): string {
  return d ? d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : '—'
}

/** Today's date in the UK, as a UTC-midnight Date. */
function todayUK(now = new Date()): Date {
  const s = now.toLocaleDateString('en-CA', { timeZone: 'Europe/London' })
  return parseDate(s) as Date
}

/** Whole months + days from a to b (a <= b). */
function monthsDays(a: Date, b: Date): { months: number; days: number } {
  let months = (b.getUTCFullYear() - a.getUTCFullYear()) * 12 + (b.getUTCMonth() - a.getUTCMonth())
  const anchor = (n: number) => {
    const y = a.getUTCFullYear(), mo = a.getUTCMonth() + n
    const last = new Date(Date.UTC(y, mo + 1, 0)).getUTCDate()
    return new Date(Date.UTC(y, mo, Math.min(a.getUTCDate(), last)))
  }
  if (anchor(months) > b) months -= 1
  const days = Math.round((b.getTime() - anchor(months).getTime()) / 86400000)
  return { months, days }
}

function plural(n: number, w: string) {
  return `${n} ${w}${n === 1 ? '' : 's'}`
}

export function LicenceCard({
  licenceNumber,
  licenceStartDate,
  licenceExpiryDate,
  renewHref = '/members/licence',
}: {
  licenceNumber?: string | null
  licenceStartDate?: string | null
  licenceExpiryDate?: string | null
  renewHref?: string
}) {
  const start = parseDate(licenceStartDate)
  const expiry = parseDate(licenceExpiryDate)
  const hasAny = !!(licenceNumber || start || expiry)

  const header = (
    <div className="flex items-center gap-2 mb-6">
      <div className="w-6 h-0.5 bg-[#dc2626]" />
      <h2 className="text-lg font-bold text-[#111111]">Licence</h2>
    </div>
  )

  if (!hasAny) {
    return (
      <div className="bg-white rounded-2xl border border-black/8 p-8 shadow-sm">
        {header}
        <p className="text-sm text-gray-500">
          No licence on record yet. If you think this is wrong, please speak to your instructor or{' '}
          <a href={renewHref} className="text-[#dc2626] font-medium hover:underline">get in touch</a>.
        </p>
        <LicenceEditor licenceNumber={licenceNumber} licenceStartDate={licenceStartDate} licenceExpiryDate={licenceExpiryDate} />
      </div>
    )
  }

  const today = todayUK()
  let status: 'ok' | 'soon' | 'expired' | 'unknown' = 'unknown'
  let countdown = 'No expiry date on record'
  let pct = 0
  if (expiry) {
    const daysLeft = Math.round((expiry.getTime() - today.getTime()) / 86400000)
    if (daysLeft < 0) {
      status = 'expired'
      const { months, days } = monthsDays(expiry, today)
      countdown = `Expired ${months > 0 ? plural(months, 'month') + ' ' : ''}${plural(days, 'day')} ago`
    } else {
      status = daysLeft <= 60 ? 'soon' : 'ok'
      const { months, days } = monthsDays(today, expiry)
      countdown = daysLeft === 0 ? 'Expires today' : `${months > 0 ? plural(months, 'month') + ' ' : ''}${plural(days, 'day')} left`
    }
    if (start && expiry > start) {
      pct = Math.min(100, Math.max(0, ((today.getTime() - start.getTime()) / (expiry.getTime() - start.getTime())) * 100))
    }
  }

  const tone = {
    ok: { box: 'border-green-200 bg-green-50', text: 'text-green-700', bar: 'bg-green-500', label: 'Active' },
    soon: { box: 'border-amber-200 bg-amber-50', text: 'text-amber-700', bar: 'bg-amber-500', label: 'Renewal due soon' },
    expired: { box: 'border-red-200 bg-red-50', text: 'text-red-700', bar: 'bg-red-500', label: 'Expired' },
    unknown: { box: 'border-gray-200 bg-gray-50', text: 'text-gray-600', bar: 'bg-gray-400', label: 'Status unknown' },
  }[status]

  return (
    <div className="bg-white rounded-2xl border border-black/8 p-8 shadow-sm">
      {header}
      <div className="grid gap-6 md:grid-cols-[1fr_1.2fr]">
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-1">
          <div>
            <dt className="text-xs uppercase tracking-wider text-gray-400">Licence number</dt>
            <dd className="mt-1 text-lg font-semibold text-[#111111] font-mono">{licenceNumber || '—'}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-gray-400">Start date</dt>
            <dd className="mt-1 text-sm font-medium text-[#111111]">{fmt(start)}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-wider text-gray-400">Expiry date</dt>
            <dd className="mt-1 text-sm font-medium text-[#111111]">{fmt(expiry)}</dd>
          </div>
        </dl>

        <div className={`rounded-xl border p-5 ${tone.box}`} role="status">
          <p className={`text-xs font-semibold uppercase tracking-wider ${tone.text}`}>{tone.label}</p>
          <p className={`mt-1 text-2xl font-bold ${tone.text}`}>{countdown}</p>
          {pct > 0 && (
            <div className="mt-4 h-2 w-full rounded-full bg-white/80 ring-1 ring-black/5" aria-hidden="true">
              <div className={`h-2 rounded-full ${tone.bar}`} style={{ width: `${pct}%` }} />
            </div>
          )}
          {(status === 'soon' || status === 'expired') && (
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href={renewHref}
                className="inline-flex items-center rounded-lg bg-[#dc2626] px-4 py-2 text-sm font-semibold text-white hover:bg-[#b91c1c] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]/50"
              >
                Renew licence
              </a>
              <span className="text-xs text-gray-600">
                {status === 'expired'
                  ? 'You need a valid licence to train, grade and compete.'
                  : 'Renew before it runs out to keep training, grading and competing.'}
              </span>
            </div>
          )}
        </div>
      </div>
      <LicenceEditor licenceNumber={licenceNumber} licenceStartDate={licenceStartDate} licenceExpiryDate={licenceExpiryDate} />
    </div>
  )
}
