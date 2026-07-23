export interface PlatformEvent {
  id: string
  name: string
  moduleId: string
  dispatchedAt: string
  duration?: number
  status: 'success' | 'failed' | 'retrying'
  listeners?: string[]
  payload?: Record<string, unknown>
  error?: string
}

export interface EventStats {
  total: number
  success: number
  failed: number
  retrying: number
  avgDuration?: number
}

const ADAPTER_ID = 'events'

export function getEventAdapterId(): string {
  return ADAPTER_ID
}

export function getDefaultEventStats(): EventStats {
  return { total: 0, success: 0, failed: 0, retrying: 0 }
}

/*
  TODO — Backend API contract:
  GET /api/v1/admin/events          → { success: true, data: { events: PlatformEvent[], stats: EventStats } }
  GET /api/v1/admin/events/{id}     → { success: true, data: PlatformEvent }
  DELETE /api/v1/admin/events       → { success: true } (clear all)
  
  Backend needs:
  - Event model/migration
  - EventController (index, show, destroy)
  - Route registration in admin routes
  - Permission: view_events (to be created)
*/
