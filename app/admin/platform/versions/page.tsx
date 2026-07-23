'use client'

import { Package, Layers, Database, Globe, Cpu } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Badge } from '@/components/ui/Badge'
import { HealthIndicator, type HealthStatus } from '@/components/admin/HealthIndicator'
import { usePlatform } from '@/lib/platform/PlatformProvider'

interface VersionRowProps {
  component: string
  version: string
  status: HealthStatus
  icon: typeof Package
  subtitle?: string
}

function VersionRow({ component, version, status, icon: Icon, subtitle }: VersionRowProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'var(--color-background-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={16} style={{ color: 'var(--color-foreground-muted)' }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-foreground)' }}>{component}</span>
          <code style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>v{version}</code>
          <HealthIndicator status={status} label="" size="sm" />
        </div>
        {subtitle && <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)', marginTop: '0.125rem' }}>{subtitle}</div>}
      </div>
    </div>
  )
}

export default function VersionCenterPage() {
  const { kernel, loaded } = usePlatform()
  const modules = loaded && kernel ? kernel.getModules() : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Version Center" subtitle="Track versions across the entire platform ecosystem" />

      <SectionCard title="Platform Components">
        <VersionRow component="Platform Kernel" version="1.0.0" status={loaded ? 'healthy' : 'unknown'} icon={Layers} subtitle="Module-based platform kernel" />
        <VersionRow component="Frontend Framework" version="Next.js 16.2.9" status="healthy" icon={Globe} subtitle="React 19 + App Router + ISR" />
        <VersionRow component="Database Migrations" version="—" status="unknown" icon={Database} subtitle="Backend API integration required" />
      </SectionCard>

      <SectionCard title={`Module Versions (${modules.length})`}>
        {modules.length === 0 && (
          <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-foreground-muted)', fontSize: '0.875rem' }}>
            No modules registered.
          </div>
        )}
        {modules.map(mod => (
          <VersionRow
            key={mod.manifest.id}
            component={mod.manifest.name.en}
            version={mod.manifest.version}
            status={mod.manifest.enabled ? 'healthy' : 'warning'}
            icon={Package}
            subtitle={`${mod.manifest.slug} · ${mod.manifest.enabled ? 'Enabled' : 'Disabled'}`}
          />
        ))}
      </SectionCard>

      <SectionCard title="Compatibility Matrix" description="Cross-module version compatibility will be displayed when the backend version tracking API is implemented.">
        <pre style={{
          fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto',
          backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8,
          fontFamily: 'monospace', color: 'var(--color-foreground-muted)',
        }}>
{`Backend API needed:
GET /api/v1/admin/versions → PlatformVersionReport

interface PlatformVersionReport {
  platform:  { component, currentVersion, latestVersion?, status }
  kernel:    { component, currentVersion, latestVersion?, status }
  api:       { component, currentVersion, latestVersion?, status }
  database:  { component, currentVersion, latestVersion?, status }
  modules:   VersionInfo[]
}

Required permission: view_versions (to be created)`}
        </pre>
      </SectionCard>
    </div>
  )
}
