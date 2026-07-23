'use client'

import { Wrench, CheckCircle, AlertTriangle, XCircle, HelpCircle, Package, Server, Box, Database } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Badge } from '@/components/ui/Badge'
import { usePlatform } from '@/lib/platform/PlatformProvider'

const statusColors: Record<string, string> = {
  supported: '#10B981',
  deprecated: '#F59E0B',
  breaking: '#EF4444',
  unknown: '#9CA3AF',
}

const statusIcons: Record<string, typeof CheckCircle> = {
  supported: CheckCircle,
  deprecated: AlertTriangle,
  breaking: XCircle,
  unknown: HelpCircle,
}

export default function CompatibilityPage() {
  const { kernel, loaded } = usePlatform()
  const compat = loaded && kernel ? kernel.resolve<any>('compatibilityEngine') : null
  const manifest = loaded && kernel ? kernel.resolve<any>('platformManifest') : null
  const data = manifest?.generate() ?? null

  const platformCheck = compat && data ? compat.checkPlatform(data.platformVersion, '1.0.0') : null
  const sdkCheck = compat && data ? compat.checkSdk(data.sdkVersion, data.minimumProductSdkVersion) : null
  const matrix = compat && data ? compat.generateMatrix(data.platformVersion, data.sdkVersion, data.minimumProductSdkVersion) : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Compatibility Center" subtitle="Version compatibility matrix for platform, kernel, SDK, drivers, and modules" />

      <SectionCard title="Platform Compatibility" description="Current platform version check">
        {platformCheck ? (
          <div style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {(() => { const Icon = statusIcons[platformCheck.status] ?? HelpCircle; return <Icon size={24} style={{ color: statusColors[platformCheck.status] ?? '#666' }} />; })()}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>Platform v{platformCheck.currentVersion} → v{platformCheck.targetVersion}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{platformCheck.message}</div>
            </div>
            <Badge variant={platformCheck.status === 'supported' ? 'success' : platformCheck.status === 'deprecated' ? 'warning' : platformCheck.status === 'breaking' ? 'error' : 'default'}>{platformCheck.status}</Badge>
          </div>
        ) : <p style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>Platform compatibility check not available</p>}
      </SectionCard>

      <SectionCard title="SDK Compatibility" description="SDK version vs minimum required">
        {sdkCheck ? (
          <div style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {(() => { const Icon = statusIcons[sdkCheck.status] ?? HelpCircle; return <Icon size={24} style={{ color: statusColors[sdkCheck.status] ?? '#666' }} />; })()}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>SDK v{sdkCheck.currentVersion} (minimum: v{sdkCheck.targetVersion})</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{sdkCheck.message}</div>
            </div>
            <Badge variant={sdkCheck.status === 'supported' ? 'success' : sdkCheck.status === 'breaking' ? 'error' : 'warning'}>{sdkCheck.status}</Badge>
          </div>
        ) : <p style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>SDK compatibility check not available</p>}
      </SectionCard>

      <SectionCard title="Compatibility Matrix" description="Full matrix of platform components">
        <table style={{ width: '100%', fontSize: '0.8125rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Component</th>
              <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Current</th>
              <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Target</th>
              <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {matrix?.platform.map((c: any) => (
              <tr key={c.component} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                <td style={{ padding: '0.375rem 0.75rem' }}>{c.component}</td>
                <td style={{ padding: '0.375rem 0.75rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>{c.currentVersion}</td>
                <td style={{ padding: '0.375rem 0.75rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>{c.targetVersion}</td>
                <td style={{ padding: '0.375rem 0.75rem' }}><Badge variant={c.status === 'supported' ? 'success' : c.status === 'deprecated' ? 'warning' : 'error'}>{c.status}</Badge></td>
              </tr>
            ))}
            {matrix?.sdk.map((c: any) => (
              <tr key={c.component} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                <td style={{ padding: '0.375rem 0.75rem' }}>{c.component}</td>
                <td style={{ padding: '0.375rem 0.75rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>{c.currentVersion}</td>
                <td style={{ padding: '0.375rem 0.75rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>{c.targetVersion}</td>
                <td style={{ padding: '0.375rem 0.75rem' }}><Badge variant={c.status === 'supported' ? 'success' : c.status === 'deprecated' ? 'warning' : 'error'}>{c.status}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </SectionCard>

      <SectionCard title="Compatibility Engine API" description="Programmatic compatibility checks">
        <pre style={{ fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto', backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8, fontFamily: 'monospace', color: 'var(--color-foreground-muted)' }}>
{`// Check platform compatibility
const result = engine.checkPlatform('1.0.0', '2.0.0')
// { status: 'breaking', message: 'Major version behind...' }

// Check SDK compatibility
const sdkCheck = engine.checkSdk('1.0.0', '1.5.0')
// { status: 'breaking', message: 'SDK version too low...' }

// Generate full matrix
const matrix = engine.generateMatrix('1.0.0', '1.0.0', '1.0.0')`}
        </pre>
      </SectionCard>
    </div>
  )
}
