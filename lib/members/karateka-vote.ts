// Karate-ka of the Year members' vote — shared helpers (client + server safe).
// Votes are stored in Forza Club Honbu (GET/POST /api/portal/karateka-vote). Results stay in the Office.

export type VoteCandidate = { id: number; name: string }
export type VoteState = {
  open: boolean
  year: number | null
  canVote: boolean
  myVote: { memberId: number; name: string } | null
  candidates: VoteCandidate[]
}

/** Keep only the fields the page needs from Forza Club Honbu's reply. Never passes anything else through. */
export function normaliseVoteState(raw: unknown): VoteState {
  const d = (raw ?? {}) as Record<string, unknown>
  const mv = d.myVote as { memberId?: unknown; name?: unknown } | null | undefined
  const candidates = Array.isArray(d.candidates)
    ? (d.candidates as { id?: unknown; name?: unknown }[])
        .filter((c) => Number.isInteger(Number(c?.id)) && typeof c?.name === 'string' && c.name.trim())
        .map((c) => ({ id: Number(c.id), name: String(c.name).trim() }))
    : []
  return {
    open: d.open === true,
    year: typeof d.year === 'number' ? d.year : null,
    canVote: d.canVote !== false,
    myVote: mv && Number.isInteger(Number(mv.memberId)) ? { memberId: Number(mv.memberId), name: String(mv.name ?? '') } : null,
    candidates,
  }
}

/** Case/accent-insensitive "every word appears" name search. */
export function searchCandidates(list: VoteCandidate[], query: string): VoteCandidate[] {
  const norm = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
  const words = norm(query).split(/\s+/).filter(Boolean)
  if (!words.length) return list
  return list.filter((c) => {
    const n = norm(c.name)
    return words.every((w) => n.includes(w))
  })
}

/** Validate the body the browser sends to /members/vote/api. */
export function parseVoteBody(body: unknown): number | null {
  const n = Number((body as { nomineeMemberId?: unknown } | null)?.nomineeMemberId)
  return Number.isInteger(n) && n > 0 ? n : null
}
