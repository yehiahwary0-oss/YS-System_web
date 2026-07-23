'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { StatCard } from '@/components/admin/StatCard'
import { DashboardWidget } from '@/components/admin/DashboardWidget'
import { useAuth } from '@/components/admin/PermissionGate'
import { usePlatform } from '@/lib/platform/PlatformProvider'
import type { WidgetDefinition } from '@/lib/platform/registries/WidgetRegistry'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'
const fetchOpts: RequestInit = { credentials: 'include', headers: { Accept: 'application/json' } }

const quickLinks = [
  { label: 'Add Product',  href: '/admin/products',  icon: FileText, permission: 'manage_products' },
  { label: 'Static Pages', href: '/admin/static-pages', icon: FileText, permission: 'manage_static_pages' },
  { label: 'FAQ',          href: '/admin/faq',       icon: FileText, permission: 'manage_faqs' },
  { label: 'Menus',        href: '/admin/menus',     icon: FileText, permission: 'manage_menus' },
  { label: 'Homepage',     href: '/admin/homepage',  icon: FileText, permission: 'manage_homepage' },
  { label: 'View Settings',href: '/admin/settings',  icon: FileText },
]

export default function DashboardPage() {
  const [statValues, setStatValues] = useState<Record<string, number>>({})
  const [loading, setLoading] = useState(true)
  const { user, hasPermission } = useAuth()
  const { kernel, loaded: platformLoaded } = usePlatform()

  const widgets: WidgetDefinition[] = platformLoaded && kernel
    ? kernel.getRegistry('widgets').getFilteredWidgets(hasPermission)
    : []

  useEffect(() => {
    if (widgets.length === 0) {
      setLoading(false)
      return
    }

    Promise.allSettled(
      widgets.map(w =>
        fetch(`${API}/admin/${w.id}`, fetchOpts).then(r => r.json())
      )
    ).then(results => {
      const values: Record<string, number> = {}
      results.forEach((r, i) => {
        if (r.status === 'fulfilled') {
          values[widgets[i].id] = r.value.meta?.total ?? r.value.data?.length ?? 0
        } else {
          values[widgets[i].id] = 0
        }
      })
      setStatValues(values)
      setLoading(false)
    })
  }, [widgets.length])

  const visibleLinks = quickLinks.filter(l => !l.permission || hasPermission(l.permission))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 className="font-display font-semibold" style={{ fontSize: '1.5rem', color: 'var(--color-foreground)', marginBottom: '0.25rem' }}>
          {loading ? 'Loading...' : `Welcome back${user ? `, ${user.name.split(' ')[0]}` : ''}!`}
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-foreground-muted)' }}>
          {user ? `${user.role.name} · YS Systems & Software` : 'YS Systems & Software Admin Panel'}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {widgets.map(w => (
          <StatCard
            key={w.id}
            label={w.title}
            value={loading ? '—' : (statValues[w.id] ?? 0)}
            icon={w.icon}
            color={w.color}
          />
        ))}
      </div>

      <DashboardWidget title="Quick Actions" description="Common management tasks">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {visibleLinks.map(({ label, href, icon: Icon }) => (
            <Link key={label} href={href} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.75rem 1rem', borderRadius: 8, border: '1px solid var(--color-border)', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-foreground-muted)', textDecoration: 'none', transition: 'all 150ms' }}
              className="hover:text-foreground hover:border-border-strong hover:bg-background-subtle">
              <Icon size={15} />
              {label}
            </Link>
          ))}
        </div>
      </DashboardWidget>

      <DashboardWidget title="System Status">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981', boxShadow: '0 0 0 3px rgba(16,185,129,0.2)' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-foreground)' }}>All systems operational</span>
          </div>
          <Link href="/en/status" style={{ fontSize: '0.8125rem', color: 'var(--color-accent)', textDecoration: 'none' }}>
            View Status Page →
          </Link>
        </div>
      </DashboardWidget>
    </div>
  )
}
