'use client'

import { Search, Database, Globe, Filter, ListOrdered, FileText } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Badge } from '@/components/ui/Badge'
import { usePlatform } from '@/lib/platform/PlatformProvider'

export default function SearchPage() {
  const { kernel, loaded } = usePlatform()
  const search = loaded && kernel ? kernel.resolve<any>('searchEngine') : null
  const providers = search?.getModuleProviders() ?? []
  const available = search?.isAvailable() ?? false

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Search Engine" subtitle="Driver-based search with Database driver — future Meilisearch, Elastic, Algolia support" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { label: 'Status', value: available ? 'Available' : 'Unavailable', icon: Search, color: available ? '#10B981' : '#EF4444' },
          { label: 'Module Providers', value: providers.length, icon: Globe, color: '#8B5CF6' },
          { label: 'Current Driver', value: 'Database', icon: Database, color: '#3B82F6' },
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

      <SectionCard title="Search Drivers" description="Driver architecture — current and planned">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'Database Driver', status: 'implemented' as const, desc: 'In-memory search with scoring, pagination, module filtering' },
            { name: 'Meilisearch', status: 'pending' as const, desc: 'Typo-tolerant, instant search engine' },
            { name: 'Elasticsearch', status: 'pending' as const, desc: 'Distributed search and analytics' },
            { name: 'Algolia', status: 'pending' as const, desc: 'Hosted search API with typo tolerance' },
          ].map(d => (
            <div key={d.name} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <Database size={14} style={{ color: d.status === 'implemented' ? '#10B981' : '#F59E0B' }} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{d.name}</span>
                <Badge variant={d.status === 'implemented' ? 'success' : 'warning'}>{d.status}</Badge>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{d.desc}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Module Search Providers" description={`${providers.length} module provider(s) registered`}>
        {providers.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {providers.map((p: string) => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', borderRadius: 8, border: '1px solid var(--color-border-subtle)' }}>
                <Globe size={14} style={{ color: '#8B5CF6' }} />
                <code style={{ fontSize: '0.8125rem' }}>{p}</code>
                <Badge variant="success">Active</Badge>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>No module search providers registered yet.</p>
        )}
      </SectionCard>

      <SectionCard title="Search Engine API" description="Unified search interface">
        <pre style={{ fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto', backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8, fontFamily: 'monospace', color: 'var(--color-foreground-muted)' }}>
{`// Search across all providers
const results = await search.search({ query: 'hello', page: 1, perPage: 10 })
const { documents, total, page, totalPages } = results

// Filter by module
const filtered = await search.search({
  query: 'hello',
  filters: { moduleId: 'core' }
})

// Global search - aggregates all providers
const allResults = await search.searchGlobal('hello')

// Index/update documents
await search.index({ id: '1', title: 'Doc', content: 'Content', moduleId: 'core' })
await search.update({ id: '1', title: 'Updated', content: 'New content' })
await search.delete('1')`}
        </pre>
      </SectionCard>
    </div>
  )
}
