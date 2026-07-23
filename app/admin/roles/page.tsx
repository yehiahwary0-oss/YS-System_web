'use client'

import { useState, useEffect } from 'react'
import { Save, Shield } from 'lucide-react'
import { PageHeader } from '@/components/admin/PageHeader'
import { SectionCard } from '@/components/admin/SectionCard'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/admin/Toast'
import { usePlatform } from '@/lib/platform/PlatformProvider'
import { adminList, API } from '@/lib/admin/api'
import type { PermissionGroup } from '@/lib/platform/registries/PermissionRegistry'

interface Role {
  id: string
  name: string
  guard_name: string
  permissions: string[]
}

export default function RolesPage() {
  const { show } = useToast()
  const { kernel, loaded: platformLoaded } = usePlatform()
  const [roles, setRoles] = useState<Role[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [edited, setEdited] = useState<Record<string, string[]>>({})
  const [loading, setLoading] = useState(true)

  const permissionGroups: PermissionGroup[] = platformLoaded && kernel
    ? kernel.getRegistry('permissions').getGroups()
    : []

  useEffect(() => {
    adminList<Role>('/admin/roles').then(data => {
      setRoles(data)
      const map: Record<string, string[]> = {}
      data.forEach(r => { map[r.id] = [...r.permissions] })
      setEdited(map)
    }).catch(() => show('error', 'Failed to load roles.'))
    .finally(() => setLoading(false))
  }, [show])

  const togglePerm = (roleId: string, perm: string) => {
    setEdited(prev => {
      const perms = [...(prev[roleId] || [])]
      return { ...prev, [roleId]: perms.includes(perm) ? perms.filter(p => p !== perm) : [...perms, perm] }
    })
  }

  const toggleGroup = (roleId: string, perms: string[]) => {
    const current = edited[roleId] || []
    const allSelected = perms.every(p => current.includes(p))
    setEdited(prev => ({
      ...prev,
      [roleId]: allSelected ? current.filter(p => !perms.includes(p)) : [...new Set([...current, ...perms])],
    }))
  }

  const saveRole = async (roleId: string) => {
    const permissions = edited[roleId]
    try {
      const res = await fetch(`${API}/admin/roles/${roleId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ permissions }),
      })
      const body = await res.json()
      if (!res.ok || !body.success) { show('error', body.message ?? 'Failed to save.'); return }
      setRoles(prev => prev.map(r => r.id === roleId ? { ...r, permissions } : r))
      show('success', 'Role updated.')
    } catch { show('error', 'Network error.') }
  }

  if (loading) return (
    <>
      <PageHeader title="Roles & Permissions" subtitle="Manage access control roles" />
      <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-foreground-muted)' }}>Loading...</div>
    </>
  )

  return (
    <>
      <PageHeader title="Roles & Permissions" subtitle="Manage access control roles" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {roles.map(role => {
          const isOpen = expanded === role.id
          const currentPerms = edited[role.id] || []
          const hasChanges = JSON.stringify(currentPerms.sort()) !== JSON.stringify(role.permissions.sort())
          return (
            <SectionCard
              key={role.id}
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={16} />
                  <span style={{ textTransform: 'capitalize' }}>{role.name.replace('_', ' ')}</span>
                </div>
              }
              description={`${role.permissions.length} permission(s) · ${currentPerms.length} selected`}
              actions={
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {hasChanges && <Button variant="primary" size="sm" onClick={() => saveRole(role.id)}><Save size={14} /> Save</Button>}
                  <button onClick={() => setExpanded(isOpen ? null : role.id)}
                    style={{ padding: '0.375rem 0.75rem', borderRadius: 6, border: '1px solid var(--color-border)', backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)', fontSize: '0.8125rem', cursor: 'pointer' }}>
                    {isOpen ? 'Collapse' : 'Edit'}
                  </button>
                </div>
              }
            >
              {isOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {permissionGroups.map(pg => {
                    const perms = pg.permissions
                    const allSelected = perms.every(p => currentPerms.includes(p))
                    const someSelected = perms.some(p => currentPerms.includes(p))
                    return (
                      <div key={`${pg.moduleId}:${pg.group}`} style={{ paddingBottom: '0.75rem', borderBottom: '1px solid var(--color-border)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <input type="checkbox" checked={allSelected} ref={el => { if (el) el.indeterminate = someSelected && !allSelected }}
                            onChange={() => toggleGroup(role.id, perms)}
                            style={{ accentColor: 'var(--color-primary)' }} />
                          <span style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{pg.group}</span>
                          <span style={{ fontSize: '0.6875rem', color: 'var(--color-foreground-muted)', opacity: 0.6 }}>{pg.moduleId}</span>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.375rem', paddingLeft: '1.5rem' }}>
                          {perms.map(perm => (
                            <label key={perm} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.8125rem', cursor: 'pointer', padding: '0.25rem 0.5rem', borderRadius: 4, backgroundColor: currentPerms.includes(perm) ? 'var(--color-primary-subtle, #EEF2FF)' : 'var(--color-background-subtle)' }}>
                              <input type="checkbox" checked={currentPerms.includes(perm)} onChange={() => togglePerm(role.id, perm)}
                                style={{ accentColor: 'var(--color-primary)' }} />
                              {perm.replace(/_/g, ' ')}
                            </label>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </SectionCard>
          )
        })}
      </div>
    </>
  )
}
