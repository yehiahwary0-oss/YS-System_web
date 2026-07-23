import { Lock, Globe, Zap, Gauge } from 'lucide-react'
import { AnimatedBox } from '@/components/shared/AnimatedBox'
import { cn } from '@/lib/utils/cn'
import type { PublicSettings, HomepageSection } from '@/types'
import { whyChooseContentSchema, type WhyChooseItemData } from '@/lib/cms/schemas'
import { validateCmsContent } from '@/lib/cms/validate'

interface WhyChooseSectionProps {
  locale: string
  settings?: PublicSettings
  cmsSection?: HomepageSection
}

interface WhyChooseItem {
  icon: typeof Lock
  iconLabel: string
  title_en: string
  title_ar: string
  description_en: string
  description_ar: string
}

const iconMap: Record<string, typeof Lock> = { Lock, Globe, Zap, Gauge }

const fallbackItems: WhyChooseItem[] = [
  {
    icon: Lock, iconLabel: 'Security',
    title_en: 'Security First', title_ar: 'الأمان أولاً',
    description_en: 'Enterprise-grade security built into every layer, from authentication to data storage.',
    description_ar: 'أمان بمستوى المؤسسات مدمج في كل طبقة، من المصادقة إلى تخزين البيانات.',
  },
  {
    icon: Globe, iconLabel: 'Global',
    title_en: 'Bilingual by Design', title_ar: 'ثنائي اللغة بالتصميم',
    description_en: 'Full Arabic and English support with proper RTL layouts across every product.',
    description_ar: 'دعم كامل للعربية والإنجليزية مع تخطيطات RTL صحيحة عبر كل منتج.',
  },
  {
    icon: Zap, iconLabel: 'Performance',
    title_en: 'Built to Scale', title_ar: 'مبني للتوسع',
    description_en: 'Architecture designed to grow with your business, from startup to enterprise.',
    description_ar: 'معمارية مصممة للنمو مع أعمالك، من الشركات الناشئة إلى المؤسسات الكبرى.',
  },
  {
    icon: Gauge, iconLabel: 'Speed',
    title_en: 'Modern & Fast', title_ar: 'حديث وسريع',
    description_en: 'Optimized performance and modern tech stack for the best experience at any scale.',
    description_ar: 'أداء محسّن وتقنيات حديثة لأفضل تجربة ممكنة على أي نطاق.',
  },
]

const sectionLabels = {
  en: { eyebrow: 'Why YS Systems', title: 'Built Different' },
  ar: { eyebrow: 'لماذا YS Systems', title: 'مبنية بشكل مختلف' },
}

function parseCmsItems(raw: WhyChooseItemData[]): WhyChooseItem[] {
  return raw.map((item) => {
    const iconName = item.icon ?? 'Lock'
    const IconComponent = iconMap[iconName] ?? Lock
    return {
      icon: IconComponent,
      iconLabel: iconName,
      title_en: item.title_en ?? '',
      title_ar: item.title_ar ?? '',
      description_en: item.description_en ?? '',
      description_ar: item.description_ar ?? '',
    }
  })
}

export function WhyChooseSection({ locale, settings, cmsSection }: WhyChooseSectionProps) {
  const isAr = locale === 'ar'
  const t    = sectionLabels[locale as keyof typeof sectionLabels] ?? sectionLabels.en

  const cmsContent = validateCmsContent(cmsSection, whyChooseContentSchema)
  const settingsRawItems = (settings?.content?.why_choose_items as WhyChooseItemData[] | undefined) ?? []
  const items: WhyChooseItem[] = cmsContent?.items?.length
    ? parseCmsItems(cmsContent.items)
    : settingsRawItems.length
      ? parseCmsItems(settingsRawItems)
      : fallbackItems

  const heading = cmsSection?.title ?? t.title
  const eyebrow = cmsSection?.subtitle ?? t.eyebrow

  return (
    <section className="section-sm" style={{ borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-background-subtle)' }}>
      <div className="container-site">
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
            {eyebrow}
            </p>
            <h2 className="font-display font-semibold text-fluid-xl" style={{ color: 'var(--color-foreground)' }}>
            {heading}
          </h2>
        </div>

        {/* Desktop / tablet — one glass container, items divided inside it */}
        <div
          className="hidden sm:grid grid-cols-2 lg:grid-cols-4 rounded-[1.5rem] overflow-hidden"
          style={{ border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
        >
          {items.map((item, i) => (
            <AnimatedBox
              key={item.title_en + i}
              whileInView
              delay={i * 0.1}
              y={16}
              className={cn(
                'p-6 lg:p-8',
                i % 2 === 0 && 'border-e',                 // tablet: divider between the 2 columns
                i < items.length - 2 && 'border-b',         // tablet: divider between the 2 rows
                'lg:border-b-0 lg:border-e-0',              // desktop: clear tablet dividers…
                i % 4 !== 0 && 'lg:border-s',               // …use one continuous divider per column instead
              )}
              style={{ borderColor: 'var(--color-border)' }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: 'var(--color-accent-subtle)' }}
              >
                <item.icon size={20} style={{ color: 'var(--color-accent)' }} aria-hidden="true" />
              </div>
              <h3 className="font-display font-semibold text-[1.0625rem] mb-2.5" style={{ color: 'var(--color-foreground)' }}>
                {isAr ? item.title_ar : item.title_en}
              </h3>
              <p className="text-[0.9375rem] leading-relaxed" style={{ color: 'var(--color-foreground-muted)' }}>
                {isAr ? item.description_ar : item.description_en}
              </p>
            </AnimatedBox>
          ))}
        </div>

        {/* Mobile — horizontal snap-scroll carousel, not vertical stacking */}
        <div
          className="sm:hidden flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 pb-2"
        >
          {items.map((item, i) => (
            <div
              key={item.title_en + i}
              className="snap-center shrink-0 rounded-2xl p-5"
              style={{ width: '78%', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ backgroundColor: 'var(--color-accent-subtle)' }}
              >
                <item.icon size={18} style={{ color: 'var(--color-accent)' }} aria-hidden="true" />
              </div>
              <h3 className="font-display font-semibold text-sm mb-1.5" style={{ color: 'var(--color-foreground)' }}>
                {isAr ? item.title_ar : item.title_en}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: 'var(--color-foreground-muted)' }}>
                {isAr ? item.description_ar : item.description_en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
