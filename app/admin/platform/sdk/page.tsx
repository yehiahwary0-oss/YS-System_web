'use client'

import { Box, Shield, Navigation, LayoutDashboard, Settings, Flag, Globe, Search, Terminal, Database, Activity, Mail, Clock, Code } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Badge } from '@/components/ui/Badge'
import { usePlatform } from '@/lib/platform/PlatformProvider'

export default function SDKPage() {
  const { kernel, loaded } = usePlatform()
  const container = loaded && kernel ? kernel.getContainer() : null
  const registries = loaded && kernel ? kernel.getRegistries() : null

  const registrationMethods = [
    { name: 'registerPermissions', icon: Shield, color: '#EC4899', desc: 'Register permission groups and keys' },
    { name: 'registerNavigation', icon: Navigation, color: '#3B82F6', desc: 'Add navigation groups with items' },
    { name: 'registerWidgets', icon: LayoutDashboard, color: '#F97316', desc: 'Register dashboard stat widgets' },
    { name: 'registerSettings', icon: Settings, color: '#14B8A6', desc: 'Create settings sections' },
    { name: 'registerFeatureFlags', icon: Flag, color: '#F59E0B', desc: 'Define feature flags with defaults' },
    { name: 'registerSEO', icon: Globe, color: '#10B981', desc: 'Contribute SEO metadata per route' },
    { name: 'registerSearch', icon: Search, color: '#06B6D4', desc: 'Register module search providers' },
    { name: 'registerCommands', icon: Terminal, color: '#8B5CF6', desc: 'Declare command types handled' },
    { name: 'registerQueries', icon: Database, color: '#10B981', desc: 'Declare query types handled' },
    { name: 'registerEvents', icon: Activity, color: '#F97316', desc: 'Declare events emitted/listened' },
    { name: 'registerJobs', icon: Clock, color: '#6366F1', desc: 'Register scheduled jobs' },
    { name: 'registerHealthChecks', icon: Activity, color: '#22D3EE', desc: 'Register health check endpoints' },
    { name: 'registerNotificationProviders', icon: Mail, color: '#F472B6', desc: 'Register notification channels' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Product SDK" subtitle="createProduct() — Build products on YS Platform with zero boilerplate" />

      <SectionCard title="Quick Start" description="Register a new product in 30 seconds">
        <pre style={{ fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto', backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8, fontFamily: 'monospace', color: 'var(--color-foreground-muted)' }}>
{`import { createProduct } from '@/lib/platform/sdk'

const myProduct = createProduct({
  id: 'my_product',
  name: { en: 'My Product', ar: 'منتجي' },
  description: { en: 'My awesome product' },
  version: '1.0.0',
  slug: 'my-product',
})
  .registerPermissions([{ group: 'my_product', permissions: ['view', 'manage'] }])
  .registerNavigation([{ group: 'My Product', items: [{ label: 'Dashboard', href: '/admin/my-product' }] }])
  .registerFeatureFlags([{ key: 'my_product.enabled', label: 'My Product', default: false }])
  .registerWidgets([{ id: 'my_product_stats', label: 'Stats', value: '0' }])
  .build()

// Then add to modules list:
// registeredModules.push(myProduct)`}
        </pre>
      </SectionCard>

      <SectionCard title="Registration Methods" description="13 methods available on the ProductAPI chain">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {registrationMethods.map(m => (
            <div key={m.name} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem', borderRadius: 8, border: '1px solid var(--color-border-subtle)' }}>
              <div style={{ width: 28, height: 28, borderRadius: 6, backgroundColor: `${m.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <m.icon size={13} style={{ color: m.color }} />
              </div>
              <div>
                <code style={{ fontSize: '0.75rem' }}>{m.name}()</code>
                <div style={{ fontSize: '0.6875rem', color: 'var(--color-foreground-muted)' }}>{m.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Runtime Registration" description="Current platform state that products integrate with">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>Navigation Groups</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>{registries?.navigation.getGroups().length ?? 0}</div>
          </div>
          <div style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>Permission Keys</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>{registries?.permissions.getAllKeys().length ?? 0}</div>
          </div>
          <div style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>Services Available</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>{container?.getRegisteredIds().length ?? 0}</div>
          </div>
          <div style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>Feature Flags</div>
            <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>{registries?.featureFlags.getFlags().length ?? 0}</div>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
