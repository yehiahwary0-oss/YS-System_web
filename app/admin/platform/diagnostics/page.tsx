'use client'

import { Activity, Shield, Cpu, Server, GitBranch, AlertTriangle, CheckCircle, XCircle, Wrench, Eye, FileSearch } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Badge } from '@/components/ui/Badge'
import { usePlatform } from '@/lib/platform/PlatformProvider'
import { useState } from 'react'

const statusConfig = {
  excellent: { color: '#10B981', label: 'Excellent' },
  good: { color: '#3B82F6', label: 'Good' },
  fair: { color: '#F59E0B', label: 'Fair' },
  poor: { color: '#F97316', label: 'Poor' },
  critical: { color: '#EF4444', label: 'Critical' },
}

export default function DiagnosticsPage() {
  const { kernel, loaded } = usePlatform()
  const [runDiagnostics, setRunDiagnostics] = useState(false)

  const health = loaded && kernel ? kernel.resolve<any>('operationalHealthCenter') : null
  const audit = loaded && kernel ? kernel.resolve<any>('platformAudit') : null
  const graph = loaded && kernel ? kernel.resolve<any>('serviceGraph') : null

  const report = runDiagnostics ? health?.assess() ?? null : null
  const auditReport = runDiagnostics ? audit?.run() ?? null : null
  const graphData = runDiagnostics ? graph?.build() ?? null : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Diagnostics" subtitle="Computed platform health, architecture audit, and service graph — run on demand" />

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button onClick={() => setRunDiagnostics(true)} style={{ padding: '0.625rem 1.25rem', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={16} /> {runDiagnostics ? 'Refresh' : 'Run Diagnostics'}
        </button>
      </div>

      {report && (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { name: 'Platform', score: report.platformScore },
              { name: 'Architecture', score: report.architectureScore },
              { name: 'Health', score: report.healthScore },
              { name: 'Performance', score: report.performanceScore },
              { name: 'Security', score: report.securityScore },
              { name: 'Maintainability', score: report.maintainabilityScore },
              { name: 'Dependencies', score: report.dependencyHealth },
              { name: 'Configuration', score: report.configurationHealth },
              { name: 'Drivers', score: report.driverHealth },
              { name: 'Registries', score: report.registryHealth },
              { name: 'Observability', score: report.observabilityHealth },
            ].map(s => {
              const cfg = statusConfig[s.score.status as keyof typeof statusConfig] ?? statusConfig.critical
              return (
                <div key={s.name} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--color-foreground-muted)', marginBottom: '0.375rem' }}>{s.name}</div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 700, color: cfg.color }}>{s.score.percentage}%</div>
                  <Badge variant={s.score.status === 'excellent' || s.score.status === 'good' ? 'success' : s.score.status === 'fair' ? 'warning' : 'error'}>{cfg.label}</Badge>
                </div>
              )
            })}
          </div>

          {report.warnings.length > 0 && (
            <SectionCard title="Warnings" description={`${report.warnings.length} warning(s)`}>
              {report.warnings.map((w: string, i: number) => (
                <div key={i} style={{ padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid var(--color-border)', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertTriangle size={14} style={{ color: '#F59E0B' }} />
                  <span style={{ fontSize: '0.8125rem' }}>{w}</span>
                </div>
              ))}
            </SectionCard>
          )}

          {report.recommendations.length > 0 && (
            <SectionCard title="Recommendations" description={`${report.recommendations.length} suggestion(s)`}>
              {report.recommendations.map((r: string, i: number) => (
                <div key={i} style={{ padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid var(--color-border)', marginBottom: '0.375rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Wrench size={14} style={{ color: '#8B5CF6' }} />
                  <span style={{ fontSize: '0.8125rem' }}>{r}</span>
                </div>
              ))}
            </SectionCard>
          )}
        </>
      )}

      {auditReport && (
        <SectionCard title="Platform Audit" description={`${auditReport.summary.total} finding(s): ${auditReport.summary.critical} critical, ${auditReport.summary.warning} warning, ${auditReport.summary.info} info`}>
          <table style={{ width: '100%', fontSize: '0.8125rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Category</th>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Severity</th>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Finding</th>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {auditReport.findings.map((f: any, i: number) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '0.375rem 0.75rem', textTransform: 'capitalize' }}>{f.category}</td>
                  <td style={{ padding: '0.375rem 0.75rem' }}>
                    <Badge variant={f.severity === 'critical' ? 'error' : f.severity === 'warning' ? 'warning' : 'default'}>{f.severity}</Badge>
                  </td>
                  <td style={{ padding: '0.375rem 0.75rem', color: 'var(--color-foreground-muted)' }}>{f.message}</td>
                  <td style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{f.recommendation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      )}

      {graphData && (
        <SectionCard title="Service Graph" description={`${graphData.totalCount} nodes, ${graphData.edges.length} edges, ${graphData.singletonCount} singletons`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {graphData.nodes.map((n: any) => (
              <div key={n.id} style={{ padding: '0.5rem 0.75rem', borderRadius: 6, border: '1px solid var(--color-border-subtle)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: n.type === 'service' ? '#8B5CF6' : n.type === 'command' ? '#EC4899' : n.type === 'query' ? '#10B981' : '#F59E0B' }} />
                <code style={{ fontSize: '0.75rem', flex: 1 }}>{n.id}</code>
                <span style={{ padding: '0.125rem 0.375rem', borderRadius: 4, fontSize: '0.625rem', border: '1px solid var(--color-border)', color: 'var(--color-foreground-muted)' }}>{n.type}</span>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {!runDiagnostics && (
        <SectionCard title="Run Diagnostics" description="Click 'Run Diagnostics' to generate the full report">
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>This will compute: 11 health scores, platform audit findings, service graph. All values are computed on demand from real runtime data.</p>
        </SectionCard>
      )}
    </div>
  )
}
