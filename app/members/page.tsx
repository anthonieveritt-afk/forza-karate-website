'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { loginMembers } from '@/app/actions/members-auth'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') ?? '/members/portal'

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await loginMembers({ email, password, licenceNumber: '' })
      if (result.success) {
        router.push(redirect)
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
              Log in with your Club Honbu email and password.
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
