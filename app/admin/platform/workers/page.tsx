'use client'

import { Cpu, Play, Square, RefreshCw, RefreshCcw } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getDefaultWorkerConfig } from '@/lib/platform/adapters/workers'

const mockWorkers = [
  { id: 'w1', name: 'Worker #1', queue: 'default', status: 'running' as const, jobsProcessed: 1423, jobsFailed: 3, startedAt: '2026-07-14T08:00:00Z' },
  { id: 'w2', name: 'Worker #2', queue: 'mail', status: 'idle' as const, jobsProcessed: 892, jobsFailed: 1, startedAt: '2026-07-14T08:00:00Z' },
  { id: 'w3', name: 'Worker #3', queue: 'notifications', status: 'running' as const, jobsProcessed: 3451, jobsFailed: 7, startedAt: '2026-07-14T08:00:00Z' },
  { id: 'w4', name: 'Worker #4', queue: 'media', status: 'stopped' as const, jobsProcessed: 567, jobsFailed: 0, startedAt: '2026-07-14T08:00:00Z' },
]

const statusColors: Record<string, string> = { running: '#22C55E', idle: '#6B7280', stopped: '#EF4444', failed: '#EF4444' }

export default function WorkersPage() {
  const config = getDefaultWorkerConfig()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Worker Manager" subtitle="Monitor and manage background workers" />

      <SectionCard title="Worker Configuration" description="Global worker pool settings">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: '0.375rem' }}>Max Workers</div>
            <code style={{ fontSize: '0.875rem' }}>{config.maxWorkers}</code>
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: '0.375rem' }}>Polling Interval</div>
            <code style={{ fontSize: '0.875rem' }}>{config.pollingInterval}s</code>
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: '0.375rem' }}>Max Jobs/Worker</div>
            <code style={{ fontSize: '0.875rem' }}>{config.maxJobsPerWorker}</code>
          </div>
        </div>
      </SectionCard>

      <SectionCard description="Currently registered workers and their status">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Worker</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Queue</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Status</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Jobs</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Failed</th>
              <th style={{ textAlign: 'right', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockWorkers.map(w => (
              <tr key={w.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '0.625rem 0.5rem', fontWeight: 500 }}>{w.name}</td>
                <td style={{ padding: '0.625rem 0.5rem' }}>{w.queue}</td>
                <td style={{ padding: '0.625rem 0.5rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: statusColors[w.status] }} />
                    {w.status}
                  </span>
                </td>
                <td style={{ padding: '0.625rem 0.5rem' }}>{w.jobsProcessed.toLocaleString()}</td>
                <td style={{ padding: '0.625rem 0.5rem' }}>
                  <Badge variant={w.jobsFailed > 0 ? 'error' : 'success'}>{w.jobsFailed}</Badge>
                </td>
                <td style={{ padding: '0.625rem 0.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
                    <Button variant="ghost" size="sm"><Play size={13} /></Button>
                    <Button variant="ghost" size="sm"><Square size={13} /></Button>
                    <Button variant="ghost" size="sm"><RefreshCcw size={13} /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Backend Integration" description="Required backend API contract for worker management">
        <pre style={{
          fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto',
          backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8,
          fontFamily: 'monospace', color: 'var(--color-foreground-muted)',
        }}>
{`GET    /api/v1/admin/workers              → { workers: WorkerInfo[], config: WorkerConfig }
POST   /api/v1/admin/workers/{id}/stop    → { success: true }
POST   /api/v1/admin/workers/{id}/restart → { success: true }
PUT    /api/v1/admin/workers/config       → { success: true }

Permission: manage_workers`}
        </pre>
      </SectionCard>
    </div>
  )
}
