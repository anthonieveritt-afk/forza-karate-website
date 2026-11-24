import { describe, it, expect } from 'vitest'
import { eligibleSessions, sessionById, trialMatchesSession, formatBookedSessionText, parseDojoKey } from '@/lib/paid/trial-sessions'
import { parentConfirmationHtml, withSessionDetails } from '@/lib/paid/trial-email-html'

const TUE = 'Tuesday Rayleigh – 6.15–7pm'
const FRI = 'Friday Rayleigh – 3.40–4.40pm'
const SAT = 'Saturday – 10–11am'

describe('trial session catalogue', () => {
  it('offers Friday 3:40 Rayleigh, labelled Rayleigh Primary School pupils only', () => {
    expect(sessionById(FRI)?.trialEligible).toBe(true)
    expect(sessionById(FRI)?.restrictionNote).toBe('Rayleigh Primary School pupils only')
    expect(eligibleSessions({ dojo: 'rayleigh', ageGroup: 'ninjas' }).map(s => s.id)).toEqual([TUE, FRI, SAT])
    expect(formatBookedSessionText(FRI)).toMatch(/Rayleigh Primary School pupils only/)
  })

  it('treats Saturday as Rayleigh so holiday logic applies', () => {
    expect(parseDojoKey(SAT)).toBe('rayleigh')
  })

  it('matches legacy bare Rayleigh + Age 4 to Tuesday and Saturday, not Friday or Tuesday 7–8', () => {
    const extras = { notes: 'Age: 4' }
    expect(trialMatchesSession('Rayleigh', TUE, extras)).toBe(true)
    expect(trialMatchesSession('Rayleigh', SAT, extras)).toBe(true)
    expect(trialMatchesSession('Rayleigh', FRI, extras)).toBe(false)
    expect(trialMatchesSession('Rayleigh', 'Tuesday Rayleigh – 7–8pm', extras)).toBe(false)
  })
})

describe('parent confirmation email', () => {
  it('names the class day, time and venue and no longer says within 72 hours', () => {
    const html = parentConfirmationHtml({
      parentName: 'Chris Reeve',
      childName: 'Harper Example',
      ageGroup: 'Forza Ninjas (4–6)',
      dojo: 'Rayleigh',
      sessionName: TUE,
      amount: '£10.00',
      sessionId: 'cs_test',
      test: true,
      honbuOk: true,
    })
    expect(html).toMatch(/Tuesday 6:15/)
    expect(html).toMatch(/Rayleigh Primary School/)
    expect(html).toMatch(/Love Lane, Rayleigh, Essex SS6 7DD/)
    expect(html).not.toMatch(/72 hours/)
    expect(html).toMatch(/£10/)
    expect(html).not.toMatch(/free trial/i)
    expect(withSessionDetails({ sessionName: TUE, amount: '£10', sessionId: 'x', test: false, honbuOk: true }).when).toMatch(/Tuesday 6:15/)
  })

  it('formats booked session text for emails', () => {
    expect(formatBookedSessionText(TUE)).toMatch(/Tuesday 6:15–7:00pm at Rayleigh Primary School/)
  })

  it('labels Friday as Rayleigh Primary School pupils only in the confirmation email', () => {
    const html = parentConfirmationHtml({
      parentName: 'Chris Reeve',
      childName: 'Harper Example',
      ageGroup: 'Forza Ninjas (4–6)',
      dojo: 'Rayleigh',
      sessionName: FRI,
      amount: '£10.00',
      sessionId: 'cs_test',
      test: true,
      honbuOk: true,
    })
    expect(html).toMatch(/Friday 3:40/)
    expect(html).toMatch(/Rayleigh Primary School pupils only/)
    expect(html).not.toMatch(/72 hours/)
  })
})
