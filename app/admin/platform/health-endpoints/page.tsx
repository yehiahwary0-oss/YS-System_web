'use client'

import { Activity, Heart, Shield, Search, Database, HardDrive, RefreshCw, Cpu } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const endpoints = [
  { path: '/health/live', method: 'GET', status: 'ok' as const, description: 'Simple liveness probe - always succeeds when the process is running' },
  { path: '/health/ready', method: 'GET', status: 'ok' as const, description: 'Readiness probe - checks if the application is ready to serve traffic' },
  { path: '/health/startup', method: 'GET', status: 'ok' as const, description: 'Startup probe - indicates whether the application has completed startup' },
  { path: '/health/deep', method: 'GET', status: 'degraded' as const, description: 'Deep health check - validates all subsystems (DB, Redis, Queue, etc.)' },
]

const mockDeepChecks = [
  { name: 'Database', status: 'ok' as const, duration: 12, icon: Database },
  { name: 'Redis', status: 'ok' as const, duration: 3, icon: Activity },
  { name: 'Storage', status: 'ok' as const, duration: 8, icon: HardDrive },
  { name: 'Queue', status: 'ok' as const, duration: 5, icon: RefreshCw },
  { name: 'Mail', status: 'degraded' as const, duration: 1200, icon: Shield },
  { name: 'Search', status: 'ok' as const, duration: 15, icon: Search },
]

export default function HealthEndpointsPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Health Endpoints"
        subtitle="Production health check endpoints for container orchestration"
        actions={<Button variant="primary" size="sm"><RefreshCw size={14} /> Refresh All</Button>}
      />

      <SectionCard title="Available Endpoints" description="Kubernetes-ready health check endpoints">
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Endpoint</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Method</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Status</th>
              <th style={{ textAlign: 'left', padding: '0.625rem 0.5rem', color: 'var(--color-foreground-muted)', fontWeight: 500 }}>Description</th>
            </tr>
          </thead>
          <tbody>
            {endpoints.map(ep => (
              <tr key={ep.path} style={{ borderBottom: '1px solid var(--color-border)' }}>
                <td style={{ padding: '0.625rem 0.5rem' }}>
                  <code style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{ep.path}</code>
                </td>
                <td style={{ padding: '0.625rem 0.5rem' }}>
                  <Badge variant="accent">{ep.method}</Badge>
                </td>
                <td style={{ padding: '0.625rem 0.5rem' }}>
                  <Badge variant={ep.status === 'ok' ? 'success' : 'warning'}>{ep.status}</Badge>
                </td>
                <td style={{ padding: '0.625rem 0.5rem', fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>
                  {ep.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Deep Health Checks" description="Current state of all platform subsystems">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {mockDeepChecks.map(c => (
            <div key={c.name} style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <c.icon size={16} style={{ color: c.status === 'ok' ? '#22C55E' : '#F59E0B' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 500 }}>{c.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{c.duration}ms</div>
              </div>
              <Badge variant={c.status === 'ok' ? 'success' : 'warning'}>{c.status}</Badge>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Response Schema" description="Consistent JSON response format for all health endpoints">
        <pre style={{
          fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto',
          backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8,
          fontFamily: 'monospace', color: 'var(--color-foreground-muted)',
        }}>
{`{
  "status": "ok" | "degraded" | "fail",
  "version": "2.4.0",
  "timestamp": "2026-07-15T12:00:00Z",
  "duration": 45,
  "checks": [
    { "name": "database", "status": "ok", "duration": 12 },
    { "name": "redis", "status": "ok", "duration": 3 }
  ]
}`}
        </pre>
      </SectionCard>
    </div>
  )
}
