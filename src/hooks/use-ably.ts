'use client'

import { useEffect, useRef, useState } from 'react'
import Ably from 'ably'

const ABLY_KEY = process.env.NEXT_PUBLIC_ABLY_KEY

interface UseAblyChannelReturn {
  messages: Ably.Message[]
  isConnected: boolean
}

export function useAblyChannel(channelName: string): UseAblyChannelReturn {
  const [messages, setMessages] = useState<Ably.Message[]>([])
  const [isConnected, setIsConnected] = useState(false)

  const clientRef = useRef<Ably.Realtime | null>(null)
  const channelRef = useRef<Ably.RealtimeChannel | null>(null)

  useEffect(() => {
    if (!ABLY_KEY) {
      console.warn('[useAbly] NEXT_PUBLIC_ABLY_KEY not set. Realtime is disabled.')
      return
    }

    const client = new Ably.Realtime({ key: ABLY_KEY })
    clientRef.current = client

    client.connection.on('connected', () => {
      setIsConnected(true)
    })

    client.connection.on('disconnected', () => {
      setIsConnected(false)
    })

    client.connection.on('suspended', () => {
      setIsConnected(false)
    })

    client.connection.on('closed', () => {
      setIsConnected(false)
    })

    const channel = client.channels.get(channelName)
    channelRef.current = channel

    channel.subscribe((message: Ably.Message) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      channel.unsubscribe()
      channel.detach()
      client.close()
      setIsConnected(false)
    }
  }, [channelName])

  return { messages, isConnected }
}