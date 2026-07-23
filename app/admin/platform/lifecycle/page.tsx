'use client'

import { LifeBuoy, CheckCircle, XCircle, Activity, Clock, ArrowRight, AlertTriangle } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Badge } from '@/components/ui/Badge'
import { usePlatform } from '@/lib/platform/PlatformProvider'

const allStages = [
  'booting', 'initializing', 'loading_config', 'loading_drivers',
  'loading_services', 'loading_modules', 'loading_sdk',
  'ready', 'running', 'maintenance', 'shutting_down', 'shutdown',
]

export default function LifecyclePage() {
  const { kernel, loaded } = usePlatform()
  const lifecycle = loaded && kernel ? kernel.resolve<any>('lifecycleMonitor') : null
  const current = lifecycle?.getCurrent() ?? null
  const transitions = lifecycle?.getTransitions() ?? []
  const errors = lifecycle?.getErrors() ?? []
  const progress = lifecycle?.getProgress() ?? 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Lifecycle Monitor" subtitle="Platform lifecycle state machine — every stage tracked and observable" />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[
          { label: 'Current Stage', value: current ?? '—', icon: Activity, color: '#8B5CF6' },
          { label: 'Transitions', value: transitions.length, icon: ArrowRight, color: '#3B82F6' },
          { label: 'Progress', value: `${progress}%`, icon: Clock, color: '#10B981' },
          { label: 'Errors', value: errors.length, icon: AlertTriangle, color: errors.length > 0 ? '#EF4444' : '#10B981' },
        ].map(s => (
          <div key={s.label} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{s.label}</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700, textTransform: 'capitalize' }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <SectionCard title="Lifecycle Stages" description="12 stages in the platform lifecycle">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {allStages.map((stage, i) => {
            const isCurrent = current === stage
            const isPast = lifecycle?.isAfter(stage) ?? false
            const duration = lifecycle?.getStageDuration(stage) ?? 0
            const transition = transitions.find((t: any) => t.to === stage)

            return (
              <div key={stage} style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.625rem 0.875rem', borderRadius: 8,
                border: isCurrent ? '2px solid #8B5CF6' : '1px solid var(--color-border)',
                backgroundColor: isCurrent ? 'rgba(139,92,246,0.05)' : isPast ? 'var(--color-background-subtle)' : undefined,
                opacity: transition ? 1 : 0.5,
              }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: isCurrent ? '#8B5CF6' : isPast ? '#10B981' : 'var(--color-border)', flexShrink: 0 }}>
                  {isCurrent ? <Activity size={12} color="white" /> : isPast ? <CheckCircle size={12} color="white" /> : <span style={{ fontSize: '0.625rem', color: 'var(--color-foreground-muted)' }}>{i + 1}</span>}
                </div>
                <span style={{ fontSize: '0.8125rem', fontWeight: isCurrent ? 700 : 400, flex: 1, textTransform: 'capitalize' }}>
                  {stage.replace(/_/g, ' ')}
                </span>
                {duration > 0 && <span style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)', fontFamily: 'monospace' }}>{duration}ms</span>}
                {isCurrent && <Badge variant="accent">Current</Badge>}
                {isPast && !isCurrent && <Badge variant="success">Done</Badge>}
              </div>
            )
          })}
        </div>
      </SectionCard>

      {errors.length > 0 && (
        <SectionCard title="Lifecycle Errors" description={`${errors.length} error(s)`}>
          {errors.map((e: any, i: number) => (
            <div key={i} style={{ padding: '0.5rem 0.75rem', borderRadius: 8, backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <XCircle size={14} style={{ color: '#EF4444' }} />
              <span style={{ fontSize: '0.8125rem' }}>[{e.stage}] {e.error}</span>
            </div>
          ))}
        </SectionCard>
      )}

      {transitions.length === 0 && (
        <SectionCard title="Lifecycle Events" description="Lifecycle stages emit events on enter, complete, and error">
          <pre style={{ fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto', backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8, fontFamily: 'monospace', color: 'var(--color-foreground-muted)' }}>
{`// Lifecycle events are emitted to the EventBus:
lifecycle.enter('booting')
// → EventBus emits 'lifecycle.stage.entered'

lifecycle.complete('booting')
// → EventBus emits 'lifecycle.stage.completed'

lifecycle.error('booting', 'Failed to initialize')
// → EventBus emits 'lifecycle.error'`}
          </pre>
        </SectionCard>
      )}
    </div>
  )
}
