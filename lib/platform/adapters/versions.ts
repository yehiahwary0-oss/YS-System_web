export interface VersionInfo {
  component: string
  currentVersion: string
  latestVersion?: string
  status: 'up-to-date' | 'outdated' | 'unknown'
  releasedAt?: string
  changelog?: string
}

export interface PlatformVersionReport {
  platform: VersionInfo
  kernel: VersionInfo
  api: VersionInfo
  database: VersionInfo
  modules: VersionInfo[]
}

const ADAPTER_ID = 'versions'

export function getVersionAdapterId(): string {
  return ADAPTER_ID
}

/*
  TODO — Backend API contract:
  GET /api/v1/admin/versions   → { success: true, data: PlatformVersionReport }
  
  Backend needs:
  - VersionController
  - Platform version tracking (could read from composer.json, package.json, or a versions table)
  - Route: admin route
  - Permission: view_versions (to be created)
*/
