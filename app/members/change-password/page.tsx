'use client'

import { useState } from 'react'
import Image from 'next/image'
import { KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { changeMemberPassword } from '@/app/actions/members-auth'

// Shown after logging in with the emailed temporary password (middleware sends every other
// /members page here until a new password is chosen). Also usable any time to change password.
export default function ChangePasswordPage() {
  const [currentPassword, setCurrent] = useState('')
  const [newPassword, setNew] = useState('')
  const [confirmPassword, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const result = await changeMemberPassword({ currentPassword, newPassword, confirmPassword })
    if (result.success) {
      window.location.href = '/members/portal?passwordChanged=1'
    } else {
      setError(result.error ?? 'Could not change your password.')
      setLoading(false)
    }
  }

  const input = 'w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition'

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image src="/forza-logo.webp" alt="Forza Karate Club" width={140} height={56} className="h-14 w-auto" />
        </div>
        <div className="bg-white rounded-2xl border border-black/8 p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#111111] mb-4">
              <KeyRound className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#111111]">Choose your password</h1>
            <p className="text-sm text-gray-500 mt-2">
              Pick a password you&apos;ll remember. After this, the temporary password from your email stops working.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm text-center">{error}</div>
            )}
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-1.5">Temporary (current) password</label>
              <input type="password" autoComplete="current-password" value={currentPassword} onChange={e => setCurrent(e.target.value)} required autoFocus className={input} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-1.5">New password</label>
              <input type="password" autoComplete="new-password" minLength={8} value={newPassword} onChange={e => setNew(e.target.value)} required placeholder="At least 8 characters" className={input} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#111111] mb-1.5">Confirm new password</label>
              <input type="password" autoComplete="new-password" minLength={8} value={confirmPassword} onChange={e => setConfirm(e.target.value)} required className={input} />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
              {loading ? 'Saving…' : 'Save my password'}
            </Button>
          </form>
          <form action="/api/members/logout" method="post" className="text-center mt-6">
            <button type="submit" className="text-xs text-gray-500 underline">Log out</button>
          </form>
          <p className="text-xs text-gray-400 text-center mt-4">
            Shared family email? Everyone using this email shares the one login and new password.
          </p>
        </div>
      </div>
    </div>
  )
}
