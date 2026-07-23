'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Send, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/admin/Toast'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

interface Update {
  id: string; title_en: string; type: string; is_featured: boolean
  published_at: string | null; created_at: string
}

const typeColors: Record<string, string> = {
  announcement: 'var(--color-accent)', blog: '#10B981', news: '#F59E0B', release: '#8B5CF6',
}

export default function AdminUpdatesPage() {
  const { show } = useToast()
  const [updates, setUpdates] = useState<Update[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState<string | null>(null)

  const fetchUpdates = async () => {
    try {
      const res  = await fetch(`${API}/admin/updates`, { credentials: 'include', headers: { Accept: 'application/json' } })
      const body = await res.json()
      if (body.success) setUpdates(body.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchUpdates() }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    setBusy(id)
    try {
        const res   = await fetch(`${API}/admin/updates/${id}`, { method: 'DELETE', credentials: 'include', headers: { Accept: 'application/json' } })
      const body  = await res.json()
      if (body.success) { show('success', 'Update deleted.'); fetchUpdates() }
      else show('error', body.message ?? 'Delete failed. Unpublish first if needed.')
    } catch { show('error', 'Network error.') }
    setBusy(null)
  }

  const handleUnpublish = async (id: string) => {
    setBusy(id)
    try {
        const res   = await fetch(`${API}/admin/updates/${id}/unpublish`, { method: 'POST', credentials: 'include', headers: { Accept: 'application/json' } })
      const body  = await res.json()
      if (body.success) { show('success', 'Update unpublished.'); fetchUpdates() }
    } catch { show('error', 'Network error.') }
    setBusy(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-display font-semibold" style={{ fontSize: '1.375rem', color: 'var(--color-foreground)' }}>Updates</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-foreground-muted)', marginTop: '0.125rem' }}>Manage announcements and news</p>
        </div>
        <Link href="/admin/updates/new">
          <Button variant="primary" size="sm"><Plus size={16} /> New Update</Button>
        </Link>
      </div>

      <div style={{ borderRadius: '1rem', border: '1px solid var(--color-border)', overflow: 'hidden', backgroundColor: 'var(--color-surface)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background-subtle)' }}>
                {['Title', 'Type', 'Status', 'Created', 'Actions'].map(col => (
                  <th key={col} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-foreground-muted)' }}>Loading...</td></tr>
              ) : updates.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-foreground-muted)' }}>
                  No updates yet. <Link href="/admin/updates/new" style={{ color: 'var(--color-accent)' }}>Create one →</Link>
                </td></tr>
              ) : updates.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--color-border)' }} className="hover:bg-background-subtle">
                  <td style={{ padding: '0.875rem 1rem', fontWeight: 500, color: 'var(--color-foreground)' }}>
                    {u.title_en} {u.is_featured && <span style={{ color: '#F59E0B' }}>★</span>}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.15rem 0.5rem', borderRadius: 9999, backgroundColor: `${typeColors[u.type]}18`, color: typeColors[u.type], textTransform: 'uppercase' }}>
                      {u.type}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: u.published_at ? '#10B981' : 'var(--color-foreground-muted)' }}>
                      {u.published_at ? '🟢 Published' : '⚪ Draft'}
                    </span>
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: 'var(--color-foreground-muted)', fontSize: '0.8125rem' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Link href={`/admin/updates/${u.id}`} style={{ padding: '0.375rem', borderRadius: 6, color: 'var(--color-foreground-muted)', display: 'flex' }}><Pencil size={15} /></Link>
                      {u.published_at && (
                        <button onClick={() => handleUnpublish(u.id)} disabled={busy === u.id} style={{ padding: '0.375rem', borderRadius: 6, border: 'none', cursor: 'pointer', backgroundColor: 'transparent', color: 'var(--color-foreground-muted)' }} title="Unpublish">
                          <EyeOff size={15} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(u.id, u.title_en)} disabled={busy === u.id} style={{ padding: '0.375rem', borderRadius: 6, border: 'none', cursor: 'pointer', backgroundColor: 'transparent', color: 'var(--color-error)' }}>
                        <Trash2 size={15} />
                      </button>
                    </div>
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
