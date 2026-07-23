'use client'

import { BookText, ExternalLink, FileText } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const docSections = [
  { name: 'Architecture Guide', path: 'architecture/', pages: 5, updated: '2026-07-15' },
  { name: 'Developer Guide', path: 'development/', pages: 3, updated: '2026-07-15' },
  { name: 'Module Development Guide', path: 'modules/', pages: 4, updated: '2026-07-14' },
  { name: 'SDK Guide', path: 'sdk/', pages: 2, updated: '2026-07-14' },
  { name: 'Deployment Guide', path: 'deployment/', pages: 3, updated: '2026-07-15' },
  { name: 'Infrastructure Guide', path: 'infrastructure/', pages: 2, updated: '2026-07-15' },
  { name: 'Operations Guide', path: 'operations/', pages: 4, updated: '2026-07-15' },
  { name: 'Security Guide', path: 'security/', pages: 3, updated: '2026-07-15' },
  { name: 'Troubleshooting Guide', path: 'troubleshooting/', pages: 2, updated: '2026-07-14' },
  { name: 'Backup & Recovery Guide', path: 'backup-recovery/', pages: 3, updated: '2026-07-15' },
  { name: 'API Guide', path: 'api/', pages: 6, updated: '2026-07-14' },
  { name: 'Contribution Guide', path: 'contributing/', pages: 2, updated: '2026-07-14' },
]

export default function DocumentationPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Platform Documentation"
        subtitle="Enterprise production documentation — version 1.0.0"
      />

      <SectionCard title="Documentation Sections" description="Browse all enterprise documentation">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {docSections.map(s => (
            <div key={s.name} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(59,130,246,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <BookText size={16} style={{ color: '#3B82F6' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{s.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)', marginTop: '0.125rem' }}>
                  {s.pages} pages &middot; Updated {s.updated}
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Documentation Index" description="Quick access to key documents">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
            <FileText size={14} style={{ color: 'var(--color-foreground-muted)' }} />
            <code style={{ fontSize: '0.8125rem' }}>docs/index.md</code>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>Documentation root</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
            <FileText size={14} style={{ color: 'var(--color-foreground-muted)' }} />
            <code style={{ fontSize: '0.8125rem' }}>docs/architecture/overview.md</code>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>System architecture</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0', borderBottom: '1px solid var(--color-border)' }}>
            <FileText size={14} style={{ color: 'var(--color-foreground-muted)' }} />
            <code style={{ fontSize: '0.8125rem' }}>docs/deployment/pipeline.md</code>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>CI/CD pipeline</span>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}
