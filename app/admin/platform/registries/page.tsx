'use client'

import { Navigation, Shield, LayoutDashboard, Settings, Search, Globe, Flag, Clock, ExternalLink } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Badge } from '@/components/ui/Badge'
import { usePlatform } from '@/lib/platform/PlatformProvider'

interface RegistryInfo {
  key: string
  label: string
  icon: typeof Navigation
  color: string
  description: string
}

const registries: RegistryInfo[] = [
  { key: 'navigation', label: 'Navigation Registry', icon: Navigation, color: '#3B82F6', description: 'Groups and items for the admin sidebar and navigation' },
  { key: 'permissions', label: 'Permission Registry', icon: Shield, color: '#EC4899', description: 'Permission keys organized by module and group' },
  { key: 'widgets', label: 'Widget Registry', icon: LayoutDashboard, color: '#F97316', description: 'Dashboard stat card definitions' },
  { key: 'settings', label: 'Settings Registry', icon: Settings, color: '#14B8A6', description: 'Settings sections contributed by modules' },
  { key: 'search', label: 'Search Registry', icon: Search, color: '#06B6D4', description: 'Search provider endpoints for global search' },
  { key: 'seo', label: 'SEO Registry', icon: Globe, color: '#10B981', description: 'SEO metadata contributions per route pattern' },
  { key: 'featureFlags', label: 'Feature Flag Registry', icon: Flag, color: '#F59E0B', description: 'Feature flag definitions with defaults' },
  { key: 'scheduler', label: 'Scheduler Registry', icon: Clock, color: '#6366F1', description: 'Scheduled task definitions managed by the platform kernel' },
]

export default function RegistryInspectorPage() {
  const { kernel, loaded } = usePlatform()

  if (!loaded) return <PageHeader title="Registry Inspector" subtitle="Loading registry data..." />

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Registry Inspector" subtitle="Visual inspection of all platform registries and their contents" />

      {registries.map(reg => {
        const registry = kernel!.getRegistry(reg.key as any)
        const items = getRegistryItems(registry)

        const moduleCount = new Set(items.map((i: any) => i.moduleId).filter(Boolean)).size
        const warnings = findWarnings(reg.key, items)

        return (
          <SectionCard
            key={reg.key}
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{ width: 30, height: 30, borderRadius: 7, backgroundColor: `${reg.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <reg.icon size={15} style={{ color: reg.color }} />
                </div>
                <span>{reg.label}</span>
              </div>
            }
            description={`${items.length} item(s) · ${moduleCount} module(s)`}
            actions={
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                {warnings.length > 0 && <Badge variant="warning">{warnings.length} warning(s)</Badge>}
                <Badge variant={items.length > 0 ? 'success' : 'default'}>{items.length > 0 ? 'Populated' : 'Empty'}</Badge>
              </div>
            }
          >
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)', margin: 0 }}>{reg.description}</p>

            {warnings.length > 0 && (
              <div style={{ padding: '0.75rem', borderRadius: 8, backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
                {warnings.map((w, i) => (
                  <div key={i} style={{ fontSize: '0.8125rem', color: '#F59E0B' }}>{w}</div>
                ))}
              </div>
            )}

            {items.length > 0 && (
              <div style={{ maxHeight: 240, overflowY: 'auto', marginTop: '0.5rem' }}>
                <table style={{ width: '100%', fontSize: '0.8125rem', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                      <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600, color: 'var(--color-foreground-muted)' }}>Source</th>
                      <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600, color: 'var(--color-foreground-muted)' }}>Key / Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.slice(0, 50).map((item: any, i: number) => (
                      <tr key={i} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                        <td style={{ padding: '0.375rem 0.75rem', color: 'var(--color-foreground-muted)', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                          {item.moduleId || '—'}
                        </td>
                        <td style={{ padding: '0.375rem 0.75rem', color: 'var(--color-foreground)' }}>
                          {item.labelEn || item.key || item.id || item.title || item.name || item.routePattern || JSON.stringify(item).slice(0, 60)}
                        </td>
                      </tr>
                    ))}
                    {items.length > 50 && (
                      <tr><td colSpan={2} style={{ padding: '0.5rem 0.75rem', textAlign: 'center', color: 'var(--color-foreground-muted)', fontSize: '0.75rem' }}>+ {items.length - 50} more items</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        )
      })}
    </div>
  )
}

function getRegistryItems(registry: any): any[] {
  if (!registry) return []
  if (registry.getGroups) return registry.getGroups()
  if (registry.getWidgets) return registry.getWidgets()
  if (registry.getSections) return registry.getSections()
  if (registry.getProviders) return registry.getProviders()
  if (registry.getContributions) return registry.getContributions()
  if (registry.getFlags) return registry.getFlags()
  if (registry.getAllKeys) return registry.getAllKeys().map((k: string) => ({ key: k, moduleId: '' }))
  if (registry.getAllTasks) return registry.getAllTasks()
  return []
}

function findWarnings(key: string, items: any[]): string[] {
  const warnings: string[] = []
  if (key === 'navigation') {
    const hrefs = items.flatMap((g: any) => g.items?.map((i: any) => i.href) ?? [])
    const duplicates = hrefs.filter((h: string, i: number) => hrefs.indexOf(h) !== i)
    if (duplicates.length > 0) warnings.push(`Duplicate nav item hrefs: ${[...new Set(duplicates)].join(', ')}`)
  }
  if (key === 'permissions') {
    const allKeys = items.flatMap((g: any) => g.permissions ?? [])
    const duplicates = allKeys.filter((k: string, i: number) => allKeys.indexOf(k) !== i)
    if (duplicates.length > 0) warnings.push(`Duplicate permission keys: ${[...new Set(duplicates)].join(', ')}`)
  }
  return warnings
}
