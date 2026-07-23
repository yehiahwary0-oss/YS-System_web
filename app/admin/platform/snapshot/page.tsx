'use client'

import { Download, FileJson, FileText, AlertTriangle, CheckCircle, XCircle, Activity, Package, Server, Flag, HardDrive, Terminal, Database, Clock, Cpu, Shield } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Badge } from '@/components/ui/Badge'
import { usePlatform } from '@/lib/platform/PlatformProvider'
import { useState, useCallback } from 'react'

export default function SnapshotPage() {
  const { kernel, loaded } = usePlatform()
  const [snapshot, setSnapshot] = useState<any>(null)
  const [exportType, setExportType] = useState<'json' | 'html' | null>(null)
  const [exportContent, setExportContent] = useState('')

  const generateSnapshot = useCallback(() => {
    if (!loaded || !kernel) return
    const generator = kernel.resolve<any>('snapshotGenerator')
    const s = generator.generate()
    setSnapshot(s)
    setExportType(null)
  }, [kernel, loaded])

  const exportJson = useCallback(() => {
    if (!loaded || !kernel) return
    const generator = kernel.resolve<any>('snapshotGenerator')
    setExportContent(generator.generateJson())
    setExportType('json')
  }, [kernel, loaded])

  const exportHtml = useCallback(() => {
    if (!loaded || !kernel) return
    const generator = kernel.resolve<any>('snapshotGenerator')
    setExportContent(generator.generateHtml())
    setExportType('html')
  }, [kernel, loaded])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Platform Snapshot" subtitle="Complete platform diagnostics — generated on demand, never fake" />

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button onClick={generateSnapshot} style={{ padding: '0.625rem 1.25rem', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={16} /> Generate Snapshot
        </button>
        {snapshot && (
          <>
            <button onClick={exportJson} style={{ padding: '0.625rem 1.25rem', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileJson size={16} /> Export JSON
            </button>
            <button onClick={exportHtml} style={{ padding: '0.625rem 1.25rem', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={16} /> Export HTML
            </button>
          </>
        )}
      </div>

      {exportContent && (
        <SectionCard title={`Export (${exportType})`} description={`Full platform snapshot in ${exportType?.toUpperCase()} format`}>
          <pre style={{ fontSize: '0.6875rem', lineHeight: 1.5, overflowX: 'auto', backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8, fontFamily: 'monospace', color: 'var(--color-foreground-muted)', maxHeight: 400, overflowY: 'auto' }}>
            {exportContent.slice(0, 5000)}
            {exportContent.length > 5000 && '\n... (truncated)'}
          </pre>
        </SectionCard>
      )}

      {snapshot && !exportType && (
        <>
          <SectionCard title="Platform Summary" description={`Generated at ${snapshot.generatedAt}`}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Platform', value: `${snapshot.platform.name} ${snapshot.platform.version}`, icon: Server },
                { label: 'Environment', value: snapshot.platform.environment, icon: Cpu },
                { label: 'Status', value: snapshot.platform.status, icon: Activity },
                { label: 'UUID', value: snapshot.platform.uuid.slice(0, 20) + '...', icon: Shield },
              ].map(s => (
                <div key={s.label} style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-foreground-muted)', marginBottom: '0.25rem' }}>{s.label}</div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{s.value}</div>
                </div>
              ))}
            </div>
          </SectionCard>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SectionCard title="Modules & Dependencies" description={`${snapshot.modules.length} modules, ${snapshot.dependencyGraph.nodes} graph nodes`}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {snapshot.modules.map((m: any) => (
                  <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8125rem' }}>
                    <Badge variant={m.enabled ? 'success' : 'warning'}>{m.enabled ? 'ON' : 'OFF'}</Badge>
                    <code>{m.id}</code>
                    <span style={{ color: 'var(--color-foreground-muted)' }}>@{m.version}</span>
                  </div>
                ))}
              </div>
              {snapshot.dependencyGraph.errors.length > 0 && (
                <div style={{ marginTop: '0.75rem', padding: '0.75rem', borderRadius: 8, backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                  {snapshot.dependencyGraph.errors.map((e: string, i: number) => (
                    <div key={i} style={{ fontSize: '0.75rem', color: '#EF4444' }}>{e}</div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title="Performance" description={`Startup: ${snapshot.performance.startupDuration}ms`}>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Memory Used', value: `${snapshot.performance.memory.used}MB` },
                  { label: 'Memory Total', value: `${snapshot.performance.memory.total}MB` },
                  { label: 'Metrics Tracked', value: snapshot.performance.metrics },
                  { label: 'Slow Operations', value: snapshot.performance.slowOperations },
                ].map(s => (
                  <div key={s.label} style={{ padding: '0.625rem', borderRadius: 6, border: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--color-foreground-muted)' }}>{s.label}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700 }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Health & Errors" description={`${snapshot.health.checks} checks, ${snapshot.errors.length} errors`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Badge variant={snapshot.health.checks > 0 ? 'success' : 'warning'}>{snapshot.health.status}</Badge>
                <span style={{ fontSize: '0.8125rem' }}>{snapshot.health.checks} health checks</span>
              </div>
              {snapshot.errors.length > 0 && (
                <div style={{ marginTop: '0.75rem' }}>
                  {snapshot.errors.map((e: any, i: number) => (
                    <div key={i} style={{ fontSize: '0.75rem', padding: '0.25rem 0', color: e.severity === 'critical' ? '#EF4444' : '#F59E0B' }}>
                      [{e.code}] {e.message}
                    </div>
                  ))}
                </div>
              )}
            </SectionCard>

            <SectionCard title="Security" description="Permissions and roles overview">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'Services', value: snapshot.security.servicesCount },
                  { label: 'Permissions', value: snapshot.security.permissionsCount },
                  { label: 'Roles', value: snapshot.security.rolesCount },
                ].map(s => (
                  <div key={s.label} style={{ padding: '0.625rem', borderRadius: 6, border: '1px solid var(--color-border-subtle)' }}>
                    <div style={{ fontSize: '0.6875rem', color: 'var(--color-foreground-muted)' }}>{s.label}</div>
                    <div style={{ fontSize: '1rem', fontWeight: 700 }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>

          {snapshot.warnings.length > 0 && (
            <SectionCard title="Warnings" description={`${snapshot.warnings.length} warning(s)`}>
              {snapshot.warnings.map((w: string, i: number) => (
                <div key={i} style={{ padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                  <AlertTriangle size={14} style={{ color: '#F59E0B' }} />
                  <span style={{ fontSize: '0.8125rem' }}>{w}</span>
                </div>
              ))}
            </SectionCard>
          )}
        </>
      )}

      {!snapshot && !exportContent && (
        <SectionCard title="Generate a Snapshot" description="Click the button above to generate a full platform diagnostics snapshot">
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>The snapshot includes manifest, environment, modules, dependencies, feature flags, drivers, services, commands, queries, events, scheduler, health, performance, errors, warnings, and security summary. Snapshots never expose secrets.</p>
        </SectionCard>
      )}
    </div>
  )
}
