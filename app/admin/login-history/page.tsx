'use client'

import { useState, useEffect } from 'react'
import { PageHeader } from '@/components/admin/PageHeader'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { adminList } from '@/lib/admin/api'

interface LoginEvent {
  id: string
  ip: string
  user_agent: string
  success: boolean
  created_at: string
}

export default function LoginHistoryPage() {
  const [events, setEvents] = useState<LoginEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminList<LoginEvent>('/admin/login-history').then(setEvents).catch(() => setEvents([]))
    .finally(() => setLoading(false))
  }, [])

  const columns: Column<LoginEvent>[] = [
    { key: 'created_at', header: 'Date', render: (e) => <span style={{ fontSize: '0.8125rem' }}>{e.created_at}</span> },
    { key: 'ip', header: 'IP', render: (e) => <span style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{e.ip}</span> },
    { key: 'user_agent', header: 'User Agent', hideOnMobile: true, render: (e) => <span style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{e.user_agent}</span> },
    {
      key: 'success', header: 'Status',
      render: (e) => e.success
        ? <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10B981' }}>Success</span>
        : <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-error)' }}>Failed</span>,
    },
  ]

  return (
    <>
      <PageHeader title="Login History" subtitle="Review all login attempts to your account" />
      <div style={{ borderRadius: '0.875rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', overflow: 'hidden' }}>
        <DataTable columns={columns} data={events} keyField="id" loading={loading} emptyMessage="No login history yet." />
      </div>
    </>
  )
}
