'use client'

import { HeartPulse, Shield, Clock, CheckCircle, Play, RotateCcw, AlertTriangle, ListChecks } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const mockPlans = [
  { name: 'Full System Recovery', steps: 8, rto: '4 hours', rpo: '1 hour', status: 'verified' as const },
  { name: 'Database Only', steps: 4, rto: '30 min', rpo: '5 min', status: 'verified' as const },
  { name: 'Storage Recovery', steps: 5, rto: '2 hours', rpo: '15 min', status: 'draft' as const },
]

export default function RecoveryPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="Disaster Recovery"
        subtitle="Recovery plans, backup verification, and disaster simulation"
        actions={<Button variant="primary" size="sm"><ListChecks size={15} /> Run Simulation</Button>}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <SectionCard>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)', fontWeight: 500, marginBottom: '0.375rem' }}>Recovery Plans</div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>3</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>2 verified &middot; 1 draft</div>
          </div>
        </SectionCard>
        <SectionCard>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)', fontWeight: 500, marginBottom: '0.375rem' }}>Last Simulation</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#22C55E' }}>Passed</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>2026-07-14 &middot; 3.2s duration</div>
          </div>
        </SectionCard>
        <SectionCard>
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)', fontWeight: 500, marginBottom: '0.375rem' }}>Backup Verification</div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>12</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>All verified &middot; 0 failures</div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="Recovery Plans" description="Defined disaster recovery plans">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {mockPlans.map(p => (
            <div key={p.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 8, border: '1px solid var(--color-border)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(236,72,153,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HeartPulse size={16} style={{ color: '#EC4899' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>{p.name}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>
                  {p.steps} steps &middot; RTO: {p.rto} &middot; RPO: {p.rpo}
                </div>
              </div>
              <Badge variant={p.status === 'verified' ? 'success' : 'default'}>{p.status}</Badge>
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <Button variant="ghost" size="sm"><Play size={13} /></Button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Backend Integration" description="Required backend API contract for disaster recovery">
        <pre style={{
          fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto',
          backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8,
          fontFamily: 'monospace', color: 'var(--color-foreground-muted)',
        }}>
{`GET    /api/v1/admin/recovery/plans  → { data: RecoveryPlan[] }
GET    /api/v1/admin/recovery/plans/{id} → { data: RecoveryPlan }
POST   /api/v1/admin/recovery/plans   → { data: RecoveryPlan }
POST   /api/v1/admin/recovery/plans/{id}/simulate → { data: RecoveryExecution }
POST   /api/v1/admin/recovery/plans/{id}/execute  → { data: RecoveryExecution }
GET    /api/v1/admin/recovery/backups/verify  → { data: BackupVerification[] }

Permission: manage_recovery`}
        </pre>
      </SectionCard>
    </div>
  )
}
