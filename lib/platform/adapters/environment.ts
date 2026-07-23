export interface EnvironmentInfo {
  name: string
  appEnv: string
  appDebug: boolean
  appUrl: string
  phpVersion?: string
  laravelVersion?: string
  nodeVersion?: string
  database: string
  cacheDriver: string
  queueDriver: string
  sessionDriver: string
  filesystem: string
  serverIp?: string
  serverSoftware?: string
}

const ADAPTER_ID = 'environment'

export function getEnvironmentAdapterId(): string {
  return ADAPTER_ID
}

/*
  TODO — Backend API contract:
  GET /api/v1/admin/environment  → { success: true, data: EnvironmentInfo }
  
  IMPORTANT: This endpoint MUST NOT expose secrets or sensitive configuration.
  The returned data should be limited to:
  - Application environment name (production/staging/local)
  - PHP/Node.js versions
  - Database driver name (not credentials)
  - Cache/queue/session driver name
  - Application URL (public)
  
  Backend needs:
  - EnvironmentController
  - Route: admin route
  - Permission: view_environment (to be created)
  - Security audit: never expose APP_KEY, DB_PASSWORD, or any secrets
*/
