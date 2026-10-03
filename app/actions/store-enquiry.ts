'use server'

// Store customer help form (/store/help).
//
// Wired like the trial booking form: it posts to a Club Honbu webhook using
// CLUB_HONBU_URL and CLUB_HONBU_WEBHOOK_SECRET. The Club Honbu endpoint
// (/api/webhooks/store/enquiry) does not exist yet, so until it is added the
// form shows a friendly "couldn't send" message and nothing is saved.

export interface StoreEnquiryInput {
  name: string
  email: string
  orderRef?: string
  message: string
  /** Honeypot: real people leave this empty. */
  website?: string
}

export type StoreEnquiryResult = { ok: true } | { ok: false; error: string }

const NOT_SENT = 'Sorry, we couldn’t send your message just now. Please try again later, or ask your instructor at class.'

export async function submitStoreEnquiry(input: StoreEnquiryInput): Promise<StoreEnquiryResult> {
  if (input?.website) return { ok: true } // bot: pretend it worked

  const name = typeof input?.name === 'string' ? input.name.replace(/\s+/g, ' ').trim() : ''
  const email = typeof input?.email === 'string' ? input.email.trim() : ''
  const orderRef = typeof input?.orderRef === 'string' ? input.orderRef.trim().toUpperCase() : ''
  const message = typeof input?.message === 'string' ? input.message.trim() : ''

  if (name.length < 2 || name.length > 80) return { ok: false, error: 'Please enter your name.' }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 200) {
    return { ok: false, error: 'Please enter a valid email address so we can reply.' }
  }
  if (orderRef && !/^[A-Z0-9-]{4,20}$/.test(orderRef)) return { ok: false, error: 'Please check your order reference.' }
  if (message.length < 10 || message.length > 2000) {
    return { ok: false, error: 'Please write a message of between 10 and 2,000 characters.' }
  }

  const honbuUrl = process.env.CLUB_HONBU_URL
  const honbuSecret = process.env.CLUB_HONBU_WEBHOOK_SECRET
  if (!honbuUrl || !honbuSecret) return { ok: false, error: NOT_SENT }

  try {
    const res = await fetch(`${honbuUrl}/api/webhooks/store/enquiry?token=${encodeURIComponent(honbuSecret)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, orderRef: orderRef || null, message, source: 'Forza website store help form' }),
      cache: 'no-store',
    })
    if (!res.ok) {
      console.error('Club Honbu store enquiry webhook failed:', res.status)
      return { ok: false, error: NOT_SENT }
    }
    return { ok: true }
  } catch (err) {
    console.error('Club Honbu store enquiry webhook error:', err)
    return { ok: false, error: NOT_SENT }
  }
}
