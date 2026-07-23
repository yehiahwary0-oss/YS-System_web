'use client'

import { useCallback } from 'react'
import { usePlatform } from '../PlatformProvider'

export function useEvents(): {
  emit: (event: string, payload?: any) => Promise<void>
  on: (event: string, handler: (payload: any) => void) => void
  history: Array<{ event: string; success: boolean; duration: number; timestamp: string }>
} {
  const { kernel, loaded } = usePlatform()
  const eventBus = loaded && kernel ? kernel.resolve<any>('eventBus') : null

  return {
    emit: useCallback(async (event: string, payload?: any) => {
      await eventBus?.emit(event, payload)
    }, [eventBus]),
    on: useCallback((event: string, handler: (payload: any) => void) => {
      eventBus?.on(event, handler)
    }, [eventBus]),
    history: eventBus?.getHistory() ?? [],
  }
}
