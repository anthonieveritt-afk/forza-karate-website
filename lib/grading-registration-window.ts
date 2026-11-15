// Registration window for a grading event (UK time).
// Keep in sync with club-honbu artifacts/api-server/src/lib/grading-registration-window.ts.
// After the usual register-by instant, parents can still register until the end
// of the day before belts are handed out (award_start), paying the usual fee
// plus a £20 emergency grading fee. Never call this a "surcharge".

export const TZ = "Europe/London";
export const EMERGENCY_GRADING_FEE_POUNDS = 20;
export type RegistrationMode = "normal" | "emergency" | "closed";

const LOCAL_RE = /^(\d{4}-\d{2}-\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/;

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

/** Calendar date in Europe/London (YYYY-MM-DD). */
export function londonYmd(now: Date): string {
  return now.toLocaleDateString("en-CA", { timeZone: TZ });
}

/** Add (possibly negative) whole days to a YYYY-MM-DD calendar date. */
export function addDaysYmd(ymd: string, days: number): string {
  const [y, m, d] = ymd.slice(0, 10).split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return `${dt.getUTCFullYear()}-${pad(dt.getUTCMonth() + 1)}-${pad(dt.getUTCDate())}`;
}

export function defaultEmergencyClosesOn(awardStart: string): string {
  return addDaysYmd(awardStart.slice(0, 10), -1);
}

/** Override if set, otherwise the day before belts are handed out. */
export function effectiveEmergencyClosesOn(awardStart: string, override: string | null | undefined): string {
  const raw = typeof override === "string" && /^\d{4}-\d{2}-\d{2}$/.test(override.trim()) ? override.trim() : null;
  return raw ?? defaultEmergencyClosesOn(awardStart);
}

function londonLocalString(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(d);
  const g = (t: string) => parts.find((p) => p.type === t)?.value ?? "00";
  return `${g("year")}-${g("month")}-${g("day")}T${g("hour")}:${g("minute")}:${g("second")}`;
}

/** Normalise a UK wall-clock stamp to YYYY-MM-DDTHH:mm:ss. */
export function normalizeLondonLocal(local: string): string {
  const m = LOCAL_RE.exec(String(local ?? "").trim());
  if (!m) throw new Error(`Invalid UK local datetime: ${local}`);
  return `${m[1]}T${m[2]}:${m[3]}:${m[4] ?? "00"}`;
}

/**
 * Instant corresponding to a Europe/London wall-clock time such as
 * "2026-12-04T23:59:59" or "2026-07-03T23:59:59" (BST).
 */
export function instantFromLondonLocal(local: string): Date {
  const wall = normalizeLondonLocal(local);
  let utc = Date.parse(`${wall}Z`);
  if (!Number.isFinite(utc)) throw new Error(`Invalid UK local datetime: ${local}`);
  for (let i = 0; i < 4; i++) {
    const shown = londonLocalString(new Date(utc));
    const diff = Date.parse(`${wall}Z`) - Date.parse(`${shown}Z`);
    utc += diff;
    if (diff === 0) break;
  }
  return new Date(utc);
}

export interface RegistrationWindowEvent {
  registerBy: string; // UK local YYYY-MM-DDTHH:mm[:ss]
  awardStart: string; // YYYY-MM-DD (first day belts are handed out)
  emergencyClosesOn?: string | null;
}

export function registrationMode(ev: RegistrationWindowEvent, now: Date = new Date()): RegistrationMode {
  const deadline = instantFromLondonLocal(ev.registerBy);
  if (now.getTime() <= deadline.getTime()) return "normal";
  const last = effectiveEmergencyClosesOn(ev.awardStart, ev.emergencyClosesOn);
  if (londonYmd(now) <= last) return "emergency";
  return "closed";
}

export function payableFeePounds(baseFee: number, mode: RegistrationMode): number | null {
  if (mode === "closed") return null;
  if (!Number.isFinite(baseFee) || baseFee < 0) return null;
  return mode === "emergency" ? baseFee + EMERGENCY_GRADING_FEE_POUNDS : baseFee;
}

/** Public wording for the emergency amount. Never says "surcharge". */
export function emergencyFeeWording(totalPounds: number): string {
  return `Emergency grading fee: £${totalPounds} (includes £${EMERGENCY_GRADING_FEE_POUNDS} late registration)`;
}

export const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
export const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function ordinal(n: number): string {
  const s = n % 100 >= 11 && n % 100 <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th";
  return `${n}${s}`;
}

/** "Sunday 13th December 2026" from a YYYY-MM-DD calendar date. */
export function ukDateLabel(ymd: string): string {
  const [y, m, d] = ymd.slice(0, 10).split("-").map(Number);
  const dow = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return `${DAYS[dow]} ${ordinal(d)} ${MONTHS[m - 1]} ${y}`;
}
