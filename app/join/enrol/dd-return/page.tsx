'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { CheckCircle, Loader2 } from 'lucide-react'

const HONBU_API = process.env.NEXT_PUBLIC_CLUB_HONBU_API ?? 'https://club-honbu-production.up.railway.app/api'

function DDReturn() {
  const params = useSearchParams()
  const router = useRouter()
  const memberId = params.get('memberId')
  const redirectFlowId = params.get('redirect_flow_id')
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!memberId || !redirectFlowId) {
      setStatus('error')
      setError('Missing parameters. Please go back and try again.')
      return
    }

    fetch(`${HONBU_API}/enrolment/gocardless/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId: Number(memberId), redirectFlowId }),
    })
      .then(r => r.json())
      .then(data => {
        if (data.success) {
          setStatus('success')
          setTimeout(() => router.push(`/join/enrol?step=3&memberId=${memberId}`), 1500)
        } else {
          setStatus('error')
          setError(data.error ?? 'Could not complete Direct Debit setup.')
        }
      })
      .catch(() => { setStatus('error'); setError('Connection error. Please try again.') })
  }, [memberId, redirectFlowId, router])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        {status === 'loading' && (
          <>
            <Loader2 className="h-12 w-12 text-[#dc2626] mx-auto mb-4 animate-spin" />
            <p className="text-[#111111] font-semibold">Setting up your Direct Debit…</p>
            <p className="text-sm text-gray-400 mt-1">Just a moment.</p>
          </>
        )}
        {status === 'success' && (
          <>
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <p className="text-[#111111] font-semibold">Direct Debit confirmed!</p>
            <p className="text-sm text-gray-400 mt-1">Taking you to the final step…</p>
          </>
        )}
        {status === 'error' && (
          <>
            <p className="text-red-600 font-semibold mb-2">Something went wrong</p>
            <p className="text-sm text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => router.back()}
              className="text-sm text-[#dc2626] underline"
            >
              Go back and try again
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function DDReturnPage() {
  return <Suspense><DDReturn /></Suspense>
}
