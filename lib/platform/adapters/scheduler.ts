export interface SchedulerJob {
  id: string
  name: string
  type: 'recurring' | 'delayed' | 'cron'
  cron?: string
  status: 'active' | 'inactive' | 'paused' | 'failed'
  lastRun?: string
  nextRun?: string
  runCount: number
  failCount: number
}

export interface SchedulerConfig {
  timezone: string
  maxConcurrent: number
  historyRetention: number
}

const ADAPTER_ID = 'scheduler'

export function getSchedulerAdapterId(): string {
  return ADAPTER_ID
}

export function getDefaultSchedulerConfig(): SchedulerConfig {
  return { timezone: 'UTC', maxConcurrent: 5, historyRetention: 30 }
}

/*
  TODO — Backend API contract:
  GET  /api/v1/admin/scheduler          → { success: true, data: { jobs: SchedulerJob[], config: SchedulerConfig } }
  POST /api/v1/admin/scheduler/run/{id} → { success: true }
  PUT  /api/v1/admin/scheduler/config   → { success: true }

  Backend needs:
  - SchedulerJob model/migration
  - SchedulerController
  - Scheduler engine/cron service
  - Route: admin route
  - Permission: manage_scheduler (to be created)
*/
