'use client'

import { Tags, Package, GitBranch, RotateCcw, ArrowUpCircle, CheckCircle, XCircle } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const mockReleases = [
  { version: 'v2.4.0', build: '245', sha: 'a1b2c3d4', branch: 'main', status: 'deployed', date: '2026-07-14T10:00:00Z', notes: 'Production release with new dashboard' },
  { version: 'v2.4.1', build: '246', sha: 'e5f6g7h8', branch: 'main', status: 'released', date: '2026-07-15T08:00:00Z', notes: 'Bug fix for cache invalidation' },
  { version: 'v2.3.9', build: '244', sha: 'i9j0k1l2', branch: 'main', status: 'rolled_back', date: '2026-07-12T15:00:00Z', notes: 'Rolled back due to migration issue' },
]

export default function ReleasesPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Release Manager"
        subtitle="Track versions, releases, and deployments"
        actions={<Button variant="primary" size="sm"><Package size={15} /> Create Release</Button>}
      />

      <SectionCard title="Current Version" description="Latest deployed release">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
          <div style={{ fontSize: '1.75rem', fontWeight: 700, fontFamily: 'monospace' }}>v2.4.0</div>
          <Badge variant="success">Deployed</Badge>
          <span style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>Build #245 &middot; 2026-07-14</span>
        </div>
      </SectionCard>

      <SectionCard
        title="Release History"
        description="All version releases and their current status"
        actions={<Button variant="ghost" size="sm"><RotateCcw size={14} /> Refresh</Button>}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Version</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Build</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Git SHA</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Branch</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Status</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Date</th>
            </tr>
          </thead>
          <tbody>
            {mockReleases.map(r => (
              <tr key={r.version} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '0.625rem 0.5rem', fontWeight: 600, fontFamily: 'monospace' }}>{r.version}</td>
                <td style={{ padding: '0.625rem 0.5rem' }}>#{r.build}</td>
                <td style={{ padding: '0.625rem 0.5rem', fontFamily: 'monospace', fontSize: '0.8125rem' }}>{r.sha}</td>
                <td style={{ padding: '0.625rem 0.5rem' }}><code>{r.branch}</code></td>
                <td style={{ padding: '0.625rem 0.5rem' }}>
                  <Badge variant={r.status === 'deployed' ? 'success' : r.status === 'rolled_back' ? 'error' : 'warning'}>{r.status}</Badge>
                </td>
                <td style={{ padding: '0.625rem 0.5rem', fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>
                  {new Date(r.date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Backend Integration" description="Required backend API contract for release management">
        <pre style={{
          fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto',
          backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8,
          fontFamily: 'monospace', color: 'var(--color-foreground-muted)',
        }}>
{`GET    /api/v1/admin/releases        → { data: ReleaseEntry[], meta: { currentVersion, stats } }
POST   /api/v1/admin/releases        → { data: ReleaseEntry }
POST   /api/v1/admin/releases/{id}/release → { success: true }
POST   /api/v1/admin/releases/{id}/rollback → { success: true }

Permission: manage_releases`}
        </pre>
      </SectionCard>
    </div>
  )
}
