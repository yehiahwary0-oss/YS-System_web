'use client'

import { Wrench, CheckCircle, ArrowRight, Settings, Database, Globe, Mail, Shield, Clock } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const steps = [
  { name: 'Platform Information', status: 'completed' as const, icon: Globe },
  { name: 'Database', status: 'completed' as const, icon: Database },
  { name: 'Redis', status: 'completed' as const, icon: Settings },
  { name: 'Mail', status: 'completed' as const, icon: Mail },
  { name: 'Storage', status: 'completed' as const, icon: Shield },
  { name: 'Admin Account', status: 'pending' as const, icon: Globe },
  { name: 'Localization', status: 'pending' as const, icon: Clock },
  { name: 'Confirmation', status: 'pending' as const, icon: CheckCircle },
]

export default function InstallationPage() {
  const completed = steps.filter(s => s.status === 'completed').length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Installation Wizard"
        subtitle="First-install setup and platform configuration"
      />

      <SectionCard title="Setup Progress" description={`${completed} of ${steps.length} steps completed`}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ flex: 1, height: 8, borderRadius: 4, backgroundColor: 'var(--color-background-subtle)' }}>
            <div style={{ width: `${(completed / steps.length) * 100}%`, height: '100%', borderRadius: 4, backgroundColor: '#22C55E', transition: 'width 0.3s' }} />
          </div>
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-foreground-muted)' }}>
            {Math.round((completed / steps.length) * 100)}%
          </span>
        </div>
      </SectionCard>

      <SectionCard title="Installation Steps" description="Guided setup wizard">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {steps.map((s, i) => (
            <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem', borderRadius: 8, border: '1px solid var(--color-border)', opacity: s.status === 'pending' ? 0.5 : 1 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: s.status === 'completed' ? 'rgba(34,197,94,0.12)' : 'var(--color-background-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {s.status === 'completed' ? <CheckCircle size={14} style={{ color: '#22C55E' }} /> : <s.icon size={14} style={{ color: 'var(--color-foreground-muted)' }} />}
              </div>
              <span style={{ fontSize: '0.875rem', fontWeight: 500, flex: 1 }}>{s.name}</span>
              <Badge variant={s.status === 'completed' ? 'success' : 'default'}>{s.status}</Badge>
              {i < steps.length - 1 && <ArrowRight size={12} style={{ color: 'var(--color-foreground-muted)' }} />}
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Post-Installation" description="What happens after the wizard completes">
        <ul style={{ fontSize: '0.875rem', lineHeight: 1.8, margin: 0, paddingLeft: '1.25rem' }}>
          <li>Environment configuration is generated</li>
          <li>Database tables are migrated</li>
          <li>Administrator account is created</li>
          <li>Platform manifest is initialized</li>
          <li>Health endpoints become operational</li>
          <li>Platform Center is ready for management</li>
        </ul>
      </SectionCard>
    </div>
  )
}
