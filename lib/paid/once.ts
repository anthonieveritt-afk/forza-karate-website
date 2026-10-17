import 'server-only'
import { put, del, list } from '@vercel/blob'

// "Do this only once" marker for webhook side effects (emails, Club Honbu posts).
// Stripe retries a webhook until it gets a 2xx, and can deliver the same event more than once.
// We claim a marker blob at a fixed path with allowOverwrite: false; a second claim fails,
// so the retry is skipped. The marker holds no personal data.
// Needs BLOB_READ_WRITE_TOKEN (already set for the GoCardless sign-up store).

export type Claim = 'claimed' | 'duplicate' | 'unavailable'

const path = (key: string) => `webhook-once/${key.replace(/[^A-Za-z0-9_.-]/g, '_')}.txt`

export async function claimOnce(key: string): Promise<Claim> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return 'unavailable'
  try {
    await put(path(key), new Date().toISOString(), {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: false,
      contentType: 'text/plain',
    })
    return 'claimed'
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (/already exists/i.test(msg)) return 'duplicate'
    // Don't rely on the error wording: if the marker is there, it's a duplicate.
    try {
      const { blobs } = await list({ prefix: path(key), limit: 1 })
      if (blobs.some((b) => b.pathname === path(key))) return 'duplicate'
    } catch { /* fall through */ }
    console.error('[once] claim failed:', msg)
    return 'unavailable'
  }
}

/** Undo a claim when processing failed, so Stripe's retry can try again. */
export async function releaseOnce(key: string): Promise<void> {
  if (!process.env.BLOB_READ_WRITE_TOKEN) return
  try {
    const { blobs } = await list({ prefix: path(key), limit: 1 })
    if (blobs[0]) await del(blobs[0].url)
  } catch (err) {
    console.error('[once] release failed:', err instanceof Error ? err.message : err)
  }
}
