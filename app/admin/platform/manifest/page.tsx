'use client'

import { FileText, Package, Server, Terminal, Database, Flag, Shield, Cpu, HardDrive, Mail, Search, Clock } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Badge } from '@/components/ui/Badge'
import { usePlatform } from '@/lib/platform/PlatformProvider'

export default function ManifestPage() {
  const { kernel, loaded } = usePlatform()

  const manifest = loaded && kernel ? kernel.resolve<any>('platformManifest') : null
  const data = manifest?.generate() ?? null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Platform Manifest" subtitle="Self-describing platform identity — everything dynamically computed" />

      {data && (
        <>
          <SectionCard title="Platform Identity" description="Core platform metadata">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {[
                { label: 'Name', value: data.platformName, icon: FileText },
                { label: 'UUID', value: data.platformUuid, icon: Shield, mono: true },
                { label: 'Version', value: data.platformVersion, icon: Package },
                { label: 'Environment', value: data.environment, icon: Cpu },
                { label: 'Status', value: data.platformStatus, icon: Flag },
                { label: 'Build Number', value: data.buildNumber, icon: Server },
              ].map(item => (
                <div key={item.label} style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-foreground-muted)', marginBottom: '0.25rem' }}>{item.label}</div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, fontFamily: item.mono ? 'monospace' : undefined }}>{item.value}</div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Version Information" description="Kernel, SDK, API versions">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Kernel Version', value: data.kernelVersion },
                { label: 'SDK Version', value: data.sdkVersion },
                { label: 'Manifest Version', value: data.manifestVersion },
                { label: 'API Version', value: data.supportedApiVersion },
                { label: 'Min Product SDK', value: data.minimumProductSdkVersion },
                { label: 'Build Date', value: data.buildDate, mono: true },
              ].map(item => (
                <div key={item.label} style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-foreground-muted)', marginBottom: '0.25rem' }}>{item.label}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, fontFamily: item.mono ? 'monospace' : undefined }}>{item.value}</div>
                </div>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Supported Driver Types" description={`${data.supportedDriverTypes.length} driver types available`}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {data.supportedDriverTypes.map((d: string) => (
                <Badge key={d} variant="success">{d}</Badge>
              ))}
            </div>
          </SectionCard>

          <SectionCard title="Runtime Counts" description="Live aggregate counts from the kernel">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Modules', value: data.registeredModulesCount, icon: Package, color: '#8B5CF6' },
                { label: 'Services', value: data.registeredServicesCount, icon: Server, color: '#3B82F6' },
                { label: 'Drivers', value: data.registeredDriversCount, icon: HardDrive, color: '#10B981' },
                { label: 'Commands', value: data.registeredCommandsCount, icon: Terminal, color: '#F97316' },
                { label: 'Queries', value: data.registeredQueriesCount, icon: Search, color: '#06B6D4' },
                { label: 'Events', value: data.registeredEventsCount, icon: Clock, color: '#EC4899' },
                { label: 'Feature Flags', value: data.featureFlagCount, icon: Flag, color: '#F59E0B' },
                { label: 'Services', value: data.registeredServicesCount, icon: Database, color: '#14B8A6' },
              ].map(s => (
                <div key={s.label} style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                  <s.icon size={16} style={{ color: s.color }} />
                  <div>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--color-foreground-muted)' }}>{s.label}</div>
                    <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>{s.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )}

      {!data && <SectionCard title="Loading"><p style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>Platform not loaded</p></SectionCard>}
    </div>
  )
}
