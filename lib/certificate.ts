import jsPDF from "jspdf";

function getOrdinalSuffix(day: number): string {
  if (day >= 11 && day <= 13) return "th";
  switch (day % 10) {
    case 1: return "st";
    case 2: return "nd";
    case 3: return "rd";
    default: return "th";
  }
}

function formatCertificateDate(dateStr: string): { dayMonth: string; year: string } {
  const date = new Date(dateStr + "T12:00:00");
  const dayNum = date.getDate();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return {
    dayMonth: `${dayNum}${getOrdinalSuffix(dayNum)} ${months[date.getMonth()]}`,
    year: String(date.getFullYear())
  };
}

function parseGradeNumber(belt: string): { number: string; type: string } {
  const match = belt.match(/^(\d+\w+)\s+(Kyu|Dan)/i);
  if (match) return { number: match[1], type: match[2] };
  return { number: belt, type: "" };
}

function extractBeltName(belt: string): string {
  const match = belt.match(/–\s*(.+)/);
  return match ? match[1].trim() : belt;
}

function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function fitText(doc: jsPDF, text: string, maxWidth: number, startSize: number, minSize: number): void {
  let size = startSize;
  doc.setFontSize(size);
  while (doc.getTextWidth(text) > maxWidth && size > minSize) {
    size -= 1;
    doc.setFontSize(size);
  }
}

/** Returns true for any Black Belt / Dan grade (including Ho grades) */
function isDanBelt(toBelt: string): boolean {
  const lower = toBelt.toLowerCase();
  return (
    lower.includes(" dan") ||
    lower.includes("shodan") ||
    lower.includes("nidan") ||
    lower.includes("sandan") ||
    lower.includes("black belt probation")
  );
}

/** Extract the rank label to print before "DAN" on the certificate.
 *  e.g. "1st Dan – Black Belt" → "1st"
 *       "1st Dan Jnr - ... Shodan Ho" → "Shodan Ho"
 *       "Black Belt Probation ..." → "Probation"
 */
function extractDanRankLabel(belt: string): string {
  const lower = belt.toLowerCase();
  if (lower.includes("shodan ho")) return "Shodan Ho";
  if (lower.includes("nidan ho"))  return "Nidan Ho";
  if (lower.includes("sandan ho")) return "Sandan Ho";
  const jnrMatch = belt.match(/^(\d+(?:st|nd|rd|th))\s+Dan\s+Jnr/i);
  if (jnrMatch) return jnrMatch[1] + " Jnr";
  const match = belt.match(/^(\d+(?:st|nd|rd|th))\s+Dan/i);
  if (match) return match[1];
  return belt;
}

// ─── Kyu (coloured belt) certificate ────────────────────────────────────────

async function generateKyuCertificate(
  doc: jsPDF,
  studentName: string,
  toBelt: string,
  gradingDate: string
) {
  const templateUrl = `/certificate-template.png`;
  const response = await fetch(templateUrl);
  if (!response.ok) throw new Error(`Failed to load kyu certificate template (${response.status})`);
  const imgData = await blobToDataURL(await response.blob());

  const pageW = 297;
  doc.addImage(imgData, "PNG", 0, 0, pageW, 210);

  // Student name
  doc.setFont("times", "bold");
  doc.setTextColor(0, 0, 0);
  fitText(doc, studentName, 155, 28, 16);
  doc.text(studentName, 148, 91, { align: "center" });

  // Grade number
  const grade = parseGradeNumber(toBelt);
  doc.setFont("times", "bold");
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(22);

  if (grade.type.toLowerCase() === "dan") {
    doc.setFillColor(255, 255, 255);
    doc.rect(204, 100, 18, 9, "F");
    doc.text(grade.number, 183, 105, { align: "center" });
    doc.text("Dan", 211, 105, { align: "center" });
  } else {
    doc.text(grade.number, 183, 105, { align: "center" });
  }

  // Dates
  const { dayMonth, year } = formatCertificateDate(gradingDate);
  doc.setFont("times", "normal");
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  doc.text(dayMonth, 103, 158, { align: "center" });
  doc.text(year, 208, 158, { align: "center" });
}

// ─── Dan (Black Belt) certificate ───────────────────────────────────────────

async function generateDanCertificate(
  doc: jsPDF,
  studentName: string,
  toBelt: string,
  gradingDate: string
) {
  // Cache-bust so the browser always fetches the latest template file
  const templateUrl = `/dan-certificate-template.jpg?v=2`;
  const response = await fetch(templateUrl, { cache: "no-store" });
  if (!response.ok) throw new Error(`Failed to load Dan certificate template (${response.status})`);
  const imgData = await blobToDataURL(await response.blob());

  const pageW = 297;
  doc.addImage(imgData, "JPEG", 0, 0, pageW, 210);

  // ── Student name ──────────────────────────────────────────────────────────
  // Measured from rendered certificate image: name underline sits at ≈y=107mm
  // Horizontal centre of white content area ≈ x=149mm
  doc.setFont("times", "bold");
  doc.setTextColor(0, 0, 0);
  fitText(doc, studentName, 175, 28, 16);
  doc.text(studentName, 139, 98, { align: "center" });

  // ── Dan grade ordinal — between "of" and "DAN" on the template ────────────
  // "Has achieved the Rank of [ORDINAL] DAN"
  // Measured from image: "of" ends ≈x=148mm, "DAN" at ≈x=205mm → gap centre ≈x=177mm
  // Same baseline as "of" and "DAN" text → y≈112mm
  const rankLabel = extractDanRankLabel(toBelt);
  doc.setFont("times", "bold");
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(22);
  doc.text(rankLabel, 170, 109, { align: "center" });

  // ── Date fields — on the "Dated ___  This Day Of ___" underlines ──────────
  // New template has underlines further right than old template:
  // dayMonth underline centre ≈ x=120mm; year underline centre ≈ x=210mm
  const { dayMonth, year } = formatCertificateDate(gradingDate);
  doc.setFont("times", "bold");
  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(dayMonth, 105, 162, { align: "center" });
  doc.text(year, 190, 162, { align: "center" });
}

// ─── Public entry points ─────────────────────────────────────────────────────

async function buildDoc(studentName: string, toBelt: string, gradingDate: string): Promise<jsPDF> {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
  if (isDanBelt(toBelt)) {
    await generateDanCertificate(doc, studentName, toBelt, gradingDate);
  } else {
    await generateKyuCertificate(doc, studentName, toBelt, gradingDate);
  }
  return doc;
}

export function getCertificateFilename(studentName: string, toBelt: string): string {
  const beltShort = extractBeltName(toBelt).replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase().replace(/-+$/, "");
  const nameSlug = studentName.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase().replace(/-+$/, "");
  return `certificate-${nameSlug}-${beltShort}.pdf`;
}

export async function generateCertificate(studentName: string, toBelt: string, gradingDate: string) {
  try {
    const doc = await buildDoc(studentName, toBelt, gradingDate);
    const filename = getCertificateFilename(studentName, toBelt);
    const blob = doc.output("blob");
    const url = URL.createObjectURL(blob);

    // Strategy: open the PDF in a new tab so it works on browsers that block
    // direct downloads (Tesla in-car browser, iOS Safari, sandboxed iframes).
    // If a popup is blocked, fall back to navigating an anchor click which
    // also gracefully degrades to opening the PDF in the same view.
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) {
      const a = document.createElement("a");
      a.href = url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
    // Release blob URL after a delay to give the browser time to load it.
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    alert(`Could not generate certificate: ${message}`);
  }
}

export async function generateCertificateBlobUrl(studentName: string, toBelt: string, gradingDate: string): Promise<string> {
  const doc = await buildDoc(studentName, toBelt, gradingDate);
  const blob = doc.output("blob");
  return URL.createObjectURL(blob);
}
