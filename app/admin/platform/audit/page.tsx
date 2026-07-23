'use client'

import { Shield, AlertTriangle, CheckCircle, XCircle, Info, Server, Box, GitBranch, Settings, HardDrive } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Badge } from '@/components/ui/Badge'
import { usePlatform } from '@/lib/platform/PlatformProvider'
import { useState } from 'react'

export default function AuditPage() {
  const { kernel, loaded } = usePlatform()
  const [auditRun, setAuditRun] = useState(false)

  const audit = loaded && kernel ? kernel.resolve<any>('platformAudit') : null
  const report = auditRun ? audit?.run() : null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Platform Audit" subtitle="Architecture audit — detect issues, inconsistencies, and improvement opportunities" />

      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <button onClick={() => setAuditRun(true)} style={{ padding: '0.625rem 1.25rem', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', cursor: 'pointer', fontSize: '0.8125rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Shield size={16} /> {auditRun ? 'Re-run Audit' : 'Run Audit'}
        </button>
      </div>

      {report && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            {[
              { label: 'Total Findings', value: report.summary.total, icon: Shield, color: '#8B5CF6' },
              { label: 'Critical', value: report.summary.critical, icon: XCircle, color: report.summary.critical > 0 ? '#EF4444' : '#10B981' },
              { label: 'Warnings', value: report.summary.warning, icon: AlertTriangle, color: report.summary.warning > 0 ? '#F59E0B' : '#10B981' },
              { label: 'Info', value: report.summary.info, icon: Info, color: '#3B82F6' },
            ].map(s => (
              <div key={s.label} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <s.icon size={16} style={{ color: s.color }} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{s.label}</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 700 }}>{s.value}</div>
                </div>
              </div>
            ))}
          </div>

          <SectionCard title="Audit Findings" description={`${report.findings.length} total — generated at ${report.generatedAt}`}>
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
                {report.findings.map((f: any, i: number) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                    <td style={{ padding: '0.5rem 0.75rem', textTransform: 'capitalize' }}>{f.category}</td>
                    <td style={{ padding: '0.5rem 0.75rem' }}>
                      <Badge variant={f.severity === 'critical' ? 'error' : f.severity === 'warning' ? 'warning' : 'default'}>{f.severity}</Badge>
                    </td>
                    <td style={{ padding: '0.5rem 0.75rem', color: 'var(--color-foreground-muted)' }}>{f.message}</td>
                    <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{f.recommendation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </SectionCard>

          <SectionCard title="Audited Areas" description="5 audit categories">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: 'Services', icon: Box, color: '#8B5CF6', desc: 'Container registrations, duplicates' },
                { name: 'Dependencies', icon: GitBranch, color: '#3B82F6', desc: 'Missing, circular, version conflicts' },
                { name: 'Registries', icon: Server, color: '#F97316', desc: 'Population, coverage' },
                { name: 'Configuration', icon: Settings, color: '#14B8A6', desc: 'Validation errors' },
                { name: 'Drivers', icon: HardDrive, color: '#10B981', desc: 'Registration status' },
              ].map(a => (
                <div key={a.name} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <a.icon size={16} style={{ color: a.color }} />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{a.name}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{a.desc}</div>
                </div>
              ))}
            </div>
          </SectionCard>
        </>
      )}

      {!auditRun && (
        <SectionCard title="Run an Audit" description="Click 'Run Audit' to scan the platform architecture">
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>The audit engine detects unused services, dead commands, duplicate registrations, circular dependencies, configuration inconsistencies, and more.</p>
        </SectionCard>
      )}
    </div>
  )
}
