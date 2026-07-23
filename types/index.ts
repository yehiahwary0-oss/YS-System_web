// ── API Response ─────────────────────────────────────────────────────
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  meta?: PaginationMeta
}

export interface PaginationMeta {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

// ── Product ───────────────────────────────────────────────────────────
export type ProductStatus = 'active' | 'beta' | 'planned' | 'archived'

export interface Product {
  id: string
  slug: string
  name: string
  short_desc: string
  status: ProductStatus
  current_version: string | null
  is_featured: boolean
  cover_image: { url: string; alt: string } | null
}

export interface ProductDetail extends Product {
  long_desc: string
  latest_release: {
    version: string
    release_date: string
    notes: string | null
  } | null
  seo: { title: string; description: string }
}

// ── Settings ──────────────────────────────────────────────────────────
export interface PublicSettings {
  brand: {
    company_name: string
    company_tagline_en: string
    company_tagline_ar: string
    company_description_en: string
    company_description_ar: string
    contact_email: string
  }
  social: {
    github_url: string | null
    tiktok_url: string | null
    x_url: string | null
    linkedin_url: string | null
  }
  seo: {
    default_og_title_en: string
    default_og_title_ar: string
  }
  contacts?: {
    support_email?: string | null
    sales_email?: string | null
    security_email?: string | null
    privacy_email?: string | null
    press_email?: string | null
  }
  content?: {
    hero_headline_en: string
    hero_headline_ar: string
    hero_subline_en: string
    hero_subline_ar: string
    homepage_stats: Array<{ label_en: string; label_ar: string; value: string }>
    why_choose_items: Array<{
      icon: string
      title_en: string; title_ar: string
      description_en: string; description_ar: string
    }>
  }
}

// ── CMS — Static Page ─────────────────────────────────────────────────
export type PageStatus = 'draft' | 'published' | 'archived'

export interface StaticPage {
  id: string
  slug: string
  title: string
  excerpt: string | null
  content: string | null
  published_at: string | null
  cover_image: { url: string; alt: string } | null
}

// ── CMS — FAQ ──────────────────────────────────────────────────────────
export interface FaqItem {
  id: string
  question: string
  answer: string
  category: string | null
}

// ── CMS — Menu ─────────────────────────────────────────────────────────
export interface MenuItem {
  id: string
  title: string
  url: string
  icon: string | null
  target: string
  children: MenuItem[]
}

export interface Menu {
  id: string
  location: string
  items: MenuItem[]
}

// ── CMS — Homepage Section ────────────────────────────────────────────
export interface HomepageSection {
  id: string
  type: string
  title: string | null
  subtitle: string | null
  content: Record<string, unknown> | null
  sort_order: number
}

// ── Roadmap ───────────────────────────────────────────────────────────
export type RoadmapStatus = 'planned' | 'in_progress' | 'completed' | 'cancelled'
export type RoadmapPriority = 'low' | 'medium' | 'high' | 'critical'

export interface RoadmapItem {
  id: string
  title: string
  description: string | null
  status: RoadmapStatus
  priority: RoadmapPriority
  target_version: string | null
  target_quarter: string | null
  product: { slug: string; name: string } | null
}

// ── Update ────────────────────────────────────────────────────────────
export interface Update {
  id: string
  title: string
  content: string
  type: 'announcement' | 'blog' | 'news' | 'release'
  is_featured: boolean
  published_at: string
  product: { slug: string; name: string } | null
}

// ── Career ────────────────────────────────────────────────────────────
export interface Career {
  id: string
  title: string
  department: string
  location: string
  type: 'full_time' | 'part_time' | 'contract' | 'internship'
  description: string | null
  requirements?: string[]
  responsibilities?: string[]
  is_featured: boolean
}

// ── Timeline ──────────────────────────────────────────────────────────
export interface TimelineEntry {
  id: string
  title: string
  description: string | null
  event_date: string
  type: string
  product: { slug: string; name: string } | null
}

// ── Search ────────────────────────────────────────────────────────────
export interface SearchResult {
  type: string
  id: string
  title: string
  excerpt: string | null
  url: string
  rank: number
  meta: Record<string, unknown>
}

// ── Contact ───────────────────────────────────────────────────────────
export interface ContactFormData {
  name: string
  email: string
  subject?: string
  message: string
  type: 'general' | 'sales' | 'support' | 'partnership'
}

// ── Admin Auth ────────────────────────────────────────────────────────
export interface AdminUser {
  id: string
  name: string
  email: string
  is_active: boolean
  last_login_at: string | null
  role: {
    id: string
    name: string
    slug: string
    permissions: string[]
  }
}
