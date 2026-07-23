'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { StatusBadge } from '@/components/ui/Badge'
import { useToast } from '@/components/admin/Toast'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

interface Product {
  id: string; slug: string; name_en: string; name_ar: string
  status: string; current_version: string | null; is_featured: boolean; created_at: string
}

export default function AdminProductsPage() {
  const { show } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchProducts = async () => {
    const qs    = search ? `?search=${encodeURIComponent(search)}` : ''
    try {
      const res  = await fetch(`${API}/admin/products${qs}`, { credentials: 'include', headers: { Accept: 'application/json' } })
      const body = await res.json()
      if (body.success) setProducts(body.data)
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    const timeout = setTimeout(fetchProducts, search ? 300 : 0)
    return () => clearTimeout(timeout)
  }, [search])

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return
    setDeleting(id)
    try {
        const res   = await fetch(`${API}/admin/products/${id}`, { method: 'DELETE', credentials: 'include', headers: { Accept: 'application/json' } })
      const body  = await res.json()
      if (body.success) {
        show('success', 'Product deleted successfully.')
        fetchProducts()
      } else {
        show('error', body.message ?? 'Delete failed.')
      }
    } catch {
      show('error', 'Network error occurred.')
    }
    setDeleting(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="font-display font-semibold" style={{ fontSize: '1.375rem', color: 'var(--color-foreground)' }}>Products</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-foreground-muted)', marginTop: '0.125rem' }}>Manage your software products</p>
        </div>
        <Link href="/admin/products/new">
          <Button variant="primary" size="sm">
            <Plus size={16} /> Add Product
          </Button>
        </Link>
      </div>

      <div style={{ position: 'relative', maxWidth: '24rem' }}>
        <Search size={15} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-foreground-muted)' }} />
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search products..."
          style={{ width: '100%', padding: '0.625rem 0.875rem 0.625rem 2.5rem', borderRadius: 8, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      <div style={{ borderRadius: '1rem', border: '1px solid var(--color-border)', overflow: 'hidden', backgroundColor: 'var(--color-surface)' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background-subtle)' }}>
                {['Name', 'Status', 'Version', 'Featured', 'Created', 'Actions'].map(col => (
                  <th key={col} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-foreground-muted)' }}>Loading...</td></tr>
              ) : products.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-foreground-muted)' }}>
                  No products found. <Link href="/admin/products/new" style={{ color: 'var(--color-accent)' }}>Create one →</Link>
                </td></tr>
              ) : products.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid var(--color-border)' }} className="hover:bg-background-subtle">
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div>
                      <p style={{ fontWeight: 500, color: 'var(--color-foreground)' }}>{product.name_en}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>{product.name_ar}</p>
                    </div>
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <StatusBadge status={product.status as any} />
                  </td>
                  <td style={{ padding: '0.875rem 1rem', fontFamily: 'monospace', color: 'var(--color-foreground-muted)', fontSize: '0.8125rem' }}>
                    {product.current_version ? `v${product.current_version}` : '—'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: product.is_featured ? 'var(--color-success)' : 'var(--color-foreground-muted)' }}>
                    {product.is_featured ? '★' : '—'}
                  </td>
                  <td style={{ padding: '0.875rem 1rem', color: 'var(--color-foreground-muted)', fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>
                    {new Date(product.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '0.875rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Link href={`/admin/products/${product.id}`} style={{ padding: '0.375rem', borderRadius: 6, color: 'var(--color-foreground-muted)', display: 'flex' }} title="Edit">
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name_en)}
                        disabled={deleting === product.id}
                        style={{ padding: '0.375rem', borderRadius: 6, border: 'none', cursor: 'pointer', backgroundColor: 'transparent', color: deleting === product.id ? 'var(--color-foreground-muted)' : 'var(--color-error)' }}
                        title="Delete"
                      >
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
