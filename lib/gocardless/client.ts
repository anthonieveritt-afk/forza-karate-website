// Minimal GoCardless API client (server-only). Never log the token.
import 'server-only'

export type GcEnv = 'live' | 'sandbox'

export function gcEnv(): GcEnv {
  return process.env.GOCARDLESS_ENV === 'live' ? 'live' : 'sandbox'
}

function base(): string {
  return gcEnv() === 'live' ? 'https://api.gocardless.com' : 'https://api-sandbox.gocardless.com'
}

export function gcConfigured(): boolean {
  return !!process.env.GOCARDLESS_RW_TOKEN?.trim()
}

export class GcError extends Error {
  constructor(public status: number, public body: unknown) {
    super(`GoCardless API error ${status}`)
  }
}

export async function gc<T = any>(
  path: string,
  opts: { method?: 'GET' | 'POST' | 'PUT'; body?: unknown; idempotencyKey?: string } = {},
): Promise<T> {
  const token = process.env.GOCARDLESS_RW_TOKEN?.trim()
  if (!token) throw new Error('GOCARDLESS_RW_TOKEN not set')
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    'GoCardless-Version': '2015-07-06',
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }
  if (opts.idempotencyKey) headers['Idempotency-Key'] = opts.idempotencyKey
  const res = await fetch(base() + path, {
    method: opts.method ?? 'GET',
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
    cache: 'no-store',
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    // Idempotent replay: GoCardless returns 409 with the existing resource id
    throw new GcError(res.status, json)
  }
  return json as T
}
