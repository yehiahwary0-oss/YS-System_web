import type { AdapterState } from './AdapterState'

export interface HealthCheckResult {
  service: string
  status: 'healthy' | 'warning' | 'critical' | 'unknown'
  latency?: number
  message?: string
  lastChecked?: string
}

export interface HealthReport {
  status: 'healthy' | 'warning' | 'critical' | 'unknown'
  checks: HealthCheckResult[]
  uptime?: number
  timestamp: string
}

const ADAPTER_ID = 'health'
const ADAPTER_STATE: AdapterState = 'pending'

export function getHealthAdapterId(): string {
  return ADAPTER_ID
}

export function getHealthAdapterState(): AdapterState {
  return ADAPTER_STATE
}

export function getDefaultHealthReport(): HealthReport {
  return {
    status: 'unknown',
    checks: [
      { service: 'Database', status: 'unknown' },
      { service: 'Redis', status: 'unknown' },
      { service: 'Storage', status: 'unknown' },
      { service: 'Mail', status: 'unknown' },
      { service: 'Queue', status: 'unknown' },
      { service: 'Scheduler', status: 'unknown' },
      { service: 'API', status: 'unknown' },
      { service: 'Platform Kernel', status: 'unknown' },
      { service: 'Service Container', status: 'unknown' },
      { service: 'Event Bus', status: 'unknown' },
      { service: 'Logger', status: 'unknown' },
      { service: 'Health Reporter', status: 'unknown' },
      { service: 'Audit Engine', status: 'unknown' },
      { service: 'Notification Bus', status: 'unknown' },
    ],
    timestamp: new Date().toISOString(),
  }
}
