'use client'

import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { bootstrapPlatform } from './bootstrap'
import { ModuleKernel } from './kernel/ModuleKernel'
import type { PlatformModule } from './contracts/ModuleManifest'
import { registeredModules } from '@/modules'

interface PlatformContextValue {
  kernel: ModuleKernel | null
  loaded: boolean
}

const PlatformContext = createContext<PlatformContextValue>({
  kernel: null,
  loaded: false,
})

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [kernel, setKernel] = useState<ModuleKernel | null>(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const k = bootstrapPlatform(registeredModules as PlatformModule[])
    setKernel(k)
    setLoaded(true)
  }, [])

  const value = useMemo(() => ({ kernel, loaded }), [kernel, loaded])

  return (
    <PlatformContext.Provider value={value}>
      {children}
    </PlatformContext.Provider>
  )
}

export function usePlatform(): PlatformContextValue {
  return useContext(PlatformContext)
}
