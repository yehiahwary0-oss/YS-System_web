'use client'

import { BarChart3, FileJson, Download, Server, Cpu, Shield, Package, Settings, Activity } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Badge } from '@/components/ui/Badge'
import { usePlatform } from '@/lib/platform/PlatformProvider'
import { useState, useCallback } from 'react'

export default function ReportsPage() {
  const { kernel, loaded } = usePlatform()
  const [selectedReport, setSelectedReport] = useState<string | null>(null)
  const [reportContent, setReportContent] = useState('')

  const generateReport = useCallback((type: string) => {
    if (!loaded || !kernel) return
    const report = kernel.resolve<any>('platformReport')
    let result: any
    switch (type) {
      case 'architecture': result = report.generateArchitectureReport(); break
      case 'runtime': result = report.generateRuntimeReport(); break
      case 'modules': result = report.generateModuleReport(); break
      case 'performance': result = report.generatePerformanceReport(); break
      case 'security': result = report.generateSecurityReport(); break
      case 'configuration': result = report.generateConfigurationReport(); break
      default: return
    }
    setSelectedReport(type)
    setReportContent(report.toJson(result))
  }, [kernel, loaded])

  const reportTypes = [
    { id: 'architecture', label: 'Architecture Report', icon: Server, color: '#8B5CF6', desc: 'Platform, modules, services, registries, drivers, middleware' },
    { id: 'runtime', label: 'Runtime Report', icon: Activity, color: '#3B82F6', desc: 'Memory, startup, modules, scheduler status' },
    { id: 'modules', label: 'Module Report', icon: Package, color: '#F97316', desc: 'Module list, commands, queries per module' },
    { id: 'performance', label: 'Performance Report', icon: Cpu, color: '#10B981', desc: 'Startup duration, memory, metrics, slow ops' },
    { id: 'security', label: 'Security Report', icon: Shield, color: '#EC4899', desc: 'Permissions, roles, sensitive config masking' },
    { id: 'configuration', label: 'Configuration Report', icon: Settings, color: '#14B8A6', desc: 'All config values with sensitive data masked' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Platform Reports" subtitle="Generate comprehensive reports — all exported as JSON" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {reportTypes.map(r => (
          <button key={r.id} onClick={() => generateReport(r.id)}
            style={{ padding: '1.25rem', borderRadius: 10, border: selectedReport === r.id ? '2px solid #8B5CF6' : '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', cursor: 'pointer', textAlign: 'left', transition: 'all 150ms' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${r.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <r.icon size={16} style={{ color: r.color }} />
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{r.label}</span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{r.desc}</div>
          </button>
        ))}
      </div>

      {reportContent && (
        <SectionCard title={`Report: ${selectedReport}`} description="JSON format — ready for export or analysis"
          actions={<button onClick={() => { navigator.clipboard.writeText(reportContent) }} style={{ padding: '0.375rem 0.75rem', borderRadius: 6, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', cursor: 'pointer', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.375rem' }}><Download size={12} /> Copy</button>}
        >
          <pre style={{ fontSize: '0.6875rem', lineHeight: 1.5, overflowX: 'auto', backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8, fontFamily: 'monospace', color: 'var(--color-foreground-muted)', maxHeight: 500, overflowY: 'auto' }}>
            {reportContent.slice(0, 10000)}
            {reportContent.length > 10000 && '\n... (truncated)'}
          </pre>
        </SectionCard>
      )}

      {!reportContent && (
        <SectionCard title="Generate a Report" description="Click any report type above">
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>Reports aggregate live platform data into structured JSON. Available: Architecture, Runtime, Module, Performance, Security, Configuration.</p>
        </SectionCard>
      )}
    </div>
  )
}
