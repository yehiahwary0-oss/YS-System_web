'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, Search as SearchIcon } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { Input } from '@/components/admin/FormElements'
import { ModuleCard } from '@/components/admin/ModuleCard'
import { usePlatform } from '@/lib/platform/PlatformProvider'

export default function ModuleManagerPage() {
  const { kernel, loaded } = usePlatform()
  const [query, setQuery] = useState('')
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return (
    <PageHeader title="Module Manager" subtitle="Manage all platform modules and extensions" />
  )

  const modules = loaded && kernel ? kernel.getModules() : []

  const filtered = query.trim()
    ? modules.filter(m =>
        m.manifest.name.en.toLowerCase().includes(query.toLowerCase()) ||
        m.manifest.id.toLowerCase().includes(query.toLowerCase()) ||
        m.manifest.description.en.toLowerCase().includes(query.toLowerCase())
      )
    : modules

  const enabledCount = modules.filter(m => m.manifest.enabled).length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Module Manager"
        subtitle={`${modules.length} module(s) · ${enabledCount} enabled`}
      />

      <div style={{ maxWidth: '24rem' }}>
        <Input
          placeholder="Search modules..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ paddingLeft: '2.25rem' }}
        />
        <SearchIcon size={15} style={{ position: 'absolute', marginTop: '-1.9rem', marginLeft: '0.75rem', color: 'var(--color-foreground-muted)' }} />
      </div>

      {!loaded && (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-foreground-muted)' }}>
          <RefreshCw size={24} className="animate-spin" style={{ margin: '0 auto 0.75rem', opacity: 0.5 }} />
          <p style={{ fontSize: '0.875rem' }}>Loading modules...</p>
        </div>
      )}

      {loaded && filtered.length === 0 && (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-foreground-muted)', fontSize: '0.875rem' }}>
          {query ? 'No modules match your search.' : 'No modules registered.'}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(mod => (
          <ModuleCard
            key={mod.manifest.id}
            id={mod.manifest.id}
            name={mod.manifest.name.en}
            technicalName={mod.manifest.slug}
            version={mod.manifest.version}
            enabled={mod.manifest.enabled}
            description={mod.manifest.description.en}
            href={`/admin/platform/modules/${mod.manifest.id}`}
          />
        ))}
      </div>
    </div>
  )
}
