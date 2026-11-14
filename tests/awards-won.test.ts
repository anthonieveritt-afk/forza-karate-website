import { describe, it, expect } from 'vitest'
import { awardsEmptyText, normaliseUpcoming, normaliseAwards, awardHeadline, awardShareText, gradingShareText, shareLinks, awardFileBase, formatAwardDay, SHARE_URL } from '@/lib/members/awards'

const award = { awardTitle: 'Student of the Year', place: '1st', club: '', certificateDate: '2026-11-27' }

describe('awards won', () => {
  it('keeps only released, well-formed awards', () => {
    const list = normaliseAwards({ awards: [
      { id: 1, awardTitle: 'Student of the Year', place: '1st', certificateDate: '2026-11-27T00:00:00Z', releasedAt: '2026-11-27T21:00:00.000Z', studentName: 'Ann Able' },
      { id: 2, awardTitle: 'Hidden', releasedAt: null },
      { id: 'x', awardTitle: 'Bad' },
    ] })
    expect(list.map((a) => a.id)).toEqual([1])
    expect(list[0].certificateDate).toBe('2026-11-27')
    expect(normaliseAwards(null)).toEqual([])
  })
  it('writes the headline and the post text from the brief', () => {
    expect(awardHeadline(award)).toBe('Gold – Student of the Year 2026')
    expect(awardShareText(award)).toBe('Proud to receive Gold – Student of the Year 2026 at Forza Karate Club! 🥋 www.forzakarate.co.uk')
    expect(awardHeadline({ ...award, awardTitle: 'Best Attendance', place: '3rd', club: 'Rayleigh' })).toBe('Bronze – Best Attendance (Rayleigh) 2026')
    expect(awardHeadline({ ...award, awardTitle: 'Most Improved', place: '' })).toBe('Most Improved 2026')
    expect(gradingShareText('Orange')).toBe('Proud to have graded to Orange belt at Forza Karate Club! 🥋 www.forzakarate.co.uk')
    expect(gradingShareText('Orange belt (10th Kyu)')).toBe('Proud to have graded to Orange belt (10th Kyu) at Forza Karate Club! 🥋 www.forzakarate.co.uk')
  })
  it('share links always point at www.forzakarate.co.uk (never vercel.app)', () => {
    const l = shareLinks(awardShareText(award))
    expect(SHARE_URL).toBe('https://www.forzakarate.co.uk')
    for (const u of Object.values(l)) {
      expect(u).toContain(encodeURIComponent('https://www.forzakarate.co.uk'))
      expect(u).not.toContain('vercel')
    }
    expect(l.facebook.startsWith('https://www.facebook.com/sharer/sharer.php?u=')).toBe(true)
    expect(decodeURIComponent(l.whatsapp)).toContain('Proud to receive Gold – Student of the Year 2026 at Forza Karate Club! 🥋 https://www.forzakarate.co.uk')
    expect(decodeURIComponent(l.x)).not.toContain('www.forzakarate.co.uk&url') // link is passed once, as url=
  })
  it('file names and dates', () => {
    expect(awardFileBase({ studentName: 'Ann Able', awardTitle: 'Student of the Year', place: '1st' })).toBe('forza-student-of-the-year-1st-ann-able')
    expect(formatAwardDay('2026-11-27')).toBe('27 November 2026')
  })
})

describe('awards won empty state', () => {
  it('names the next presentation and its UK release time', () => {
    const up = normaliseUpcoming({ upcoming: { eventName: 'End of Year Presentation 2026', releaseAt: '2026-11-27T21:00:00.000Z' } })
    expect(awardsEmptyText(up)).toBe('No awards yet — certificates from the End of Year Presentation will appear here after 9pm on Fri 27 Nov 2026.')
    expect(awardsEmptyText(normaliseUpcoming({ upcoming: { eventName: 'Summer Awards', releaseAt: '2027-06-01T18:30:00.000Z' } }))).toBe('No awards yet — certificates from the Summer Awards will appear here after 7:30pm on Tue 1 Jun 2027.')
  })
  it('falls back to generic text', () => {
    expect(normaliseUpcoming({ upcoming: null })).toBe(null)
    expect(awardsEmptyText(null)).toBe('No awards yet — certificates the club awards you will appear here.')
  })
})
