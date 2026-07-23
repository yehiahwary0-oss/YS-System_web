export interface QueueStats {
  name: string
  size: number
  processed: number
  failed: number
  pending: number
  createdAt: string
}

export interface QueueConfig {
  driver: string
  defaultQueue: string
  retries: number
  timeout: number
}

const ADAPTER_ID = 'queues'

export function getQueueAdapterId(): string {
  return ADAPTER_ID
}

export function getDefaultQueueConfig(): QueueConfig {
  return { driver: 'sync', defaultQueue: 'default', retries: 3, timeout: 60 }
}

/*
  TODO — Backend API contract:
  GET  /api/v1/admin/queues          → { success: true, data: { queues: QueueStats[], config: QueueConfig } }
  POST /api/v1/admin/queues/{name}/pause   → { success: true }
  POST /api/v1/admin/queues/{name}/resume  → { success: true }
  DELETE /api/v1/admin/queues/{name}/flush → { success: true }

  Backend needs:
  - Queue model/migration (queue_jobs table)
  - QueueController
  - Queue worker service
  - Route: admin route
  - Permission: manage_queues (to be created)
*/
