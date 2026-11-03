'use client'

import { useEffect, useState } from 'react'

export type FamilyProfile = { id: number; firstName: string; surname: string; isAdult: boolean; belt: string | null }

/** Switch the active family profile, then hard-reload so every server component re-reads it. */
export async function switchProfile(memberId: number): Promise<boolean> {
  const r = await fetch('/members/switch-profile', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ memberId }),
  }).catch(() => null)
  return !!r?.ok
}

/** "Viewing: [Name ▾]" — only shown when the login has 2+ profiles (parent + children). */
export default function ProfileSwitcher() {
  const [profiles, setProfiles] = useState<FamilyProfile[]>([])
  const [active, setActive] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetch('/members/switch-profile', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) {
          setProfiles(d.profiles ?? [])
          setActive(d.activeMemberId ?? null)
        }
      })
      .catch(() => {})
  }, [])

  if (profiles.length < 2) return null

  async function onChange(id: number) {
    if (id === active) return
    setBusy(true)
    if (await switchProfile(id)) window.location.reload()
    else setBusy(false)
  }

  return (
    <div className="bg-white rounded-2xl border border-black/8 p-4 shadow-sm">
      <label htmlFor="members-viewing" className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">
        Viewing
      </label>
      <select
        id="members-viewing"
        disabled={busy}
        value={active ?? ''}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full min-h-[44px] rounded-xl border border-black/15 bg-white px-3 text-sm font-semibold text-[#111111] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#dc2626]/50"
      >
        {profiles.map((p) => (
          <option key={p.id} value={p.id}>
            {p.firstName} {p.surname}
            {p.isAdult ? '' : ' (child)'}
          </option>
        ))}
      </select>
    </div>
  )
}
