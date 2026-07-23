'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Field, Input, Textarea, Select, Checkbox, FormSection } from '@/components/admin/FormElements'
import { useToast } from '@/components/admin/Toast'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000/api/v1'

export interface ProductFormData {
  slug: string
  name_en: string
  name_ar: string
  short_desc_en: string
  short_desc_ar: string
  long_desc_en: string
  long_desc_ar: string
  status: 'active' | 'beta' | 'planned' | 'archived'
  is_featured: boolean
  sort_order: number
}

const emptyForm: ProductFormData = {
  slug: '', name_en: '', name_ar: '',
  short_desc_en: '', short_desc_ar: '',
  long_desc_en: '', long_desc_ar: '',
  status: 'planned', is_featured: false, sort_order: 0,
}

interface ProductFormProps {
  productId?: string          // present = edit mode
  initialData?: Partial<ProductFormData>
}

export function ProductForm({ productId, initialData }: ProductFormProps) {
  const router = useRouter()
  const { show } = useToast()
  const isEdit = Boolean(productId)

  const [form, setForm]       = useState<ProductFormData>({ ...emptyForm, ...initialData })
  const [errors, setErrors]   = useState<Record<string, string>>({})
  const [saving, setSaving]   = useState(false)
  const [slugTouched, setSlugTouched] = useState(isEdit)

  const update = <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
    setForm(prev => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors(prev => { const next = { ...prev }; delete next[key]; return next })
  }

  // Auto-generate slug from English name (only if user hasn't manually edited slug)
  const handleNameChange = (value: string) => {
    update('name_en', value)
    if (!slugTouched) {
      const slug = value.toLowerCase().trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
      update('slug', slug)
    }
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}
    if (!form.slug.trim())    newErrors.slug = 'Slug is required.'
    else if (!/^[a-z0-9-]+$/.test(form.slug)) newErrors.slug = 'Slug must be lowercase letters, numbers, and hyphens only.'
    if (!form.name_en.trim()) newErrors.name_en = 'English name is required.'
    if (!form.name_ar.trim()) newErrors.name_ar = 'Arabic name is required.'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) {
      show('error', 'Please fix the errors before submitting.')
      return
    }

    setSaving(true)
    const url    = isEdit ? `${API}/admin/products/${productId}` : `${API}/admin/products`
    const method = isEdit ? 'PUT' : 'POST'

    try {
      const res  = await fetch(url, {
        method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      const body = await res.json()

      if (!res.ok || !body.success) {
        if (body.errors) {
          const fieldErrors: Record<string, string> = {}
          Object.entries(body.errors).forEach(([key, msgs]) => { fieldErrors[key] = (msgs as string[])[0] })
          setErrors(fieldErrors)
        }
        show('error', body.message ?? 'Failed to save product.')
        return
      }

      show('success', isEdit ? 'Product updated successfully.' : 'Product created successfully.')
      router.push('/admin/products')
    } catch {
      show('error', 'Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <Link href="/admin/products" style={{ display: 'flex', padding: '0.5rem', borderRadius: 8, border: '1px solid var(--color-border)', color: 'var(--color-foreground-muted)' }}>
            <ArrowLeft size={16} />
          </Link>
          <div>
            <h1 className="font-display font-semibold" style={{ fontSize: '1.375rem', color: 'var(--color-foreground)' }}>
              {isEdit ? 'Edit Product' : 'New Product'}
            </h1>
            <p style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>
              {isEdit ? 'Update product information' : 'Add a new product to the catalog'}
            </p>
          </div>
        </div>
        <Button type="submit" variant="primary" size="sm" loading={saving}>
          <Save size={15} /> {isEdit ? 'Save Changes' : 'Create Product'}
        </Button>
      </div>

      <div style={{ maxWidth: '42rem' }}>
        {/* Basic Info */}
        <FormSection title="Basic Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="English Name" required error={errors.name_en}>
              <Input value={form.name_en} onChange={e => handleNameChange(e.target.value)} placeholder="YS-Matrix" error={!!errors.name_en} />
            </Field>
            <Field label="Arabic Name" required error={errors.name_ar}>
              <Input value={form.name_ar} onChange={e => update('name_ar', e.target.value)} placeholder="واي إس ماتريكس" dir="rtl" error={!!errors.name_ar} />
            </Field>
          </div>

          <Field label="Slug" required hint="URL-friendly identifier (lowercase, hyphens only)" error={errors.slug}>
            <Input
              value={form.slug}
              onChange={e => { setSlugTouched(true); update('slug', e.target.value) }}
              placeholder="ys-matrix"
              style={{ fontFamily: 'monospace' }}
              error={!!errors.slug}
            />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Status">
              <Select value={form.status} onChange={e => update('status', e.target.value as ProductFormData['status'])}>
                <option value="planned">Planned</option>
                <option value="beta">Beta</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </Select>
            </Field>
            <Field label="Sort Order" hint="Lower numbers appear first">
              <Input type="number" value={form.sort_order} onChange={e => update('sort_order', Number(e.target.value))} min={0} />
            </Field>
          </div>

          <Checkbox label="Featured product (highlighted on homepage)" checked={form.is_featured} onChange={e => update('is_featured', e.target.checked)} />
        </FormSection>

        {/* Descriptions */}
        <FormSection title="Short Description" description="Shown in product cards and listings (max 500 characters)">
          <Field label="English">
            <Textarea value={form.short_desc_en} onChange={e => update('short_desc_en', e.target.value)} rows={2} maxLength={500} placeholder="A brief, compelling description..." />
          </Field>
          <Field label="Arabic">
            <Textarea value={form.short_desc_ar} onChange={e => update('short_desc_ar', e.target.value)} rows={2} maxLength={500} dir="rtl" placeholder="وصف موجز وجذاب..." />
          </Field>
        </FormSection>

        <FormSection title="Full Description" description="Shown on the product detail page. Supports basic HTML.">
          <Field label="English">
            <Textarea value={form.long_desc_en} onChange={e => update('long_desc_en', e.target.value)} rows={6} placeholder="Detailed product overview..." />
          </Field>
          <Field label="Arabic">
            <Textarea value={form.long_desc_ar} onChange={e => update('long_desc_ar', e.target.value)} rows={6} dir="rtl" placeholder="نظرة عامة تفصيلية على المنتج..." />
          </Field>
        </FormSection>
      </div>
    </form>
  )
}
