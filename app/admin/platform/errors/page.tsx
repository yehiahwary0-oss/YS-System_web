'use client'

import { AlertTriangle, XCircle, Info, AlertCircle, BookOpen, FileText, Search } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Badge } from '@/components/ui/Badge'
import { usePlatform } from '@/lib/platform/PlatformProvider'
import { useState } from 'react'

const severityColors: Record<string, string> = {
  critical: '#EF4444',
  major: '#F97316',
  minor: '#F59E0B',
  info: '#3B82F6',
}

const severityIcons: Record<string, typeof XCircle> = {
  critical: XCircle,
  major: AlertTriangle,
  minor: AlertCircle,
  info: Info,
}

export default function ErrorCatalogPage() {
  const { kernel, loaded } = usePlatform()
  const [searchQuery, setSearchQuery] = useState('')

  const errorCatalog = loaded && kernel ? kernel.resolve<any>('errorCatalog') : null
  const history = errorCatalog?.getHistory() ?? []
  const allCodes = errorCatalog?.getAllCodes() ?? []

  const filtered = allCodes.filter((c: any) =>
    !searchQuery || c.code.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Error Catalog" subtitle={`${allCodes.length} structured error codes — centralized, categorized, documented`} />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Codes', value: allCodes.length, icon: BookOpen, color: '#8B5CF6' },
          { label: 'Critical', value: allCodes.filter((c: any) => c.severity === 'critical').length, icon: XCircle, color: '#EF4444' },
          { label: 'Major', value: allCodes.filter((c: any) => c.severity === 'major').length, icon: AlertTriangle, color: '#F97316' },
          { label: 'Logged', value: history.length, icon: FileText, color: '#3B82F6' },
        ].map(s => (
          <div key={s.label} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <s.icon size={16} style={{ color: s.color }} />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{s.label}</div>
              <div style={{ fontSize: '1.125rem', fontWeight: 700 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '0.75rem', borderRadius: 8, border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Search size={16} style={{ color: 'var(--color-foreground-muted)' }} />
        <input type="text" placeholder="Search error codes..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
          style={{ border: 'none', outline: 'none', flex: 1, fontSize: '0.8125rem', backgroundColor: 'transparent', color: 'var(--color-foreground)' }} />
      </div>

      <SectionCard title="Error Code Registry" description={`${filtered.length} code(s) ${searchQuery ? `matching "${searchQuery}"` : ''}`}>
        <table style={{ width: '100%', fontSize: '0.8125rem', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
              <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Code</th>
              <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Category</th>
              <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Severity</th>
              <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Description</th>
              <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Resolution</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((entry: any) => {
              const Icon = severityIcons[entry.severity] ?? Info
              return (
                <tr key={entry.code} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '0.5rem 0.75rem', fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 600 }}>{entry.code}</td>
                  <td style={{ padding: '0.5rem 0.75rem', textTransform: 'capitalize' }}>{entry.category}</td>
                  <td style={{ padding: '0.5rem 0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
                      <Icon size={12} style={{ color: severityColors[entry.severity] }} />
                      <span style={{ color: severityColors[entry.severity] }}>{entry.severity}</span>
                    </div>
                  </td>
                  <td style={{ padding: '0.5rem 0.75rem', color: 'var(--color-foreground-muted)' }}>{entry.description}</td>
                  <td style={{ padding: '0.5rem 0.75rem', fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{entry.suggestedResolution}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </SectionCard>

      {history.length > 0 && (
        <SectionCard title="Error History" description={`${history.length} logged error(s)`}>
          <table style={{ width: '100%', fontSize: '0.8125rem', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Code</th>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Message</th>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Severity</th>
                <th style={{ textAlign: 'left', padding: '0.5rem 0.75rem', fontWeight: 600 }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {history.slice(-30).reverse().map((e: any, i: number) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <td style={{ padding: '0.375rem 0.75rem', fontFamily: 'monospace', fontSize: '0.75rem' }}>{e.code}</td>
                  <td style={{ padding: '0.375rem 0.75rem', color: 'var(--color-foreground-muted)' }}>{e.message}</td>
                  <td style={{ padding: '0.375rem 0.75rem' }}><Badge variant={e.severity === 'critical' ? 'error' : e.severity === 'major' ? 'warning' : 'default'}>{e.severity}</Badge></td>
                  <td style={{ padding: '0.375rem 0.75rem', fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{e.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </SectionCard>
      )}
    </div>
  )
}
