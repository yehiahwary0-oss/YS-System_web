import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import { StatusBadge } from '@/components/ui/Badge'
import { AnimatedBox } from '@/components/shared/AnimatedBox'
import { cn } from '@/lib/utils/cn'
import type { Product, HomepageSection } from '@/types'

interface ProductsSectionProps {
  locale: string
  products: Product[]
  cmsSection?: HomepageSection
}

const content = {
  en: { title: 'Our Products', subtitle: 'A growing ecosystem of software solutions.', view_all: 'View All', learn_more: 'Learn More' },
  ar: { title: 'منتجاتنا', subtitle: 'منظومة متنامية من الحلول البرمجية.', view_all: 'عرض الكل', learn_more: 'اعرف المزيد' },
}

export function ProductsSection({ locale, products, cmsSection }: ProductsSectionProps) {
  const isAr = locale === 'ar'
  const t = content[locale as keyof typeof content] ?? content.en
  if (!products.length) return null
  const heading = cmsSection?.title ?? t.title
  const subtitle = cmsSection?.subtitle ?? t.subtitle

  return (
    <section className="section" style={{ backgroundColor: 'var(--color-background)' }}>
      <div className="container-site">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '3rem' }} className="sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Products</p>
            <h2 className="font-display font-semibold text-fluid-2xl tracking-tight" style={{ color: 'var(--color-foreground)' }}>{heading}</h2>
            <p style={{ marginTop: '0.5rem', color: 'var(--color-foreground-muted)' }}>{subtitle}</p>
          </div>
          <Link href={`/${locale}/products`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.875rem', color: 'var(--color-accent)', fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            {isAr ? <ArrowLeft size={15} /> : <ArrowRight size={15} />} {t.view_all}
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <ProductCard key={product.id} product={product} locale={locale} index={i} learnMore={t.learn_more} />
          ))}
        </div>
      </div>
    </section>
  )
}

function ProductCard({ product, locale, index, learnMore }: { product: Product; locale: string; index: number; learnMore: string }) {
  const isAr = locale === 'ar'
  return (
    <AnimatedBox whileInView delay={index * 0.08} y={24}>
      <Link href={`/${locale}/products/${product.slug}`} className={cn('group flex flex-col h-full rounded-2xl border transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent')}
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', textDecoration: 'none' }}>
        <div style={{ position: 'relative', height: '12rem', borderRadius: '1rem 1rem 0 0', overflow: 'hidden', backgroundColor: 'var(--color-background-subtle)' }}>
          {product.cover_image ? (
            <Image src={product.cover_image.url} alt={product.cover_image.alt ?? product.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
          ) : (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 64, height: 64, borderRadius: 16, backgroundColor: 'var(--color-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="font-display font-bold text-2xl" style={{ color: 'var(--color-accent)' }}>{product.name.slice(0, 2).toUpperCase()}</span>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '1.5rem', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
            <h3 className="font-display font-semibold" style={{ color: 'var(--color-foreground)', lineHeight: 1.3 }}>{product.name}</h3>
            <StatusBadge status={product.status} />
          </div>
          <p className="text-sm line-clamp-2" style={{ color: 'var(--color-foreground-muted)', lineHeight: 1.6, flex: 1 }}>{product.short_desc}</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--color-border)' }}>
            {product.current_version && <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--color-foreground-muted)' }}>v{product.current_version}</span>}
            <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 500, color: 'var(--color-accent)' }}>
              {isAr ? <ArrowLeft size={13} /> : <ArrowRight size={13} />} {learnMore}
            </span>
          </div>
        </div>
      </Link>
    </AnimatedBox>
  )
}
