export interface CorePermissionGroup {
  group: string
  permissions: string[]
}

export const corePermissionGroups: CorePermissionGroup[] = [
  { group: 'Dashboard', permissions: ['view_dashboard'] },
  { group: 'Products', permissions: ['manage_products'] },
  { group: 'Static Pages', permissions: ['manage_static_pages'] },
  { group: 'FAQ', permissions: ['manage_faqs'] },
  { group: 'Menus', permissions: ['manage_menus'] },
  { group: 'Homepage', permissions: ['manage_homepage'] },
  { group: 'Users', permissions: ['manage_users', 'view_users'] },
  { group: 'Roles', permissions: ['manage_roles'] },
  { group: 'Media', permissions: ['manage_media'] },
  { group: 'Settings', permissions: ['manage_settings'] },
  { group: 'Feature Flags', permissions: ['manage_feature_flags'] },
  { group: 'Audit Logs', permissions: ['view_audit_logs'] },
  { group: 'Timeline', permissions: ['manage_timeline'] },
  { group: 'Docs', permissions: ['manage_docs'] },
  { group: 'Releases', permissions: ['manage_releases'] },
  { group: 'Roadmap', permissions: ['manage_roadmap'] },
  { group: 'Updates', permissions: ['manage_updates'] },
  { group: 'Careers', permissions: ['manage_careers'] },
]
