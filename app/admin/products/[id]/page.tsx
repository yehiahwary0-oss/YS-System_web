'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { ProductForm, type ProductFormData } from '@/components/admin/ProductForm'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

export default function EditProductPage() {
  const params = useParams()
  const id     = params.id as string

  const [data, setData]       = useState<Partial<ProductFormData> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)

  useEffect(() => {
    fetch(`${API}/admin/products/${id}`, { credentials: 'include', headers: { Accept: 'application/json' } })
      .then(r => r.json())
      .then(body => {
        if (body.success) {
          setData({
            slug: body.data.slug,
            name_en: body.data.name_en,
            name_ar: body.data.name_ar,
            short_desc_en: body.data.short_desc_en ?? '',
            short_desc_ar: body.data.short_desc_ar ?? '',
            long_desc_en: body.data.long_desc_en ?? '',
            long_desc_ar: body.data.long_desc_ar ?? '',
            status: body.data.status,
            is_featured: body.data.is_featured,
            sort_order: body.data.sort_order,
          })
        } else {
          setError(true)
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-foreground-muted)' }}>Loading product...</div>
  }

  if (error || !data) {
    return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-error)' }}>Failed to load product.</div>
  }

  return <ProductForm productId={id} initialData={data} />
}
