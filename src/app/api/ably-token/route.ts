import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { ablyServer } from '@/lib/ably-server'

export async function GET() {
  try {
    if (!ablyServer) {
      return NextResponse.json(
        { error: 'Realtime service is not configured.' },
        { status: 503 }
      )
    }

    const clientId = uuidv4()

    const tokenDetails = await ablyServer.auth.requestToken({
      clientId,
      capability: {
        'appointments:*': ['subscribe'],
      },
      ttl: 3600,
    })

    return NextResponse.json(
      {
        token: tokenDetails.token,
        clientId,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[Ably Token] Failed to generate token:', error)
    return NextResponse.json(
      { error: 'Failed to generate auth token.' },
      { status: 500 }
    )
  }
}