import { describe, it, expect } from 'vitest'
import { normaliseVoteState, searchCandidates, parseVoteBody } from '@/lib/members/karateka-vote'
import { membersCoreLinks, isMembersOnlyPath } from '@/lib/members/links'

describe('Karate-ka of the Year vote', () => {
  it('is in the Members menu and needs a member login', () => {
    expect(membersCoreLinks.find((l) => l.href === '/members/vote')?.label).toBe('Vote: Karate-ka of the Year')
    expect(isMembersOnlyPath('/members/vote')).toBe(true)
    expect(isMembersOnlyPath('/members/vote/api')).toBe(true)
  })

  it('keeps only safe fields from Forza Club Honbu', () => {
    const s = normaliseVoteState({
      open: true, year: 2026, canVote: true, tally: [{ memberId: 1, votes: 9 }], secret: 'x',
      myVote: { memberId: '4', name: 'Cat Cole' },
      candidates: [{ id: 2, name: ' Ben Bold ', email: 'b@example.invalid' }, { id: 'x', name: 'Bad' }, { id: 3, name: '' }],
    })
    expect(s).toEqual({ open: true, year: 2026, canVote: true, myVote: { memberId: 4, name: 'Cat Cole' }, candidates: [{ id: 2, name: 'Ben Bold' }] })
    expect(normaliseVoteState(null)).toEqual({ open: false, year: null, canVote: true, myVote: null, candidates: [] })
  })

  it('searches names ignoring case and accents', () => {
    const list = [{ id: 1, name: 'Zoë Brown' }, { id: 2, name: 'Zack Smith' }]
    expect(searchCandidates(list, 'zoe').map((c) => c.id)).toEqual([1])
    expect(searchCandidates(list, 'smi za').map((c) => c.id)).toEqual([2])
    expect(searchCandidates(list, ' ').length).toBe(2)
  })

  it('validates the vote body', () => {
    expect(parseVoteBody({ nomineeMemberId: 5 })).toBe(5)
    expect(parseVoteBody({ nomineeMemberId: '7' })).toBe(7)
    for (const b of [null, {}, { nomineeMemberId: 0 }, { nomineeMemberId: -2 }, { nomineeMemberId: 1.5 }, { nomineeMemberId: 'x' }]) expect(parseVoteBody(b)).toBeNull()
  })
})
