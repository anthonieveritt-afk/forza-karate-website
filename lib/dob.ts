/** Server-side date-of-birth check (mirrors the client UkDateOfBirthInput rules). */
export const DOB_MIN_AGE = 3
export const DOB_MAX_AGE = 100

/**
 * Accepts YYYY-MM-DD. Returns an error message, or '' when it is a real calendar
 * date in the past (UK date) giving an age between DOB_MIN_AGE and DOB_MAX_AGE.
 */
export function dobError(v: string, on = new Date()): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || '')
  if (!m) return 'Please enter a date of birth as DD/MM/YYYY.'
  const y = +m[1], mo = +m[2], d = +m[3]
  const dt = new Date(Date.UTC(y, mo - 1, d))
  if (dt.getUTCFullYear() !== y || dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d)
    return "That date of birth isn't a real date. Please check the day and month."
  // Today's date in the UK, so a UK birthday isn't wrongly accepted/rejected near midnight.
  const [ty, tm, td] = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit' })
    .format(on).split('-').map(Number)
  if (dt.getTime() >= Date.UTC(ty, tm - 1, td)) return 'Date of birth must be in the past.'
  let age = ty - y
  if (tm < mo || (tm === mo && td < d)) age--
  if (age < DOB_MIN_AGE) return `Students must be at least ${DOB_MIN_AGE} years old.`
  if (age > DOB_MAX_AGE) return `Please check the year of birth: that would make the student over ${DOB_MAX_AGE}.`
  return ''
}
