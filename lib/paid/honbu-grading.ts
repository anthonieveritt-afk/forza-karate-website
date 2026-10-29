// Hands a PAID grading registration to Club Honbu (grading_requests, status "paid").
// Called only from the Stripe webhook after payment_status === 'paid'. Token = CLUB_HONBU_WEBHOOK_SECRET.
const DEFAULT_HONBU = 'https://forza-club-honbu-production.up.railway.app'

export async function postPaidGradingToHonbu(d: Record<string, string>, stripeSessionId: string, amountPence: number): Promise<{ ok: boolean; status?: number; detail?: string }> {
  const honbuUrl = (process.env.CLUB_HONBU_URL || DEFAULT_HONBU).replace(/\/$/, '')
  const secret = process.env.CLUB_HONBU_WEBHOOK_SECRET?.trim()
  if (!secret) return { ok: false, detail: 'CLUB_HONBU_WEBHOOK_SECRET not set' }
  const res = await fetch(`${honbuUrl}/api/webhooks/website/grading-paid?token=${encodeURIComponent(secret)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      memberName: d.memberName, parentName: d.parentName || '', email: d.email,
      currentBelt: d.grade, dojo: d.dojo, gradingName: d.gradingName,
      notes: [`Venue: ${d.venue}`, d.notes || ''].filter(Boolean).join('\n'),
      stripeSessionId, amountPence,
    }),
    cache: 'no-store',
  })
  if (!res.ok) return { ok: false, status: res.status, detail: (await res.text().catch(() => '')).slice(0, 300) }
  return { ok: true, status: res.status }
}
