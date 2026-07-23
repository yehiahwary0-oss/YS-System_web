'use client'

import { Activity, Cpu, HardDrive, Package, Terminal, Database, Flag, Server, Clock, Shield, Search } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Badge } from '@/components/ui/Badge'
import { StatusDot } from '@/components/admin/StatusDot'
import { usePlatform } from '@/lib/platform/PlatformProvider'

export default function RuntimePage() {
  const { kernel, loaded } = usePlatform()
  const inspector = loaded && kernel ? kernel.resolve<any>('runtimeInspector') : null
  const runtime = inspector?.inspect() ?? null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Runtime Inspector" subtitle="Live runtime information — all data comes from the running kernel" />

      {runtime && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              { label: 'Modules', value: runtime.modules.length, icon: Package, color: '#8B5CF6' },
              { label: 'Services', value: runtime.services.length, icon: Server, color: '#3B82F6' },
              { label: 'Memory', value: `${runtime.memory.used}MB / ${runtime.memory.total}MB`, icon: Cpu, color: '#10B981' },
              { label: 'Startup', value: `${(runtime.startupDuration / 1000).toFixed(2)}s`, icon: Clock, color: '#F59E0B' },
            ].map(s => (
              <div key={s.label} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{s.label}</div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          <SectionCard title="Loaded Modules" description={`${runtime.modules.length} module(s)`}>
            <table style={{ width: '100%', fontSize: '0.8125rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Module</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Version</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {runtime.modules.map((m: any) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: '0.375rem 0.75rem' }}><code>{m.id}</code></td>
                    <td style={{ padding: '0.375rem 0.75rem', color: 'var(--color-foreground-muted)' }}>{m.version}</td>
                    <td style={{ padding: '0.375rem 0.75rem' }}>
                      <Badge variant={m.enabled ? 'success' : 'warning'}>{m.enabled ? 'Enabled' : 'Disabled'}</Badge>
                      {m.booted && <Badge variant="success">Booted</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>

          <SectionCard title="Services" description={`${runtime.services.length} service(s) in container`}>
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
              {runtime.services.map((s: any) => (
                <Badge key={s.id} variant="default">{s.id}</Badge>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Registries" description="All 8 registries and their item counts">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {runtime.registries.map((r: any) => (
                <div key={r.name} style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Activity size={14} style={{ color: 'var(--color-foreground-muted)' }} />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, flex: 1, textTransform: 'capitalize' }}>{r.name}</span>
                  <Badge variant="default">{r.itemCount}</Badge>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Scheduler" description={`${runtime.scheduler.length} task(s)`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {runtime.scheduler.length > 0 ? runtime.scheduler.map((t: any) => (
                <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid var(--color-border-subtle)' }}>
                  <StatusDot status={t.status === 'running' ? 'active' : t.status === 'failed' ? 'error' : 'inactive'} />
                  <code style={{ fontSize: '0.8125rem', flex: 1 }}>{t.id}</code>
                  <Badge variant={t.enabled ? 'success' : 'warning'}>{t.enabled ? 'Enabled' : 'Disabled'}</Badge>
                </div>
              )) : <p style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>No scheduled tasks</p>}
            </div>
          </SectionCard>
        </>
      )}

      {!runtime && <SectionCard title="Loading"><p style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>Runtime not available</p></SectionCard>}
    </div>
  )
}
