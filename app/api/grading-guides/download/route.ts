import { NextRequest, NextResponse } from 'next/server'
import { jsPDF } from 'jspdf'
import { getForzaStripe } from '@/lib/paid/stripe'
import { getBelt, type Belt } from '@/lib/paid/catalogue'

export const runtime = 'nodejs'

/** Placeholder guide. Replace with Anthoni's real syllabus content (or drop real PDFs in /private). */
function buildGuidePdf(belt: Belt): ArrayBuffer {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  doc.setFontSize(22); doc.text('Forza Karate Club', 20, 25)
  doc.setFontSize(16); doc.text(`Grading guide: ${belt.grade} — ${belt.name}`, 20, 38)
  doc.setDrawColor(220, 38, 38); doc.setLineWidth(1); doc.line(20, 43, 190, 43)
  doc.setFontSize(13); doc.setTextColor(220, 38, 38)
  doc.text('PLACEHOLDER — NOT THE OFFICIAL SYLLABUS', 20, 55)
  doc.setTextColor(0, 0, 0); doc.setFontSize(11)
  const body = [
    'This guide is a template. Forza Karate Club will add the real grading',
    'requirements for this belt here.',
    '',
    'Sections to fill in:',
    '  1. Kihon (basics) required for this grade',
    '  2. Kata',
    '  3. Kumite / pairs work',
    '  4. Terminology',
    '  5. Minimum training time and attendance',
    '  6. Instructor notes and tips',
    '',
    'Come and try it out, then ask questions — your instructor is always happy to help.',
  ]
  doc.text(body, 20, 68)
  return doc.output('arraybuffer')
}

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get('session_id') || ''
  const belt = getBelt(req.nextUrl.searchParams.get('belt') || '')
  if (!sessionId || !belt) return NextResponse.json({ error: 'Missing guide.' }, { status: 400 })

  const stripe = getForzaStripe()
  if (!stripe) return NextResponse.json({ error: 'Downloads are temporarily unavailable.' }, { status: 503 })
  try {
    const s = await stripe.checkout.sessions.retrieve(sessionId)
    const bought = s.metadata?.guides
    if (s.payment_status !== 'paid' || s.metadata?.kind !== 'guide' || (bought !== 'bundle' && bought !== belt.slug)) {
      return NextResponse.json({ error: 'This purchase does not include that guide.' }, { status: 403 })
    }
  } catch {
    return NextResponse.json({ error: 'Purchase not found.' }, { status: 404 })
  }
  return new NextResponse(buildGuidePdf(belt), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="forza-grading-guide-${belt.slug}.pdf"`,
      'Cache-Control': 'private, no-store',
    },
  })
}
