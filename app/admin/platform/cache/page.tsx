'use client'

import { HardDrive, Database, RefreshCw, Trash2, BarChart3 } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Badge } from '@/components/ui/Badge'
import { usePlatform } from '@/lib/platform/PlatformProvider'

export default function CachePage() {
  const { kernel, loaded } = usePlatform()
  const cache = loaded && kernel ? kernel.resolve<any>('cacheManager') : null
  const stats = cache?.statistics() ?? { hits: 0, misses: 0, keys: 0 }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Cache Manager" subtitle="Driver-based caching with Memory, Null drivers — future Redis, File support" />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        {[
          { label: 'Keys Cached', value: stats.keys, icon: Database, color: '#8B5CF6' },
          { label: 'Hits', value: stats.hits, icon: BarChart3, color: '#10B981' },
          { label: 'Misses', value: stats.misses, icon: RefreshCw, color: '#F59E0B' },
          { label: 'Hit Rate', value: stats.hits + stats.misses > 0 ? `${((stats.hits / (stats.hits + stats.misses)) * 100).toFixed(1)}%` : '0%', icon: Database, color: '#3B82F6' },
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

      <SectionCard title="Drivers" description="Cache driver architecture">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'Memory Driver', status: 'implemented' as const, desc: 'In-memory Map-based cache with TTL support and tag-based invalidation' },
            { name: 'Null Driver', status: 'implemented' as const, desc: 'No-op cache that never stores — useful for testing' },
            { name: 'Redis Driver', status: 'pending' as const, desc: 'Distributed cache via Redis — pending backend integration' },
            { name: 'File Driver', status: 'pending' as const, desc: 'Filesystem-based cache — pending implementation' },
          ].map(d => (
            <div key={d.name} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <HardDrive size={14} style={{ color: d.status === 'implemented' ? '#10B981' : '#F59E0B' }} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{d.name}</span>
                <Badge variant={d.status === 'implemented' ? 'success' : 'warning'}>{d.status}</Badge>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{d.desc}</div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Cache Manager API" description="All cache operations go through CacheManager — never use drivers directly">
        <pre style={{ fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto', backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8, fontFamily: 'monospace', color: 'var(--color-foreground-muted)' }}>
{`// Basic operations
await cache.get('key')          // Get value (returns null if missing)
await cache.set('key', val, 300) // Set with 300s TTL
await cache.forget('key')       // Remove key
await cache.has('key')          // Check existence
await cache.clear()             // Flush all keys

// Smart operations
await cache.remember('key', 300, async () => {
  return await fetchExpensiveData()
})

await cache.pull('key')         // Get and forget
await cache.add('key', val, 300) // Set only if not exists

// Statistics
const stats = cache.statistics()
// { hits: number, misses: number, keys: number }`}
        </pre>
      </SectionCard>
    </div>
  )
}
