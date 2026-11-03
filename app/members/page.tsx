'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { safeMembersRedirect } from '@/lib/members/session'
import { switchProfile, type FamilyProfile } from '@/components/members/ProfileSwitcher'
// loginMembers server action replaced with direct API route for reliability

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  // Only ever send people back into the members area (blocks open redirects and javascript: URLs).
  const redirect = safeMembersRedirect(searchParams.get('redirect'))
  const unavailable = searchParams.get('error') === 'unavailable'
  const loggedOut = searchParams.get('loggedOut') === '1'

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)
  const [forgot, setForgot]     = useState(false)
  const [notice, setNotice]     = useState('')
  const [profiles, setProfiles] = useState<FamilyProfile[]>([])

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    setNotice('')
    try {
      const res = await fetch('/api/members/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const result = await res.json().catch(() => ({}))
      if (result.success) setNotice(result.message ?? "If that email is registered, we've sent a new password.")
      else setError(result.error ?? 'Something went wrong — please try again.')
    } catch {
      setError('Something went wrong — please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/members/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const result = await res.json()
      if (result.success) {
        // Cookie is now set — do a hard nav so middleware sees it
        // Still on the emailed temporary password → choose a new one first.
        if (result.mustChangePassword) {
          window.location.href = '/members/change-password'
        } else if (Array.isArray(result.profiles) && result.profiles.length > 1) {
          // Family login (parent + children on one email): ask who's viewing first.
          setProfiles(result.profiles)
          setLoading(false)
        } else {
          window.location.href = redirect
        }
      } else {
        setError(result.error ?? 'Invalid credentials.')
        setLoading(false)
      }
    } catch {
      setError('Login failed — please try again.')
      setLoading(false)
    }
  }

  const input = 'w-full h-11 px-4 rounded-xl border border-black/12 bg-white text-[#111111] text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#dc2626] focus:border-transparent transition'

  async function pickProfile(id: number) {
    setLoading(true)
    setError('')
    if (await switchProfile(id)) window.location.assign(redirect)
    else {
      setError('Could not open that profile — please try again.')
      setLoading(false)
    }
  }

  if (profiles.length > 1) {
    return (
      <div className="space-y-4">
        <div>
          <h2 className="text-lg font-bold text-[#111111]">Who&apos;s viewing?</h2>
          <p className="text-sm text-gray-500">This login covers more than one member. Choose a profile — you can switch any time from the Viewing menu.</p>
        </div>
        <ul className="space-y-2">
          {profiles.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                disabled={loading}
                onClick={() => pickProfile(p.id)}
                className="w-full min-h-[48px] rounded-xl border border-black/12 bg-white px-4 py-2 text-left text-sm font-semibold text-[#111111] hover:border-[#dc2626] hover:bg-red-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626] disabled:opacity-60"
              >
                {p.firstName} {p.surname}
                <span className="ml-2 text-xs font-normal text-gray-500">{p.isAdult ? 'Adult' : 'Child'}{p.belt ? ` · ${p.belt} belt` : ''}</span>
              </button>
            </li>
          ))}
        </ul>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    )
  }

  if (forgot) {
    return (
      <form onSubmit={handleForgot} className="space-y-4">
        <p className="text-sm text-gray-600 text-center">
          Enter your Forza email and we&apos;ll email you a new password. You&apos;ll be asked to change it after you log in.
        </p>
        {notice && (
          <div className="p-3 rounded-xl bg-green-50 border border-green-100 text-green-800 text-sm text-center">{notice}</div>
        )}
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm text-center">{error}</div>
        )}
        <div>
          <label className="block text-sm font-medium text-[#111111] mb-1.5">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus placeholder="your@email.com" className={input} />
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? 'Sending…' : 'Email me a new password'}
        </Button>
        <button type="button" onClick={() => { setForgot(false); setNotice(''); setError('') }} className="w-full text-sm text-gray-500 hover:text-[#111111] underline">
          Back to log in
        </button>
      </form>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {loggedOut && !unavailable && !error && (
        <div className="p-3 rounded-xl bg-green-50 border border-green-100 text-green-800 text-sm text-center">
          You&apos;ve been logged out.
        </div>
      )}
      {unavailable && !error && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 text-amber-800 text-sm text-center">
          We couldn&apos;t reach the club system to check your login. Please try again in a minute.
        </div>
      )}
      {error && (
        <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm text-center">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-[#111111] mb-1.5">Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          autoFocus
          placeholder="your@email.com"
          className={input}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#111111] mb-1.5">Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          placeholder="Your portal password"
          className={input}
        />
      </div>
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? 'Checking…' : 'Enter members area'}
      </Button>
      <button type="button" onClick={() => { setForgot(true); setError('') }} className="w-full text-sm text-gray-500 hover:text-[#111111] underline">
        Forgot password?
      </button>
    </form>
  )
}

export default function MembersLoginPage() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Image src="/forza-logo.webp" alt="Forza Karate Club" width={140} height={56} className="h-14 w-auto" />
        </div>

        <div className="bg-white rounded-2xl border border-black/8 p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#111111] mb-4">
              <Lock className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-[#111111]">Members area</h1>
            <p className="text-sm text-gray-500 mt-2">
              Log in with your Forza email and password.
            </p>
          </div>

          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>

          <p className="text-xs text-gray-400 text-center mt-6">
            New member? Your login details were sent to your email when you enrolled. If you can&apos;t find them, speak to your instructor.
          </p>
        </div>
      </div>
    </div>
  )
}
