'use client'

import { useState, useEffect } from 'react'
import { Bell, CheckCheck, Trash2, Info, AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Button } from '@/components/ui/Button'
import { adminList } from '@/lib/admin/api'

interface Notification {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  read: boolean
  created_at: string
}

const typeConfig: Record<string, { icon: typeof Bell; color: string }> = {
  info:    { icon: Info,          color: '#3B82F6' },
  warning: { icon: AlertTriangle, color: '#F59E0B' },
  error:   { icon: AlertCircle,   color: '#EF4444' },
  success: { icon: CheckCircle,   color: '#10B981' },
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminList<Notification>('/admin/notifications').then(setNotifications).catch(() => setNotifications([]))
    .finally(() => setLoading(false))
  }, [])

  const unreadCount = notifications.filter(n => !n.read).length

  const markAllRead = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/notifications/read-all`, { method: 'POST', credentials: 'include', headers: { Accept: 'application/json' } })
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    } catch {}
  }

  return (
    <>
      <PageHeader
        title="Notification Center"
        subtitle={`${unreadCount} unread notification(s)`}
        actions={unreadCount > 0 ? (
          <Button variant="secondary" size="sm" onClick={markAllRead}><CheckCheck size={15} /> Mark All Read</Button>
        ) : undefined}
      />
      <div style={{ maxWidth: '40rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {loading && <p style={{ fontSize: '0.875rem', color: 'var(--color-foreground-muted)', padding: '2rem', textAlign: 'center' }}>Loading...</p>}
        {!loading && notifications.length === 0 && (
          <SectionCard>
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--color-foreground-muted)' }}>
              <Bell size={32} style={{ margin: '0 auto 0.75rem', opacity: 0.4 }} />
              <p style={{ fontSize: '0.875rem' }}>No notifications yet.</p>
            </div>
          </SectionCard>
        )}
        {notifications.map(n => {
          const cfg = typeConfig[n.type] ?? typeConfig.info
          const Icon = cfg.icon
          return (
            <div key={n.id} style={{
              padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--color-border)',
              backgroundColor: n.read ? 'var(--color-surface)' : 'var(--color-background-subtle)',
              display: 'flex', gap: '0.75rem', transition: 'all 150ms',
            }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: `${cfg.color}14`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={16} style={{ color: cfg.color }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: n.read ? 400 : 600 }}>{n.title}</span>
                  {!n.read && <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-accent)', flexShrink: 0 }} />}
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)', margin: 0 }}>{n.message}</p>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)', opacity: 0.6 }}>{n.created_at}</span>
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}
