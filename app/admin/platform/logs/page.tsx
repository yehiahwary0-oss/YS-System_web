'use client'

import { FileText, Download, Trash2, Search, Filter, RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getDefaultLogConfig } from '@/lib/platform/adapters/logs'

const mockLogs = [
  { id: 'log_001', category: 'application', level: 'info', message: 'User login successful', moduleId: 'core', timestamp: '2026-07-15T10:30:00Z' },
  { id: 'log_002', category: 'security', level: 'warning', message: 'Failed login attempt from 192.168.1.100', moduleId: 'core', timestamp: '2026-07-15T10:29:00Z' },
  { id: 'log_003', category: 'queue', level: 'info', message: 'Job processed: send_email (default)', moduleId: 'core', timestamp: '2026-07-15T10:28:00Z' },
  { id: 'log_004', category: 'platform', level: 'error', message: 'Cache write failed for key: product_123', moduleId: 'core', timestamp: '2026-07-15T10:27:00Z' },
  { id: 'log_005', category: 'audit', level: 'info', message: 'Role "editor" permissions updated', moduleId: 'core', timestamp: '2026-07-15T10:25:00Z' },
]

const levelColors: Record<string, 'success' | 'warning' | 'error' | 'default'> = {
  info: 'success', warning: 'warning', error: 'error', debug: 'default',
}

export default function LogsPage() {
  const config = getDefaultLogConfig()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Log Center"
        subtitle="Centralized application and platform logs"
        actions={<Button variant="primary" size="sm"><RefreshCw size={14} /> Refresh</Button>}
      />

      <SectionCard title="Log Configuration" description="Log retention and export settings">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: '0.375rem' }}>Retention Period</div>
            <code style={{ fontSize: '0.875rem' }}>{config.retention} days</code>
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: '0.375rem' }}>Export Formats</div>
            <code style={{ fontSize: '0.875rem' }}>{config.exportFormats.join(', ')}</code>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Recent Logs"
        description="Latest log entries across all categories"
        actions={
          <div style={{ display: 'flex', gap: '0.375rem' }}>
            <Button variant="ghost" size="sm"><Filter size={14} /> Filter</Button>
            <Button variant="ghost" size="sm"><Download size={14} /> Export</Button>
          </div>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
          {mockLogs.map(log => (
            <div key={log.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
              <FileText size={14} style={{ marginTop: '0.25rem', color: 'var(--color-foreground-muted)', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Badge variant={levelColors[log.level] ?? 'default'}>{log.level}</Badge>
                  <code style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{log.category}</code>
                  {log.moduleId && <code style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{log.moduleId}</code>}
                </div>
                <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>{log.message}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)', marginTop: '0.125rem' }}>
                  {new Date(log.timestamp).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Backend Integration" description="Required backend API contract for log management">
        <pre style={{
          fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto',
          backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8,
          fontFamily: 'monospace', color: 'var(--color-foreground-muted)',
        }}>
{`GET    /api/v1/admin/logs         → { data: LogEntry[], meta: { total, page, config } }
GET    /api/v1/admin/logs/{id}    → { data: LogEntry }
GET    /api/v1/admin/logs/export  → file download
DELETE /api/v1/admin/logs         → { success: true }

Permissions: view_logs, manage_logs`}
        </pre>
      </SectionCard>
    </div>
  )
}
