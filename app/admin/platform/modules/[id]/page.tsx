'use client'

import { use, useState } from 'react'
import { Badge } from '@/components/ui/Badge'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { HealthIndicator, type HealthStatus } from '@/components/admin/HealthIndicator'
import { usePlatform } from '@/lib/platform/PlatformProvider'
import type { PermissionGroup } from '@/lib/platform/registries/PermissionRegistry'

const tabs = ['Overview', 'Permissions', 'Widgets', 'Navigation', 'Feature Flags', 'Settings', 'Search', 'SEO'] as const
type Tab = typeof tabs[number]

export default function ModuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { kernel, loaded } = usePlatform()
  const [tab, setTab] = useState<Tab>('Overview')

  const mod = loaded && kernel ? kernel.getModules().find(m => m.manifest.id === id) : null

  if (!loaded) {
    return <PageHeader title="Loading..." backHref="/admin/platform/modules" subtitle="Loading module details..." />
  }

  if (!mod) {
    return (
      <PageHeader title="Module Not Found" backHref="/admin/platform/modules" subtitle={`No module with ID "${id}" is registered.`} />
    )
  }

  const m = mod.manifest
  const registries = kernel!.getRegistries()

  const modulePermissions: PermissionGroup[] = registries.permissions.getGroups().filter(pg => pg.moduleId === id)
  const moduleWidgets = registries.widgets.getWidgets().filter(w => w.moduleId === id)
  const moduleNavGroups = registries.navigation.getGroups().filter(g => g.moduleId === id)
  const moduleFlags = registries.featureFlags.getFlags().filter(f => f.moduleId === id)
  const moduleSettings = registries.settings.getSections().filter(s => s.moduleId === id)
  const moduleSearch = registries.search.getProviders().filter(p => p.moduleId === id)
  const moduleSeo = registries.seo.getContributions().filter(c => c.moduleId === id)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title={m.name.en}
        subtitle={`${m.slug} · v${m.version}`}
        backHref="/admin/platform/modules"
        actions={<Badge variant={m.enabled ? 'success' : 'default'}>{m.enabled ? 'Enabled' : 'Disabled'}</Badge>}
      />

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setTab(t)}
            style={{
              padding: '0.5rem 1rem', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontSize: '0.8125rem', fontWeight: 500,
              color: tab === t ? 'var(--color-accent)' : 'var(--color-foreground-muted)',
              backgroundColor: tab === t ? 'var(--color-accent-subtle)' : 'transparent',
              transition: 'all 150ms',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Overview' && (
        <>
          <SectionCard title="Description">
            <p style={{ fontSize: '0.875rem', color: 'var(--color-foreground-subtle)', lineHeight: 1.7, margin: 0 }}>
              {m.description.en}
            </p>
          </SectionCard>
          <SectionCard title="Details">
            <DetailRow label="Module ID" value={m.id} mono />
            <DetailRow label="Technical Slug" value={m.slug} mono />
            <DetailRow label="Version" value={`v${m.version}`} />
            <DetailRow label="Status" value={m.enabled ? 'Enabled' : 'Disabled'} />
            <DetailRow label="Sort Order" value={String(m.order)} />
          </SectionCard>
        </>
      )}

      {tab === 'Permissions' && (
        <SectionCard title={`Permissions (${modulePermissions.length} group(s))`}>
          {modulePermissions.length === 0 && <EmptyDetail />}
          {modulePermissions.map(pg => (
            <div key={`${pg.moduleId}:${pg.group}`} style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '0.5rem' }}>{pg.group}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem' }}>
                {pg.permissions.map(p => (
                  <code key={p} style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', borderRadius: 4, backgroundColor: 'var(--color-background-subtle)', color: 'var(--color-foreground-muted)' }}>
                    {p}
                  </code>
                ))}
              </div>
            </div>
          ))}
        </SectionCard>
      )}

      {tab === 'Widgets' && (
        <SectionCard title={`Widgets (${moduleWidgets.length})`}>
          {moduleWidgets.length === 0 && <EmptyDetail />}
          {moduleWidgets.map(w => (
            <div key={w.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <w.icon size={16} style={{ color: w.color ?? 'var(--color-accent)' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-foreground)' }}>{w.title}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>order: {w.order}</span>
              {w.permission && <code style={{ fontSize: '0.7rem', padding: '0.125rem 0.375rem', borderRadius: 4, backgroundColor: 'var(--color-background-subtle)', color: 'var(--color-foreground-muted)' }}>{w.permission}</code>}
            </div>
          ))}
        </SectionCard>
      )}

      {tab === 'Navigation' && (
        <SectionCard title={`Navigation (${moduleNavGroups.length} group(s))`}>
          {moduleNavGroups.length === 0 && <EmptyDetail />}
          {moduleNavGroups.map(g => (
            <div key={g.id} style={{ marginBottom: '1rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-foreground)', marginBottom: '0.5rem' }}>
                {g.labelEn} / {g.labelAr}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', paddingLeft: '0.75rem', borderLeft: '2px solid var(--color-border)' }}>
                {g.items.map(item => (
                  <div key={item.href} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem', color: 'var(--color-foreground-subtle)' }}>
                    <item.icon size={13} />
                    <span>{item.labelEn}</span>
                    <code style={{ fontSize: '0.7rem', color: 'var(--color-foreground-muted)' }}>{item.href}</code>
                    {item.permission && <Badge variant="outline">{item.permission}</Badge>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </SectionCard>
      )}

      {tab === 'Feature Flags' && (
        <SectionCard title={`Feature Flags (${moduleFlags.length})`}>
          {moduleFlags.length === 0 && <EmptyDetail />}
          {moduleFlags.map(f => (
            <div key={f.key} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-foreground)' }}>{f.labelEn}</span>
              <code style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{f.key}</code>
              <Badge variant={f.defaultValue ? 'success' : 'default'}>{f.defaultValue ? 'On' : 'Off'}</Badge>
            </div>
          ))}
        </SectionCard>
      )}

      {tab === 'Settings' && (
        <SectionCard title={`Settings Sections (${moduleSettings.length})`}>
          {moduleSettings.length === 0 && <EmptyDetail />}
          {moduleSettings.map(s => (
            <div key={s.id} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-foreground)' }}>{s.labelEn} / {s.labelAr}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.375rem' }}>
                {s.keys.map(k => <code key={k} style={{ fontSize: '0.7rem', padding: '0.125rem 0.375rem', borderRadius: 4, backgroundColor: 'var(--color-background-subtle)', color: 'var(--color-foreground-muted)' }}>{k}</code>)}
              </div>
            </div>
          ))}
        </SectionCard>
      )}

      {tab === 'Search' && (
        <SectionCard title={`Search Providers (${moduleSearch.length})`}>
          {moduleSearch.length === 0 && <EmptyDetail />}
          {moduleSearch.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-foreground)' }}>{p.labelEn}</span>
              <code style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{p.endpoint}</code>
            </div>
          ))}
        </SectionCard>
      )}

      {tab === 'SEO' && (
        <SectionCard title={`SEO Contributions (${moduleSeo.length})`}>
          {moduleSeo.length === 0 && <EmptyDetail />}
          {moduleSeo.map(c => (
            <div key={c.routePattern} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
              <code style={{ fontSize: '0.8125rem', color: 'var(--color-foreground)' }}>{c.routePattern}</code>
              {c.titleEn && <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)', marginTop: '0.25rem' }}>Title: {c.titleEn}</div>}
            </div>
          ))}
        </SectionCard>
      )}
    </div>
  )
}

function DetailRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
      <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-foreground-muted)', minWidth: '8rem' }}>{label}</span>
      <span style={{ fontSize: '0.875rem', color: 'var(--color-foreground)', fontFamily: mono ? 'monospace' : 'inherit' }}>{value}</span>
    </div>
  )
}

function EmptyDetail() {
  return <p style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>No items registered.</p>
}
