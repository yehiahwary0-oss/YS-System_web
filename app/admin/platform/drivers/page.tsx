'use client'

import { Server, HardDrive, Mail, Search, Bell, Activity, Box } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Badge } from '@/components/ui/Badge'
import { StatusDot } from '@/components/admin/StatusDot'
import { usePlatform } from '@/lib/platform/PlatformProvider'
import type { DriverCategory, DriverInfo } from '@/lib/platform/drivers/DriverRegistry'

const categoryIcons: Record<DriverCategory, typeof Server> = {
  cache: HardDrive,
  storage: Server,
  mail: Mail,
  search: Search,
  notification: Bell,
  logger: Activity,
}

const categoryColors: Record<DriverCategory, string> = {
  cache: '#8B5CF6',
  storage: '#3B82F6',
  mail: '#EC4899',
  search: '#10B981',
  notification: '#F59E0B',
  logger: '#14B8A6',
}

export default function DriversPage() {
  const { kernel, loaded } = usePlatform()
  const driverReg = loaded && kernel ? kernel.resolve<any>('driverRegistry') : null
  const categories = driverReg?.getCategories() ?? []
  const allDrivers: DriverInfo[] = driverReg?.discover() ?? []

  const driversByCategory: Record<string, DriverInfo[]> = {}
  for (const d of allDrivers) {
    if (!driversByCategory[d.category]) driversByCategory[d.category] = []
    driversByCategory[d.category].push(d)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Driver Registry" subtitle="Central registry for all platform drivers — Cache, Storage, Mail, Search, and more" />

      <SectionCard title="Summary" description={`${allDrivers.length} total drivers across ${categories.length} categories`}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {categories.map((cat: string) => {
            const Icon = categoryIcons[cat as DriverCategory] ?? Box
            const count = driversByCategory[cat]?.length ?? 0
            return (
              <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                <Icon size={14} style={{ color: categoryColors[cat as DriverCategory] ?? '#666' }} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{cat}</span>
                <Badge variant="default">{count}</Badge>
              </div>
            )
          })}
          {categories.length === 0 && <span style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>No drivers registered yet</span>}
        </div>
      </SectionCard>

      {Object.entries(driversByCategory).map(([cat, drivers]) => {
        const Icon = categoryIcons[cat as DriverCategory] ?? Box
        return (
          <SectionCard key={cat} title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Icon size={16} style={{ color: categoryColors[cat as DriverCategory] ?? '#666' }} />
              <span style={{ textTransform: 'capitalize' }}>{cat}</span>
            </div>
          } description={`${drivers.length} driver(s)`}>
            <table style={{ width: '100%', fontSize: '0.8125rem', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>State</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Module</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Version</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((d: DriverInfo) => (
                  <tr key={d.name} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: '0.375rem 0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <StatusDot status={d.state === 'implemented' ? 'active' : 'inactive'} />
                        {d.name}
                      </div>
                    </td>
                    <td style={{ padding: '0.375rem 0.75rem' }}><Badge variant={d.state === 'implemented' ? 'success' : 'warning'}>{d.state}</Badge></td>
                    <td style={{ padding: '0.375rem 0.75rem', color: 'var(--color-foreground-muted)', fontFamily: 'monospace', fontSize: '0.75rem' }}>{d.moduleId || '—'}</td>
                    <td style={{ padding: '0.375rem 0.75rem', color: 'var(--color-foreground-muted)' }}>{d.version || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>
        )
      })}

      {categories.length === 0 && (
        <SectionCard title="Register a Driver" description="Drivers are registered automatically when subsystems are initialized.">
          <pre style={{ fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto', backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8, fontFamily: 'monospace', color: 'var(--color-foreground-muted)' }}>
{`// Drivers register themselves through DriverRegistry
driverRegistry.register('cache', 'memory', memoryDriver, 'core')
driverRegistry.register('storage', 'local', localDriver, 'core')
driverRegistry.register('mail', 'smtp', smtpDriver, 'core')

// Replace an existing driver
driverRegistry.replace('cache', 'redis', redisDriver, 'module-x')

// Discover all drivers
const all = driverRegistry.discover()
const cacheDrivers = driverRegistry.discover('cache')`}
          </pre>
        </SectionCard>
      )}
    </div>
  )
}
