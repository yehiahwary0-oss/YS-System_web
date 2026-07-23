'use client'

import { Puzzle, Navigation, Shield, LayoutDashboard, Settings, Search, Globe, Flag, Activity, Server, Bell, FileText, Eye, Zap, Lock, Box, Wrench, Clock } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { StatCard } from '@/components/admin/StatCard'
import { DashboardWidget } from '@/components/admin/DashboardWidget'
import { usePlatform } from '@/lib/platform/PlatformProvider'
import { useAuth } from '@/components/admin/PermissionGate'
import { HealthIndicator } from '@/components/admin/HealthIndicator'

export default function PlatformOverviewPage() {
  const { kernel, loaded } = usePlatform()
  const { user } = useAuth()

  const navReg = loaded && kernel ? kernel.getRegistry('navigation') : null
  const permReg = loaded && kernel ? kernel.getRegistry('permissions') : null
  const widgetReg = loaded && kernel ? kernel.getRegistry('widgets') : null
  const settingsReg = loaded && kernel ? kernel.getRegistry('settings') : null
  const searchReg = loaded && kernel ? kernel.getRegistry('search') : null
  const seoReg = loaded && kernel ? kernel.getRegistry('seo') : null
  const flagReg = loaded && kernel ? kernel.getRegistry('featureFlags') : null
  const schedReg = loaded && kernel ? kernel.getRegistry('scheduler') : null
  const modules = loaded && kernel ? kernel.getModules() : []

  const container = loaded && kernel ? kernel.getContainer() : null
  const logger = loaded && kernel ? kernel.resolve<any>('logger') : null
  const config = loaded && kernel ? kernel.resolve<any>('config') : null
  const eventBus = loaded && kernel ? kernel.resolve<any>('eventBus') : null
  const healthReporter = loaded && kernel ? kernel.resolve<any>('healthReporter') : null
  const auditEngine = loaded && kernel ? kernel.resolve<any>('auditEngine') : null
  const perfMonitor = loaded && kernel ? kernel.resolve<any>('performanceMonitor') : null
  const notificationBus = loaded && kernel ? kernel.resolve<any>('notificationBus') : null
  const ffEngine = loaded && kernel ? kernel.resolve<any>('featureFlagEngine') : null
  const depGraph = loaded && kernel ? kernel.resolve<any>('dependencyGraph') : null
  const securityManager = loaded && kernel ? kernel.resolve<any>('securityManager') : null

  const stats = [
    { label: 'Modules', value: modules.length, icon: Puzzle, color: '#8B5CF6' },
    { label: 'Nav Items', value: navReg?.getGroups().reduce((s, g) => s + g.items.length, 0) ?? 0, icon: Navigation, color: '#3B82F6' },
    { label: 'Permissions', value: permReg?.getAllKeys().length ?? 0, icon: Shield, color: '#EC4899' },
    { label: 'Widgets', value: widgetReg?.getWidgets().length ?? 0, icon: LayoutDashboard, color: '#F97316' },
    { label: 'Sections', value: settingsReg?.getSections().length ?? 0, icon: Settings, color: '#14B8A6' },
    { label: 'Search', value: searchReg?.getProviders().length ?? 0, icon: Search, color: '#06B6D4' },
    { label: 'SEO', value: seoReg?.getContributions().length ?? 0, icon: Globe, color: '#10B981' },
    { label: 'Flags', value: flagReg?.getFlags().length ?? 0, icon: Flag, color: '#F59E0B' },
    { label: 'Scheduled Tasks', value: schedReg?.getAllTasks().length ?? 0, icon: Clock, color: '#6366F1' },
    { label: 'Feature Flags (Engine)', value: ffEngine?.getAllFlags().length ?? 0, icon: Flag, color: '#A855F7' },
    { label: 'Audit Entries', value: auditEngine?.count() ?? 0, icon: FileText, color: '#84CC16' },
    { label: 'Event History', value: eventBus?.getHistory().length ?? 0, icon: Activity, color: '#EAB308' },
    { label: 'Health Checks', value: healthReporter?.getRegisteredChecks().length ?? 0, icon: Eye, color: '#22D3EE' },
    { label: 'Services', value: container?.getRegisteredIds().length ?? 0, icon: Box, color: '#F472B6' },
    { label: 'Metrics', value: perfMonitor?.getMetricNames().length ?? 0, icon: Zap, color: '#FB923C' },
    { label: 'Log Entries', value: logger?.getHistory().length ?? 0, icon: Server, color: '#38BDF8' },
    { label: 'Dependency Nodes', value: depGraph?.getNodeCount() ?? 0, icon: Navigation, color: '#A78BFA' },
    { label: 'Roles', value: securityManager?.getRoles().length ?? 0, icon: Lock, color: '#FB7185' },
    { label: 'Notifications Sent', value: notificationBus?.getHistory().length ?? 0, icon: Bell, color: '#34D399' },
    { label: 'Config Keys', value: config?.getAll().length ?? 0, icon: Wrench, color: '#2DD4BF' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <PageHeader
          title="Platform Overview"
          subtitle="Enterprise platform management center — monitor and manage the entire ecosystem"
        />
        <div style={{ marginTop: '-0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <HealthIndicator status={loaded ? 'healthy' : 'unknown'} label={`Kernel: ${loaded ? 'Running' : 'Initializing...'}`} size="sm" />
          <HealthIndicator status={container ? 'healthy' : 'unknown'} label={`Container: ${container ? `${container.getRegisteredIds().length} services` : 'N/A'}`} size="sm" />
          {loaded && <HealthIndicator status="healthy" label={`Booted: ${kernel!.isBooted() ? 'Yes' : 'No'}`} size="sm" />}
          <span style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>
            {user ? `Authenticated as ${user.name}` : ''}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {stats.map(s => (
          <StatCard key={s.label} label={s.label} value={loaded ? s.value : '—'} icon={s.icon} color={s.color} />
        ))}
      </div>

      <DashboardWidget title="Platform Sections" description="Manage every aspect of the platform ecosystem">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { label: 'Module Manager', href: '/admin/platform/modules', icon: Puzzle, color: '#8B5CF6', desc: 'Install, enable, configure modules' },
            { label: 'Registry Inspector', href: '/admin/platform/registries', icon: Activity, color: '#14B8A6', desc: 'Inspect all platform registries' },
            { label: 'System Health', href: '/admin/platform/health', icon: Eye, color: '#10B981', desc: 'Monitor system services' },
            { label: 'Version Center', href: '/admin/platform/versions', icon: Flag, color: '#3B82F6', desc: 'Track platform and module versions' },
            { label: 'Event Center', href: '/admin/platform/events', icon: Activity, color: '#F59E0B', desc: 'Event bus history and monitoring' },
            { label: 'Dependencies', href: '/admin/platform/dependencies', icon: Navigation, color: '#A78BFA', desc: 'Module dependency graph' },
            { label: 'Maintenance', href: '/admin/platform/maintenance', icon: Settings, color: '#EC4899', desc: 'Maintenance mode controls' },
            { label: 'Backups', href: '/admin/platform/backups', icon: Wrench, color: '#F97316', desc: 'Backup and restore data' },
            { label: 'Environment', href: '/admin/platform/environment', icon: Globe, color: '#06B6D4', desc: 'Environment metadata' },
          ].map(s => (
            <a key={s.label} href={s.href}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '1rem',
                borderRadius: 10, border: '1px solid var(--color-border)',
                textDecoration: 'none', transition: 'all 150ms',
              }}
              className="hover:border-border-strong hover:bg-background-subtle"
            >
              <div style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: `${s.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
              <div>
                <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-foreground)' }}>{s.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)', marginTop: '0.125rem' }}>{s.desc}</div>
              </div>
            </a>
          ))}
        </div>
      </DashboardWidget>
    </div>
  )
}
