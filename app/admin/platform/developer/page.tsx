'use client'

import { Code, Server, Box, HardDrive, Mail, Search, Terminal, Cpu, Activity, Wrench, Database, Globe, Shield, LayoutDashboard, Flag, Settings } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { StatusDot } from '@/components/admin/StatusDot'
import { usePlatform } from '@/lib/platform/PlatformProvider'

export default function DeveloperCenterPage() {
  const { kernel, loaded } = usePlatform()

  const container = loaded && kernel ? kernel.getContainer() : null
  const services = container?.getRegisteredIds() ?? []
  const commandBus = container?.resolve<any>('commandBus')
  const queryBus = container?.resolve<any>('queryBus')
  const driverReg = container?.resolve<any>('driverRegistry')

  const sections = [
    {
      label: 'Bus Systems',
      icon: Terminal,
      color: '#8B5CF6',
      items: [
        { name: 'Command Bus', desc: `${commandBus?.getRegisteredTypes().length ?? 0} handlers · ${commandBus?.getMiddlewareCount() ?? 0} middleware`, status: commandBus ? 'implemented' : 'pending' as const, href: '/admin/platform/commands' },
        { name: 'Query Bus', desc: `${queryBus?.getRegisteredTypes().length ?? 0} handlers · ${queryBus?.getMiddlewareCount() ?? 0} middleware`, status: queryBus ? 'implemented' : 'pending' as const, href: '/admin/platform/queries' },
      ],
    },
    {
      label: 'Data Layer',
      icon: Server,
      color: '#3B82F6',
      items: [
        { name: 'Cache Manager', desc: 'Memory, Null drivers', status: 'implemented' as const, href: '/admin/platform/cache' },
        { name: 'Storage Manager', desc: 'Local driver', status: 'implemented' as const, href: '/admin/platform/storage' },
      ],
    },
    {
      label: 'Communication',
      icon: Mail,
      color: '#EC4899',
      items: [
        { name: 'Mail Manager', desc: 'SMTP driver', status: 'implemented' as const, href: '/admin/platform/mail' },
        { name: 'Search Engine', desc: 'Database driver', status: 'implemented' as const, href: '/admin/platform/search' },
        { name: 'Notification Bus', desc: 'Multi-channel', status: 'implemented' as const, href: '/admin/platform/events' },
        { name: 'Event Bus', desc: 'Pub/sub with wildcards', status: 'implemented' as const, href: '/admin/platform/events' },
      ],
    },
    {
      label: 'Orchestration',
      icon: Cpu,
      color: '#F97316',
      items: [
        { name: 'Middleware Pipeline', desc: 'Reusable by commands, queries, HTTP', status: 'implemented' as const, href: '/admin/platform/pipeline' },
        { name: 'Module Generator', desc: 'Auto-generate module scaffolds', status: 'implemented' as const, href: '/admin/platform/generator' },
        { name: 'Driver Registry', desc: `${driverReg?.count() ?? 0} registered drivers`, status: 'implemented' as const, href: '/admin/platform/drivers' },
      ],
    },
    {
      label: 'SDK & CLI',
      icon: Code,
      color: '#14B8A6',
      items: [
        { name: 'Product SDK', desc: 'createProduct() builder API', status: 'implemented' as const, href: '/admin/platform/sdk' },
        { name: 'CLI Foundation', desc: '16 commands architected', status: 'implemented' as const, href: '/admin/platform/generator' },
      ],
    },
    {
      label: 'Observability',
      icon: Activity,
      color: '#F59E0B',
      items: [
        { name: 'Observability Manager', desc: 'Execution metrics, slow ops, error rates', status: 'implemented' as const, href: '/admin/platform/health' },
        { name: 'Service Container', desc: `${services.length} registered services`, status: 'implemented' as const, href: '/admin/platform/registries' },
      ],
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <PageHeader title="Developer Center" subtitle="Enterprise platform architecture — every subsystem at a glance" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sections.map(section => (
          <SectionCard key={section.label} title={
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <section.icon size={16} style={{ color: section.color }} />
              <span>{section.label}</span>
            </div>
          }>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {section.items.map(item => (
                <a key={item.name} href={item.href}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0', textDecoration: 'none', borderBottom: '1px solid var(--color-border-subtle)' }}>
                  <StatusDot status={item.status === 'implemented' ? 'active' : 'inactive'} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--color-foreground)' }}>{item.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{item.desc}</div>
                  </div>
                </a>
              ))}
            </div>
          </SectionCard>
        ))}
      </div>
    </div>
  )
}
