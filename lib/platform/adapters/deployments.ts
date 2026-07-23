export interface ReleaseData {
  id: string
  version: string
  buildNumber: string
  gitSha: string
  gitBranch: string
  description: string
  status: string
  deployedAt?: string
  createdAt: string
}

export interface DeploymentConfig {
  environments: string[]
  steps: string[]
  requireApproval: boolean
}

const ADAPTER_ID = 'deployments'

export function getDeploymentAdapterId(): string {
  return ADAPTER_ID
}

export function getDefaultDeploymentConfig(): DeploymentConfig {
  return {
    environments: ['development', 'staging', 'production'],
    steps: ['backup', 'extract', 'verify', 'migrate', 'activate'],
    requireApproval: true,
  }
}

/*
  TODO — Backend API contract:
  GET  /api/v1/admin/deployments        → { success: true, data: { releases: ReleaseData[], deployments: DeploymentData[], config: DeploymentConfig } }
  POST /api/v1/admin/deployments/release → { success: true, data: ReleaseData }
  POST /api/v1/admin/deployments/deploy  → { success: true, data: DeploymentData }
  POST /api/v1/admin/deployments/{id}/rollback → { success: true }

  Backend needs:
  - Release model/migration
  - Deployment model/migration
  - DeploymentController
  - Deployment engine/service
  - Route: admin route
  - Permission: manage_deployments (to be created)
*/
