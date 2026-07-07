import { Ably } from 'ably'

const ABLY_API_KEY = process.env.ABLY_API_KEY

let ablyServer: Ably.Realtime | null = null

if (ABLY_API_KEY) {
  ablyServer = new Ably.Realtime({ key: ABLY_API_KEY })
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