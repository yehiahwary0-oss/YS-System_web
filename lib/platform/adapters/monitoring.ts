export interface MonitoringStats {
  cpu: { current: number; avg: number; max: number }
  memory: { used: number; total: number; percent: number }
  disk: { used: number; total: number; percent: number }
  uptime: number
}

export interface MonitoringAlertData {
  id: string
  metric: string
  severity: 'info' | 'warning' | 'critical'
  message: string
  timestamp: string
  acknowledged: boolean
}

export interface MonitoringConfig {
  pollingInterval: number
  alertThresholds: Record<string, number>
}

const ADAPTER_ID = 'monitoring'

export function getMonitoringAdapterId(): string {
  return ADAPTER_ID
}

export function getDefaultMonitoringConfig(): MonitoringConfig {
  return { pollingInterval: 60, alertThresholds: { cpu: 90, memory: 90, disk: 95 } }
}

/*
  TODO — Backend API contract:
  GET  /api/v1/admin/monitoring     → { success: true, data: { stats: MonitoringStats, alerts: MonitoringAlertData[], config: MonitoringConfig } }
  PUT  /api/v1/admin/monitoring/config → { success: true, data: MonitoringConfig }
  POST /api/v1/admin/monitoring/alerts/{id}/ack → { success: true }

  Backend needs:
  - Monitoring model/migration
  - MonitoringController
  - System stats collector service
  - Route: admin route
  - Permission: view_monitoring, manage_monitoring (to be created)
*/
