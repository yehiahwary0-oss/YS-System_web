'use client'

import { Zap, RefreshCw, Trash2, Thermometer, Globe, Snowflake } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getDefaultPerformanceConfig } from '@/lib/platform/adapters/performance'

const mockCacheStats = { hitRate: 87, size: 256, entries: 1842 }
const mockWarmedPaths = ['/api/products', '/api/categories', '/api/settings']

export default function PerformancePage() {
  const config = getDefaultPerformanceConfig()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Performance Center"
        subtitle="Cache management, warmup, and CDN configuration"
        actions={<Button variant="primary" size="sm"><RefreshCw size={14} /> Refresh</Button>}
      />

      <SectionCard title="Configuration" description="Performance optimization settings">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: '0.375rem' }}>Cache</div>
            <Badge variant={config.cacheEnabled ? 'success' : 'default'}>{config.cacheEnabled ? 'Enabled' : 'Disabled'}</Badge>
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: '0.375rem' }}>Default TTL</div>
            <code style={{ fontSize: '0.875rem' }}>{config.defaultCacheTtl}s</code>
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: '0.375rem' }}>CDN</div>
            <Badge variant={config.cdnEnabled ? 'success' : 'default'}>{config.cdnEnabled ? 'Enabled' : 'Disabled'}</Badge>
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SectionCard title="Cache Hit Rate" description="Percentage of cache hits">
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#22C55E' }}>{mockCacheStats.hitRate}%</div>
            <div style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>
              {mockCacheStats.entries} entries &middot; {mockCacheStats.size} KB
            </div>
            <div style={{ marginTop: '0.75rem' }}>
              <Button variant="ghost" size="sm"><Trash2 size={13} /> Clear Cache</Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="Warmed Endpoints" description="Pre-warmed cache paths">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {mockWarmedPaths.map(p => (
              <div key={p} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.25rem 0' }}>
                <Zap size={12} style={{ color: '#F59E0B' }} />
                <code style={{ fontSize: '0.8125rem' }}>{p}</code>
              </div>
            ))}
            <div style={{ marginTop: '0.5rem' }}>
              <Button variant="ghost" size="sm"><Thermometer size={13} /> Warm All</Button>
            </div>
          </div>
        </SectionCard>

        <SectionCard title="CDN Endpoints" description="Configured content delivery networks">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', padding: '1rem 0', color: 'var(--color-foreground-muted)' }}>
            <Globe size={24} style={{ opacity: 0.3 }} />
            <span style={{ fontSize: '0.875rem' }}>No CDN endpoints configured</span>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Backend Integration" description="Required backend API contract for performance management">
        <pre style={{
          fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto',
          backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8,
          fontFamily: 'monospace', color: 'var(--color-foreground-muted)',
        }}>
{`GET    /api/v1/admin/performance          → { data: { stats: PerformanceData, config: PerformanceConfig } }
PUT    /api/v1/admin/performance/config    → { success: true }
POST   /api/v1/admin/performance/warmup    → { success: true }
POST   /api/v1/admin/performance/cache/clear → { success: true }

Permission: manage_performance`}
        </pre>
      </SectionCard>
    </div>
  )
}
