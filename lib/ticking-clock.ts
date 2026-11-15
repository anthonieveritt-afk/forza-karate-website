// A once-a-second clock for useSyncExternalStore.
// getSnapshot MUST return the same value until the store notifies a change.
// Returning Date.now() directly makes React see a "new" value on every read
// whenever a render takes longer than 1 ms, which loops forever
// (React error #185, "Maximum update depth exceeded") and crashes the page.

export function createTickingClock(intervalMs = 1000, nowFn: () => number = Date.now) {
  let snapshot = nowFn()
  const listeners = new Set<() => void>()
  let timer: ReturnType<typeof setInterval> | null = null

  function tick() {
    snapshot = nowFn()
    listeners.forEach((l) => l())
  }

  return {
    subscribe(onStoreChange: () => void) {
      listeners.add(onStoreChange)
      if (timer === null) {
        snapshot = nowFn()
        timer = setInterval(tick, intervalMs)
      }
      return () => {
        listeners.delete(onStoreChange)
        if (listeners.size === 0 && timer !== null) {
          clearInterval(timer)
          timer = null
        }
      }
    },
    getSnapshot() {
      return snapshot
    },
    getServerSnapshot() {
      return 0
    },
  }
}
