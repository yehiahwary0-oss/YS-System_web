'use client'

import { Globe, Server, Database, Cpu, HardDrive, Shield, Terminal } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Badge } from '@/components/ui/Badge'
import { HealthIndicator } from '@/components/admin/HealthIndicator'

interface EnvRowProps {
  label: string
  value: string
  icon: typeof Globe
  sensitive?: boolean
}

function EnvRow({ label, value, icon: Icon, sensitive }: EnvRowProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid var(--color-border-subtle)' }}>
      <div style={{ width: 32, height: 32, borderRadius: 7, backgroundColor: 'var(--color-background-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={15} style={{ color: 'var(--color-foreground-muted)' }} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.8125rem', fontWeight: 500, color: 'var(--color-foreground-muted)' }}>{label}</div>
        <div style={{ fontSize: '0.875rem', color: 'var(--color-foreground)', fontFamily: 'monospace', marginTop: '0.125rem' }}>
          {sensitive ? '••••••••' : value}
          {sensitive && <span style={{ marginLeft: '0.5rem' }}><Badge variant="warning">Redacted</Badge></span>}
        </div>
      </div>
    </div>
  )
}

export default function EnvironmentPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Environment" subtitle="Platform environment metadata and configuration overview" />

      <SectionCard title="Application" description="Current application environment and runtime information">
        <EnvRow label="Application Environment" value={process.env.NODE_ENV ?? 'unknown'} icon={Globe} />
        <EnvRow label="Application URL" value={process.env.NEXT_PUBLIC_API_URL ?? 'not set'} icon={Globe} />
        <EnvRow label="Node.js Version" value={process.version ?? 'unknown'} icon={Terminal} />
        <EnvRow label="Platform" value={typeof window !== 'undefined' ? navigator.platform : 'Server'} icon={Server} />
      </SectionCard>

      <SectionCard title="System Information" description="Server-side environment metadata (requires backend API)">
        <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--color-foreground-muted)' }}>
          <Server size={28} style={{ margin: '0 auto 0.75rem', opacity: 0.3 }} />
          <p style={{ fontSize: '0.875rem', margin: 0 }}>
            System information requires a backend API endpoint.
          </p>
        </div>
      </SectionCard>

      <SectionCard title="Backend Integration" description="Required backend API contract for environment metadata">
        <pre style={{
          fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto',
          backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8,
          fontFamily: 'monospace', color: 'var(--color-foreground-muted)',
        }}>
{`GET /api/v1/admin/environment → EnvironmentInfo

interface EnvironmentInfo {
  name: string              // "Production" | "Staging" | "Local"
  appEnv: string            // "production" | "local"
  appDebug: boolean
  appUrl: string
  phpVersion?: string
  laravelVersion?: string
  nodeVersion?: string
  database: string          // driver only: "mysql" | "pgsql" | "sqlite"
  cacheDriver: string
  queueDriver: string
  sessionDriver: string
  filesystem: string
}

⚠ NEVER expose: APP_KEY, DB_PASSWORD, API_SECRETS, or any credentials
Required permission: view_environment (to be created)`}
        </pre>
      </SectionCard>
    </div>
  )
}
