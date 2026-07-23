export interface PerformanceData {
  responseTimes: Record<string, number>
  cacheHitRate: number
  cacheSize: number
  warmedEndpoints: string[]
  cdnEndpoints: string[]
}

export interface PerformanceConfig {
  cacheEnabled: boolean
  defaultCacheTtl: number
  warmupEnabled: boolean
  cdnEnabled: boolean
}

const ADAPTER_ID = 'performance'

export function getPerformanceAdapterId(): string {
  return ADAPTER_ID
}

export function getDefaultPerformanceConfig(): PerformanceConfig {
  return { cacheEnabled: true, defaultCacheTtl: 3600, warmupEnabled: true, cdnEnabled: false }
}

/*
  TODO — Backend API contract:
  GET  /api/v1/admin/performance       → { success: true, data: { stats: PerformanceData, config: PerformanceConfig } }
  PUT  /api/v1/admin/performance/config → { success: true, data: PerformanceConfig }
  POST /api/v1/admin/performance/warmup → { success: true }
  POST /api/v1/admin/performance/cache/clear → { success: true }
  POST /api/v1/admin/performance/cache/invalidate → { success: true }

  Backend needs:
  - PerformanceController
  - Cache service
  - CDN integration service
  - Route: admin route
  - Permission: manage_performance (to be created)
*/
