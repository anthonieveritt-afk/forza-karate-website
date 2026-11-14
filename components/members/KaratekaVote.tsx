'use client'

import { useEffect, useMemo, useState } from 'react'
import { searchCandidates, type VoteState } from '@/lib/members/karateka-vote'

/** Members' vote for Karate-ka of the Year. One vote per profile; can be changed while voting is open. */
export default function KaratekaVote() {
  const [state, setState] = useState<VoteState | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [chosen, setChosen] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState<string | null>(null)

  useEffect(() => {
    let alive = true
    fetch('/members/vote/api', { cache: 'no-store' })
      .then(async (r) => {
        const d = await r.json().catch(() => ({}))
        if (!r.ok) throw new Error(d?.error ?? 'Could not load the vote.')
        return d as VoteState
      })
      .then((d) => {
        if (!alive) return
        setState(d)
        setChosen(d?.myVote?.memberId ?? null)
      })
      .catch((e: Error) => { if (alive) setError(e.message) })
    return () => { alive = false }
  }, [])

  const results = useMemo(() => searchCandidates(state?.candidates ?? [], q).slice(0, 60), [state, q])
  const chosenName = state?.candidates.find((c) => c.id === chosen)?.name ?? null

  async function submit() {
    if (!chosen) return
    setSaving(true)
    setError(null)
    setSaved(null)
    try {
      const r = await fetch('/members/vote/api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nomineeMemberId: chosen }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) throw new Error(d?.error ?? 'Could not save your vote.')
      setSaved(d?.myVote?.name || chosenName || 'your choice')
      setState((s) => (s ? { ...s, myVote: d?.myVote ?? s.myVote } : s))
    } catch (e) {
      setError((e as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600">Awards Evening {state?.year ?? ''}</p>
        <h1 className="mt-1 text-3xl font-bold text-gray-900">Vote: Karate-ka of the Year</h1>
        <p className="mt-2 text-gray-600">
          Who has been the best Karate-ka at Forza this year? Pick one member. Every profile on your login gets its own vote,
          so if you have children at the club, use the <strong>Viewing</strong> menu to switch to each of them and vote again.
          You can&apos;t vote for yourself, and the results stay private until the Awards Evening.
        </p>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {!state && !error && <p className="text-sm text-gray-500">Loading…</p>}

      {state && !state.open && (
        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <p className="font-semibold text-gray-900">Voting isn&apos;t open right now.</p>
          <p className="mt-1 text-sm text-gray-600">Keep an eye on club messages. We&apos;ll let you know when you can vote.</p>
          {state.myVote && <p className="mt-3 text-sm text-gray-700">Your vote: <strong>{state.myVote.name}</strong></p>}
        </div>
      )}

      {state && state.open && !state.canVote && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-700">
          Only current members can vote. If you think this is wrong, please speak to your instructor.
        </div>
      )}

      {state && state.open && state.canVote && (
        <div className="space-y-4 rounded-xl border border-gray-200 bg-white p-5 sm:p-6">
          {state.myVote && !saved && (
            <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
              You voted for <strong>{state.myVote.name}</strong>. You can change your vote below until voting closes.
            </p>
          )}
          {saved && (
            <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
              Thank you! Your vote for <strong>{saved}</strong> has been saved.
            </p>
          )}
          <label htmlFor="vote-search" className="block text-sm font-medium text-gray-700">Search for a member</label>
          <input
            id="vote-search"
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Start typing a name…"
            autoComplete="off"
            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
          />
          <ul className="max-h-80 divide-y divide-gray-100 overflow-y-auto rounded-lg border border-gray-200" role="listbox" aria-label="Members">
            {results.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={chosen === c.id}
                  onClick={() => { setChosen(c.id); setSaved(null) }}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left text-base hover:bg-red-50 ${chosen === c.id ? 'bg-red-50 font-semibold text-red-700' : 'text-gray-800'}`}
                >
                  {c.name}
                  {chosen === c.id && <span aria-hidden>✓</span>}
                </button>
              </li>
            ))}
            {!results.length && <li className="px-4 py-3 text-sm text-gray-500">No members match “{q}”.</li>}
          </ul>
          <button
            type="button"
            onClick={submit}
            disabled={!chosen || saving || chosen === state.myVote?.memberId}
            className="w-full rounded-lg bg-red-600 px-6 py-3 text-base font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {saving ? 'Saving…' : chosenName ? `Vote for ${chosenName}` : 'Choose a member'}
          </button>
        </div>
      )}
    </div>
  )
}
