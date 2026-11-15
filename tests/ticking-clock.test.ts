import { describe, it, expect, vi, afterEach } from 'vitest'
import { createTickingClock } from '@/lib/ticking-clock'

afterEach(() => vi.useRealTimers())

describe('grading countdown clock (useSyncExternalStore snapshot)', () => {
  it('returns the same snapshot on repeated reads even when time moves on (prevents React #185 loop)', () => {
    let t = 1_000
    const clock = createTickingClock(1000, () => t)
    const a = clock.getSnapshot()
    t += 5 // a slow render: real time passes between React's two reads
    const b = clock.getSnapshot()
    expect(b).toBe(a)
  })

  it('only changes on a tick and notifies subscribers', () => {
    vi.useFakeTimers()
    let t = 1_000
    const clock = createTickingClock(1000, () => t)
    const fn = vi.fn()
    const unsub = clock.subscribe(fn)
    const first = clock.getSnapshot()
    t = 2_000
    expect(clock.getSnapshot()).toBe(first)
    vi.advanceTimersByTime(1000)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(clock.getSnapshot()).toBe(2_000)
    unsub()
    vi.advanceTimersByTime(5000)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('server snapshot is stable', () => {
    const clock = createTickingClock()
    expect(clock.getServerSnapshot()).toBe(clock.getServerSnapshot())
  })
})
