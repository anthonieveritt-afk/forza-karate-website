'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'

const HONBU_API = process.env.NEXT_PUBLIC_CLUB_HONBU_API ?? 'https://forza-club-honbu-production.up.railway.app/api'

export default function ApplyLicencePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const [form, setForm] = useState({
    firstName: '',
    surname: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    belt: '',
    reason: 'first_time',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${HONBU_API}/licence-applications`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/')
        }, 3000)
      } else {
        setError(data.error || 'Failed to submit application')
      }
    } catch (err) {
      console.error('Error submitting licence application:', err)
      setError('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-[#111111] mb-3">Application Submitted! 🎖️</h1>
          <p className="text-gray-500 leading-relaxed">
            Thank you! Your licence application has been received. We'll review it and get back to you soon.
          </p>
          <p className="text-sm text-gray-400 mt-6">Redirecting you in a moment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-[#111111] mb-2">Apply for Your Licence & Insurance</h1>
        <p className="text-gray-600 mb-8">Complete this form to apply for your official karate licence and insurance coverage.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">First Name *</label>
              <input
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">Surname *</label>
              <input
                type="text"
                name="surname"
                value={form.surname}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#111111] mb-2">Date of Birth *</label>
            <input
              type="date"
              name="dateOfBirth"
              value={form.dateOfBirth}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#111111] mb-2">Phone *</label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
                placeholder="07700 900000"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#111111] mb-2">Current Belt Level *</label>
            <select
              name="belt"
              value={form.belt}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
            >
              <option value="">Select belt...</option>
              <option value="white">White (Beginner)</option>
              <option value="red">Red / Red Stripe</option>
              <option value="yellow">Yellow / Yellow Stripe</option>
              <option value="orange">Orange / Orange Stripe</option>
              <option value="green">Green / Green Stripe</option>
              <option value="blue">Blue / Blue Stripe</option>
              <option value="purple">Purple / Purple Stripe</option>
              <option value="brown">Brown / Brown Stripe</option>
              <option value="black">Black Belt</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#111111] mb-2">Application Type *</label>
            <select
              name="reason"
              value={form.reason}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#dc2626]"
            >
              <option value="first_time">First Time Licence (new member)</option>
              <option value="renewal">Licence Renewal</option>
              <option value="upgrade">Grading Certificate / Belt Upgrade</option>
            </select>
          </div>

          {error && (
            <div className="flex gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#dc2626] hover:bg-[#b91c1c] text-white font-semibold py-3 rounded-xl text-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Submitting...
              </>
            ) : (
              'Submit Application'
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Your application will be reviewed and you'll hear from us within 2–3 business days.
          </p>
        </form>
      </div>
    </div>
  )
}
