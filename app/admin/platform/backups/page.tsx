'use client'

import { Database, Image, Settings, Package, HardDrive, Download, Trash2, RotateCcw } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { getDefaultBackupConfig } from '@/lib/platform/adapters/backups'

const backupTypes = [
  { key: 'database', label: 'Database', icon: Database, color: '#3B82F6' },
  { key: 'media', label: 'Media', icon: Image, color: '#EC4899' },
  { key: 'settings', label: 'Settings', icon: Settings, color: '#14B8A6' },
  { key: 'modules', label: 'Modules', icon: Package, color: '#8B5CF6' },
  { key: 'full', label: 'Full System', icon: HardDrive, color: '#F59E0B' },
]

export default function BackupsPage() {
  const config = getDefaultBackupConfig()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Backup Center" subtitle="Manage platform backups and restore points" />

      <SectionCard title="Backup Configuration" description="Automatic backup settings. Backend API integration required for persistence.">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: '0.375rem' }}>Schedule</div>
            <code style={{ fontSize: '0.875rem', color: 'var(--color-foreground)' }}>{config.schedule}</code>
          </div>
          <div>
            <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-foreground-muted)', marginBottom: '0.375rem' }}>Retention</div>
            <code style={{ fontSize: '0.875rem', color: 'var(--color-foreground)' }}>{config.retention} days</code>
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Available Backup Types" description="Select the data types to include in backups">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {backupTypes.map(bt => (
            <div key={bt.key} style={{
              padding: '1rem', borderRadius: 10, border: '1px solid var(--color-border)',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              opacity: config.types.includes(bt.key) ? 1 : 0.5,
            }}>
              <div style={{ width: 34, height: 34, borderRadius: 8, backgroundColor: `${bt.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <bt.icon size={16} style={{ color: bt.color }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-foreground)' }}>{bt.label}</div>
                <Badge variant={config.types.includes(bt.key) ? 'success' : 'default'}>
                  {config.types.includes(bt.key) ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard
        title="Backup History"
        description="Recent backups will appear here once the backup system is implemented."
        actions={<Button variant="primary" size="sm"><HardDrive size={14} /> Create Backup</Button>}
      >
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-foreground-muted)' }}>
          <HardDrive size={28} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
          <p style={{ fontSize: '0.875rem', margin: 0 }}>No backups recorded yet.</p>
        </div>
      </SectionCard>

      <SectionCard title="Backend Integration" description="Required backend API contract for backup management">
        <pre style={{
          fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto',
          backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8,
          fontFamily: 'monospace', color: 'var(--color-foreground-muted)',
        }}>
{`GET    /api/v1/admin/backups             → List backups + config
POST   /api/v1/admin/backups             → Create new backup
POST   /api/v1/admin/backups/{id}/restore → Restore from backup
DELETE /api/v1/admin/backups/{id}         → Delete backup

Required permission: manage_backups (to be created)
Backend: BackupController, Backup model, Backup job/engine`}
        </pre>
      </SectionCard>
    </div>
  )
}
