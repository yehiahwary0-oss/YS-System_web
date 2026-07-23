export interface WorkerInfo {
  id: string
  name: string
  queue: string
  status: 'running' | 'idle' | 'stopped' | 'failed'
  jobsProcessed: number
  jobsFailed: number
  startedAt: string
  lastHeartbeat?: string
}

export interface WorkerConfig {
  maxWorkers: number
  pollingInterval: number
  maxJobsPerWorker: number
}

const ADAPTER_ID = 'workers'

export function getWorkerAdapterId(): string {
  return ADAPTER_ID
}

export function getDefaultWorkerConfig(): WorkerConfig {
  return { maxWorkers: 4, pollingInterval: 1, maxJobsPerWorker: 10 }
}

/*
  TODO — Backend API contract:
  GET  /api/v1/admin/workers          → { success: true, data: { workers: WorkerInfo[], config: WorkerConfig } }
  POST /api/v1/admin/workers/{id}/stop    → { success: true }
  POST /api/v1/admin/workers/{id}/restart → { success: true }
  PUT  /api/v1/admin/workers/config       → { success: true }

  Backend needs:
  - Worker model/migration
  - WorkerController
  - Worker daemon/service
  - Route: admin route
  - Permission: manage_workers (to be created)
*/
