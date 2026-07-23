export interface MaintenanceConfig {
  enabled: boolean
  message: string
  allowedAdmins: boolean
  allowedIps: string[]
  estimatedCompletion?: string
}

const ADAPTER_ID = 'maintenance'

export function getMaintenanceAdapterId(): string {
  return ADAPTER_ID
}

export function getDefaultMaintenanceConfig(): MaintenanceConfig {
  return {
    enabled: false,
    message: 'The platform is currently undergoing scheduled maintenance. Please check back shortly.',
    allowedAdmins: true,
    allowedIps: [],
  }
}

/*
  TODO — Backend API contract:
  GET  /api/v1/admin/maintenance       → { success: true, data: MaintenanceConfig }
  PUT  /api/v1/admin/maintenance       → { success: true, data: MaintenanceConfig }
  
  Backend needs:
  - MaintenanceController (show, update)
  - MaintenanceMiddleware that checks the config
  - Settings or dedicated table for maintenance state
  - Route: admin route
  - Permission: manage_maintenance (to be created)
*/
