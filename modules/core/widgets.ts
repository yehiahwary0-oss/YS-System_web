import { Package, TrendingUp, Briefcase, ScrollText, FileText, HelpCircle, Home, Menu } from 'lucide-react'
import type { WidgetDefinition } from '@/lib/platform/registries/WidgetRegistry'

export const coreWidgets: WidgetDefinition[] = [
  { id: 'products',   moduleId: 'core', title: 'Products',  icon: Package,    permission: 'manage_products',    order: 0, value: 0, color: 'var(--color-accent)' },
  { id: 'releases',   moduleId: 'core', title: 'Releases',  icon: TrendingUp, permission: 'manage_releases',    order: 1, value: 0, color: '#10B981' },
  { id: 'careers',    moduleId: 'core', title: 'Careers',   icon: Briefcase,  permission: 'manage_careers',     order: 2, value: 0, color: '#F59E0B' },
  { id: 'audit-logs', moduleId: 'core', title: 'Audit Logs',icon: ScrollText, permission: 'view_audit_logs',    order: 3, value: 0, color: '#8B5CF6' },
  { id: 'static-pages', moduleId: 'core', title: 'Static Pages', icon: FileText, permission: 'manage_static_pages', order: 4, value: 0, color: '#3B82F6' },
  { id: 'faq',         moduleId: 'core', title: 'FAQ',       icon: HelpCircle, permission: 'manage_faqs',        order: 5, value: 0, color: '#EC4899' },
  { id: 'menus',       moduleId: 'core', title: 'Menus',     icon: Menu,      permission: 'manage_menus',        order: 6, value: 0, color: '#14B8A6' },
  { id: 'homepage',    moduleId: 'core', title: 'Homepage',  icon: Home,      permission: 'manage_homepage',     order: 7, value: 0, color: '#F97316' },
]
