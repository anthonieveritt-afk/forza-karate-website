import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * SECURITY: The previous gallery-proxy authenticated to Club Honbu as admin
 * using server env credentials and exposed write operations to anonymous
 * callers. It has been permanently disabled. Staff manage the gallery in
 * Club Honbu (linked from /admin). Public visitors use /gallery, which talks
 * to Club Honbu's public API directly.
 */
function gone() {
  return NextResponse.json(
    {
      error: 'This endpoint has been removed. Manage the gallery in Club Honbu.',
    },
    { status: 410 },
  )
}

export async function GET() { return gone() }
export async function POST() { return gone() }
export async function PUT() { return gone() }
export async function PATCH() { return gone() }
export async function DELETE() { return gone() }
