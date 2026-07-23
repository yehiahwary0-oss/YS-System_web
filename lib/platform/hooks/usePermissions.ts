'use client'

import { usePlatform } from '../PlatformProvider'

export function usePermissions(): {
  hasPermission: (permission: string) => boolean
  hasAll: (permissions: string[]) => boolean
  hasAny: (permissions: string[]) => boolean
  allKeys: string[]
} {
  const { kernel, loaded } = usePlatform()

  const securityManager = loaded && kernel ? kernel.resolve<any>('securityManager') : null
  const permReg = loaded && kernel ? kernel.getRegistry('permissions') : null
  const allKeys = permReg?.getAllKeys() ?? []

  return {
    hasPermission: (permission: string) => {
      if (!securityManager) return false
      return securityManager.hasPermission(allKeys, permission)
    },
    hasAll: (permissions: string[]) => {
      if (!securityManager) return false
      return securityManager.hasAllPermissions(allKeys, permissions)
    },
    hasAny: (permissions: string[]) => {
      if (!securityManager) return false
      return securityManager.hasAnyPermission(allKeys, permissions)
    },
    allKeys,
  }
}
