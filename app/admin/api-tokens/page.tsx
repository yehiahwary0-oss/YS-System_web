'use client'

import { useState } from 'react'
import { Plus, Copy, Trash2, Eye, EyeOff } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Button } from '@/components/ui/Button'
import { Field, Input, Checkbox } from '@/components/admin/FormElements'
import { useToast } from '@/components/admin/Toast'
import { API } from '@/lib/admin/api'

const DEMO_TOKENS = [
  { id: '1', name: 'Development', last_used: '2026-07-13', created_at: '2026-01-15', scopes: ['read', 'write'] },
  { id: '2', name: 'CI/CD Pipeline', last_used: '2026-07-12', created_at: '2026-03-01', scopes: ['read'] },
]

export default function ApiTokensPage() {
  const { show } = useToast()
  const [tokens, setTokens] = useState(DEMO_TOKENS)
  const [showNew, setShowNew] = useState(false)
  const [name, setName] = useState('')
  const [readScope, setReadScope] = useState(true)
  const [writeScope, setWriteScope] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newToken, setNewToken] = useState<string | null>(null)

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) { show('error', 'Token name is required.'); return }
    setCreating(true)
    try {
      const res = await fetch(`${API}/admin/api-tokens`, {
        method: 'POST', credentials: 'include',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: name.trim(), scopes: [...(readScope ? ['read'] : []), ...(writeScope ? ['write'] : [])] }),
      })
      const body = await res.json()
      if (!res.ok || !body.success) { show('error', body.message ?? 'Failed to create token.'); return }
      setNewToken(body.data.token ?? body.data.plain_text ?? '')
      setTokens(prev => [...prev, { id: body.data.id ?? crypto.randomUUID(), name, last_used: 'Never', created_at: new Date().toISOString().split('T')[0], scopes: [] }])
      show('success', 'Token created. Copy it now — it won\'t be shown again.')
    } catch { show('error', 'Network error.') }
    finally { setCreating(false) }
  }

  return (
    <>
      <PageHeader
        title="API Tokens" subtitle="Manage API tokens for programmatic access"
        actions={<Button variant="primary" size="sm" onClick={() => { setShowNew(true); setNewToken(null) }}><Plus size={15} /> New Token</Button>}
      />
      <div style={{ maxWidth: '40rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {showNew && (
          <SectionCard title={newToken ? 'Token Created' : 'Create API Token'}>
            {newToken ? (
              <div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-foreground-muted)', marginBottom: '0.75rem' }}>
                  Copy this token now. You won&apos;t be able to see it again.
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Input value={newToken} readOnly style={{ fontFamily: 'monospace', fontSize: '0.75rem', flex: 1 }} />
                  <Button variant="secondary" size="sm" onClick={() => { navigator.clipboard.writeText(newToken); show('success', 'Copied!') }}>
                    <Copy size={14} />
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <Field label="Token Name">
                  <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. CI/CD Pipeline" autoFocus />
                </Field>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <Checkbox label="Read" checked={readScope} onChange={e => setReadScope(e.target.checked)} />
                  <Checkbox label="Write" checked={writeScope} onChange={e => setWriteScope(e.target.checked)} />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Button type="submit" variant="primary" size="sm" loading={creating}>Create</Button>
                  <Button type="button" variant="secondary" size="sm" onClick={() => setShowNew(false)}>Cancel</Button>
                </div>
              </form>
            )}
          </SectionCard>
        )}

        <SectionCard title="Existing Tokens">
          {tokens.length === 0 && <p style={{ fontSize: '0.875rem', color: 'var(--color-foreground-muted)' }}>No API tokens created yet.</p>}
          {tokens.map(t => (
            <div key={t.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: t.id !== tokens[tokens.length-1].id ? '1px solid var(--color-border)' : 'none' }}>
              <div>
                <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{t.name}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)', marginLeft: '0.75rem' }}>Last used: {t.last_used}</span>
              </div>
              <button style={{ padding: '0.375rem', borderRadius: 6, border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: 'var(--color-foreground-muted)' }} aria-label="Revoke token">
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </SectionCard>
      </div>
    </>
  )
}
