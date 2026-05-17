'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { submitGradingRegistration } from '@/app/actions/grading-registration'
import { CheckCircle, AlertCircle } from 'lucide-react'

const belts = [
  '9th Kyu - White',
  '8th Kyu - Orange',
  '7th Kyu - Red',
  '6th Kyu - Yellow',
  '5th Kyu - Green',
  '4th Kyu - Blue',
  '3rd Kyu - Purple',
  '2nd Kyu - Brown',
  '1st Kyu - Brown',
]

const upcomingGradings = [
  'Contact club for upcoming dates',
]

export default function GradingRegForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const form = e.currentTarget
    const data = new FormData(form)

    const result = await submitGradingRegistration({
      memberName: data.get('memberName') as string,
      parentName: data.get('parentName') as string || undefined,
      email: data.get('email') as string,
      currentBelt: data.get('currentBelt') as string,
      dojo: data.get('dojo') as string,
      gradingDate: data.get('gradingDate') as string,
      notes: data.get('notes') as string || undefined,
    })

    if (result.success) {
      setStatus('success')
      form.reset()
    } else {
      setStatus('error')
      setErrorMsg(result.error || 'Something went wrong.')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle className="h-14 w-14 text-green-500 mb-4" />
        <h3 className="text-2xl font-bold text-[#111111] mb-2">Registration received!</h3>
        <p className="text-gray-500 max-w-sm">
          Your grading registration has been submitted. Your instructor will confirm your place.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {status === 'error' && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">
            Member name <span className="text-[#dc2626]">*</span>
          </label>
          <input
            name="memberName"
            type="text"
            required
            placeholder="Full name of member grading"
            className="w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">
            Parent / guardian name <span className="text-gray-400 font-normal">(if under 18)</span>
          </label>
          <input
            name="parentName"
            type="text"
            placeholder="Jane Smith"
            className="w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#111111] mb-1.5">
          Email <span className="text-[#dc2626]">*</span>
        </label>
        <input
          name="email"
          type="email"
          required
          placeholder="contact@example.com"
          className="w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">
            Current belt <span className="text-[#dc2626]">*</span>
          </label>
          <select
            name="currentBelt"
            required
            className="w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition"
          >
            <option value="">Select current belt</option>
            {belts.map((belt) => (
              <option key={belt} value={belt}>{belt}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">
            Your dojo <span className="text-[#dc2626]">*</span>
          </label>
          <select
            name="dojo"
            required
            className="w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition"
          >
            <option value="">Select dojo</option>
            <option value="rayleigh">Rayleigh</option>
            <option value="upminster">Upminster</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#111111] mb-1.5">
          Grading date <span className="text-[#dc2626]">*</span>
        </label>
        <select
          name="gradingDate"
          required
          className="w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition"
        >
          <option value="">Select grading date</option>
          {upcomingGradings.map((date) => (
            <option key={date} value={date}>{date}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-[#111111] mb-1.5">
          Notes <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          name="notes"
          rows={3}
          placeholder="Any additional notes for your instructor..."
          className="w-full px-4 py-3 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition resize-none"
        />
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={status === 'loading'}
        className="w-full"
      >
        {status === 'loading' ? 'Submitting…' : 'Register for Grading'}
      </Button>
    </form>
  )
}
