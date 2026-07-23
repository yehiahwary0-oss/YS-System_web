'use client'

import { Terminal, CheckCircle, XCircle, Clock, Shield } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Badge } from '@/components/ui/Badge'
import { usePlatform } from '@/lib/platform/PlatformProvider'

export default function CommandsPage() {
  const { kernel, loaded } = usePlatform()
  const commandBus = loaded && kernel ? kernel.resolve<any>('commandBus') : null
  const types = commandBus?.getRegisteredTypes() ?? []
  const history = commandBus?.getHistory() ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Command Bus" subtitle="Typed command dispatch with middleware pipeline, validation, and monitoring" />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[
          { label: 'Registered Commands', value: types.length, icon: Terminal, color: '#8B5CF6' },
          { label: 'Total Dispatched', value: history.length, icon: Clock, color: '#3B82F6' },
          { label: 'Succeeded', value: history.filter((h: any) => h.success).length, icon: CheckCircle, color: '#10B981' },
          { label: 'Failed', value: history.filter((h: any) => !h.success).length, icon: XCircle, color: '#EF4444' },
        ].map(s => (
          <div key={s.label} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{s.label}</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <SectionCard title="Registered Handlers" description={`${types.length} command type(s) with registered handlers`}>
        {types.length === 0 ? (
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>No command handlers registered. Use <code>commandBus.registerHandler()</code> to add handlers.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {types.map((type: string) => {
              const info = commandBus?.getHandlerInfo(type)
              return (
                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid var(--color-border-subtle)' }}>
                  <Terminal size={14} style={{ color: '#8B5CF6' }} />
                  <code style={{ flex: 1, fontSize: '0.8125rem' }}>{type}</code>
                  {info?.moduleId && <Badge variant="default">{info.moduleId}</Badge>}
                  <Badge variant="success">Ready</Badge>
                </div>
              )
            })}
          </div>
        )}
      </SectionCard>

      <SectionCard title="Dispatch History" description="Last 50 command executions">
        {history.length === 0 ? (
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>No commands dispatched yet. Dispatch a command to see history.</p>
        ) : (
          <table style={{ width: '100%', fontSize: '0.8125rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Command</th>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Status</th>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Duration</th>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(-50).reverse().map((h: any, i: number) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '0.375rem 0.75rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>{h.command}</td>
                  <td style={{ padding: '0.375rem 0.75rem' }}>
                    <Badge variant={h.success ? 'success' : 'error'}>{h.success ? 'Success' : 'Failed'}</Badge>
                  </td>
                  <td style={{ padding: '0.375rem 0.75rem', color: 'var(--color-foreground-muted)' }}>{(h.duration).toFixed(2)}ms</td>
                  <td style={{ padding: '0.375rem 0.75rem', color: 'var(--color-foreground-muted)', fontSize: '0.75rem' }}>{h.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </SectionCard>
    </div>
  )
}
