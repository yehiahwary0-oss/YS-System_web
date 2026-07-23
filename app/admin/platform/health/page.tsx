'use client'

import { Activity, Database, Server, Mail, Cpu, Clock, Globe, Layers, Bell, Shield, FileText, Box } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { HealthIndicator, type HealthStatus } from '@/components/admin/HealthIndicator'
import { usePlatform } from '@/lib/platform/PlatformProvider'
import { getDefaultHealthReport } from '@/lib/platform/adapters/health'

const serviceIcons: Record<string, typeof Server> = {
  Database: Database,
  Redis: Cpu,
  Storage: Server,
  Mail: Mail,
  Queue: Clock,
  Scheduler: Clock,
  API: Globe,
  'Platform Kernel': Layers,
  'Service Container': Box,
  'Event Bus': Activity,
  Logger: Server,
  'Health Reporter': Activity,
  'Audit Engine': FileText,
  'Notification Bus': Bell,
}

export default function HealthPage() {
  const { kernel, loaded } = usePlatform()
  const defaultReport = getDefaultHealthReport()

  const healthReporter = loaded && kernel ? kernel.resolve<any>('healthReporter') : null
  const cachedReport = healthReporter?.getCachedReport()

  const checks = cachedReport?.checks ?? defaultReport.checks

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader
        title="System Health"
        subtitle={`Real-time monitoring of all platform services · ${cachedReport ? 'Live data available' : 'Using default configuration'}`}
      />

      <SectionCard title="Service Status" description="Current status of every platform service">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {checks.map((check: { service: string; status: string; lastChecked?: string; latency?: number; message?: string }) => {
            const Icon = serviceIcons[check.service] ?? Server
            return (
              <div key={check.service} style={{
                padding: '1rem 1.25rem', borderRadius: 10,
                border: '1px solid var(--color-border)',
                display: 'flex', alignItems: 'center', gap: '1rem',
              }}>
                <div style={{ width: 38, height: 38, borderRadius: 9, backgroundColor: 'var(--color-background-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={17} style={{ color: 'var(--color-foreground-muted)' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <HealthIndicator
                    status={check.status as HealthStatus}
                    label={check.service}
                    subtitle={check.lastChecked ? `Last checked: ${check.lastChecked}` : undefined}
                  />
                </div>
                {check.latency !== undefined && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)', fontFamily: 'monospace' }}>
                    {check.latency}ms
                  </span>
                )}
              </div>
            )
          })}
        </div>
      </SectionCard>

      <SectionCard title="Infrastructure Services" description="Enterprise core services registered in the ServiceContainer">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {[
            { name: 'Logger', desc: 'Structured logging with levels, transports, and history', loaded: true },
            { name: 'PlatformConfig', desc: 'Configuration management with validation and env loading', loaded: true },
            { name: 'EventBus', desc: 'Publish/subscribe with wildcards, priority, and module isolation', loaded: true },
            { name: 'NotificationBus', desc: 'Multi-channel notification dispatch (email, sms, push, webhook)', loaded: true },
            { name: 'AuditEngine', desc: 'Immutable audit trail for all platform actions', loaded: true },
            { name: 'HealthReporter', desc: 'Health check registration, execution, and caching', loaded: true },
            { name: 'PerformanceMonitor', desc: 'Metric recording, aggregation, and slow-operation detection', loaded: true },
            { name: 'SecurityManager', desc: 'Permission checking, role management, and caching', loaded: true },
            { name: 'FeatureFlagEngine', desc: 'Conditional feature flags (env, role, percentage, date, country, dependency)', loaded: true },
            { name: 'DependencyGraph', desc: 'Module dependency validation, cycle detection, topological sort', loaded: true },
            { name: 'SchedulerRegistry', desc: 'Scheduled task registration, execution, and history', loaded: true },
          ].map(svc => (
            <div key={svc.name} style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.625rem 0.875rem', borderRadius: 8,
              border: '1px solid var(--color-border)',
            }}>
              <HealthIndicator status={svc.loaded ? 'healthy' : 'critical'} label={svc.name} subtitle={svc.desc} />
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Backend Integration" description="Required backend API contract for health monitoring">
        <pre style={{
          fontSize: '0.75rem', lineHeight: 1.6, overflowX: 'auto',
          backgroundColor: 'var(--color-background-subtle)', padding: '1rem', borderRadius: 8,
          fontFamily: 'monospace', color: 'var(--color-foreground-muted)',
        }}>
{`GET /api/v1/admin/health   → { success: true, data: HealthReport }

interface HealthReport {
  status: 'healthy' | 'warning' | 'critical' | 'unknown'
  checks: Array<{
    service: string
    status: 'healthy' | 'warning' | 'critical' | 'unknown'
    latency?: number
    message?: string
    lastChecked?: string
  }>
  uptime?: number
  timestamp: string
}

Required permission: view_health`}
        </pre>
      </SectionCard>
    </div>
  )
}
