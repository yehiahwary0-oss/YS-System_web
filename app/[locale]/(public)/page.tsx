import type { Metadata } from 'next'
import { api }              from '@/lib/api/client'
import { buildMetadata }    from '@/lib/seo'
import { HeroSection }      from '@/components/sections/HeroSection'
import { ProductsSection }  from '@/components/sections/ProductsSection'
import { WhyChooseSection } from '@/components/sections/WhyChooseSection'
import { CTASection }       from '@/components/sections/CTASection'
import type { Product, PublicSettings, HomepageSection } from '@/types'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isAr = locale === 'ar'

  return buildMetadata({
    locale,
    path: '',
    title: isAr ? 'YS Systems & Software — منصات برمجية حديثة' : 'YS Systems & Software — Modern Software Products',
    description: isAr
      ? 'منصات SaaS قابلة للتوسع وآمنة ومُنتجة لحل مشكلات الأعمال الحقيقية.'
      : 'Scalable, secure, and production-grade SaaS platforms for real business problems.',
  })
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  const [productsResult, settingsResult, sectionsResult] = await Promise.allSettled([
    api.products(locale),
    api.settings(locale),
    api.homepageSections(locale).catch(() => [] as HomepageSection[]),
  ])

  const products: Product[] =
    productsResult.status === 'fulfilled' ? productsResult.value : []

  const settings: PublicSettings | undefined =
    settingsResult.status === 'fulfilled' ? settingsResult.value : undefined

  const sections: HomepageSection[] =
    sectionsResult.status === 'fulfilled' ? sectionsResult.value : []

  const heroSection = sections.find(s => s.type === 'hero')
  const whyChoose    = sections.find(s => s.type === 'why_choose')
  const productsSec  = sections.find(s => s.type === 'products')
  const ctaSection   = sections.find(s => s.type === 'cta')

  return (
    <>
      <HeroSection locale={locale} settings={settings} cmsSection={heroSection} />
      <ProductsSection locale={locale} products={products} cmsSection={productsSec} />
      <WhyChooseSection locale={locale} settings={settings} cmsSection={whyChoose} />
      <CTASection locale={locale} cmsSection={ctaSection} />
    </>
  )
}
