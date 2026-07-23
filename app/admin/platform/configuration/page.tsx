'use client'

import { Settings, Eye, EyeOff, Server, HardDrive, Mail, Search, Shield, Box, Activity } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Badge } from '@/components/ui/Badge'
import { usePlatform } from '@/lib/platform/PlatformProvider'

export default function ConfigurationPage() {
  const { kernel, loaded } = usePlatform()
  const configInspector = loaded && kernel ? kernel.resolve<any>('configurationInspector') : null
  const view = configInspector?.inspect() ?? null
  const serviceConfigs = configInspector?.getServiceConfigurations() ?? null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Configuration Inspector" subtitle="Platform configuration with automatic secret masking" />

      {view && (
        <>
          <SectionCard title="Environment" description={`Running in ${view.environment} mode`}>
            <Badge variant={view.environment === 'production' ? 'accent' : 'default'}>{view.environment}</Badge>
            {view.sensitiveKeys.length > 0 && (
              <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <EyeOff size={14} style={{ color: '#10B981' }} />
                <span style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{view.sensitiveKeys.length} sensitive value(s) automatically masked</span>
              </div>
            )}
          </SectionCard>

          <SectionCard title="Configuration Values" description={`${view.entries.length} entries`}>
            <table style={{ width: '100%', fontSize: '0.8125rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Key</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Value</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Source</th>
                </tr>
              </thead>
              <tbody>
                {view.entries.map((e: any) => (
                  <tr key={e.key} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: '0.375rem 0.75rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>{e.key}</td>
                    <td style={{ padding: '0.375rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <code style={{ fontSize: '0.75rem' }}>{e.value}</code>
                      {e.masked && <EyeOff size={12} style={{ color: '#10B981' }} />}
                    </td>
                    <td style={{ padding: '0.375rem 0.75rem' }}>
                      <Badge variant="default">{e.source}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>

          <SectionCard title="Service Configurations" description="Current driver and service states">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: 'Cache', icon: HardDrive, color: '#8B5CF6', data: serviceConfigs?.cache ?? {} },
                { name: 'Storage', icon: Server, color: '#3B82F6', data: serviceConfigs?.storage ?? {} },
                { name: 'Mail', icon: Mail, color: '#EC4899', data: serviceConfigs?.mail ?? {} },
                { name: 'Search', icon: Search, color: '#10B981', data: serviceConfigs?.search ?? {} },
                { name: 'Security', icon: Shield, color: '#F59E0B', data: { roles: kernel?.resolve<any>('securityManager')?.getRoles().length ?? 0 } },
                { name: 'Services', icon: Box, color: '#14B8A6', data: { count: serviceConfigs?.services?.length ?? 0 } },
              ].map(s => (
                <div key={s.name} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <s.icon size={16} style={{ color: s.color }} />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{s.name}</span>
                  </div>
                  <pre style={{ fontSize: '0.6875rem', color: 'var(--color-foreground-muted)', fontFamily: 'monospace', margin: 0 }}>
                    {JSON.stringify(s.data, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )}

      {!view && <SectionCard title="Loading"><p style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>Configuration not available</p></SectionCard>}
    </div>
  )
}
