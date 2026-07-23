'use client'

import { useCallback } from 'react'
import { usePlatform } from '../PlatformProvider'
import type { BusResult } from '../bus/types'

export function useQueries(): {
  execute: <TResult = unknown>(type: string, params?: Record<string, unknown>) => Promise<BusResult<TResult>>
  registeredTypes: string[]
  history: Array<{ query: string; success: boolean; duration: number; cached: boolean }>
} {
  const { kernel, loaded } = usePlatform()
  const queryBus = loaded && kernel ? kernel.resolve<any>('queryBus') : null

  const execute = useCallback(async <TResult = unknown>(type: string, params?: Record<string, unknown>) => {
    if (!queryBus) return { success: false, error: 'QueryBus not available', duration: 0 } as BusResult<TResult>
    return queryBus.execute({ type, ...params }) as Promise<BusResult<TResult>>
  }, [queryBus])

  return {
    execute,
    registeredTypes: queryBus?.getRegisteredTypes() ?? [],
    history: queryBus?.getHistory() ?? [],
  }
}
