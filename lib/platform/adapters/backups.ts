export interface BackupEntry {
  id: string
  type: 'database' | 'media' | 'settings' | 'modules' | 'full'
  filename: string
  size: number
  status: 'completed' | 'failed' | 'in_progress'
  createdAt: string
  createdBy?: string
  retention?: string
}

export interface BackupConfig {
  enabled: boolean
  schedule: string
  retention: number
  types: string[]
}

const ADAPTER_ID = 'backups'

export function getBackupAdapterId(): string {
  return ADAPTER_ID
}

export function getDefaultBackupConfig(): BackupConfig {
  return {
    enabled: false,
    schedule: 'daily',
    retention: 30,
    types: ['database', 'media', 'settings'],
  }
}

/*
  TODO — Backend API contract:
  GET  /api/v1/admin/backups           → { success: true, data: { backups: BackupEntry[], config: BackupConfig } }
  POST /api/v1/admin/backups           → { success: true, data: BackupEntry }
  POST /api/v1/admin/backups/{id}/restore → { success: true }
  DELETE /api/v1/admin/backups/{id}     → { success: true }
  
  Backend needs:
  - Backup model/migration
  - BackupController (index, store, restore, destroy)
  - Backup engine/job
  - Route: admin route
  - Permission: manage_backups (to be created)
*/
