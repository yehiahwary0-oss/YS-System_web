import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard, Package, FileText, Map, Megaphone,
  Briefcase, Image, Users, Settings, ScrollText,
  ToggleLeft, History, BookOpen, HelpCircle, Menu,
  Home, Shield, Key, Fingerprint, Bell, UserCog,
  Globe, Tags,
} from 'lucide-react'

export interface NavItem {
  href: string
  labelEn: string
  labelAr: string
  icon: LucideIcon
  permission?: string
  children?: NavItem[]
}

export interface NavGroup {
  labelEn: string
  labelAr: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    labelEn: 'Overview',
    labelAr: 'نظرة عامة',
    items: [
      { href: '/admin/dashboard', labelEn: 'Dashboard', labelAr: 'لوحة التحكم', icon: LayoutDashboard },
    ],
  },
  {
    labelEn: 'Content',
    labelAr: 'المحتوى',
    items: [
      { href: '/admin/products',     labelEn: 'Products',     labelAr: 'المنتجات',     icon: Package,    permission: 'manage_products' },
      { href: '/admin/docs',         labelEn: 'Documentation',labelAr: 'التوثيق',      icon: FileText,   permission: 'manage_documentation' },
      { href: '/admin/static-pages', labelEn: 'Static Pages', labelAr: 'الصفحات الثابتة', icon: BookOpen, permission: 'manage_static_pages' },
      { href: '/admin/faq',          labelEn: 'FAQ',          labelAr: 'الأسئلة الشائعة', icon: HelpCircle, permission: 'manage_faqs' },
      { href: '/admin/menus',        labelEn: 'Menus',        labelAr: 'القوائم',        icon: Menu,       permission: 'manage_menus' },
      { href: '/admin/homepage',     labelEn: 'Homepage',     labelAr: 'الصفحة الرئيسية', icon: Home,       permission: 'manage_homepage' },
      { href: '/admin/releases',     labelEn: 'Releases',     labelAr: 'الإصدارات',     icon: Tags,       permission: 'manage_products' },
      { href: '/admin/roadmap',      labelEn: 'Roadmap',      labelAr: 'خارطة الطريق',  icon: Map,        permission: 'manage_roadmap' },
      { href: '/admin/updates',      labelEn: 'Updates',      labelAr: 'المستجدات',     icon: Megaphone,  permission: 'manage_updates' },
      { href: '/admin/careers',      labelEn: 'Careers',      labelAr: 'الوظائف',       icon: Briefcase,  permission: 'manage_careers' },
      { href: '/admin/timeline',     labelEn: 'Timeline',     labelAr: 'الجدول الزمني',  icon: History,    permission: 'manage_settings' },
    ],
  },
  {
    labelEn: 'Media',
    labelAr: 'الوسائط',
    items: [
      { href: '/admin/media', labelEn: 'Media Library', labelAr: 'مكتبة الوسائط', icon: Image, permission: 'manage_media' },
    ],
  },
  {
    labelEn: 'System',
    labelAr: 'النظام',
    items: [
      { href: '/admin/users',         labelEn: 'Users',          labelAr: 'المستخدمون',       icon: Users,       permission: 'manage_users' },
      { href: '/admin/roles',         labelEn: 'Roles & Permissions', labelAr: 'الأدوار والصلاحيات', icon: UserCog, permission: 'manage_users' },
      { href: '/admin/settings',      labelEn: 'Settings',       labelAr: 'الإعدادات',        icon: Settings },
      { href: '/admin/feature-flags', labelEn: 'Feature Flags',  labelAr: 'مفاتيح الميزات',    icon: ToggleLeft, permission: 'manage_settings' },
    ],
  },
  {
    labelEn: 'Security',
    labelAr: 'الأمان',
    items: [
      { href: '/admin/audit-logs',    labelEn: 'Audit Logs',    labelAr: 'سجلات التدقيق',  icon: ScrollText, permission: 'view_audit_logs' },
      { href: '/admin/sessions',      labelEn: 'Active Sessions',labelAr: 'الجلسات النشطة', icon: Fingerprint },
      { href: '/admin/login-history', labelEn: 'Login History',  labelAr: 'سجل الدخول',     icon: Shield },
      { href: '/admin/api-tokens',    labelEn: 'API Tokens',     labelAr: 'رموز API',       icon: Key },
    ],
  },
  {
    labelEn: 'Notifications',
    labelAr: 'الإشعارات',
    items: [
      { href: '/admin/notifications', labelEn: 'Notification Center', labelAr: 'مركز الإشعارات', icon: Bell },
    ],
  },
]

export function findNavItem(href: string): NavItem | undefined {
  for (const group of navGroups) {
    for (const item of group.items) {
      if (item.href === href) return item
      for (const child of item.children ?? []) {
        if (child.href === href) return child
      }
    }
  }
  return undefined
}

export function findGroupLabel(href: string): { en: string; ar: string } | undefined {
  for (const group of navGroups) {
    for (const item of group.items) {
      if (item.href === href || item.children?.some(c => c.href === href)) {
        return { en: group.labelEn, ar: group.labelAr }
      }
    }
  }
  return undefined
}
