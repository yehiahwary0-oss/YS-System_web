'use client'

import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { adminList } from '@/lib/admin/api'

interface Session {
  id: string
  ip: string
  user_agent: string
  last_active: string
  is_current: boolean
}

export default function SessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminList<Session>('/admin/sessions').then(setSessions).catch(() => setSessions([]))
    .finally(() => setLoading(false))
  }, [])

  const columns: Column<Session>[] = [
    { key: 'ip', header: 'IP', render: (s) => <span style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{s.ip}</span> },
    { key: 'user_agent', header: 'User Agent', hideOnMobile: true, render: (s) => <span style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)', maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'inline-block' }}>{s.user_agent}</span> },
    { key: 'last_active', header: 'Last Active', render: (s) => <span style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>{s.last_active}</span> },
    {
      key: 'is_current', header: '',
      render: (s) => s.is_current ? <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#10B981' }}>Current</span> : null,
    },
    {
      key: 'actions', header: '',
      render: (s) => s.is_current ? null : (
        <button style={{ padding: '0.375rem', borderRadius: 6, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: 'var(--color-foreground-muted)' }} aria-label="Terminate session"><Trash2 size={14} /></button>
      ),
    },
  ]

  return (
    <>
      <PageHeader title="Active Sessions" subtitle="Manage your active login sessions" />
      <div style={{ borderRadius: '0.875rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', overflow: 'hidden' }}>
        <DataTable columns={columns} data={sessions} keyField="id" loading={loading} emptyMessage="No sessions found." />
      </div>
    </>
  )
}
