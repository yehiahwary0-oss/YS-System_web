import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { api } from '@/lib/api/client'
import { buildMetadata } from '@/lib/seo'
import { StatusBadge } from '@/components/ui/Badge'
import type { ProductDetail } from '@/types'

const content = {
  en: {
    back: '← Back to Products', version: 'Current Version',
    latest_release: 'Latest Release', overview: 'Overview',
    get_started: 'Get Started', view_docs: 'View Documentation',
  },
  ar: {
    back: '→ العودة للمنتجات', version: 'الإصدار الحالي',
    latest_release: 'آخر إصدار', overview: 'نظرة عامة',
    get_started: 'ابدأ الآن', view_docs: 'عرض التوثيق',
  },
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  try {
    const product = await api.product(slug, locale)
    return buildMetadata({
      locale,
      path: `/products/${slug}`,
      title: product.seo?.title ?? product.name,
      description: product.seo?.description ?? product.short_desc,
      image: product.cover_image?.url,
    })
  } catch {
    return buildMetadata({
      locale,
      path: `/products/${slug}`,
      title: 'Product',
      description: 'YS Systems & Software product.',
      noIndex: true, // unresolvable product — don't index a broken page
    })
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const t = content[locale as keyof typeof content] ?? content.en

  let product: ProductDetail
  try {
    product = await api.product(slug, locale)
  } catch {
    notFound()
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: product.name,
    description: product.short_desc,
    applicationCategory: 'BusinessApplication',
    ...(product.current_version ? { softwareVersion: product.current_version } : {}),
    ...(product.cover_image ? { image: product.cover_image.url } : {}),
    offers: {
      '@type': 'Offer',
      availability: product.status === 'active' || product.status === 'beta'
        ? 'https://schema.org/InStock'
        : 'https://schema.org/PreOrder',
    },
    publisher: {
      '@type': 'Organization',
      name: 'YS Systems & Software',
    },
  }

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: 'var(--color-background)' }}>
      {/* Structured data for rich search results */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <section style={{ paddingTop: '7rem', paddingBottom: '5rem', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container-site">
          <Link href={`/${locale}/products`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--color-foreground-muted)', textDecoration: 'none', marginBottom: '2rem' }}>
            {t.back}
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <StatusBadge status={product!.status} />
                {product!.current_version && (
                  <span style={{ fontSize: '0.875rem', fontFamily: 'monospace', color: 'var(--color-foreground-muted)', padding: '0.25rem 0.75rem', backgroundColor: 'var(--color-background-subtle)', borderRadius: 6 }}>
                    v{product!.current_version}
                  </span>
                )}
              </div>

              <h1 className="font-display font-semibold tracking-tight text-fluid-2xl" style={{ color: 'var(--color-foreground)' }}>
                {product!.name}
              </h1>

              <p className="text-fluid-base" style={{ color: 'var(--color-foreground-muted)', lineHeight: 1.7 }}>
                {product!.short_desc}
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link href={`/${locale}/contact`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.75rem 1.5rem', borderRadius: 8, fontSize: '0.875rem', fontWeight: 500,
                  backgroundColor: 'var(--color-accent)', color: '#fff', textDecoration: 'none',
                }}>
                  {t.get_started}
                </Link>
                <Link href={`/${locale}/docs`} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.75rem 1.5rem', borderRadius: 8, fontSize: '0.875rem', fontWeight: 500,
                  border: '1px solid var(--color-border)', color: 'var(--color-foreground)',
                  backgroundColor: 'var(--color-background-subtle)', textDecoration: 'none',
                }}>
                  {t.view_docs}
                </Link>
              </div>
            </div>

            {/* Cover Image */}
            <div style={{ position: 'relative', height: '20rem', borderRadius: '1.5rem', overflow: 'hidden', backgroundColor: 'var(--color-background-subtle)' }}>
              {product!.cover_image ? (
                <Image src={product!.cover_image.url} alt={product!.name} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
              ) : (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ width: 96, height: 96, borderRadius: 24, backgroundColor: 'var(--color-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="font-display font-bold" style={{ fontSize: '2.5rem', color: 'var(--color-accent)' }}>
                      {product!.name.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Overview */}
      {product!.long_desc && (
        <section className="section-sm">
          <div className="container-site">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <h2 className="font-display font-semibold text-fluid-xl" style={{ color: 'var(--color-foreground)', marginBottom: '1.5rem' }}>
                  {t.overview}
                </h2>
                <div style={{ color: 'var(--color-foreground-muted)', lineHeight: 1.8, fontSize: '1rem' }}
                  dangerouslySetInnerHTML={{ __html: product!.long_desc }} />
              </div>

              {/* Sidebar */}
              <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {product!.latest_release && (
                  <div style={{ padding: '1.5rem', borderRadius: '1rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                    <h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
                      {t.latest_release}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'monospace', color: 'var(--color-foreground)' }}>
                        v{product!.latest_release.version}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>
                      {product!.latest_release.release_date}
                    </p>
                    {product!.latest_release.notes && (
                      <p style={{ fontSize: '0.875rem', color: 'var(--color-foreground-muted)', marginTop: '0.75rem', lineHeight: 1.6 }}>
                        {product!.latest_release.notes}
                      </p>
                    )}
                  </div>
                )}
              </aside>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
