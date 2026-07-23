'use client'

import { Cpu, Shield, FileText, Activity, Flag, CheckSquare, Repeat, Gauge, Terminal } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Badge } from '@/components/ui/Badge'
import { usePlatform } from '@/lib/platform/PlatformProvider'

const pipelineMiddlewares = [
  { name: 'Permissions', icon: Shield, color: '#EC4899', desc: 'Check user permissions before execution', implemented: true },
  { name: 'Audit', icon: FileText, color: '#8B5CF6', desc: 'Record audit trail for all operations', implemented: true },
  { name: 'Logging', icon: Activity, color: '#3B82F6', desc: 'Log execution start, completion, and errors', implemented: true },
  { name: 'Metrics', icon: Gauge, color: '#F97316', desc: 'Record execution time and success rate', implemented: true },
  { name: 'Feature Flags', icon: Flag, color: '#F59E0B', desc: 'Gate operations behind feature flags', implemented: true },
  { name: 'Validation', icon: CheckSquare, color: '#14B8A6', desc: 'Validate input before handler execution', implemented: true },
  { name: 'Rate Limits', icon: Repeat, color: '#06B6D4', desc: 'Enforce rate limits per operation', implemented: true },
  { name: 'Transactions', icon: Cpu, color: '#10B981', desc: 'Database transaction wrapping', future: true },
]

export default function PipelinePage() {
  const { kernel, loaded } = usePlatform()
  const commandBus = loaded && kernel ? kernel.resolve<any>('commandBus') : null
  const queryBus = loaded && kernel ? kernel.resolve<any>('queryBus') : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Execution Pipeline" subtitle="Reusable middleware architecture shared by Commands, Queries, and future HTTP APIs" />

      <SectionCard title="Available Middleware" description="8 middleware types designed for the platform pipeline">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {pipelineMiddlewares.map(m => (
            <div key={m.name} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', opacity: m.implemented ? 1 : 0.5 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${m.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <m.icon size={16} style={{ color: m.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {m.name}
                  {m.implemented ? <Badge variant="success">Ready</Badge> : <Badge variant="warning">Future</Badge>}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)', marginTop: '0.125rem' }}>{m.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Pipeline Usage" description="The MiddlewarePipeline is shared across subsystems">
        <pre style={{ fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto', backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8, fontFamily: 'monospace', color: 'var(--color-foreground-muted)' }}>
{`// The pipeline is consumed by:
//   1. CommandBus.dispatch()
//   2. QueryBus.execute()
//   3. Future HTTP middleware layer

// Register middleware on CommandBus:
commandBus.use(createPermissionMiddleware(check))
commandBus.use(createLoggingMiddleware('command', logger))
commandBus.use(createMetricsMiddleware('command', monitor))
commandBus.use(createValidationMiddleware(validator))
commandBus.use(createFeatureFlagMiddleware(flags, 'commands.enabled'))
commandBus.use(createRateLimitMiddleware(100))

// Register middleware on QueryBus:
queryBus.use(createLoggingMiddleware('query', logger))
queryBus.use(createMetricsMiddleware('query', monitor))
queryBus.use(createPermissionMiddleware(authCheck))

// Standalone use:
const pipeline = new MiddlewarePipeline()
pipeline.use(createLoggingMiddleware('http'))
pipeline.use(createMetricsMiddleware('http', monitor))
await pipeline.execute(context, handler)`}
        </pre>
      </SectionCard>

      <SectionCard title="Active Pipelines" description={`Command Bus: ${commandBus?.getMiddlewareCount() ?? 0} middleware · Query Bus: ${queryBus?.getMiddlewareCount() ?? 0} middleware`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem' }}>Command Bus Pipeline</div>
            <pre style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)', fontFamily: 'monospace' }}>
              {commandBus?.getMiddlewareCount() > 0 ? `${commandBus.getMiddlewareCount()} middleware(s) active` : 'No middleware registered'}
            </pre>
          </div>
          <div style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, marginBottom: '0.5rem' }}>Query Bus Pipeline</div>
            <pre style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)', fontFamily: 'monospace' }}>
              {queryBus?.getMiddlewareCount() > 0 ? `${queryBus.getMiddlewareCount()} middleware(s) active` : 'No middleware registered'}
            </pre>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
