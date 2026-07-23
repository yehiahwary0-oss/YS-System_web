'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Save, Plus, Trash2, GripVertical } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Button } from '@/components/ui/Button'
import { Field, Input, Select, Checkbox } from '@/components/admin/FormElements'
import { useToast } from '@/components/admin/Toast'
import { adminGet, adminUpdate, API } from '@/lib/admin/api'

interface MenuItem {
  id?: string
  title_en: string
  title_ar: string
  url: string
  icon: string
  target: '_self' | '_blank'
  parent_id: string | null
  sort_order: number
  is_active: boolean
}

interface MenuFormData {
  name_en: string
  name_ar: string
  location: string
  items: MenuItem[]
}

interface MenuFormProps {
  menuId?: string
}

export function MenuForm({ menuId }: MenuFormProps) {
  const router = useRouter()
  const { show } = useToast()
  const isEdit = Boolean(menuId)

  const [form, setForm] = useState<MenuFormData>({ name_en: '', name_ar: '', location: '', items: [] })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  useEffect(() => {
    if (!menuId) return
    adminGet<any>(`/admin/menus/${menuId}`).then(data => {
      setForm({
        name_en: data.name_en ?? data.name ?? '',
        name_ar: data.name_ar ?? '',
        location: data.location,
        items: (data.items ?? []).map((i: any) => ({
          id: i.id,
          title_en: i.title_en ?? '',
          title_ar: i.title_ar ?? '',
          url: i.url ?? '#',
          icon: i.icon ?? '',
          target: i.target ?? '_self',
          parent_id: i.parent_id ?? null,
          sort_order: i.sort_order ?? 0,
          is_active: i.is_active ?? true,
        })),
      })
    }).catch(() => { show('error', 'Failed to load menu.'); router.push('/admin/menus') })
    .finally(() => setLoading(false))
  }, [menuId, router, show])

  const updateField = <K extends keyof MenuFormData>(k: K, v: MenuFormData[K]) => {
    setForm(p => ({ ...p, [k]: v }))
    if (errors[k]) setErrors(p => { const n = { ...p }; delete n[k]; return n })
  }

  const updateItem = (i: number, item: MenuItem) => {
    const items = [...form.items]
    items[i] = item
    updateField('items', items)
  }

  const addItem = () => {
    updateField('items', [...form.items, { title_en: '', title_ar: '', url: '#', icon: '', target: '_self', parent_id: null, sort_order: form.items.length, is_active: true }])
  }

  const removeItem = (i: number) => {
    updateField('items', form.items.filter((_, idx) => idx !== i))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name_en.trim()) e.name_en = 'Required.'
    if (!form.name_ar.trim()) e.name_ar = 'Required.'
    if (!form.location.trim()) e.location = 'Required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) { show('error', 'Please fix errors.'); return }
    setSaving(true)
    try {
      const url = isEdit ? `${API}/admin/menus/${menuId}` : `${API}/admin/menus`
      const res = await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(form),
      })
      const body = await res.json()
      if (!res.ok || !body.success) {
        if (body.errors) {
          const fe: Record<string, string> = {}
          Object.entries(body.errors).forEach(([k, msgs]) => { fe[k] = (msgs as string[])[0] })
          setErrors(fe)
        }
        show('error', body.message ?? 'Failed to save.')
        return
      }
      show('success', isEdit ? 'Menu updated.' : 'Menu created.')
      router.push('/admin/menus')
    } catch { show('error', 'Network error.') }
    finally { setSaving(false) }
  }

  if (loading) return <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-foreground-muted)' }}>Loading...</div>

  const parentOptions = form.items.map((item, i) => (
    <option key={i} value={i.toString()}>{item.title_en || `Item ${i + 1}`}</option>
  ))

  return (
    <form onSubmit={handleSubmit}>
      <PageHeader
        title={isEdit ? 'Edit Menu' : 'New Menu'}
        subtitle={isEdit ? `Editing: ${form.name_en}` : 'Create a new navigation menu'}
        backHref="/admin/menus"
        actions={<Button type="submit" variant="primary" size="sm" loading={saving}><Save size={15} /> {isEdit ? 'Save Changes' : 'Create Menu'}</Button>}
      />
      <div style={{ maxWidth: '46rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <SectionCard title="Menu Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="English Name" required error={errors.name_en}>
              <Input value={form.name_en} onChange={e => updateField('name_en', e.target.value)} placeholder="Header Navigation" />
            </Field>
            <Field label="Arabic Name" required error={errors.name_ar}>
              <Input value={form.name_ar} onChange={e => updateField('name_ar', e.target.value)} placeholder="قائمة التنقل العلوية" dir="rtl" />
            </Field>
          </div>
          <Field label="Location Key" required hint="Unique identifier, e.g. header, footer_products" error={errors.location}>
            <Input value={form.location} onChange={e => updateField('location', e.target.value)} placeholder="header" style={{ fontFamily: 'monospace' }} disabled={isEdit} />
          </Field>
        </SectionCard>

        <SectionCard
          title="Menu Items"
          description={`${form.items.length} item(s)`}
          actions={<Button type="button" variant="secondary" size="sm" onClick={addItem}><Plus size={14} /> Add Item</Button>}
        >
          {form.items.length === 0 && (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-foreground-muted)' }}>No items yet. Click &quot;Add Item&quot; to create one.</p>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {form.items.map((item, i) => (
              <div key={i} style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background-subtle)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <GripVertical size={14} style={{ color: 'var(--color-foreground-muted)', flexShrink: 0 }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-foreground-muted)', textTransform: 'uppercase' }}>Item {i + 1}</span>
                  <button type="button" onClick={() => removeItem(i)} style={{ marginLeft: 'auto', padding: '0.25rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: 'var(--color-error)' }} aria-label="Remove item">
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Input value={item.title_en} onChange={e => updateItem(i, { ...item, title_en: e.target.value })} placeholder="English label" />
                  <Input value={item.title_ar} onChange={e => updateItem(i, { ...item, title_ar: e.target.value })} placeholder="Arabic label" dir="rtl" />
                  <Input value={item.url} onChange={e => updateItem(i, { ...item, url: e.target.value })} placeholder="/products" style={{ fontFamily: 'monospace' }} />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <select value={item.target} onChange={e => updateItem(i, { ...item, target: e.target.value as '_self' | '_blank' })}
                      style={{ flex: 1, padding: '0.5rem', borderRadius: 6, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)', fontSize: '0.8125rem' }}>
                      <option value="_self">Same tab</option>
                      <option value="_blank">New tab</option>
                    </select>
                    <Checkbox label="Active" checked={item.is_active} onChange={e => updateItem(i, { ...item, is_active: e.target.checked })} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    </form>
  )
}
