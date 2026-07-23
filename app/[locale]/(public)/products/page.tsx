import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { api } from '@/lib/api/client'
import { buildMetadata } from '@/lib/seo'
import { StatusBadge } from '@/components/ui/Badge'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Product } from '@/types'

const locales = ['en', 'ar'] as const
const content = {
  en: { title: 'Products', subtitle: 'A growing ecosystem of modern software solutions built for real business problems.', learn_more: 'Learn More', version: 'Version' },
  ar: { title: 'المنتجات', subtitle: 'منظومة متنامية من الحلول البرمجية الحديثة المبنية لحل مشكلات الأعمال الحقيقية.', learn_more: 'اعرف المزيد', version: 'الإصدار' },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = content[locale as keyof typeof content] ?? content.en
  return buildMetadata({ locale, path: '/products', title: t.title, description: t.subtitle })
}


export default async function ProductsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!(locales as readonly string[]).includes(locale)) notFound()
  const t = content[locale as keyof typeof content] ?? content.en

  let products: Product[] = []
  try { products = await api.products(locale) } catch {}

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: 'var(--color-background)' }}>
      {/* Hero */}
      <section style={{ paddingTop: '7rem', paddingBottom: '5rem', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container-site">
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
            Products
          </p>
          <h1 className="font-display font-semibold tracking-tight text-fluid-2xl" style={{ color: 'var(--color-foreground)', marginBottom: '1rem' }}>
            {t.title}
          </h1>
          <p className="text-fluid-base" style={{ color: 'var(--color-foreground-muted)', maxWidth: '48rem' }}>
            {t.subtitle}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="section-sm">
        <div className="container-site">
          {products.length === 0 ? (
            <EmptyState message={locale === 'ar' ? 'لا توجد منتجات متاحة حتى الآن.' : 'No products available yet.'} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/${locale}/products/${product.slug}`}
                  style={{
                    display: 'flex', flexDirection: 'column', borderRadius: '1rem',
                    border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)',
                    textDecoration: 'none', overflow: 'hidden', transition: 'all 300ms',
                  }}
                  className="card-hover group"
                >
                  {/* Cover */}
                  <div style={{ position: 'relative', height: '12rem', backgroundColor: 'var(--color-background-subtle)' }}>
                    {product.cover_image ? (
                      <Image src={product.cover_image.url} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 72, height: 72, borderRadius: 20, backgroundColor: 'var(--color-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span className="font-display font-bold text-3xl" style={{ color: 'var(--color-accent)' }}>{product.name.slice(0, 2).toUpperCase()}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                      <h2 className="font-display font-semibold" style={{ color: 'var(--color-foreground)', fontSize: '1.125rem' }}>{product.name}</h2>
                      <StatusBadge status={product.status} />
                    </div>
                    <p className="text-sm line-clamp-2" style={{ color: 'var(--color-foreground-muted)', lineHeight: 1.6, flex: 1 }}>{product.short_desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
                      {product.current_version && (
                        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--color-foreground-muted)' }}>v{product.current_version}</span>
                      )}
                      <span style={{ marginLeft: 'auto', fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-accent)' }}>
                        {locale === 'ar' ? <ArrowLeft size={14} /> : <ArrowRight size={14} />} {t.learn_more}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
