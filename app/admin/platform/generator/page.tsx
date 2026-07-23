'use client'

import { Code, FolderOpen, FileText, Route, Shield, Settings, Globe, LayoutDashboard, Flag, Activity, Terminal, Database, Clock, Search, FileCode } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Badge } from '@/components/ui/Badge'
import { usePlatform } from '@/lib/platform/PlatformProvider'

export default function GeneratorPage() {
  const { kernel, loaded } = usePlatform()
  const generator = loaded && kernel ? kernel.resolve<any>('moduleGenerator') : null

  const generatedFiles = [
    { name: 'module.config.ts', desc: 'Module manifest (id, name, version, etc.)', icon: FileText },
    { name: 'index.ts', desc: 'Module entry point with register() function', icon: Code },
    { name: 'navigation.ts', desc: 'Navigation group definitions', icon: Route },
    { name: 'permissions.ts', desc: 'Permission groups and keys', icon: Shield },
    { name: 'settings.ts', desc: 'Settings section configuration', icon: Settings },
    { name: 'seo.ts', desc: 'SEO metadata contributions', icon: Globe },
    { name: 'widgets.ts', desc: 'Dashboard widget definitions', icon: LayoutDashboard },
    { name: 'feature-flags.ts', desc: 'Feature flag definitions', icon: Flag },
    { name: 'events.ts', desc: 'Event definitions (emitted/listened)', icon: Activity },
    { name: 'commands.ts', desc: 'Command type definitions', icon: Terminal },
    { name: 'queries.ts', desc: 'Query type definitions', icon: Database },
    { name: 'scheduler.ts', desc: 'Scheduled task definitions', icon: Clock },
    { name: 'search.ts', desc: 'Search provider registration', icon: Search },
    { name: 'health.ts', desc: 'Health check definitions', icon: Activity },
    { name: '__tests__/index.test.ts', desc: 'Vitest test scaffold', icon: FileCode },
    { name: 'README.md', desc: 'Module documentation', icon: FileText },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Module Generator" subtitle="Auto-generate complete module scaffolds — zero manual boilerplate" />

      <SectionCard title="Usage" description="Generate a full module in one call">
        <pre style={{ fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto', backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8, fontFamily: 'monospace', color: 'var(--color-foreground-muted)' }}>
{`const generator = new ModuleGenerator()
const result = generator.generate({
  name: 'My Module',
  slug: 'my-module',
  description: 'Does something useful',
  version: '1.0.0',
  features: {
    navigation: true,
    permissions: true,
    settings: true,
    seo: true,
    widgets: true,
    featureFlags: true,
    events: true,
    commands: true,
    queries: true,
    scheduler: true,
    search: true,
    health: true,
    tests: true,
  },
})

// result.files contains all generated file contents
// result.manifest contains the module manifest`}
        </pre>
      </SectionCard>

      <SectionCard title="Generated Output" description={`16 files generated per module (${generatedFiles.length} total)`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {generatedFiles.map(f => (
            <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.625rem', borderRadius: 6, border: '1px solid var(--color-border-subtle)' }}>
              <f.icon size={13} style={{ color: 'var(--color-foreground-muted)' }} />
              <div>
                <code style={{ fontSize: '0.6875rem' }}>{f.name}</code>
                <div style={{ fontSize: '0.625rem', color: 'var(--color-foreground-muted)' }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="CLI Integration" description="Future CLI commands that will use the generator">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { cmd: 'make:module', desc: 'Generate a new module scaffold' },
            { cmd: 'make:page', desc: 'Generate a new admin page' },
            { cmd: 'make:widget', desc: 'Generate a dashboard widget' },
            { cmd: 'make:permission', desc: 'Generate a permission key' },
            { cmd: 'make:event', desc: 'Generate an event class' },
            { cmd: 'make:command', desc: 'Generate a command + handler' },
            { cmd: 'make:query', desc: 'Generate a query + handler' },
            { cmd: 'make:driver', desc: 'Generate a driver scaffold' },
          ].map(c => (
            <div key={c.cmd} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.625rem', borderRadius: 8, border: '1px solid var(--color-border-subtle)' }}>
              <Terminal size={14} style={{ color: '#8B5CF6' }} />
              <code style={{ fontSize: '0.8125rem', flex: 1 }}>{c.cmd}</code>
              <Badge variant="warning">Future</Badge>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Architecture" description="The generator is registered in the ServiceContainer and available via DI">
        <Badge variant={generator ? 'success' : 'error'}>{generator ? 'Generator Available' : 'Generator Not Available'}</Badge>
        <pre style={{ fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto', backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8, fontFamily: 'monospace', color: 'var(--color-foreground-muted)', marginTop: '0.75rem' }}>
{`// Resolve from container
const generator = kernel.resolve('moduleGenerator')

// Or use generator directly
import { ModuleGenerator } from '@/lib/platform/generator'
const gen = new ModuleGenerator()`}
        </pre>
      </SectionCard>
    </div>
  )
}
