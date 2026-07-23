'use client'

import { usePlatform } from '../PlatformProvider'

export function useNotifications(): {
  send: (channel: string | string[], subject: string, body: string, recipient: string) => Promise<any[]>
  history: Array<{ notification: any; success: boolean; timestamp: string }>
  providers: string[]
} {
  const { kernel, loaded } = usePlatform()
  const notificationBus = loaded && kernel ? kernel.resolve<any>('notificationBus') : null

  return {
    send: async (channel, subject, body, recipient) => {
      if (!notificationBus) return []
      return notificationBus.notify({ channel, subject, body, recipient })
    },
    history: notificationBus?.getHistory() ?? [],
    providers: notificationBus?.getProviders().map((p: any) => p.channel) ?? [],
  }
}
