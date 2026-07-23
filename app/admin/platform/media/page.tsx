'use client'

import { Image, FolderOpen, Upload, Trash2, Search, Plus } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getDefaultMediaConfig } from '@/lib/platform/adapters/media'

const mockFolders = ['Hero Images', 'Products', 'Team Photos', 'Documents', 'Logos']
const mockRecentFiles = [
  { name: 'hero-banner.jpg', size: '2.4 MB', type: 'image/jpeg', folder: 'Hero Images' },
  { name: 'product-1.png', size: '1.1 MB', type: 'image/png', folder: 'Products' },
  { name: 'team-2026.jpg', size: '3.7 MB', type: 'image/jpeg', folder: 'Team Photos' },
]

export default function MediaPage() {
  const config = getDefaultMediaConfig()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Media Center"
        subtitle="Manage media files, folders, and collections"
        actions={
          <Button variant="primary" size="sm"><Upload size={15} /> Upload</Button>
        }
      />

      <SectionCard title="Configuration" description="Upload policies and thumbnail settings">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: '0.375rem' }}>Max File Size</div>
            <code style={{ fontSize: '0.875rem' }}>{(config.maxFileSize / 1024 / 1024).toFixed(0)} MB</code>
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: '0.375rem' }}>Allowed Types</div>
            <code style={{ fontSize: '0.875rem' }}>{config.allowedMimes.length} mime types</code>
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: '0.375rem' }}>Thumbnails</div>
            <Badge variant={config.generateThumbnails ? 'success' : 'default'}>{config.generateThumbnails ? 'Enabled' : 'Disabled'}</Badge>
          </div>
        </div>
      </SectionCard>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <SectionCard title="Folders" description="Media folders" className="lg:col-span-1" actions={<Button variant="ghost" size="sm"><Plus size={14} /></Button>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            {mockFolders.map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.375rem 0', cursor: 'pointer' }}>
                <FolderOpen size={14} style={{ color: '#F59E0B' }} />
                <span style={{ fontSize: '0.875rem' }}>{f}</span>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="Recent Files" description="Recently uploaded media" className="lg:col-span-2">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {mockRecentFiles.map(f => (
              <div key={f.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', borderRadius: 8, border: '1px solid var(--color-border)' }}>
                <div style={{ width: 36, height: 36, borderRadius: 6, backgroundColor: 'var(--color-background-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image size={16} style={{ color: 'var(--color-foreground-muted)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{f.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{f.size} &middot; {f.folder}</div>
                </div>
                <Button variant="ghost" size="sm"><Trash2 size={13} /></Button>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Backend Integration" description="Required backend API contract for media management">
        <pre style={{
          fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto',
          backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8,
          fontFamily: 'monospace', color: 'var(--color-foreground-muted)',
        }}>
{`GET    /api/v1/admin/media              → { data: MediaItem[], meta: { stats, config } }
POST   /api/v1/admin/media/upload       → { data: MediaItem }
DELETE /api/v1/admin/media/{id}         → { success: true }
GET    /api/v1/admin/media/folders      → { data: MediaFolder[] }
POST   /api/v1/admin/media/folders      → { data: MediaFolder }

Permission: manage_media`}
        </pre>
      </SectionCard>
    </div>
  )
}
