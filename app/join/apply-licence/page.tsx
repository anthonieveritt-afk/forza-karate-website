'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ApplyLicenceForm } from '@/components/licence/ApplyLicenceForm'

function ApplyLicenceGate() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reason = searchParams.get('reason')

  useEffect(() => {
    if (reason !== 'renewal') return
    const q = new URLSearchParams(searchParams.toString())
    q.delete('reason')
    const s = q.toString()
    router.replace(`/members/licence${s ? `?${s}` : ''}`)
  }, [reason, router, searchParams])

  if (reason === 'renewal') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <p className="text-gray-500 text-sm">Taking you to renew in the members area…</p>
      </div>
    )
  }

  return <ApplyLicenceForm />
}

export default function ApplyLicencePage() {
  return (
    <Suspense>
      <ApplyLicenceGate />
    </Suspense>
  )
}
