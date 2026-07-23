'use client'

import { usePlatform } from '../PlatformProvider'
import type { PlatformModule } from '../contracts/ModuleManifest'

export function useModule(moduleId: string): {
  module: PlatformModule | undefined
  loaded: boolean
} {
  const { kernel, loaded } = usePlatform()

  if (!kernel || !loaded) return { module: undefined, loaded: false }

  const module = kernel.getModules().find(m => m.manifest.id === moduleId)
  return { module, loaded: true }
}
