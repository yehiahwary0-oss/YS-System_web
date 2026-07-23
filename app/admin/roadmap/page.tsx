'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/admin/Toast'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

interface RoadmapItem {
  id: string; title_en: string; status: string; priority: string
  target_quarter: string | null; is_public: boolean
  product: { name_en: string } | null
}

const statusStyle: Record<string, { bg: string; color: string }> = {
  planned:     { bg: 'var(--color-background-muted)', color: 'var(--color-foreground-muted)' },
  in_progress: { bg: 'rgba(99,102,241,0.1)', color: 'var(--color-accent)' },
  completed:   { bg: 'rgba(16,185,129,0.1)', color: '#10B981' },
  cancelled:   { bg: 'rgba(239,68,68,0.1)', color: '#EF4444' },
}

export default function AdminRoadmapPage() {
  const { show } = useToast()
  const [items, setItems] = useState<RoadmapItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchItems = async () => {
    try {
      const res  = await fetch(`${API}/admin/roadmap`, { credentials: 'include', headers: { Accept: 'application/json' } })
      const body = await res.json()
      if (body.success) setItems(body.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchItems() }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    setDeleting(id)
    try {
        const res   = await fetch(`${API}/admin/roadmap/${id}`, { method: 'DELETE', credentials: 'include', headers: { Accept: 'application/json' } })
      const body  = await res.json()
      if (body.success) { show('success', 'Item deleted.'); fetchItems() }
      else show('error', body.message ?? 'Delete failed.')
    } catch { show('error', 'Network error.') }
    setDeleting(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-display font-semibold" style={{ fontSize: '1.375rem', color: 'var(--color-foreground)' }}>Roadmap</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-foreground-muted)', marginTop: '0.125rem' }}>Manage public roadmap items</p>
        </div>
        <Link href="/admin/roadmap/new">
          <Button variant="primary" size="sm"><Plus size={16} /> Add Item</Button>
        </Link>
      </div>

      <div style={{ borderRadius: '1rem', border: '1px solid var(--color-border)', overflow: 'hidden', backgroundColor: 'var(--color-surface)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background-subtle)' }}>
                {['Title', 'Product', 'Status', 'Priority', 'Visibility', 'Actions'].map(col => (
                  <th key={col} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-foreground-muted)' }}>Loading...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-foreground-muted)' }}>
                  No roadmap items yet. <Link href="/admin/roadmap/new" style={{ color: 'var(--color-accent)' }}>Create one →</Link>
                </td></tr>
              ) : items.map((item) => {
                const style = statusStyle[item.status] ?? statusStyle.planned
                return (
                  <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }} className="hover:bg-background-subtle">
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 500, color: 'var(--color-foreground)' }}>{item.title_en}</td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--color-foreground-muted)' }}>{item.product?.name_en ?? '— Company —'}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0.2rem 0.625rem', borderRadius: 9999, backgroundColor: style.bg, color: style.color }}>
                        {item.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--color-foreground-muted)', textTransform: 'capitalize' }}>{item.priority}</td>
                    <td style={{ padding: '0.875rem 1rem', color: item.is_public ? '#10B981' : 'var(--color-foreground-muted)' }}>
                      {item.is_public ? 'Public' : 'Private'}
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link href={`/admin/roadmap/${item.id}`} style={{ padding: '0.375rem', borderRadius: 6, color: 'var(--color-foreground-muted)', display: 'flex' }}><Pencil size={15} /></Link>
                        <button onClick={() => handleDelete(item.id, item.title_en)} disabled={deleting === item.id} style={{ padding: '0.375rem', borderRadius: 6, border: 'none', cursor: 'pointer', backgroundColor: 'transparent', color: 'var(--color-error)' }}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
