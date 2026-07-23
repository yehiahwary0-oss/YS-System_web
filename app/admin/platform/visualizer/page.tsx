'use client'

import { GitBranch, Package, Server, AlertTriangle, CheckCircle, XCircle, Cpu, Activity, Shield, Terminal, Database, Globe, Flag, Settings } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Badge } from '@/components/ui/Badge'
import { usePlatform } from '@/lib/platform/PlatformProvider'
import { useState } from 'react'

export default function VisualizerPage() {
  const { kernel, loaded } = usePlatform()
  const [expanded, setExpanded] = useState<string | null>(null)

  const depGraph = loaded && kernel ? kernel.resolve<any>('dependencyGraph') : null
  const commandBus = loaded && kernel ? kernel.resolve<any>('commandBus') : null
  const queryBus = loaded && kernel ? kernel.resolve<any>('queryBus') : null
  const container = loaded && kernel ? kernel.getContainer() : null

  const errors = depGraph?.validate() ?? []
  const nodes = depGraph?.getNodeCount() ?? 0
  const order = depGraph?.getTopologicalOrder() ?? []
  const leafNodes = depGraph?.getLeafNodes() ?? []
  const rootNodes = depGraph?.getRootNodes() ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Dependency Visualizer" subtitle="Visualize the full platform dependency graph — powered by DependencyGraph" />

      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
        {[
          { label: 'Graph Nodes', value: nodes, icon: GitBranch, color: '#8B5CF6' },
          { label: 'Root Nodes', value: rootNodes.length, icon: Cpu, color: '#3B82F6' },
          { label: 'Leaf Modules', value: leafNodes.length, icon: Package, color: '#10B981' },
          { label: 'Topological Order', value: order.length, icon: Activity, color: '#F59E0B' },
          { label: 'Issues', value: errors.length, icon: AlertTriangle, color: errors.length > 0 ? '#EF4444' : '#10B981' },
        ].map(s => (
          <div key={s.label} style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
            <s.icon size={16} style={{ color: s.color }} />
            <div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--color-foreground-muted)' }}>{s.label}</div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <SectionCard title="Architecture Layers" description="Kernel → Services → Drivers → Modules → Commands → Queries → Events → Feature Flags">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {[
            { name: 'Kernel', icon: Cpu, color: '#8B5CF6', items: ['ModuleKernel', 'KernelRegistries', 'ServiceContainer'], expanded: expanded === 'kernel' },
            { name: 'Services', icon: Server, color: '#3B82F6', items: container?.getRegisteredIds() ?? [], expanded: expanded === 'services' },
            { name: 'Drivers', icon: Server, color: '#10B981', items: ['cache:memory', 'storage:local', 'mail:smtp', 'search:database'], expanded: expanded === 'drivers' },
            { name: 'Modules', icon: Package, color: '#F97316', items: kernel?.getModules().map(m => m.manifest.id) ?? [], expanded: expanded === 'modules' },
            { name: 'Commands', icon: Terminal, color: '#EC4899', items: commandBus?.getRegisteredTypes() ?? [], expanded: expanded === 'commands' },
            { name: 'Queries', icon: Database, color: '#06B6D4', items: queryBus?.getRegisteredTypes() ?? [], expanded: expanded === 'queries' },
            { name: 'Feature Flags', icon: Flag, color: '#F59E0B', items: [], expanded: expanded === 'flags' },
          ].map((layer, i) => (
            <div key={layer.name}>
              <button onClick={() => setExpanded(expanded === layer.name ? null : layer.name)}
                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', border: '1px solid var(--color-border)', borderRadius: i === 0 ? '8px 8px 0 0' : i === 6 ? '0 0 8px 8px' : 0, borderTop: i > 0 ? 'none' : undefined, backgroundColor: 'var(--color-background)', cursor: 'pointer', textAlign: 'left' }}>
                <div style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: `${layer.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <layer.icon size={15} style={{ color: layer.color }} />
                </div>
                <span style={{ fontSize: '0.875rem', fontWeight: 600, flex: 1 }}>{layer.name}</span>
                <Badge variant="default">{layer.items.length}</Badge>
                <span style={{ color: 'var(--color-foreground-muted)', fontSize: '0.75rem' }}>{expanded === layer.name ? '▲' : '▼'}</span>
              </button>
              {expanded === layer.name && layer.items.length > 0 && (
                <div style={{ padding: '0.75rem 1rem 0.75rem 3.5rem', border: '1px solid var(--color-border)', borderTop: 'none', backgroundColor: 'var(--color-background-subtle)' }}>
                  {layer.items.map((item: string) => (
                    <div key={item} style={{ fontSize: '0.8125rem', padding: '0.25rem 0', fontFamily: 'monospace' }}>{item}</div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      {errors.length > 0 && (
        <SectionCard title="Dependency Issues" description={`${errors.length} issue(s) detected`}>
          {errors.map((err: any, i: number) => (
            <div key={i} style={{ padding: '0.75rem', borderRadius: 8, backgroundColor: err.type === 'circular' ? 'rgba(239,68,68,0.08)' : 'rgba(245,158,11,0.08)', border: `1px solid ${err.type === 'circular' ? 'rgba(239,68,68,0.2)' : 'rgba(245,158,11,0.2)'}`, marginBottom: '0.5rem', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
              {err.type === 'circular' ? <XCircle size={14} style={{ color: '#EF4444', marginTop: 2 }} /> : <AlertTriangle size={14} style={{ color: '#F59E0B', marginTop: 2 }} />}
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: err.type === 'circular' ? '#EF4444' : '#F59E0B' }}>{err.type}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{err.message}</div>
              </div>
            </div>
          ))}
        </SectionCard>
      )}

      {nodes > 0 && (
        <SectionCard title="Topological Order" description="Module loading sequence">
          <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap' }}>
            {order.map((id: string, i: number) => (
              <Badge key={id} variant="default">{i + 1}. {id}</Badge>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  )
}
