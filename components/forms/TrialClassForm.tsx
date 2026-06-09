'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { submitTrialBooking } from '@/app/actions/trial-booking'
import { CheckCircle, AlertCircle } from 'lucide-react'

export default function TrialClassForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')

    const form = e.currentTarget
    const data = new FormData(form)

    try {
      await submitTrialBooking({
        firstName: data.get('parentName') as string,
        lastName: '',
        email: data.get('email') as string,
        phone: data.get('phone') as string,
        dateOfBirth: '',
        dojo: data.get('preferredDojo') as string,
        classTime: data.get('ageGroup') as string,
        parentName: data.get('parentName') as string || undefined,
        childName: data.get('childName') as string || undefined,
        medicalNotes: data.get('message') as string || undefined,
      })
      setStatus('success')
      form.reset()
    } catch {
      setStatus('error')
      setErrorMsg('Something went wrong.')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle className="h-14 w-14 text-green-500 mb-4" />
        <h3 className="text-2xl font-bold text-[#111111] mb-2">You&apos;re booked in!</h3>
        <p className="text-gray-500 max-w-sm">
          Thanks! We&apos;ll be in touch within 72 hours to confirm your free trial class.
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
            Your name <span className="text-[#dc2626]">*</span>
          </label>
          <input
            name="parentName"
            type="text"
            required
            placeholder="Jane Smith"
            className="w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">
            Child&apos;s name <span className="text-gray-400 font-normal">(if applicable)</span>
          </label>
          <input
            name="childName"
            type="text"
            placeholder="Tommy Smith"
            className="w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">
            Email <span className="text-[#dc2626]">*</span>
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="jane@example.com"
            className="w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">
            Phone <span className="text-[#dc2626]">*</span>
          </label>
          <input
            name="phone"
            type="tel"
            required
            placeholder="07700 900000"
            className="w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">
            Age group <span className="text-[#dc2626]">*</span>
          </label>
          <select
            name="ageGroup"
            required
            className="w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition"
          >
            <option value="">Select age group</option>
            <option value="ninjas">Forza Ninjas (Ages 4–7)</option>
            <option value="juniors">Forza Juniors (Ages 8–10)</option>
            <option value="seniors">Forza Seniors (Ages 11+)</option>
            <option value="adult">Adult</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">
            Preferred dojo <span className="text-[#dc2626]">*</span>
          </label>
          <select
            name="preferredDojo"
            required
            className="w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition"
          >
            <option value="">Select dojo</option>
            <option value="rayleigh">Rayleigh</option>
            <option value="upminster">Upminster</option>
            <option value="no-preference">No preference</option>
          </select>
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={status === 'loading'}
        className="w-full"
      >
        {status === 'loading' ? 'Sending…' : 'Book My Free Trial'}
      </Button>

      <p className="text-xs text-gray-400 text-center">
        We&apos;ll be in touch within 72 hours. No obligation, no kit needed.
      </p>
    </form>
  )
}
