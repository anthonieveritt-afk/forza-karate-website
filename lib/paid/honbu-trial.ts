// Posts a trial booking into Club Honbu's trial_members via the existing trial webhook.
const DEFAULT_HONBU = 'https://forza-club-honbu-production.up.railway.app'

export type TrialDetails = {
  parentName: string
  childName?: string
  age?: string
  email: string
  phone: string
  dateOfBirth?: string
  dojo: string
  ageGroup: string
  message?: string
}

function splitName(full: string): { first: string; last: string } {
  const parts = (full || '').trim().split(/\s+/)
  const first = parts[0] || ''
  const last = parts.slice(1).join(' ') || first
  return { first, last }
}

/**
 * paidNote, when given, is stored in the trial's notes. Club Honbu's webhook has no
 * "paid" column yet, so the note goes in via the "How did you hear" field, which
 * Club Honbu writes into notes as "Referral: …".
 */
export async function postTrialToHonbu(d: TrialDetails, paidNote?: string): Promise<{ ok: boolean; status?: number; detail?: string }> {
  const honbuUrl = (process.env.CLUB_HONBU_URL || DEFAULT_HONBU).replace(/\/$/, '')
  const secret = process.env.CLUB_HONBU_WEBHOOK_SECRET?.trim()
  if (!secret) return { ok: false, detail: 'CLUB_HONBU_WEBHOOK_SECRET not set' }

  const student = (d.childName || '').trim() || d.parentName
  const { first, last } = splitName(student)
  const notes = [paidNote, d.age ? `Age: ${d.age}` : '', d.message || ''].filter(Boolean).join(' | ')

  const res = await fetch(`${honbuUrl}/api/webhooks/formsmarts/trial?token=${encodeURIComponent(secret)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      'First Name': first,
      'Last Name': last,
      Email: d.email,
      Phone: d.phone,
      'Date of Birth': d.dateOfBirth || '',
      'Which Club': d.dojo,
      'Preferred Class': d.ageGroup,
      'Parent Name': d.parentName,
      'How did you hear': notes,
      Medical: d.message || '',
      Source: 'Forza website trial form',
    }),
    cache: 'no-store',
  })
  if (!res.ok) return { ok: false, status: res.status, detail: (await res.text().catch(() => '')).slice(0, 300) }
  return { ok: true, status: res.status }
}
