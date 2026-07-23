'use client'

import { useEffect, useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

interface AuditLog {
  id: string; action: string; resource_type: string; resource_id: string | null
  user: { name: string; email: string } | null
  ip_address: string | null; created_at: string
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/admin/audit-logs?per_page=50`, { credentials: 'include', headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then(body => { if (body.success) setLogs(body.data) })
      .finally(() => setLoading(false))
  }, [])

  const actionColor = (action: string) => {
    if (action.includes('deleted'))  return '#EF4444'
    if (action.includes('created'))  return '#10B981'
    if (action.includes('updated'))  return 'var(--color-accent)'
    if (action.includes('login'))    return '#8B5CF6'
    return 'var(--color-foreground-muted)'
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h1 className="font-display font-semibold" style={{ fontSize: '1.375rem', color: 'var(--color-foreground)' }}>Audit Logs</h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--color-foreground-muted)', marginTop: '0.125rem' }}>
          Immutable record of all administrative actions
        </p>
      </div>

      <div style={{ borderRadius: '1rem', border: '1px solid var(--color-border)', overflow: 'hidden', backgroundColor: 'var(--color-surface)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8125rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background-subtle)' }}>
                {['Action', 'Resource', 'User', 'IP Address', 'Timestamp'].map(col => (
                  <th key={col} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.7rem', fontWeight: 600, color: 'var(--color-foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-foreground-muted)' }}>Loading...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-foreground-muted)' }}>No audit logs yet.</td></tr>
              ) : logs.map((log) => (
                <tr key={log.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <td style={{ padding: '0.75rem 1rem' }}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', fontWeight: 600, color: actionColor(log.action) }}>
                      {log.action}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--color-foreground-muted)' }}>
                    {log.resource_type}{log.resource_id ? ` #${log.resource_id.slice(0, 8)}` : ''}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--color-foreground)' }}>
                    {log.user?.name ?? <span style={{ color: 'var(--color-foreground-muted)' }}>System</span>}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--color-foreground-muted)', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                    {log.ip_address ?? '—'}
                  </td>
                  <td style={{ padding: '0.75rem 1rem', color: 'var(--color-foreground-muted)', whiteSpace: 'nowrap' }}>
                    {new Date(log.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
