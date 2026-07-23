import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api/client'
import { buildMetadata } from '@/lib/seo'
import { StatusBadge } from '@/components/ui/Badge'
import type { Product } from '@/types'

const locales = ['en', 'ar'] as const
const content = {
  en: {
    title: 'The YS Ecosystem',
    subtitle: 'A connected suite of products built on a shared foundation, designed to grow with your business.',
    active_products: 'Active Products',
    planned_products: 'Coming Soon',
    view_product: 'View Product',
    foundation: 'Shared Foundation',
    foundation_desc: 'All YS products are built on the same secure, scalable infrastructure.',
    pillars: ['Security First', 'Arabic & English', 'API-Driven', 'Cloud Ready'],
  },
  ar: {
    title: 'منظومة YS',
    subtitle: 'مجموعة متكاملة من المنتجات المبنية على أساس مشترك، مصممة للنمو مع أعمالك.',
    active_products: 'المنتجات النشطة',
    planned_products: 'قريباً',
    view_product: 'عرض المنتج',
    foundation: 'الأساس المشترك',
    foundation_desc: 'جميع منتجات YS مبنية على نفس البنية التحتية الآمنة والقابلة للتوسع.',
    pillars: ['الأمان أولاً', 'عربي وإنجليزي', 'مدفوع بـ API', 'جاهز للسحابة'],
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = content[locale as keyof typeof content] ?? content.en
  return buildMetadata({ locale, path: '/ecosystem', title: t.title, description: t.subtitle })
}

export default async function EcosystemPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!(locales as readonly string[]).includes(locale)) notFound()
  const t = content[locale as keyof typeof content] ?? content.en

  let products: Product[] = []
  try { products = await api.products(locale) } catch {}

  const active  = products.filter(p => ['active', 'beta'].includes(p.status))
  const planned = products.filter(p => ['planned', 'archived'].includes(p.status))

  // Future planned products (hardcoded until added via admin)
  const futureProducts = [
    { name: 'YS-Clinic', desc: locale === 'ar' ? 'نظام إدارة عيادات' : 'Clinic Management System' },
    { name: 'YS-Nexus',  desc: locale === 'ar' ? 'منصة ربط الأعمال' : 'Business Integration Platform' },
  ]

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: 'var(--color-background)' }}>
      {/* Hero */}
      <section style={{ paddingTop: '7rem', paddingBottom: '5rem', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container-site" style={{ maxWidth: '56rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Ecosystem</p>
          <h1 className="font-display font-semibold tracking-tight text-fluid-2xl" style={{ color: 'var(--color-foreground)', marginBottom: '1.5rem' }}>{t.title}</h1>
          <p className="text-fluid-lg" style={{ color: 'var(--color-foreground-muted)', lineHeight: 1.7 }}>{t.subtitle}</p>
        </div>
      </section>

      {/* Foundation */}
      <section className="section-sm" style={{ borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-background-subtle)' }}>
        <div className="container-site">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 className="font-display font-semibold text-fluid-xl" style={{ color: 'var(--color-foreground)', marginBottom: '0.75rem' }}>{t.foundation}</h2>
            <p style={{ color: 'var(--color-foreground-muted)' }}>{t.foundation_desc}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {t.pillars.map((pillar) => (
              <div key={pillar} style={{ textAlign: 'center', padding: '1.25rem', borderRadius: '0.875rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-foreground)' }}>{pillar}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Active Products */}
      {active.length > 0 && (
        <section className="section-sm" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="container-site">
            <h2 className="font-display font-semibold text-fluid-xl" style={{ color: 'var(--color-foreground)', marginBottom: '2rem' }}>{t.active_products}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {active.map((product) => (
                <div key={product.id} className="card-hover" style={{ padding: '1.75rem', borderRadius: '1rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: 'var(--color-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span className="font-display font-bold" style={{ fontSize: '1.125rem', color: 'var(--color-accent)' }}>{product.name.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <StatusBadge status={product.status} />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold" style={{ color: 'var(--color-foreground)', fontSize: '1.0625rem', marginBottom: '0.375rem' }}>{product.name}</h3>
                    <p className="text-sm line-clamp-2" style={{ color: 'var(--color-foreground-muted)', lineHeight: 1.6 }}>{product.short_desc}</p>
                  </div>
                  <Link href={`/${locale}/products/${product.slug}`} style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-accent)', textDecoration: 'none', marginTop: 'auto' }}>
                    {locale === 'ar' ? '← ' : '→ '}{t.view_product}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Planned / Coming Soon */}
      <section className="section-sm">
        <div className="container-site">
          <h2 className="font-display font-semibold text-fluid-xl" style={{ color: 'var(--color-foreground)', marginBottom: '2rem' }}>{t.planned_products}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...planned, ...futureProducts.map(p => ({ id: p.name, name: p.name, slug: '', status: 'planned' as const, short_desc: p.desc, current_version: null, is_featured: false, cover_image: null }))].map((product) => (
              <div key={product.id} style={{ padding: '1.75rem', borderRadius: '1rem', border: '1px dashed var(--color-border)', backgroundColor: 'var(--color-background-subtle)', display: 'flex', flexDirection: 'column', gap: '1rem', opacity: 0.75 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, backgroundColor: 'var(--color-background-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span className="font-display font-bold" style={{ fontSize: '1.125rem', color: 'var(--color-foreground-muted)' }}>{product.name.slice(0, 2).toUpperCase()}</span>
                </div>
                <div>
                  <h3 className="font-display font-semibold" style={{ color: 'var(--color-foreground)', fontSize: '1.0625rem', marginBottom: '0.375rem' }}>{product.name}</h3>
                  <p className="text-sm" style={{ color: 'var(--color-foreground-muted)', lineHeight: 1.6 }}>{product.short_desc}</p>
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  {locale === 'ar' ? 'قريباً' : 'Coming Soon'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
