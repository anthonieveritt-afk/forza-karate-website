import { describe, it, expect } from 'vitest'
import { EVENTS } from '../lib/events'

function weekday(iso: string) {
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-GB', { weekday: 'long' })
}

const PROVISIONAL = 'Session details are provisional and will be confirmed once the booking link is available.'

describe('Kumite Training Preparation 2026/27 (12 years & below)', () => {
  const dec = EVENTS.find((e) => e.id === 'kum-dec')
  const jan = EVENTS.find((e) => e.id === 'kum-u12-jan-2027')
  const feb = EVENTS.find((e) => e.id === 'kum-u12-feb-2027')

  it('lists Sunday 20 December 2026 in Chingford at 2:00pm as bookable', () => {
    expect(dec).toMatchObject({
      title: 'Kumite Training Preparation',
      date: '2026-12-20',
      time: '2:00pm',
      venue: 'Chingford',
      eligibility: '12 years & below',
      registrationHref: '/members/events/prep-training',
    })
    expect(weekday('2026-12-20')).toBe('Sunday')
  })

  it('lists Sunday 10 January 2027 in Rayleigh at 11:00am as provisional, not yet bookable', () => {
    expect(jan).toMatchObject({
      title: 'Kumite Training Preparation',
      date: '2027-01-10',
      time: '11:00am',
      venue: 'Rayleigh',
      eligibility: '12 years & below',
      notes: PROVISIONAL,
    })
    expect(jan?.registrationHref).toBeUndefined()
    expect(weekday('2027-01-10')).toBe('Sunday')
  })

  it('lists Sunday 14 February 2027 in Chingford at 11:00am as provisional, not yet bookable', () => {
    expect(feb).toMatchObject({
      title: 'Kumite Training Preparation',
      date: '2027-02-14',
      time: '11:00am',
      venue: 'Chingford',
      eligibility: '12 years & below',
      notes: PROVISIONAL,
    })
    expect(feb?.registrationHref).toBeUndefined()
    expect(weekday('2027-02-14')).toBe('Sunday')
  })
})
