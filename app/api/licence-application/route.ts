import { NextRequest, NextResponse } from 'next/server'

const HONBU_API = process.env.NEXT_PUBLIC_CLUB_HONBU_API || 'https://forza-club-honbu-production.up.railway.app/api'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Forward to Club Honbu API
    const response = await fetch(`${HONBU_API}/licence-applications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: body.firstName,
        surname: body.surname,
        dateOfBirth: body.dateOfBirth,
        email: body.email,
        phone: body.phone,
        beltLevel: body.belt,
        applicationType: body.reason,
        status: 'pending',
        submittedAt: new Date().toISOString(),
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Failed to submit application' },
        { status: response.status }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in licence application API:', error)
    return NextResponse.json(
      { error: 'Failed to process application' },
      { status: 500 }
    )
  }
}
