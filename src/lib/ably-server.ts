import { Rest } from 'ably'

const ABLY_API_KEY = process.env.ABLY_API_KEY

/**
 * Server-side Ably client using the REST API.
 *
 * REST (not Realtime) is used server-side because:
 * - Stateless HTTP calls, no persistent WebSocket connection
 * - Ideal for serverless environments (Vercel, AWS Lambda, etc.)
 * - No connection lifecycle management needed
 * - Supports both `auth.requestToken()` and `channels.publish()`
 *
 * The browser client (useAblyChannel hook) uses Ably.Realtime for
 * live subscriptions via WebSocket.
 */
let ablyServer: Rest | null = null

if (ABLY_API_KEY) {
  ablyServer = new Rest({ key: ABLY_API_KEY })
} else {
  console.warn(
    '[Ably] ABLY_API_KEY not set. Realtime features will be disabled.'
  )
}

export { ablyServer }

export async function publishEvent(
  channel: string,
  event: string,
  data: unknown
): Promise<void> {
  if (!ablyServer) {
    console.warn(`[Ably] Skipping publish to "${channel}:${event}" — not configured.`)
    return
  }

  const ch = ablyServer.channels.get(channel)
  await ch.publish(event, data)
}