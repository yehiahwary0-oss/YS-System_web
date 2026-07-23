export interface LogEntryData {
  id: string
  category: string
  level: string
  message: string
  moduleId?: string
  timestamp: string
  correlationId?: string
}

export interface LogConfig {
  retention: number
  maxEntries: number
  exportFormats: string[]
}

const ADAPTER_ID = 'logs'

export function getLogAdapterId(): string {
  return ADAPTER_ID
}

export function getDefaultLogConfig(): LogConfig {
  return { retention: 30, maxEntries: 2000, exportFormats: ['json', 'csv'] }
}

/*
  TODO — Backend API contract:
  GET  /api/v1/admin/logs            → { success: true, data: LogEntryData[], meta: { total, page, config: LogConfig } }
  GET  /api/v1/admin/logs/{id}       → { success: true, data: LogEntryData }
  GET  /api/v1/admin/logs/export     → file download
  DELETE /api/v1/admin/logs          → { success: true } (clear all logs)

  Backend needs:
  - Log model/migration (platform_logs table)
  - LogController
  - Log storage service
  - Route: admin route
  - Permission: view_logs, manage_logs (to be created)
*/
