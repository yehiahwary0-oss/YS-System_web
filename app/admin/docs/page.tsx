'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, FolderTree, FileText } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/admin/Toast'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

interface Category {
  id: string; title_en: string; slug: string; product: { name_en: string } | null
  parent: { title_en: string } | null
}
interface Article {
  id: string; title_en: string; slug: string; is_published: boolean
  category: { title_en: string; slug: string } | null
  reading_time_minutes: number | null
}

export default function AdminDocsPage() {
  const { show } = useToast()
  const [tab, setTab] = useState<'categories' | 'articles'>('categories')
  const [categories, setCategories] = useState<Category[]>([])
  const [articles, setArticles]     = useState<Article[]>([])
  const [loading, setLoading]       = useState(true)
  const [busy, setBusy]             = useState<string | null>(null)

  const fetchData = async () => {
    try {
      const [catRes, artRes] = await Promise.all([
        fetch(`${API}/admin/docs/categories`, { credentials: 'include', headers: { Accept: 'application/json' } }).then(r => r.json()),
        fetch(`${API}/admin/docs/articles`,   { credentials: 'include', headers: { Accept: 'application/json' } }).then(r => r.json()),
      ])
      if (catRes.success) setCategories(catRes.data)
      if (artRes.success)  setArticles(artRes.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { fetchData() }, [])

  const handleDeleteCategory = async (id: string, title: string) => {
    if (!confirm(`Delete category "${title}"? It must have no articles.`)) return
    setBusy(id)
    try {
        const res   = await fetch(`${API}/admin/docs/categories/${id}`, { method: 'DELETE', credentials: 'include', headers: { Accept: 'application/json' } })
      const body  = await res.json()
      if (body.success) { show('success', 'Category deleted.'); fetchData() }
      else show('error', body.message ?? 'Delete failed. It may contain articles.')
    } catch { show('error', 'Network error.') }
    setBusy(null)
  }

  const handleDeleteArticle = async (id: string, title: string) => {
    if (!confirm(`Delete "${title}"?`)) return
    setBusy(id)
    try {
        const res   = await fetch(`${API}/admin/docs/articles/${id}`, { method: 'DELETE', credentials: 'include', headers: { Accept: 'application/json' } })
      const body  = await res.json()
      if (body.success) { show('success', 'Article deleted.'); fetchData() }
      else show('error', body.message ?? 'Delete failed.')
    } catch { show('error', 'Network error.') }
    setBusy(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-display font-semibold" style={{ fontSize: '1.375rem', color: 'var(--color-foreground)' }}>Documentation</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-foreground-muted)', marginTop: '0.125rem' }}>Manage categories and articles</p>
        </div>
        <Link href={tab === 'categories' ? '/admin/docs/categories/new' : '/admin/docs/articles/new'}>
          <Button variant="primary" size="sm"><Plus size={16} /> {tab === 'categories' ? 'Add Category' : 'Add Article'}</Button>
        </Link>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--color-border)', paddingBottom: '0.5rem' }}>
        <button onClick={() => setTab('categories')} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: 8, border: 'none', cursor: 'pointer',
          fontSize: '0.8125rem', fontWeight: 500,
          backgroundColor: tab === 'categories' ? 'var(--color-accent-subtle)' : 'transparent',
          color: tab === 'categories' ? 'var(--color-accent)' : 'var(--color-foreground-muted)',
        }}>
          <FolderTree size={15} /> Categories ({categories.length})
        </button>
        <button onClick={() => setTab('articles')} style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: 8, border: 'none', cursor: 'pointer',
          fontSize: '0.8125rem', fontWeight: 500,
          backgroundColor: tab === 'articles' ? 'var(--color-accent-subtle)' : 'transparent',
          color: tab === 'articles' ? 'var(--color-accent)' : 'var(--color-foreground-muted)',
        }}>
          <FileText size={15} /> Articles ({articles.length})
        </button>
      </div>

      {/* Categories table */}
      {tab === 'categories' && (
        <div style={{ borderRadius: '1rem', border: '1px solid var(--color-border)', overflow: 'hidden', backgroundColor: 'var(--color-surface)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background-subtle)' }}>
                  {['Title', 'Slug', 'Product', 'Parent', 'Actions'].map(col => (
                    <th key={col} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-foreground-muted)' }}>Loading...</td></tr>
                ) : categories.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-foreground-muted)' }}>
                    No categories yet. <Link href="/admin/docs/categories/new" style={{ color: 'var(--color-accent)' }}>Create one →</Link>
                  </td></tr>
                ) : categories.map((cat) => (
                  <tr key={cat.id} style={{ borderBottom: '1px solid var(--color-border)' }} className="hover:bg-background-subtle">
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 500, color: 'var(--color-foreground)' }}>{cat.title_en}</td>
                    <td style={{ padding: '0.875rem 1rem', fontFamily: 'monospace', fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>{cat.slug}</td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--color-foreground-muted)' }}>{cat.product?.name_en ?? '— General —'}</td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--color-foreground-muted)' }}>{cat.parent?.title_en ?? '— Top Level —'}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link href={`/admin/docs/categories/${cat.id}`} style={{ padding: '0.375rem', borderRadius: 6, color: 'var(--color-foreground-muted)', display: 'flex' }}><Pencil size={15} /></Link>
                        <button onClick={() => handleDeleteCategory(cat.id, cat.title_en)} disabled={busy === cat.id} style={{ padding: '0.375rem', borderRadius: 6, border: 'none', cursor: 'pointer', backgroundColor: 'transparent', color: 'var(--color-error)' }}>
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
      )}

      {/* Articles table */}
      {tab === 'articles' && (
        <div style={{ borderRadius: '1rem', border: '1px solid var(--color-border)', overflow: 'hidden', backgroundColor: 'var(--color-surface)' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background-subtle)' }}>
                  {['Title', 'Category', 'Reading Time', 'Status', 'Actions'].map(col => (
                    <th key={col} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-foreground-muted)' }}>Loading...</td></tr>
                ) : articles.length === 0 ? (
                  <tr><td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-foreground-muted)' }}>
                    No articles yet. <Link href="/admin/docs/articles/new" style={{ color: 'var(--color-accent)' }}>Create one →</Link>
                  </td></tr>
                ) : articles.map((art) => (
                  <tr key={art.id} style={{ borderBottom: '1px solid var(--color-border)' }} className="hover:bg-background-subtle">
                    <td style={{ padding: '0.875rem 1rem', fontWeight: 500, color: 'var(--color-foreground)' }}>{art.title_en}</td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--color-foreground-muted)' }}>{art.category?.title_en ?? '—'}</td>
                    <td style={{ padding: '0.875rem 1rem', color: 'var(--color-foreground-muted)' }}>{art.reading_time_minutes ? `${art.reading_time_minutes} min` : '—'}</td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: art.is_published ? '#10B981' : 'var(--color-foreground-muted)' }}>
                        {art.is_published ? '🟢 Published' : '⚪ Draft'}
                      </span>
                    </td>
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <Link href={`/admin/docs/articles/${art.id}`} style={{ padding: '0.375rem', borderRadius: 6, color: 'var(--color-foreground-muted)', display: 'flex' }}><Pencil size={15} /></Link>
                        <button onClick={() => handleDeleteArticle(art.id, art.title_en)} disabled={busy === art.id} style={{ padding: '0.375rem', borderRadius: 6, border: 'none', cursor: 'pointer', backgroundColor: 'transparent', color: 'var(--color-error)' }}>
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
      )}
    </div>
  )
}
