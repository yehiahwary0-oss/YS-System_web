'use client'

import { Activity, Cpu, HardDrive, MemoryStick, AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getDefaultMonitoringConfig } from '@/lib/platform/adapters/monitoring'

const mockStats = {
  cpu: { current: 45, avg: 52, max: 78 },
  memory: { used: 6144, total: 16384, percent: 37.5 },
  disk: { used: 120, total: 500, percent: 24 },
}

const mockAlerts = [
  { metric: 'CPU', severity: 'warning' as const, message: 'CPU usage exceeded 70% threshold', timestamp: '2026-07-15T09:45:00Z', acknowledged: false },
  { metric: 'Memory', severity: 'info' as const, message: 'Memory usage normalizing after peak', timestamp: '2026-07-15T08:30:00Z', acknowledged: true },
]

export default function MonitoringPage() {
  const config = getDefaultMonitoringConfig()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Monitoring Center"
        subtitle="System resource monitoring and alerting"
        actions={<Button variant="primary" size="sm"><RefreshCw size={14} /> Refresh</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SectionCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Cpu size={18} style={{ color: '#3B82F6' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>CPU</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{mockStats.cpu.current}%</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>avg {mockStats.cpu.avg}% / max {mockStats.cpu.max}%</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(236,72,153,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MemoryStick size={18} style={{ color: '#EC4899' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Memory</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{(mockStats.memory.used / 1024).toFixed(1)} GB</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{mockStats.memory.percent}% of {(mockStats.memory.total / 1024).toFixed(0)} GB</div>
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(20,184,166,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <HardDrive size={18} style={{ color: '#14B8A6' }} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Disk</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{mockStats.disk.used} GB</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{mockStats.disk.percent}% of {mockStats.disk.total} GB</div>
            </div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Active Alerts" description="System alerts that require attention">
        {mockAlerts.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {mockAlerts.map((a, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                <AlertTriangle size={16} style={{ color: a.severity === 'warning' ? '#F59E0B' : '#3B82F6' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{a.message}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{a.metric} &middot; {new Date(a.timestamp).toLocaleString()}</div>
                </div>
                <Badge variant={a.acknowledged ? 'success' : 'warning'}>{a.acknowledged ? 'Acknowledged' : 'New'}</Badge>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-foreground-muted)' }}>
            <CheckCircle2 size={16} style={{ color: '#22C55E' }} />
            <span style={{ fontSize: '0.875rem' }}>No active alerts</span>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Backend Integration" description="Required backend API contract for monitoring">
        <pre style={{
          fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto',
          backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8,
          fontFamily: 'monospace', color: 'var(--color-foreground-muted)',
        }}>
{`GET    /api/v1/admin/monitoring           → { stats: SystemStats, alerts: Alert[], config }
PUT    /api/v1/admin/monitoring/config    → { success: true, data: MonitoringConfig }
POST   /api/v1/admin/monitoring/alerts/{id}/ack → { success: true }

Permissions: view_monitoring, manage_monitoring`}
        </pre>
      </SectionCard>
    </div>
  )
}
