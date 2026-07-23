'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { adminList, adminDelete } from '@/lib/admin/api'

interface MenuItem {
  id: string
  location: string
  title: string
  items_count?: number
}

export default function MenusPage() {
  const [menus, setMenus] = useState<MenuItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchMenus = async () => {
    setLoading(true)
    try {
      const data = await adminList<MenuItem>('/admin/menus')
      setMenus(data)
    } catch { setMenus([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchMenus() }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await adminDelete(`/admin/menus/${deleteId}`)
      setMenus(prev => prev.filter(m => m.id !== deleteId))
    } catch {}
    setDeleting(false)
    setDeleteId(null)
  }

  const columns: Column<MenuItem>[] = [
    {
      key: 'title', header: 'Menu',
      render: (m) => (
        <Link href={`/admin/menus/${m.id}`} style={{ fontWeight: 500, color: 'var(--color-foreground)', textDecoration: 'none' }}>
          {m.title}
        </Link>
      ),
    },
    {
      key: 'location', header: 'Location', hideOnMobile: true,
      render: (m) => <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>{m.location}</span>,
    },
    {
      key: 'items_count', header: 'Items', hideOnMobile: true,
      render: (m) => <span style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>{(m as any).items_count ?? 0}</span>,
    },
    {
      key: 'actions', header: '',
      render: (m) => (
        <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
          <Link href={`/admin/menus/${m.id}`} style={{ padding: '0.375rem', borderRadius: 6, color: 'var(--color-foreground-muted)' }} aria-label="Edit"><Edit size={14} /></Link>
          <button onClick={() => setDeleteId(m.id)} style={{ padding: '0.375rem', borderRadius: 6, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: 'var(--color-foreground-muted)' }} aria-label="Delete"><Trash2 size={14} /></button>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader title="Menus" subtitle="Manage navigation menus across the site" actions={
        <Link href="/admin/menus/new"><Button variant="primary" size="sm"><Plus size={15} /> New Menu</Button></Link>
      } />
      <div style={{ borderRadius: '0.875rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', overflow: 'hidden' }}>
        <DataTable columns={columns} data={menus} keyField="id" loading={loading} emptyMessage="No menus yet." />
      </div>
      <ConfirmDialog open={!!deleteId} title="Delete Menu" message="This will delete the menu and all its items." confirmLabel="Delete" loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </>
  )
}
