import { notFound } from 'next/navigation'
import GradingRegForm from '@/components/forms/GradingRegForm'
import { isPreviewDeployment } from '@/lib/grading-checkout'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Grading form preview', robots: { index: false, follow: false } }

export default function PreviewGradingFormPage() {
  if (!isPreviewDeployment()) notFound()
  return (
    <div className="min-h-screen bg-[#fafaf9] px-4 py-10">
      <div className="max-w-3xl mx-auto">
        <p className="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mb-6">
          Preview only — this page is not on the live forzakarate.co.uk site. It opens in the emergency state. Use the Normal / Emergency / Closed toggle (or ?previewWindow=normal, emergency, or closed) to check each registration state.
        </p>
        <h1 className="text-3xl font-bold text-[#111111] mb-2">Register for grading</h1>
        <p className="text-gray-500 mb-8">
          Submit your grading registration below and pay the grading fee online. After the usual deadline, emergency registration stays open until the day before belts are handed out, with a £20 emergency grading fee added.
        </p>
        <div className="bg-white rounded-2xl border border-black/8 p-8 shadow-sm">
          <GradingRegForm previewDefault="emergency" />
        </div>
      </div>
    </div>
  )
}
