'use client'

import { usePlatform } from '../PlatformProvider'

export function useFeatureFlags(): {
  isEnabled: (key: string) => boolean
  flags: Array<{ key: string; label: string; enabled: boolean }>
} {
  const { kernel, loaded } = usePlatform()

  const ffEngine = loaded && kernel ? kernel.resolve<any>('featureFlagEngine') : null
  const flags = ffEngine?.getAllFlags() ?? []

  return {
    isEnabled: (key: string) => {
      if (!ffEngine) return false
      return ffEngine.isEnabled(key)
    },
    flags: flags.map((f: any) => ({ key: f.key, label: f.label, enabled: f.enabled })),
  }
}
