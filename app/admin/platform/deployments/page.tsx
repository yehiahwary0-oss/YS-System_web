'use client'

import { GitBranch, Package, RotateCcw, Rocket, CheckCircle, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getDefaultDeploymentConfig } from '@/lib/platform/adapters/deployments'

const mockReleases = [
  { version: 'v2.4.0', buildNumber: '245', gitSha: 'a1b2c3d4', gitBranch: 'main', status: 'deployed', deployedAt: '2026-07-14T10:00:00Z' },
  { version: 'v2.4.1', buildNumber: '246', gitSha: 'e5f6g7h8', gitBranch: 'main', status: 'pending', deployedAt: null },
  { version: 'v2.3.9', buildNumber: '244', gitSha: 'i9j0k1l2', gitBranch: 'main', status: 'rolled_back', deployedAt: '2026-07-12T15:00:00Z' },
]

export default function DeploymentsPage() {
  const config = getDefaultDeploymentConfig()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Deployment Center"
        subtitle="Manage releases and deployments across environments"
        actions={<Button variant="primary" size="sm"><Rocket size={15} /> New Deployment</Button>}
      />

      <SectionCard title="Deployment Configuration" description="Available environments and deployment steps">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: '0.375rem' }}>Environments</div>
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
              {config.environments.map(e => <Badge key={e} variant="default">{e}</Badge>)}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: '0.375rem' }}>Deployment Steps</div>
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
              {config.steps.map(s => <Badge key={s} variant="default">{s}</Badge>)}
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Releases"
        description="Version releases and their deployment status"
        actions={<Button variant="ghost" size="sm"><Package size={14} /> Create Release</Button>}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Version</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Build</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Git SHA</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Branch</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Status</th>
              <th style={{ textAlign: 'right', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockReleases.map(r => (
              <tr key={r.version} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '0.625rem 0.5rem', fontWeight: 600, fontFamily: 'monospace' }}>{r.version}</td>
                <td style={{ padding: '0.625rem 0.5rem' }}>#{r.buildNumber}</td>
                <td style={{ padding: '0.625rem 0.5rem', fontFamily: 'monospace', fontSize: '0.8125rem' }}>{r.gitSha}</td>
                <td style={{ padding: '0.625rem 0.5rem' }}><code>{r.gitBranch}</code></td>
                <td style={{ padding: '0.625rem 0.5rem' }}>
                  <Badge variant={r.status === 'deployed' ? 'success' : r.status === 'rolled_back' ? 'error' : 'warning'}>{r.status}</Badge>
                </td>
                <td style={{ padding: '0.625rem 0.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
                    <Button variant="ghost" size="sm"><Rocket size={13} /></Button>
                    <Button variant="ghost" size="sm"><RotateCcw size={13} /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Backend Integration" description="Required backend API contract for deployments">
        <pre style={{
          fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto',
          backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8,
          fontFamily: 'monospace', color: 'var(--color-foreground-muted)',
        }}>
{`GET    /api/v1/admin/deployments          → { data: { releases, deployments, config } }
POST   /api/v1/admin/deployments/release  → { data: Release }
POST   /api/v1/admin/deployments/deploy   → { data: Deployment }
POST   /api/v1/admin/deployments/{id}/rollback → { success: true }

Permission: manage_deployments`}
        </pre>
      </SectionCard>
    </div>
  )
}
