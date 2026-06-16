'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { AlertCircle, CheckCircle, Loader2, BadgePoundSterling } from 'lucide-react'

const HONBU_API = process.env.NEXT_PUBLIC_CLUB_HONBU_API ?? 'https://forza-club-honbu-production.up.railway.app/api'

function calculateAge(dob: string): number | null {
  if (!dob) return null
  const d = new Date(dob)
  if (isNaN(d.getTime())) return null
  return Math.floor((Date.now() - d.getTime()) / (1000 * 60 * 60 * 24 * 365.25))
}

function ApplyLicenceForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const paid = searchParams.get('paid') === 'true'

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(paid)

  const [form, setForm] = useState({
    firstName: '',
    surname: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    belt: '',
    reason: 'first_time',
  })

  const age = calculateAge(form.dateOfBirth)
  const isRenewal = form.reason === 'renewal'
  const renewalFee = age !== null ? (age < 18 ? 45 : 49) : null
  const renewalLabel = age !== null ? (age < 18 ? 'Under 18' : 'Senior (18+)') : null

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      if (isRenewal) {
        // Renewal: go through Stripe checkout
        const origin = window.location.origin
        const response = await fetch(`${HONBU_API}/licence-applications/stripe/checkout`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...form,
            successUrl: `${origin}/join/apply-licence?paid=true`,
            cancelUrl: `${origin}/join/apply-licence`,
          }),
        })

        const data = await response.json()

        if (response.ok && data.checkoutUrl) {
          window.location.href = data.checkoutUrl
          return
        } else {
          setError(data.error || 'Failed to start payment. Please try again.')
        }
      } else {
        // First time or upgrade: no payment needed
        const response = await fetch(`${HONBU_API}/licence-applications`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: form.firstName,
            surname: form.surname,
            dateOfBirth: form.dateOfBirth,
            email: form.email,
            phone: form.phone,
            beltLevel: form.belt,
            applicationType: form.reason,
          }),
        })

        const data = await response.json()

        if (response.ok) {
          setSuccess(true)
          setTimeout(() => router.push('/'), 3000)
        } else {
          setError(data.error || 'Failed to submit application')
        }
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
          <h1 className="text-3xl font-bold text-[#111111] mb-3">
            {paid ? 'Renewal paid! 🎖️' : 'Application Submitted! 🎖️'}
          </h1>
          <p className="text-gray-500 leading-relaxed">
            {paid
              ? "Your licence renewal payment has been received. We'll process your renewal and be in touch shortly."
              : "Thank you! Your licence application has been received. We'll review it and get back to you soon."}
          </p>
          {!paid && <p className="text-sm text-gray-400 mt-6">Redirecting you in a moment...</p>}
          {paid && (
            <Button className="mt-8" onClick={() => router.push('/')}>
              Back to home
            </Button>
          )}
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

          {/* Renewal fee badge — shown when renewal is selected and DOB is entered */}
          {isRenewal && (
            <div className={`flex items-start gap-3 p-4 rounded-xl border ${renewalFee ? 'bg-red-50 border-[#dc2626]/20' : 'bg-gray-50 border-gray-200'}`}>
              <BadgePoundSterling className={`h-5 w-5 mt-0.5 flex-shrink-0 ${renewalFee ? 'text-[#dc2626]' : 'text-gray-400'}`} />
              <div>
                {renewalFee ? (
                  <>
                    <p className="text-sm font-semibold text-[#111111]">
                      Renewal fee: <span className="text-[#dc2626]">£{renewalFee}</span>
                      <span className="text-gray-400 font-normal ml-2">({renewalLabel})</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      You'll be taken to a secure Stripe payment page to complete your renewal.
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-500">
                    Enter your date of birth above to see the renewal fee.
                    <span className="block text-xs text-gray-400 mt-0.5">Under 18: £45 · Senior (18+): £49</span>
                  </p>
                )}
              </div>
            </div>
          )}

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
                {isRenewal ? 'Redirecting to payment...' : 'Submitting...'}
              </>
            ) : (
              isRenewal ? `Pay & Renew Licence${renewalFee ? ` — £${renewalFee}` : ''}` : 'Submit Application'
            )}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            {isRenewal
              ? 'Payment is processed securely via Stripe. Your licence will be renewed once payment is confirmed.'
              : "Your application will be reviewed and you'll hear from us within 2\u20133 business days."}
          </p>
        </form>
      </div>
    </div>
  )
}

export default function ApplyLicencePage() {
  return (
    <Suspense>
      <ApplyLicenceForm />
    </Suspense>
  )
}
