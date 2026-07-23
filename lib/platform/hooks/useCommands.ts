'use client'

import { useCallback } from 'react'
import { usePlatform } from '../PlatformProvider'
import type { BusResult } from '../bus/types'

export function useCommands(): {
  dispatch: <TResult = void>(type: string, payload?: Record<string, unknown>) => Promise<BusResult<TResult>>
  registeredTypes: string[]
  history: Array<{ command: string; success: boolean; duration: number }>
} {
  const { kernel, loaded } = usePlatform()
  const commandBus = loaded && kernel ? kernel.resolve<any>('commandBus') : null

  const dispatch = useCallback(async <TResult = void>(type: string, payload?: Record<string, unknown>) => {
    if (!commandBus) return { success: false, error: 'CommandBus not available', duration: 0 } as BusResult<TResult>
    return commandBus.dispatch({ type, ...payload }) as Promise<BusResult<TResult>>
  }, [commandBus])

  return {
    dispatch,
    registeredTypes: commandBus?.getRegisteredTypes() ?? [],
    history: commandBus?.getHistory() ?? [],
  }
}
