'use client'

import { Share2, Package, ExternalLink } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { usePlatform } from '@/lib/platform/PlatformProvider'

export default function DependencyGraphPage() {
  const { kernel, loaded } = usePlatform()
  const modules = loaded && kernel ? kernel.getModules() : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Dependency Graph" subtitle="Visual dependency explorer for all platform modules" />

      <SectionCard title="Module Dependency Tree" description="Each module can declare dependencies on other modules. Dependencies ensure correct load order and prevent conflicts.">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {modules.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-foreground-muted)', fontSize: '0.875rem' }}>
              No modules registered.
            </div>
          )}

          {modules.map(mod => (
            <div key={mod.manifest.id} style={{
              padding: '1rem 1.25rem', borderRadius: 10,
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-surface)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 32, height: 32, borderRadius: 7, backgroundColor: 'var(--color-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={15} style={{ color: 'var(--color-accent)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-foreground)' }}>
                    {mod.manifest.name.en}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)', fontFamily: 'monospace' }}>
                    {mod.manifest.slug} v{mod.manifest.version}
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border-subtle)' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Dependencies
                </div>
                <div style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>
                  <em>No dependencies declared. Module manifests do not yet support a dependency array.</em>
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Architecture" description="How module dependencies will work in future releases">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-foreground-subtle)', lineHeight: 1.7, margin: 0 }}>
            Each module manifest will include an optional <code>dependencies</code> array specifying other modules by ID and version constraint. The kernel will validate dependency trees during bootstrap and prevent loading if requirements are not met.
          </p>

          <pre style={{
            fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto',
            backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8,
            fontFamily: 'monospace', color: 'var(--color-foreground-muted)',
          }}>
{`// Future ModuleManifest extension:
interface ModuleManifest {
  // ... existing fields
  dependencies?: Array<{
    moduleId: string
    version: string  // semver constraint, e.g. "^1.0.0"
    optional?: boolean
  }>
}`}
          </pre>
        </div>
      </SectionCard>
    </div>
  )
}
