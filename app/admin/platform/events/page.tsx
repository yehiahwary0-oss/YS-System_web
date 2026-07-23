'use client'

import { Activity, Bell, RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { getDefaultEventStats } from '@/lib/platform/adapters/events'

export default function EventCenterPage() {
  const stats = getDefaultEventStats()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Event Center"
        subtitle="Platform event bus monitoring and history"
      />

      <SectionCard title="Event Bus Overview" description="The platform event bus enables modules to communicate without direct coupling. Events are dispatched by modules and consumed by listeners across the ecosystem.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-foreground-subtle)', lineHeight: 1.7, margin: 0 }}>
            The Event Bus is an architectural extension point. When a module dispatches an event (e.g., <code>module.installed</code>, <code>user.created</code>), other modules can listen and react without knowing about each other.
          </p>

          <div style={{ padding: '1rem', borderRadius: 8, backgroundColor: 'var(--color-background-subtle)' }}>
            <p style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-foreground)', margin: '0 0 0.5rem' }}>Event Flow</p>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)', fontFamily: 'monospace', lineHeight: 2 }}>
              Module ──dispatches──▶ Event Bus ──routes──▶ Listener(s) ──handles──▶ Response
            </div>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Statistics">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <StatBox label="Total" value={String(stats.total)} />
          <StatBox label="Successful" value={String(stats.success)} color="#10B981" />
          <StatBox label="Failed" value={String(stats.failed)} color="#EF4444" />
          <StatBox label="Retrying" value={String(stats.retrying)} color="#F59E0B" />
        </div>
      </SectionCard>

      <SectionCard title="Event List" description="Recent events will appear here once the backend event system is implemented.">
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-foreground-muted)' }}>
          <Activity size={28} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
          <p style={{ fontSize: '0.875rem', margin: 0 }}>
            No events recorded yet.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Backend Integration" description="Required backend API contract for event monitoring">
        <pre style={{
          fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto',
          backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8,
          fontFamily: 'monospace', color: 'var(--color-foreground-muted)',
        }}>
{`GET /api/v1/admin/events          → List paginated events
GET /api/v1/admin/events/{id}     → Single event details
DELETE /api/v1/admin/events       → Clear event history

Required permission: view_events

Backend requirements:
  - Event model + migration (id, name, module_id, payload, status, duration, error, created_at)
  - EventController (index, show, destroy)
  - Route in admin routes`}
        </pre>
      </SectionCard>
    </div>
  )
}

function StatBox({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div style={{ padding: '1rem', borderRadius: 8, border: '1px solid var(--color-border)', textAlign: 'center' }}>
      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: color ?? 'var(--color-foreground)', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)', marginTop: '0.375rem' }}>{label}</div>
    </div>
  )
}
