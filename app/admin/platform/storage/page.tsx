'use client'

import { Server, Upload, Download, Trash2, Move, Copy, Eye, HardDrive } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Badge } from '@/components/ui/Badge'
import { usePlatform } from '@/lib/platform/PlatformProvider'

export default function StoragePage() {
  const { kernel, loaded } = usePlatform()
  const storage = loaded && kernel ? kernel.resolve<any>('storageManager') : null
  const disks = storage?.getDisks() ?? []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Storage Manager" subtitle="Driver-based file storage with Local driver — future S3, R2, Azure, GCS support" />

      <SectionCard title="Configured Disks" description={`${disks.length} disk(s) registered`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {disks.length > 0 ? disks.map((disk: string) => (
            <div key={disk} style={{ padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Server size={20} style={{ color: '#3B82F6' }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{disk}</div>
                {disk === storage?.getDefaultDisk() && <Badge variant="success">Default</Badge>}
              </div>
              <Badge variant="success">Active</Badge>
            </div>
          )) : (
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>No disks configured. Register a LocalDriver or cloud driver.</p>
          )}
        </div>
      </SectionCard>

      <SectionCard title="Drivers" description="Storage driver architecture">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'Local Driver', status: 'implemented' as const, desc: 'Filesystem-based storage with public URL support' },
            { name: 'Amazon S3', status: 'pending' as const, desc: 'AWS S3-compatible object storage' },
            { name: 'Cloudflare R2', status: 'pending' as const, desc: 'Cloudflare R2 object storage' },
            { name: 'Azure Blob', status: 'pending' as const, desc: 'Azure Blob Storage' },
            { name: 'Google Cloud Storage', status: 'pending' as const, desc: 'GCP Cloud Storage' },
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

      <SectionCard title="Storage Manager API" description="All file operations go through StorageManager">
        <pre style={{ fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto', backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8, fontFamily: 'monospace', color: 'var(--color-foreground-muted)' }}>
{`// Using default disk
await storage.upload('path/to/file.txt', content, 'public')
const data = await storage.download('path/to/file.txt')
await storage.delete('path/to/file.txt')
await storage.move('from/path', 'to/path')
await storage.copy('from/path', 'to/path')
const exists = await storage.exists('path/to/file.txt')
const url = await storage.temporaryUrl('path/to/file.txt', 3600)

// Using a specific disk
const s3 = storage.disk('s3')
await s3.upload('file.txt', buffer)`}
        </pre>
      </SectionCard>
    </div>
  )
}
