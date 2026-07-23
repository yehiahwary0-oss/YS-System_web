'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { DataTable, type Column } from '@/components/admin/DataTable'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { Button } from '@/components/ui/Button'
import { adminList, adminDelete } from '@/lib/admin/api'
import type { FaqItem } from '@/types'

export default function FaqPage() {
  const [items, setItems] = useState<FaqItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  const fetchItems = async () => {
    setLoading(true)
    try {
      const data = await adminList<FaqItem>('/admin/faqs')
      setItems(data)
    } catch { setItems([]) }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchItems() }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    setDeleting(true)
    try {
      await adminDelete(`/admin/faqs/${deleteId}`)
      setItems(prev => prev.filter(i => i.id !== deleteId))
    } catch {}
    setDeleting(false)
    setDeleteId(null)
  }

  const columns: Column<FaqItem>[] = [
    {
      key: 'question',
      header: 'Question',
      render: (item) => (
        <Link href={`/admin/faq/${item.id}`} style={{ fontWeight: 500, color: 'var(--color-foreground)', textDecoration: 'none' }}>
          {item.question}
        </Link>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      render: (item) => (
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>
          {item.category ?? '-'}
        </span>
      ),
      hideOnMobile: true,
    },
    {
      key: 'answer',
      header: 'Answer',
      render: (item) => (
        <span style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>
          {item.answer.slice(0, 120)}{item.answer.length > 120 ? '...' : ''}
        </span>
      ),
      hideOnMobile: true,
    },
    {
      key: 'actions',
      header: '',
      render: (item) => (
        <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'flex-end' }}>
          <Link href={`/admin/faq/${item.id}`} style={{ padding: '0.375rem', borderRadius: 6, color: 'var(--color-foreground-muted)' }} aria-label="Edit">
            <Edit size={14} />
          </Link>
          <button onClick={() => setDeleteId(item.id)} style={{ padding: '0.375rem', borderRadius: 6, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: 'var(--color-foreground-muted)' }} aria-label="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title="FAQ"
        subtitle="Manage frequently asked questions"
        actions={
          <Link href="/admin/faq/new">
            <Button variant="primary" size="sm"><Plus size={15} /> New FAQ</Button>
          </Link>
        }
      />
      <div style={{ borderRadius: '0.875rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', overflow: 'hidden' }}>
        <DataTable columns={columns} data={items} keyField="id" loading={loading} emptyMessage="No FAQ items yet." />
      </div>
      <ConfirmDialog open={!!deleteId} title="Delete FAQ" message="Are you sure? This cannot be undone." confirmLabel="Delete" loading={deleting} onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </>
  )
}
