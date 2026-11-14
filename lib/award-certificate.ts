// Copied from club-honbu artifacts/karate-club/src/lib/award-certificate.ts (Office → Certificates)
// so portal copies of award certificates look exactly like the printed ones. Keep the two in sync.
/**
 * Award certificates (Student of the Year etc.) for the Forza Club Honbu Office.
 *
 * Pure jsPDF drawing code — no DOM, no network, no `import.meta.env` — so the
 * same function renders in the browser (Awards page) and in Node (tests and
 * sample exports). Assets (logo, emblem, grading-certificate badge row, fonts)
 * are passed in; see `award-certificate-assets.ts` for the browser loader.
 *
 * To add a new award, append an entry to AWARD_TYPES. Anything else can be
 * made with the "Custom award" option (free-text title, any metal).
 */
import { jsPDF, GState } from "jspdf";

export type Metal = "gold" | "silver" | "bronze";

export const METAL_NAMES: Record<Metal, string> = { gold: "Gold", silver: "Silver", bronze: "Bronze" };

export type Place = "1st" | "2nd" | "3rd";

/** Who the Office name picker suggests first for an award. */
export type AwardAudience = "members" | "adults" | "instructors" | "club" | "voted";

export interface AwardType {
  id: string;
  /** Printed on the certificate and shown in the Office */
  title: string;
  audience: AwardAudience;
  /** Default wording under the name. `{club}` is replaced with the chosen club. */
  citation: string;
  /** Short help text for the Office page */
  hint?: string;
  /** Per-club award: bulk mode shows one block per club (1st/2nd/3rd each); the club is printed on the award line. */
  perClub?: boolean;
}

/**
 * The awards offered on the Office Awards page. To add a new award, append one
 * entry here — it automatically gets 1st (Gold), 2nd (Silver) and 3rd (Bronze).
 */
export const AWARD_TYPES: AwardType[] = [
  { id: "student-of-the-year", title: "Student of the Year", audience: "members",
    citation: "in recognition of outstanding dedication, effort and achievement" },
  { id: "adult-student-of-the-year", title: "Adult Student of the Year", audience: "adults",
    citation: "in recognition of outstanding dedication, effort and achievement", hint: "Adults (18+) are listed first." },
  { id: "best-kumite", title: "Best Kumite Student of the Year", audience: "members",
    citation: "in recognition of outstanding skill, spirit and sportsmanship in kumite" },
  { id: "best-kata", title: "Best Kata Student of the Year", audience: "members",
    citation: "in recognition of outstanding skill, precision and spirit in kata" },
  { id: "best-attendance", title: "Best Attendance", audience: "club",
    citation: "for outstanding commitment and attendance at Forza Karate {club}",
    hint: "Choose the club first. The club name is printed on the certificate." },
  { id: "best-male", title: "Best Male", audience: "club", perClub: true,
    citation: "for outstanding achievement as Best Male at Forza Karate {club}",
    hint: "One per club. The club name is printed on the certificate." },
  { id: "best-female", title: "Best Female", audience: "club", perClub: true,
    citation: "for outstanding achievement as Best Female at Forza Karate {club}",
    hint: "One per club. The club name is printed on the certificate." },
  { id: "instructor-of-the-year", title: "Instructor of the Year", audience: "instructors",
    citation: "in recognition of outstanding teaching, leadership and dedication to the club",
    hint: "Instructors and staff are listed first, then all members." },
  { id: "future-champion", title: "Future Champion", audience: "members",
    citation: "in recognition of exceptional promise, effort and fighting spirit" },
  { id: "karateka-of-the-year", title: "Karate-ka of the Year", audience: "voted",
    citation: "as voted by the members of Forza Karate Club" },
];

export const PLACES: { place: Place; metal: Metal }[] = [
  { place: "1st", metal: "gold" },
  { place: "2nd", metal: "silver" },
  { place: "3rd", metal: "bronze" },
];

export interface AwardPreset {
  id: string;
  /** Text shown in dropdowns */
  label: string;
  awardTypeId: string;
  awardTitle: string;
  place: Place;
  metal: Metal;
}

/** Every award × 1st/2nd/3rd. */
export const AWARD_PRESETS: AwardPreset[] = AWARD_TYPES.flatMap(t => PLACES.map(p => ({
  id: `${t.id}-${p.place}`,
  label: `${t.title} — ${p.place} (${METAL_NAMES[p.metal]})`,
  awardTypeId: t.id,
  awardTitle: t.title,
  place: p.place,
  metal: p.metal,
})));

/** Fill `{club}` in an award's default wording. */
export function awardCitation(type: Pick<AwardType, "citation">, club?: string): string {
  const c = (club ?? "").trim();
  return type.citation.replace(/\s*\{club\}/g, c ? ` ${c}` : "").trim();
}

export const CUSTOM_AWARD_ID = "custom";
export const DEFAULT_AWARD_DATE = "2026-11-27";
export const DEFAULT_CITATION = "in recognition of outstanding dedication, effort and achievement";

export interface AwardCertificateOptions {
  studentName: string;
  awardTitle: string;
  /** "1st", "2nd", "3rd" … or "" for no place (a star is drawn instead) */
  place?: string;
  metal: Metal;
  /** Club name printed on the place banner (e.g. Best Attendance), optional */
  club?: string;
  /** yyyy-mm-dd */
  date: string;
  citation?: string;
  /** "classic" = Anthoni's design (default); "metallic" = the earlier gold/silver/bronze frame design */
  style?: CertificateStyle;
  /** Classic: left signature (Chief Instructor) and right signature (Club Representative) */
  chiefSignature?: SignatureSpec;
  repSignature?: SignatureSpec;
  /** Classic: small grading-certificate badge row bottom-left (default on) */
  showBadges?: boolean;
  /** Metallic style only */
  showSignature?: boolean;
  signatoryName?: string;
  signatoryTitle?: string;
}

export type CertificateStyle = "classic" | "metallic";

/** A typed name (printed in script) and/or an uploaded signature image. Images win over names. */
export interface SignatureSpec {
  name?: string;
  /** PNG data URL with dark ink on transparent background (for white areas) */
  imageDark?: string;
  /** PNG data URL with white ink on transparent background (for the black ribbon) */
  imageLight?: string;
  /** width / height of the image, so it keeps its shape */
  imageAspect?: number;
}

/** Wording from Anthoni's design; the default on every award (editable in the Office). */
export const DESIGN_CITATION = "For outstanding dedication, discipline, perseverance and the true spirit of karate.";

/** Default wording for an award in a style. */
export function defaultCitation(type: Pick<AwardType, "citation">, club: string | undefined, style: CertificateStyle = "classic"): string {
  return style === "classic" ? DESIGN_CITATION : awardCitation(type, club);
}

/** Award line under CERTIFICATE (classic): "Best Attendance · Rayleigh". */
export function awardLine(title: string, club?: string): string {
  const c = (club ?? "").trim();
  return c ? `${title.trim()} · ${c}` : title.trim();
}

export interface AwardAssets {
  /** data: URLs (PNG) */
  /** "FORZA KARATE" wordmark logo (classic design) */
  wordmark: string;
  forzaLogo: string;
  emblem: string;
  badges: string;
  /** base64 TTF data keyed by file name (see AWARD_FONT_FILES) */
  fonts: Record<string, string>;
}

export const AWARD_FONT_FILES: readonly { file: string; family: string; style: string; for: readonly CertificateStyle[] }[] = [
  { file: "Gelasio-Regular.ttf", family: "Gelasio", style: "normal", for: ["classic"] },
  { file: "Gelasio-Bold.ttf", family: "Gelasio", style: "bold", for: ["classic"] },
  { file: "Gelasio-Italic.ttf", family: "Gelasio", style: "italic", for: ["classic"] },
  { file: "GreatVibes-Regular.ttf", family: "GreatVibes", style: "normal", for: ["classic", "metallic"] },
  { file: "Cinzel-Bold.ttf", family: "Cinzel", style: "bold", for: ["metallic"] },
  { file: "Cinzel-Regular.ttf", family: "Cinzel", style: "normal", for: ["metallic"] },
  { file: "CormorantGaramond-MediumItalic.ttf", family: "Cormorant", style: "italic", for: ["metallic"] },
  { file: "CormorantGaramond-SemiBold.ttf", family: "Cormorant", style: "bold", for: ["metallic"] },
];

export const AWARD_IMAGE_FILES = {
  wordmark: "forza-karate-logo.png",
  forzaLogo: "forza-logo-round.png",
  emblem: "wado-emblem.png",
  badges: "grading-badges.png",
} as const;

// ─── Pure helpers (unit tested) ──────────────────────────────────────────────

type RGB = [number, number, number];

interface MetalPalette {
  /** dark → highlight ramp used for bevels and the medal */
  ramp: RGB[];
  title: RGB;
  titleShadow: RGB;
  ribbon: RGB;
  ribbonDark: RGB;
  name: string;
}

export const METALS: Record<Metal, MetalPalette> = {
  gold: {
    ramp: [[110, 78, 12], [168, 124, 31], [212, 175, 55], [246, 224, 138], [255, 247, 205]],
    title: [168, 123, 31], titleShadow: [92, 66, 12],
    ribbon: [200, 16, 46], ribbonDark: [128, 8, 28], name: "Gold",
  },
  silver: {
    ramp: [[84, 89, 95], [128, 134, 141], [184, 189, 195], [225, 228, 231], [255, 255, 255]],
    title: [112, 118, 125], titleShadow: [52, 56, 61],
    ribbon: [31, 42, 68], ribbonDark: [16, 22, 38], name: "Silver",
  },
  bronze: {
    ramp: [[82, 44, 18], [134, 82, 40], [184, 115, 51], [217, 160, 102], [245, 214, 178]],
    title: [150, 88, 40], titleShadow: [74, 40, 14],
    ribbon: [36, 110, 52], ribbonDark: [18, 66, 30], name: "Bronze",
  },
};

function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

/** Sample a colour ramp at t∈[0,1]. */
export function sampleRamp(ramp: RGB[], t: number): RGB {
  const x = Math.min(1, Math.max(0, t)) * (ramp.length - 1);
  const i = Math.min(ramp.length - 2, Math.floor(x));
  const f = x - i;
  return [0, 1, 2].map(k => Math.round(lerp(ramp[i][k], ramp[i + 1][k], f))) as RGB;
}

/** Metallic sheen across a band: dark → highlight → dark. */
export function sheen(ramp: RGB[], t: number): RGB {
  return sampleRamp(ramp, 1 - Math.abs(Math.min(1, Math.max(0, t)) * 2 - 1));
}

export function ordinalSuffix(day: number): string {
  if (day % 100 >= 11 && day % 100 <= 13) return "th";
  switch (day % 10) { case 1: return "st"; case 2: return "nd"; case 3: return "rd"; default: return "th"; }
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

/** "2026-11-27" → "27th November 2026". Falls back to the raw string. */
export function formatAwardDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((iso ?? "").trim());
  if (!m) return (iso ?? "").trim();
  const day = Number(m[3]); const month = Number(m[2]);
  if (month < 1 || month > 12 || day < 1 || day > 31) return iso.trim();
  return `${day}${ordinalSuffix(day)} ${MONTHS[month - 1]} ${m[1]}`;
}

export function placeLabel(place?: string): string {
  const p = (place ?? "").trim();
  return p ? `${p} Place` : "";
}

export function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "certificate";
}

export function awardFilename(o: Pick<AwardCertificateOptions, "studentName" | "awardTitle" | "place">): string {
  const parts = [o.awardTitle, o.place ?? "", o.studentName].map(s => (s ?? "").trim()).filter(Boolean);
  return `award-${slugify(parts.join(" "))}.pdf`;
}

export function presetToOptions(preset: AwardPreset): Pick<AwardCertificateOptions, "awardTitle" | "place" | "metal" | "citation"> {
  const type = AWARD_TYPES.find(t => t.id === preset.awardTypeId);
  return { awardTitle: preset.awardTitle, place: preset.place, metal: preset.metal, citation: type ? awardCitation(type) : undefined };
}

/** "Rayleigh Primary School, Love Lane" → "Rayleigh"; "Upminster - St Lawrence Church" → "Upminster". */
export function clubShortName(clubName: string | null | undefined): string {
  const s = (clubName ?? "").trim();
  if (!s) return "";
  return s.split(/[\s,–-]+/).filter(Boolean)[0] ?? s;
}

/** Age in whole years on `today` (yyyy-mm-dd), or null if unknown. */
export function ageOn(dateOfBirth: string | null | undefined, today: string): number | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(dateOfBirth ?? "");
  const t = /^(\d{4})-(\d{2})-(\d{2})/.exec(today);
  if (!m || !t) return null;
  let age = Number(t[1]) - Number(m[1]);
  if (Number(t[2]) < Number(m[2]) || (Number(t[2]) === Number(m[2]) && Number(t[3]) < Number(m[3]))) age--;
  return age >= 0 && age < 120 ? age : null;
}

export interface NamedMember { id: number; firstName: string; surname: string; active?: boolean; isStaff?: boolean; dateOfBirth?: string | null; clubName?: string | null }

export function memberFullName(m: Pick<NamedMember, "firstName" | "surname">): string {
  return `${(m.firstName ?? "").trim()} ${(m.surname ?? "").trim()}`.replace(/\s+/g, " ").trim();
}

/** Active members only, de-duplicated by full name, sorted A–Z by first name then surname. */
export function memberNameOptions(members: NamedMember[] | undefined | null): { id: number; name: string }[] {
  const seen = new Set<string>();
  const out: { id: number; name: string }[] = [];
  for (const m of members ?? []) {
    if (m.active === false) continue;
    const name = memberFullName(m);
    if (!name) continue;
    const key = name.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ id: m.id, name });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name, "en-GB", { sensitivity: "base" }));
}

export interface NameGroup { label: string; names: { id: number; name: string }[] }

/**
 * Name-picker groups for an award: the suggested people first, then everyone else.
 * - adults: members aged 18+ on `today`, plus all staff/instructors, first
 * - instructors: staff/instructors first
 * - club: only members of `club` (exact clubName) — Best Attendance is per club
 */
export function nameGroupsFor(audience: AwardAudience, members: NamedMember[] | undefined | null, opts: { today: string; club?: string } ): NameGroup[] {
  const list = (members ?? []).filter(m => m.active !== false);
  if (audience === "club") {
    const club = (opts.club ?? "").trim().toLowerCase();
    const inClub = club ? list.filter(m => (m.clubName ?? "").trim().toLowerCase() === club) : list;
    return [{ label: club ? "Members of this club" : "All members", names: memberNameOptions(inClub) }];
  }
  let first: NamedMember[] = [];
  let firstLabel = "";
  if (audience === "adults") {
    // Instructors/staff always count as adults, even if their date of birth is missing or wrong.
    first = list.filter(m => { if (m.isStaff) return true; const a = ageOn(m.dateOfBirth ?? null, opts.today); return a != null && a >= 18; });
    firstLabel = "Adults (18+)";
  } else if (audience === "instructors") {
    first = list.filter(m => m.isStaff);
    firstLabel = "Instructors & staff";
  }
  if (!first.length) return [{ label: "All members", names: memberNameOptions(list) }];
  const firstIds = new Set(first.map(m => m.id));
  const firstNames = memberNameOptions(first);
  const taken = new Set(firstNames.map(n => n.name.toLowerCase()));
  const rest = memberNameOptions(list.filter(m => !firstIds.has(m.id))).filter(n => !taken.has(n.name.toLowerCase()));
  return [{ label: firstLabel, names: firstNames }, { label: "Everyone else", names: rest }];
}

/** Case/accent-insensitive "every word appears" search. */
export function filterNames<T extends { name: string }>(options: T[], query: string): T[] {
  const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const words = norm(query).split(/\s+/).filter(Boolean);
  if (!words.length) return options;
  return options.filter(o => { const n = norm(o.name); return words.every(w => n.includes(w)); });
}

// ─── Drawing ────────────────────────────────────────────────────────────────

const W = 297;
const H = 210;
const CX = W / 2;
const INK: RGB = [28, 28, 30];
const SOFT: RGB = [70, 70, 74];

function fill(doc: jsPDF, c: RGB) { doc.setFillColor(c[0], c[1], c[2]); }
function stroke(doc: jsPDF, c: RGB) { doc.setDrawColor(c[0], c[1], c[2]); }
function ink(doc: jsPDF, c: RGB) { doc.setTextColor(c[0], c[1], c[2]); }

function poly(doc: jsPDF, pts: [number, number][], style: "F" | "S" | "FD" = "F") {
  const [x0, y0] = pts[0];
  const segs: [number, number][] = [];
  for (let i = 1; i < pts.length; i++) segs.push([pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]]);
  doc.lines(segs, x0, y0, [1, 1], style, true);
}

/** Centred text with letter spacing (jsPDF's align ignores charSpace). */
function spacedText(doc: jsPDF, text: string, cx: number, y: number, charSpace: number) {
  const w = doc.getTextWidth(text) + charSpace * Math.max(0, text.length - 1);
  doc.text(text, cx - w / 2, y, { charSpace });
}

function fitFont(doc: jsPDF, text: string, maxW: number, start: number, min: number, charSpace = 0) {
  let size = start;
  doc.setFontSize(size);
  const width = () => doc.getTextWidth(text) + charSpace * Math.max(0, text.length - 1);
  while (width() > maxW && size > min) { size -= 0.5; doc.setFontSize(size); }
  return size;
}

function registerFonts(doc: jsPDF, fonts: Record<string, string>, styles: Set<CertificateStyle>) {
  for (const f of AWARD_FONT_FILES) {
    if (!f.for.some(s => styles.has(s))) continue;
    const data = fonts[f.file];
    if (!data) throw new Error(`Missing font ${f.file}`);
    doc.addFileToVFS(f.file, data);
    doc.addFont(f.file, f.family, f.style);
  }
}

function drawFrame(doc: jsPDF, p: MetalPalette) {
  // Outer bevelled metal band (inset 5 → 12mm)
  const outer = 5, inner = 12, steps = 36;
  const step = (inner - outer) / steps;
  doc.setLineWidth(step * 1.15);
  for (let i = 0; i < steps; i++) {
    const t = (i + 0.5) / steps;
    stroke(doc, sheen(p.ramp, t));
    const inset = outer + step * (i + 0.5);
    doc.rect(inset, inset, W - inset * 2, H - inset * 2, "S");
  }
  // Fine dark edge lines either side of the band
  stroke(doc, p.ramp[0]);
  doc.setLineWidth(0.35);
  doc.rect(outer, outer, W - outer * 2, H - outer * 2, "S");
  doc.rect(inner, inner, W - inner * 2, H - inner * 2, "S");
  // Inner hairline
  stroke(doc, p.ramp[1]);
  doc.setLineWidth(0.3);
  const hl = 14.5;
  doc.rect(hl, hl, W - hl * 2, H - hl * 2, "S");
  // Corner diamonds
  for (const [x, y] of [[hl, hl], [W - hl, hl], [hl, H - hl], [W - hl, H - hl]] as [number, number][]) {
    const r = 2.6;
    fill(doc, p.ramp[1]);
    poly(doc, [[x, y - r], [x + r, y], [x, y + r], [x - r, y]]);
    fill(doc, p.ramp[3]);
    const r2 = 1.2;
    poly(doc, [[x, y - r2], [x + r2, y], [x, y + r2], [x - r2, y]]);
  }
}

function drawRibbon(doc: jsPDF, p: MetalPalette, cx: number, medalTop: number) {
  const top = 9;
  const w = 11;
  const bottom = medalTop + 6;
  // Left strip runs from top-left down to the medal; right strip mirrors it.
  const strips: { tl: number; bl: number }[] = [
    { tl: cx - 22, bl: cx - 7 },
    { tl: cx + 22 - w, bl: cx + 7 - w },
  ];
  for (const s of strips) {
    const bands: [number, number, RGB][] = [
      [0, 0.09, p.ramp[2]],
      [0.09, 0.42, p.ribbon],
      [0.42, 0.58, [250, 250, 250]],
      [0.58, 0.91, p.ribbon],
      [0.91, 1, p.ramp[2]],
    ];
    for (const [a, b, c] of bands) {
      fill(doc, c);
      poly(doc, [
        [s.tl + w * a, top], [s.tl + w * b, top],
        [s.bl + w * b, bottom], [s.bl + w * a, bottom],
      ]);
    }
    // shading line down the inner edge for depth
    stroke(doc, p.ribbonDark);
    doc.setLineWidth(0.25);
    doc.line(s.tl, top, s.bl, bottom);
    doc.line(s.tl + w, top, s.bl + w, bottom);
  }
}

function drawStar(doc: jsPDF, cx: number, cy: number, r: number, c: RGB) {
  const pts: [number, number][] = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 === 0 ? r : r * 0.45;
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
  }
  fill(doc, c);
  poly(doc, pts);
}

function drawMedal(doc: jsPDF, p: MetalPalette, cx: number, cy: number, place: string) {
  const R = 15;
  // Scalloped rosette behind the disc
  const pts: [number, number][] = [];
  const n = 48;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const rr = i % 2 === 0 ? R + 3.2 : R + 1.6;
    pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]);
  }
  fill(doc, p.ramp[1]);
  poly(doc, pts);
  fill(doc, p.ramp[0]);
  doc.circle(cx, cy, R + 0.8, "F");
  // Disc: stepped radial gradient with an off-centre highlight
  const steps = 40;
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    const r = R * (1 - t * 0.97);
    const off = t * 3.2;
    fill(doc, sampleRamp(p.ramp, 0.15 + t * 0.85));
    doc.circle(cx - off, cy - off, r, "F");
  }
  // Raised rim
  stroke(doc, p.ramp[0]);
  doc.setLineWidth(0.5);
  doc.circle(cx, cy, R, "S");
  stroke(doc, p.ramp[1]);
  doc.setLineWidth(0.35);
  doc.circle(cx, cy, R - 2.6, "S");
  stroke(doc, p.ramp[4]);
  doc.setLineWidth(0.2);
  doc.circle(cx, cy, R - 3.1, "S");

  const label = (place ?? "").trim();
  if (label) {
    doc.setFont("Cinzel", "bold");
    fitFont(doc, label, (R - 4) * 2, 22, 10);
    ink(doc, p.ramp[4]);
    doc.text(label, cx + 0.3, cy + 2.6, { align: "center" });
    ink(doc, p.titleShadow);
    doc.text(label, cx, cy + 2.3, { align: "center" });
    doc.setFont("Cinzel", "bold");
    doc.setFontSize(5.5);
    ink(doc, p.titleShadow);
    spacedText(doc, "PLACE", cx, cy + 7.3, 0.6);
  } else {
    drawStar(doc, cx + 0.3, cy + 0.3, 7, p.ramp[4]);
    drawStar(doc, cx, cy, 7, p.titleShadow);
  }
}

function drawDivider(doc: jsPDF, p: MetalPalette, y: number, half = 34) {
  stroke(doc, p.ramp[1]);
  doc.setLineWidth(0.35);
  doc.line(CX - half - 4, y, CX - 5, y);
  doc.line(CX + 5, y, CX + half + 4, y);
  fill(doc, p.ramp[1]);
  poly(doc, [[CX, y - 2], [CX + 2, y], [CX, y + 2], [CX - 2, y]]);
  fill(doc, p.ramp[3]);
  poly(doc, [[CX, y - 0.9], [CX + 0.9, y], [CX, y + 0.9], [CX - 0.9, y]]);
  for (const x of [CX - half - 5.5, CX + half + 5.5]) { doc.circle(x, y, 0.8, "F"); }
}

function drawPlaceBanner(doc: jsPDF, p: MetalPalette, y: number, text: string) {
  doc.setFont("Cinzel", "bold");
  doc.setFontSize(10.5);
  const cs = 0.8;
  const tw = doc.getTextWidth(text) + cs * (text.length - 1);
  const w = tw + 16, h = 8, x = CX - w / 2;
  // vertical sheen
  const steps = 16;
  for (let i = 0; i < steps; i++) {
    fill(doc, sheen(p.ramp, 0.2 + (i / (steps - 1)) * 0.6));
    doc.rect(x, y - h / 2 + (h * i) / steps, w, h / steps + 0.05, "F");
  }
  // notched ends
  fill(doc, [255, 255, 255]);
  poly(doc, [[x - 0.01, y - h / 2], [x + 2.4, y], [x - 0.01, y + h / 2]]);
  poly(doc, [[x + w + 0.01, y - h / 2], [x + w - 2.4, y], [x + w + 0.01, y + h / 2]]);
  ink(doc, p.titleShadow);
  spacedText(doc, text, CX, y + 1.35, cs);
}

/** The earlier metallic frame design (alternative style). */
function drawMetallicCertificate(doc: jsPDF, assets: AwardAssets, o: AwardCertificateOptions) {
  const p = METALS[o.metal] ?? METALS.gold;

  fill(doc, [255, 255, 255]);
  doc.rect(0, 0, W, H, "F");

  // Faint emblem watermark (like the grading certificate's fist watermark)
  doc.setGState(new GState({ opacity: 0.045 }));
  doc.addImage(assets.emblem, "PNG", CX - 55, 52, 110, 110, "emblem-wm", "FAST");
  doc.setGState(new GState({ opacity: 1 }));

  // Medal + ribbon (left), drawn before the frame so the ribbon hangs from it
  const medalX = 52, medalY = 108;
  drawRibbon(doc, p, medalX, medalY - 18);
  drawFrame(doc, p);
  drawMedal(doc, p, medalX, medalY, o.place ?? "");

  // Forza logo (top centre) with a metal ring
  const logoD = 30, logoY = 36;
  fill(doc, p.ramp[0]);
  doc.circle(CX, logoY, logoD / 2 + 1.6, "F");
  fill(doc, p.ramp[2]);
  doc.circle(CX, logoY, logoD / 2 + 1.0, "F");
  doc.addImage(assets.forzaLogo, "PNG", CX - logoD / 2, logoY - logoD / 2, logoD, logoD, "forza-logo", "FAST");

  // Wado emblem (right), balancing the medal
  const emX = 245, emY = medalY, emD = 33;
  fill(doc, p.ramp[0]);
  doc.circle(emX, emY, emD / 2 + 1.6, "F");
  fill(doc, p.ramp[2]);
  doc.circle(emX, emY, emD / 2 + 1.0, "F");
  doc.addImage(assets.emblem, "PNG", emX - emD / 2, emY - emD / 2, emD, emD, "emblem", "FAST");

  // Title
  doc.setFont("Cinzel", "bold");
  fitFont(doc, "CERTIFICATE", 150, 38, 24, 2.2);
  ink(doc, p.titleShadow);
  spacedText(doc, "CERTIFICATE", CX + 0.45, 69.45, 2.2);
  ink(doc, p.title);
  spacedText(doc, "CERTIFICATE", CX, 69, 2.2);

  doc.setFont("Cinzel", "normal");
  doc.setFontSize(14);
  ink(doc, INK);
  spacedText(doc, "OF ACHIEVEMENT", CX, 77.5, 3);

  drawDivider(doc, p, 83);

  // Award title
  const title = (o.awardTitle || "Award").trim().toUpperCase();
  doc.setFont("Cinzel", "bold");
  fitFont(doc, title, 140, 21, 12, 1.4);
  ink(doc, INK);
  spacedText(doc, title, CX, 94.5, 1.4);

  // Place banner — "1st Place · Gold"
  const pl = placeLabel(o.place);
  const club = (o.club ?? "").trim();
  const bannerParts = [pl, club || p.name].filter(Boolean);
  drawPlaceBanner(doc, p, 102.5, bannerParts.join("  ·  ").toUpperCase());

  doc.setFont("Cormorant", "italic");
  doc.setFontSize(15);
  ink(doc, SOFT);
  doc.text("This certificate is proudly presented to", CX, 116, { align: "center" });

  // Student name
  const name = (o.studentName || "").trim() || " ";
  doc.setFont("GreatVibes", "normal");
  fitFont(doc, name, 140, 48, 24);
  ink(doc, INK);
  doc.text(name, CX, 133, { align: "center" });
  stroke(doc, p.ramp[1]);
  doc.setLineWidth(0.4);
  doc.line(CX - 66, 137, CX + 66, 137);

  // Citation
  const citation = (o.citation ?? DEFAULT_CITATION).trim();
  if (citation) {
    doc.setFont("Cormorant", "italic");
    doc.setFontSize(13.5);
    ink(doc, SOFT);
    const lines = doc.splitTextToSize(citation, 138).slice(0, 2) as string[];
    lines.forEach((ln, i) => doc.text(ln, CX, 145 + i * 5.6, { align: "center" }));
  }

  // Date + signature
  const lineY = 166;
  const dateText = formatAwardDate(o.date);
  const sig = o.showSignature !== false;
  const dateCx = sig ? CX - 40 : CX;
  stroke(doc, p.ramp[1]);
  doc.setLineWidth(0.35);
  doc.line(dateCx - 27, lineY, dateCx + 27, lineY);
  doc.setFont("Cormorant", "bold");
  doc.setFontSize(14);
  ink(doc, INK);
  doc.text(dateText, dateCx, lineY - 2, { align: "center" });
  doc.setFont("Cinzel", "normal");
  doc.setFontSize(7.5);
  ink(doc, SOFT);
  spacedText(doc, "DATE", dateCx, lineY + 4, 1);

  if (sig) {
    const sx = CX + 40;
    doc.line(sx - 27, lineY, sx + 27, lineY);
    const sname = (o.signatoryName ?? "").trim();
    const stitle = ((o.signatoryTitle ?? "").trim() || "Chief Instructor").toUpperCase();
    doc.setFont("Cinzel", "normal");
    doc.setFontSize(7.5);
    ink(doc, SOFT);
    spacedText(doc, sname ? `${sname.toUpperCase()}  ·  ${stitle}` : stitle, sx, lineY + 4, 1);
  }

  // Grading-certificate badge row (exact image from the grading certificate)
  const bw = 120, bh = bw * (185 / 1780);
  doc.addImage(assets.badges, "PNG", CX - bw / 2, 180.5, bw, bh, "badges", "FAST");
}

// ─── Classic design (Anthoni's certificate, Nov 2026) ───────────────────────
// Drawn in his 900×550 SVG coordinates, mapped onto A4 landscape (297×210mm).
// Shapes stretch to the page; text and the round badge use one uniform scale so
// nothing is distorted.

const DX = W / 900;
const DY = H / 550;
/** Uniform mm-per-unit for text/circles (between DX and DY). */
const DU = 0.355;
const ux = (u: number) => u * DX;
const uy = (u: number) => u * DY;
/** SVG px font size → jsPDF pt */
const pt = (px: number) => (px * DU) / 0.3528;

type Stop = [number, RGB];
const RIBBON_BLACK: Stop[] = [[0, [68, 68, 68]], [0.6, [17, 17, 17]], [1, [37, 37, 37]]];
const RIBBON_RED: Stop[] = [[0, [255, 36, 36]], [0.5, [214, 0, 0]], [1, [146, 0, 0]]];

function sampleStops(stops: Stop[], t: number): RGB {
  const x = Math.min(1, Math.max(0, t));
  for (let i = 0; i < stops.length - 1; i++) {
    const [a, ca] = stops[i]; const [b, cb] = stops[i + 1];
    if (x <= b) { const f = b === a ? 0 : (x - a) / (b - a); return [0, 1, 2].map(k => Math.round(lerp(ca[k], cb[k], f))) as RGB; }
  }
  return stops[stops.length - 1][1];
}

function unitPoly(pts: [number, number][], dx = 0, dy = 0): [number, number][] {
  return pts.map(([x, y]) => [ux(x + dx), uy(y + dy)]);
}

/** Fill a polygon with an SVG-style objectBoundingBox gradient from top-left to bottom-right. */
function gradientPoly(doc: jsPDF, ptsUnits: [number, number][], stops: Stop[]) {
  const pts = unitPoly(ptsUnits);
  const xs = pts.map(p => p[0]); const ys = pts.map(p => p[1]);
  const x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(...xs) - x0, h = Math.max(...ys) - y0;
  doc.saveGraphicsState();
  const [px0, py0] = pts[0];
  const segs: [number, number][] = [];
  for (let i = 1; i < pts.length; i++) segs.push([pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]]);
  doc.lines(segs, px0, py0, [1, 1], null as unknown as string, true);
  doc.clip();
  doc.discardPath();
  // Bands along x/w + y/h = c, c ∈ [0, 2]; gradient t = c / 2.
  const steps = 60;
  for (let i = 0; i < steps; i++) {
    const c1 = (2 * i) / steps - 0.01, c2 = (2 * (i + 1)) / steps + 0.01;
    fill(doc, sampleStops(stops, (i + 0.5) / steps));
    poly(doc, [[x0 + w * c1, y0], [x0 + w * c2, y0], [x0, y0 + h * c2], [x0, y0 + h * c1]]);
  }
  doc.restoreGraphicsState();
}

function flatPoly(doc: jsPDF, ptsUnits: [number, number][], c: RGB, dx = 0, dy = 0) {
  fill(doc, c);
  poly(doc, unitPoly(ptsUnits, dx, dy));
}

function drawSignature(doc: jsPDF, sig: SignatureSpec | undefined, cxU: number, lineYU: number, light: boolean) {
  if (!sig) return;
  const img = light ? sig.imageLight : sig.imageDark;
  const cx = ux(cxU), lineY = uy(lineYU);
  if (img) {
    const maxW = 50, maxH = 14;
    const ar = sig.imageAspect && sig.imageAspect > 0 ? sig.imageAspect : 3;
    let w = maxW, h = w / ar;
    if (h > maxH) { h = maxH; w = h * ar; }
    doc.addImage(img, "PNG", cx - w / 2, lineY - h - 0.4, w, h, undefined, "FAST");
    return;
  }
  const name = (sig.name ?? "").trim();
  if (!name) return;
  doc.setFont("GreatVibes", "normal");
  fitFont(doc, name, 54, pt(30), pt(16));
  ink(doc, light ? [255, 255, 255] : [17, 17, 17]);
  doc.text(name, cx, lineY - 1.6, { align: "center" });
}

function drawClassicCertificate(doc: jsPDF, assets: AwardAssets, o: AwardCertificateOptions) {
  const p = METALS[o.metal] ?? METALS.gold;
  fill(doc, [255, 255, 255]);
  doc.rect(0, 0, W, H, "F");

  // Top-left ribbons
  flatPoly(doc, [[0, 0], [470, 0], [0, 355]], [221, 221, 221], 6, 7);
  gradientPoly(doc, [[0, 0], [465, 0], [0, 348]], RIBBON_BLACK);
  gradientPoly(doc, [[0, 0], [330, 0], [0, 246]], RIBBON_RED);
  flatPoly(doc, [[0, 0], [230, 0], [0, 172]], [21, 21, 21]);
  flatPoly(doc, [[0, 332], [445, 0], [460, 0], [0, 347]], [241, 241, 241]);
  // Bottom-right ribbons
  flatPoly(doc, [[900, 550], [430, 550], [900, 205]], [221, 221, 221], -5, -6);
  gradientPoly(doc, [[900, 550], [440, 550], [900, 210]], RIBBON_BLACK);
  gradientPoly(doc, [[900, 550], [570, 550], [900, 307]], RIBBON_RED);
  flatPoly(doc, [[900, 550], [690, 550], [900, 396]], [21, 21, 21]);
  flatPoly(doc, [[900, 187], [425, 550], [408, 550], [900, 169]], [242, 242, 242]);

  // Forza Karate logo, top right (real club logo in place of the drawn one)
  const logoH = uy(79), logoW = logoH * (1426 / 676);
  doc.addImage(assets.wordmark, "PNG", ux(864) - logoW, uy(24), logoW, logoH, "forza-wordmark", "FAST");

  const CXm = ux(450);
  doc.setFont("Gelasio", "bold");
  doc.setFontSize(pt(48));
  ink(doc, [17, 17, 17]);
  doc.text("CERTIFICATE", CXm, uy(204), { align: "center" });

  const line = awardLine(o.awardTitle || "Award", o.club);
  doc.setFont("Gelasio", "italic");
  fitFont(doc, line, ux(480), pt(28), pt(16));
  doc.text(line, CXm, uy(243), { align: "center" });

  doc.setFont("Gelasio", "normal");
  doc.setFontSize(pt(15));
  ink(doc, [51, 51, 51]);
  spacedText(doc, "PROUDLY PRESENTED TO", CXm, uy(286), 2 * DU);

  const name = (o.studentName || "").trim() || " ";
  doc.setFont("Gelasio", "italic");
  fitFont(doc, name, ux(380), pt(42), pt(22));
  ink(doc, [17, 17, 17]);
  doc.text(name, CXm, uy(338), { align: "center" });
  stroke(doc, [85, 85, 85]);
  doc.setLineWidth(0.3);
  doc.line(ux(260), uy(350), ux(640), uy(350));

  const citation = (o.citation ?? DESIGN_CITATION).trim();
  if (citation) {
    doc.setFont("Gelasio", "normal");
    doc.setFontSize(pt(16));
    ink(doc, [51, 51, 51]);
    const lines = doc.splitTextToSize(citation, ux(340)) as string[];
    lines.slice(0, 2).forEach((ln, i) => doc.text(ln, CXm, uy(386 + i * 21), { align: "center" }));
  }

  // Date — small, centred under the wording (the design has no date slot)
  const dateText = formatAwardDate(o.date);
  if (dateText) {
    doc.setFont("Gelasio", "italic");
    doc.setFontSize(pt(13));
    ink(doc, [85, 85, 85]);
    doc.text(dateText, CXm, uy(426), { align: "center" });
  }

  // Place badge — black, with a subtle metal ring for 1st/2nd/3rd
  const bx = CXm, by = uy(466), R = 35 * DU;
  fill(doc, [17, 17, 17]);
  doc.circle(bx, by, R, "F");
  const label = (o.place ?? "").trim();
  if (label) {
    stroke(doc, p.ramp[1]);
    doc.setLineWidth(1.3);
    doc.circle(bx, by, R - 0.65, "S");
    stroke(doc, p.ramp[3]);
    doc.setLineWidth(0.25);
    doc.circle(bx, by, R - 0.65, "S");
  }
  stroke(doc, [255, 255, 255]);
  doc.setLineWidth(1.5 * DU * 0.6);
  doc.circle(bx, by, 29 * DU, "S");
  ink(doc, [255, 255, 255]);
  if (label) {
    doc.setFont("Gelasio", "bold");
    fitFont(doc, label, 2 * 24 * DU, pt(23), pt(12));
    doc.text(label, bx, by + 3 * DU, { align: "center" });
    doc.setFont("Gelasio", "normal");
    doc.setFontSize(pt(10));
    doc.text("PLACE", bx, by + 19 * DU, { align: "center" });
  } else {
    drawStar(doc, bx, by, 15 * DU, [255, 255, 255]);
  }

  // Signatures
  stroke(doc, [85, 85, 85]);
  doc.setLineWidth(0.3);
  doc.line(ux(150), uy(488), ux(310), uy(488));
  drawSignature(doc, o.chiefSignature, 230, 488, false);
  doc.setFont("Gelasio", "normal");
  doc.setFontSize(pt(13));
  ink(doc, [51, 51, 51]);
  doc.text("Chief Instructor", ux(230), uy(511), { align: "center" });

  stroke(doc, [255, 255, 255]);
  doc.setLineWidth(0.45);
  doc.line(ux(660), uy(488), ux(830), uy(488));
  drawSignature(doc, o.repSignature, 745, 488, true);
  doc.setFont("Gelasio", "normal");
  doc.setFontSize(pt(13));
  ink(doc, [255, 255, 255]);
  doc.text("Club Representative", ux(745), uy(511), { align: "center" });

  // Grading-certificate badge row — small, bottom-left white space
  if (o.showBadges !== false) {
    const bh = 5.2, bw = bh * (1780 / 185);
    doc.addImage(assets.badges, "PNG", ux(230) - bw / 2, uy(522), bw, bh, "badges", "FAST");
  }
}

/** Draw one certificate onto the current page of `doc` (fonts must already be registered). */
export function drawAwardCertificate(doc: jsPDF, assets: AwardAssets, o: AwardCertificateOptions) {
  if (o.style === "metallic") drawMetallicCertificate(doc, assets, o);
  else drawClassicCertificate(doc, assets, o);
}

/** Build a PDF with one page per certificate. */
export function buildAwardCertificatesPdf(assets: AwardAssets, certs: AwardCertificateOptions[]): jsPDF {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4", compress: true });
  const styles = new Set<CertificateStyle>(certs.map(c => c.style ?? "classic"));
  if (!styles.size) styles.add("classic");
  registerFonts(doc, assets.fonts, styles);
  certs.forEach((c, i) => {
    if (i > 0) doc.addPage("a4", "landscape");
    drawAwardCertificate(doc, assets, c);
  });
  doc.setProperties({ title: certs.length === 1 ? `${certs[0].awardTitle} — ${certs[0].studentName}` : "Forza Karate award certificates", creator: "Forza Club Honbu" });
  return doc;
}
