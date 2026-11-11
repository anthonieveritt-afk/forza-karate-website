import { NextResponse } from 'next/server'
import { jsPDF } from 'jspdf'
import { getMemberPortalData } from '@/app/actions/portal'
import { grades, gradingRules, generalToConfirm, TRAINED_STRIPES } from '@/lib/syllabus-full'
import { belts } from '@/lib/syllabus'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

const RED: [number, number, number] = [220, 38, 38]
const hexRgb = (h: string): [number, number, number] => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as [number, number, number]

export async function GET() {
  if (!(await getMemberPortalData())) {
    return NextResponse.redirect(new URL('/members?redirect=/members/syllabus/full', process.env.NEXT_PUBLIC_SITE_URL || 'https://forzakarate.co.uk'))
  }
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = 210, M = 15
  let y = 0
  const watermark = () => {
    doc.saveGraphicsState()
    doc.setGState(new (doc as unknown as { GState: new (o: object) => unknown }).GState({ opacity: 0.08 }) as never)
    doc.setFont('helvetica', 'bold'); doc.setFontSize(110); doc.setTextColor(...RED)
    doc.text('DRAFT', W / 2, 170, { align: 'center', angle: 45 })
    doc.restoreGraphicsState()
  }
  const header = () => {
    doc.setFillColor(17, 17, 17); doc.rect(0, 0, W, 14, 'F')
    doc.setFillColor(...RED); doc.rect(0, 14, W, 1.5, 'F')
    doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(11)
    doc.text('FORZA KARATE CLUB  |  Grading Syllabus (DRAFT)', M, 9)
    watermark(); y = 24
  }
  const need = (h: number) => { if (y + h > 282) { doc.addPage(); header() } }
  const para = (t: string, size = 10, bold = false, colour: [number, number, number] = [17, 17, 17], indent = 0) => {
    doc.setFont('helvetica', bold ? 'bold' : 'normal'); doc.setFontSize(size); doc.setTextColor(...colour)
    const lines = doc.splitTextToSize(t, W - 2 * M - indent)
    need(lines.length * size * 0.42 + 1)
    doc.text(lines, M + indent, y); y += lines.length * size * 0.42 + 1.5
  }
  const draft = (t: string, indent = 0) => para(`DRAFT, TO CONFIRM BY ANTHONI: ${t}`, 8.5, true, [146, 64, 14], indent)
  const h2 = (t: string) => { y += 3; need(12); para(t, 15, true, RED) }

  header()
  para('Grading Syllabus', 22, true); para('Wado Ryu traditional karate with WKF sport karate. Kyu grades 18th to 1st, then Shodan (1st Dan). Rayleigh & Upminster.', 10, false, [80, 80, 80])
  generalToConfirm.forEach((t) => draft(t))

  h2('Grading rules')
  gradingRules.forEach((r, i) => { para(`${i + 1}. ${r.text}`, 9.5); if (r.toConfirm) draft(r.toConfirm, 4) })

  h2('Progress stripes')
  para('Every belt up to 1st Kyu has 5 progress stripes, earned through set tasks and shown at the end of the belt: ' + TRAINED_STRIPES.map((s) => `${s.n} ${s.colour}`).join(', ') + '. Some belts also come with a stripe automatically, which runs along the belt.', 9.5)

  h2('Belt order')
  grades.forEach((g) => {
    need(30)
    // belt graphic
    doc.setDrawColor(17, 17, 17); doc.setLineWidth(0.3); doc.setFillColor(...hexRgb(g.hex)); doc.rect(M, y - 3, 48, 7, 'FD')
    if (g.autoStripe) { const n = g.autoStripe.count ?? 1; for (let i = 0; i < n; i++) { doc.setFillColor(...hexRgb(g.autoStripe.hex)); doc.rect(M + 0.5, y - 1 + (n === 1 ? 0.3 : i * 2.2 - 0.6), g.trainedStripes ? 34 : 47, n === 1 ? 1.8 : 1.3, 'FD') } }
    if (g.trainedStripes) TRAINED_STRIPES.forEach((s, i) => { doc.setFillColor(...hexRgb(s.hex)); doc.rect(M + 36 + i * 2.4, y - 2.4, 1.6, 5.8, 'FD') })
    doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(17, 17, 17)
    doc.text(`${g.grade}: ${g.belt}`, M + 52, y + 2); y += 7
    if (g.autoStripe) para(`Automatic stripe: ${g.autoStripe.label}`, 9, false, [80, 80, 80], 4)
    para(`Main kata: ${g.kata}`, 9, false, [17, 17, 17], 4)
    para(`Minimum time: ${g.minTime}`, 9, false, [17, 17, 17], 4)
    para(!g.trainedStripes ? 'No progress stripes at Shodan.' : g.tasksHref ? 'Stripe tasks: see below (18th Kyu).' : 'Stripe tasks to be added.', 9, false, [80, 80, 80], 4)
    g.toConfirm?.forEach((t) => draft(t, 4)); draft('Belt colour.', 4); y += 2
  })

  h2('18th Kyu: stripe tasks')
  belts[0].stripes.forEach((s) => {
    para(`Stripe ${s.number} (${s.colour}): ${s.title}`, 10.5, true)
    if (s.intro) para(s.intro, 9, false, [80, 80, 80], 4)
    s.items.forEach((it) => para(`• ${it.japanese && it.japanese !== it.name ? `${it.japanese} (${it.name.toLowerCase()})` : it.name}${it.description ? `: ${it.description}` : ''}`, 9, false, [17, 17, 17], 4))
    // instructorOnly notes are deliberately never written to the PDF
  })

  const pages = doc.getNumberOfPages()
  for (let i = 1; i <= pages; i++) { doc.setPage(i); doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(120, 120, 120); doc.text(`Forza Karate Club · DRAFT · Members only · Page ${i} of ${pages}`, W / 2, 292, { align: 'center' }) }

  return new NextResponse(Buffer.from(doc.output('arraybuffer')), {
    headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': 'attachment; filename="Forza_Karate_Syllabus_DRAFT.pdf"', 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex' },
  })
}
