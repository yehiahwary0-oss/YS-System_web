'use client'

import { usePlatform } from '../PlatformProvider'

export function useCache(): {
  get: (key: string) => Promise<unknown | null>
  set: (key: string, value: unknown, ttl: number) => Promise<void>
  forget: (key: string) => Promise<void>
  remember: <T>(key: string, ttl: number, callback: () => Promise<T>) => Promise<T>
  clear: () => Promise<void>
  statistics: () => { hits: number; misses: number; keys: number }
} {
  const { kernel, loaded } = usePlatform()
  const cache = loaded && kernel ? kernel.resolve<any>('cacheManager') : null

  return {
    get: async (key: string) => cache?.get(key) ?? null,
    set: async (key: string, value: unknown, ttl: number) => cache?.set(key, value, ttl),
    forget: async (key: string) => cache?.forget(key),
    remember: async <T>(key: string, ttl: number, callback: () => Promise<T>) => cache?.remember(key, ttl, callback) ?? callback(),
    clear: async () => cache?.clear(),
    statistics: () => cache?.statistics() ?? { hits: 0, misses: 0, keys: 0 },
  }
}
