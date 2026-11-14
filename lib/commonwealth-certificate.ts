// Copied from club-honbu artifacts/karate-club/src/lib/commonwealth-certificate.ts (Office → Certificates)
// so portal copies look exactly like the ones made in the Office. Keep the two in sync.
// Commonwealth Karate Championships 2026 — Certificate of Participation.
// The official certificate (photo straightened and cropped to its gold border, A4 portrait) is the
// background; the student's name is printed on the blank line under "This certifies that".
// Its own event in Forza Club Honbu, separate from the End of Year Presentation, released straight away.
import { jsPDF } from "jspdf";

export const COMMONWEALTH_2026 = {
  awardType: "commonwealth-2026",
  title: "Commonwealth Karate Championships 2026",
  eventName: "Commonwealth Karate Championships 2026",
  /** Last day of the championships (5th–8th Nov 2026, Glasgow International Arena) */
  certificateDate: "2026-11-08",
  /** In /awards (public). 1654 × 2339 px = A4 portrait. */
  background: "commonwealth-2026-participation.jpg",
  /** The blank name line is at y = 1366 px of 2339 → 173.4 mm on A4 (297 mm). */
  nameLineMm: 173.4,
  nameGapMm: 4.4,
  nameMaxWidthMm: 118,
  nameSizePt: 32,
  nameMinSizePt: 18,
  /** Navy of "12th Commonwealth Karate Championships 2026" on the certificate */
  navy: [22, 27, 74] as [number, number, number],
  fontFile: "Gelasio-Bold.ttf",
} as const;

export const COMMONWEALTH_SHARE_TEXT =
  "Proud to have competed at the 12th Commonwealth Karate Championships 2026 in Glasgow, representing Forza Karate Club! 🥋 www.forzakarate.co.uk";

export function isCommonwealthAward(awardType: string | null | undefined): boolean {
  return awardType === COMMONWEALTH_2026.awardType;
}

export interface CommonwealthAssets {
  /** data:image/jpeg;base64,… */
  background: string;
  /** base64 TTF of Gelasio Bold */
  font: string;
}

export function commonwealthFilename(studentName: string): string {
  const slug = studentName.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-");
  return `commonwealth-2026-${slug || "certificate"}.pdf`;
}

/** Tidy a typed name: single spaces, trimmed. */
export function cleanName(name: string): string {
  return name.replace(/\s+/g, " ").trim();
}

/** Largest size (pt) from nameSizePt down to nameMinSizePt that fits the name line. */
export function fitNameSize(widthAt: (pt: number) => number): number {
  const c = COMMONWEALTH_2026;
  for (let pt = c.nameSizePt; pt > c.nameMinSizePt; pt -= 0.5) if (widthAt(pt) <= c.nameMaxWidthMm) return pt;
  return c.nameMinSizePt;
}

/** Draw one certificate on the current (A4 portrait) page. */
export function drawCommonwealthCertificate(doc: jsPDF, assets: CommonwealthAssets, studentName: string) {
  const c = COMMONWEALTH_2026;
  const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight();
  doc.addImage(assets.background, "JPEG", 0, 0, W, H, "cw2026-bg", "FAST");
  const name = cleanName(studentName);
  if (!name) return;
  doc.setFont("Gelasio", "bold");
  const size = fitNameSize(pt => { doc.setFontSize(pt); return doc.getTextWidth(name); });
  doc.setFontSize(size);
  doc.setTextColor(...c.navy);
  doc.text(name, W / 2, c.nameLineMm - c.nameGapMm, { align: "center", baseline: "alphabetic" });
}

/** One page per name. */
export function buildCommonwealthCertificatesPdf(assets: CommonwealthAssets, names: string[]): jsPDF {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  doc.addFileToVFS(COMMONWEALTH_2026.fontFile, assets.font);
  doc.addFont(COMMONWEALTH_2026.fontFile, "Gelasio", "bold");
  const list = names.length ? names : [""];
  list.forEach((n, i) => {
    if (i > 0) doc.addPage("a4", "portrait");
    drawCommonwealthCertificate(doc, assets, n);
  });
  doc.setProperties({
    title: list.length === 1 && cleanName(list[0]) ? `${COMMONWEALTH_2026.title} — ${cleanName(list[0])}` : COMMONWEALTH_2026.title,
    creator: "Forza Club Honbu",
  });
  return doc;
}
