'use client'

import { useState } from 'react'
import { Shield, Save, X } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Button } from '@/components/ui/Button'
import { Field, Input, Textarea, Checkbox } from '@/components/admin/FormElements'
import { useToast } from '@/components/admin/Toast'
import { getDefaultMaintenanceConfig } from '@/lib/platform/adapters/maintenance'

export default function MaintenancePage() {
  const { show } = useToast()
  const config = getDefaultMaintenanceConfig()
  const [enabled, setEnabled] = useState(config.enabled)
  const [message, setMessage] = useState(config.message)
  const [allowedIps, setAllowedIps] = useState(config.allowedIps.join(', '))

  const handleSave = () => {
    show('success', 'Maintenance settings updated. (Backend integration required for persistence.)')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Maintenance Center"
        subtitle="Control platform maintenance mode"
        actions={
          <Button variant="primary" size="sm" onClick={handleSave}>
            <Save size={15} /> Save Settings
          </Button>
        }
      />

      <SectionCard title="Maintenance Mode">
        <Checkbox
          label="Enable maintenance mode"
          checked={enabled}
          onChange={e => setEnabled(e.target.checked)}
        />

        {enabled && (
          <div style={{ padding: '1rem', borderRadius: 8, backgroundColor: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield size={18} style={{ color: '#F59E0B', flexShrink: 0 }} />
            <span style={{ fontSize: '0.8125rem', color: '#92400E' }}>
              Maintenance mode is currently active. Only administrators and allowed IPs can access the platform.
            </span>
          </div>
        )}
      </SectionCard>

      <SectionCard title="Maintenance Message">
        <Field label="Public message" hint="Shown to users when maintenance mode is active">
          <Textarea
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={3}
          />
        </Field>
      </SectionCard>

      <SectionCard title="Access Control">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Checkbox label="Allow administrators" checked={true} onChange={() => {}} />
          <Field label="Allowed IP addresses (comma-separated)">
            <Input
              value={allowedIps}
              onChange={e => setAllowedIps(e.target.value)}
              placeholder="192.168.1.1, 10.0.0.0/8"
              style={{ fontFamily: 'monospace' }}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Backend Integration" description="Required backend API contract for maintenance mode">
        <pre style={{
          fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto',
          backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8,
          fontFamily: 'monospace', color: 'var(--color-foreground-muted)',
        }}>
{`GET  /api/v1/admin/maintenance   → { success: true, data: MaintenanceConfig }
PUT  /api/v1/admin/maintenance   → { success: true, data: MaintenanceConfig }

interface MaintenanceConfig {
  enabled: boolean
  message: string
  allowedAdmins: boolean
  allowedIps: string[]
  estimatedCompletion?: string  // ISO 8601
}

Required permission: manage_maintenance (to be created)
Backend: MaintenanceController + MaintenanceMiddleware`}
        </pre>
      </SectionCard>
    </div>
  )
}
