'use client'

import { Clock, Play, RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getDefaultSchedulerConfig } from '@/lib/platform/adapters/scheduler'

const mockJobs = [
  { id: 'j1', name: 'Cleanup old logs', type: 'cron' as const, cron: '0 3 * * *', status: 'active' as const, lastRun: '2026-07-14T03:00:00Z', nextRun: '2026-07-15T03:00:00Z', runCount: 120, failCount: 0 },
  { id: 'j2', name: 'Send digest emails', type: 'cron' as const, cron: '0 8 * * *', status: 'active' as const, lastRun: '2026-07-14T08:00:00Z', nextRun: '2026-07-15T08:00:00Z', runCount: 89, failCount: 2 },
  { id: 'j3', name: 'Backup database', type: 'cron' as const, cron: '0 2 * * 0', status: 'active' as const, lastRun: '2026-07-12T02:00:00Z', nextRun: '2026-07-19T02:00:00Z', runCount: 52, failCount: 1 },
  { id: 'j4', name: 'Generate reports', type: 'recurring' as const, status: 'inactive' as const, runCount: 0, failCount: 0 },
]

export default function SchedulerPage() {
  const config = getDefaultSchedulerConfig()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Enterprise Scheduler" subtitle="Manage scheduled jobs and cron tasks" />

      <SectionCard title="Scheduler Configuration" description="Global scheduler settings">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: '0.375rem' }}>Timezone</div>
            <code style={{ fontSize: '0.875rem' }}>{config.timezone}</code>
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: '0.375rem' }}>Max Concurrent</div>
            <code style={{ fontSize: '0.875rem' }}>{config.maxConcurrent}</code>
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: '0.375rem' }}>History Retention</div>
            <code style={{ fontSize: '0.875rem' }}>{config.historyRetention} days</code>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Scheduled Jobs"
        description="Registered cron jobs and recurring tasks"
        actions={<Button variant="primary" size="sm"><RefreshCw size={14} /> Refresh</Button>}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Job</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Type</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Schedule</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Status</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Runs</th>
              <th style={{ textAlign: 'right', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockJobs.map(j => (
              <tr key={j.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '0.625rem 0.5rem', fontWeight: 500 }}>{j.name}</td>
                <td style={{ padding: '0.625rem 0.5rem' }}><code>{j.type}</code></td>
                <td style={{ padding: '0.625rem 0.5rem', fontFamily: 'monospace' }}>{j.cron ?? '-'}</td>
                <td style={{ padding: '0.625rem 0.5rem' }}>
                  <Badge variant={j.status === 'active' ? 'success' : 'default'}>{j.status}</Badge>
                </td>
                <td style={{ padding: '0.625rem 0.5rem' }}>
                  {j.runCount} / <span style={{ color: j.failCount > 0 ? '#EF4444' : undefined }}>{j.failCount} failed</span>
                </td>
                <td style={{ padding: '0.625rem 0.5rem', textAlign: 'right' }}>
                  <Button variant="ghost" size="sm"><Play size={13} /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Backend Integration" description="Required backend API contract for scheduler management">
        <pre style={{
          fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto',
          backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8,
          fontFamily: 'monospace', color: 'var(--color-foreground-muted)',
        }}>
{`GET    /api/v1/admin/scheduler              → { jobs: SchedulerJob[], config: SchedulerConfig }
POST   /api/v1/admin/scheduler/run/{id}     → { success: true }
PUT    /api/v1/admin/scheduler/config       → { success: true }
POST   /api/v1/admin/scheduler/jobs         → { success: true, data: SchedulerJob }

Permission: manage_scheduler`}
        </pre>
      </SectionCard>
    </div>
  )
}
