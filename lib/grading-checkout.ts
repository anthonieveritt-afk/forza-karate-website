import { gradingFee, GRADINGS } from '@/lib/gradings'
import {
  emergencyFeeWording,
  registrationMode,
  payableFeePounds,
  type RegistrationMode,
} from '@/lib/grading-registration-window'

export type PreviewWindow = 'normal' | 'emergency' | 'closed'

export type PublicGradingEvent = {
  name: string
  registerBy: string
  awardStart?: string
  awardEnd?: string
  awardLabel?: string
  registerDeadlineLabel?: string
  emergencyClosesOn?: string | null
  emergencyClosesLabel?: string
  registrationMode?: RegistrationMode
  notes?: string | null
  id?: number
}

/** True on Vercel previews and local dev — never on the live forzakarate.co.uk production deploy. */
export function isPreviewDeployment(env: Record<string, string | undefined> = process.env): boolean {
  if (env.VERCEL_ENV === 'production') return false
  if (env.VERCEL_ENV === 'preview' || env.VERCEL_ENV === 'development') return true
  if (!env.VERCEL_ENV && env.NODE_ENV === 'development') return true
  return false
}

export function parsePreviewWindow(v: unknown): PreviewWindow | null {
  return v === 'normal' || v === 'emergency' || v === 'closed' ? v : null
}

/** Live Stripe keys must never be used on a preview. */
export function stripeKeyAllowedForEnv(key: string, env: Record<string, string | undefined> = process.env): boolean {
  if (!isPreviewDeployment(env)) return true
  return /^(sk|rk)_test_/.test(key.trim())
}

export function localEvents(): PublicGradingEvent[] {
  return GRADINGS.map((g) => ({
    name: g.name,
    registerBy: g.registerByLocal,
    awardStart: g.awardStart,
    awardEnd: g.awardEnd,
    awardLabel: g.awardLabel,
    registerDeadlineLabel: g.registerDeadlineLabel,
  }))
}

export function findEvent(events: PublicGradingEvent[], name: string): PublicGradingEvent | null {
  const n = name.trim().toLowerCase()
  return events.find((e) => e.name.trim().toLowerCase() === n)
    ?? localEvents().find((e) => e.name.trim().toLowerCase() === n)
    ?? null
}

export function eventMode(ev: PublicGradingEvent, now: Date = new Date(), preview: PreviewWindow | null = null): RegistrationMode {
  if (preview) return preview
  const awardStart = ev.awardStart ?? localEvents().find((x) => x.name === ev.name)?.awardStart
  const registerBy = ev.registerBy || localEvents().find((x) => x.name === ev.name)?.registerBy
  if (awardStart && registerBy) {
    return registrationMode({ registerBy, awardStart, emergencyClosesOn: ev.emergencyClosesOn }, now)
  }
  return ev.registrationMode ?? 'normal'
}

export type ChargeOk = {
  ok: true
  event: PublicGradingEvent
  mode: RegistrationMode
  baseFee: number
  fee: number
  wording: string | null
  lineItemName: string
}
export type ChargeErr = { ok: false; error: string }

/**
 * Server-side price for a grading registration. Ignores any client-supplied fee
 * or emergency flag; those arguments exist only so tests can prove they are discarded.
 */
export function resolveGradingCharge(input: {
  grade: string
  gradingName: string
  events: PublicGradingEvent[]
  now?: Date
  previewWindow?: PreviewWindow | null
  isPreview?: boolean
  clientFee?: unknown
  clientIsEmergency?: unknown
}): ChargeOk | ChargeErr {
  void input.clientFee
  void input.clientIsEmergency
  const baseFee = gradingFee(input.grade)
  if (baseFee == null) return { ok: false, error: 'Please choose the grade and venue.' }
  const ev = findEvent(input.events, input.gradingName)
  if (!ev) return { ok: false, error: 'Please choose the grading.' }
  const preview = input.isPreview ? (input.previewWindow ?? null) : null
  const mode = eventMode(ev, input.now ?? new Date(), preview)
  if (mode === 'closed') {
    return { ok: false, error: 'Registration for this grading has now closed. The next grading will open for registration in the usual way.' }
  }
  const fee = payableFeePounds(baseFee, mode)
  if (fee == null) return { ok: false, error: 'Registration for this grading has now closed. The next grading will open for registration in the usual way.' }
  const wording = mode === 'emergency' ? emergencyFeeWording(fee) : null
  const lineItemName = mode === 'emergency' ? 'Emergency grading fee' : `Grading fee — ${input.grade.split('–')[0].trim()}`
  return { ok: true, event: ev, mode, baseFee, fee, wording, lineItemName }
}
