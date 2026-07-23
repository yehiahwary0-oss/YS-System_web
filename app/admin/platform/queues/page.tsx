'use client'

import { Layers, Play, Pause, Trash2, RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getDefaultQueueConfig } from '@/lib/platform/adapters/queues'

const mockQueues = [
  { name: 'default', size: 12, processed: 1423, failed: 3, pending: 0 },
  { name: 'mail', size: 0, processed: 892, failed: 1, pending: 0 },
  { name: 'notifications', size: 5, processed: 3451, failed: 7, pending: 2 },
  { name: 'media', size: 0, processed: 567, failed: 0, pending: 0 },
]

export default function QueuesPage() {
  const config = getDefaultQueueConfig()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Queue Manager" subtitle="Monitor and manage job queues" />

      <SectionCard title="Queue Configuration" description="Global queue driver settings">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: '0.375rem' }}>Driver</div>
            <code style={{ fontSize: '0.875rem' }}>{config.driver}</code>
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: '0.375rem' }}>Max Retries</div>
            <code style={{ fontSize: '0.875rem' }}>{config.retries}</code>
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: '0.375rem' }}>Timeout</div>
            <code style={{ fontSize: '0.875rem' }}>{config.timeout}s</code>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Queues"
        description="Active queues and their current state"
        actions={<Button variant="primary" size="sm"><RefreshCw size={14} /> Refresh</Button>}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Queue</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Size</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Processed</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Failed</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Status</th>
              <th style={{ textAlign: 'right', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockQueues.map(q => (
              <tr key={q.name} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '0.625rem 0.5rem', fontWeight: 500 }}>{q.name}</td>
                <td style={{ padding: '0.625rem 0.5rem' }}>{q.size}</td>
                <td style={{ padding: '0.625rem 0.5rem' }}>{q.processed.toLocaleString()}</td>
                <td style={{ padding: '0.625rem 0.5rem' }}>
                  <Badge variant={q.failed > 0 ? 'error' : 'success'}>{q.failed}</Badge>
                </td>
                <td style={{ padding: '0.625rem 0.5rem' }}>
                  <Badge variant={q.size > 0 ? 'warning' : 'success'}>{q.size > 0 ? 'Active' : 'Idle'}</Badge>
                </td>
                <td style={{ padding: '0.625rem 0.5rem', textAlign: 'right' }}>
                  <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
                    <Button variant="ghost" size="sm"><Pause size={13} /></Button>
                    <Button variant="ghost" size="sm"><Trash2 size={13} /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Backend Integration" description="Required backend API contract for queue management">
        <pre style={{
          fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto',
          backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8,
          fontFamily: 'monospace', color: 'var(--color-foreground-muted)',
        }}>
{`GET    /api/v1/admin/queues              → { queues: QueueStats[], config: QueueConfig }
POST   /api/v1/admin/queues/{name}/pause  → { success: true }
POST   /api/v1/admin/queues/{name}/resume → { success: true }
DELETE /api/v1/admin/queues/{name}/flush  → { success: true }

Permission: manage_queues`}
        </pre>
      </SectionCard>
    </div>
  )
}
