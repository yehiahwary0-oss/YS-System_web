import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { api } from '@/lib/api/client'
import { buildMetadata } from '@/lib/seo'
import Link from 'next/link'
import { Target, Rocket } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { TimelineEntry, PublicSettings, StaticPage } from '@/types'

const locales = ['en', 'ar'] as const
const fallbackContent = {
  en: {
    title: 'About YS Systems',
    subtitle: 'We build modern, scalable, and secure software systems that solve real business problems.',
    mission_label: 'Our Mission',
    mission: 'To create scalable, secure, modern, and professional software products that solve real business problems for companies of all sizes.',
    vision_label: 'Our Vision',
    vision: 'Building modern software systems, SaaS platforms, and industry-specific business solutions that empower businesses to grow.',
    timeline_label: 'Company Timeline',
    type_labels: { founding: 'Founding', product_launch: 'Launch', milestone: 'Milestone', award: 'Award', partnership: 'Partnership' },
    cta_heading: 'Interested in our products?',
    cta_body: 'Get in touch to learn how we can help your business.',
    cta_label: 'Contact Us',
  },
  ar: {
    title: 'عن YS Systems',
    subtitle: 'نبني أنظمة برمجية حديثة وقابلة للتوسع وآمنة تحل مشكلات الأعمال الحقيقية.',
    mission_label: 'مهمتنا',
    mission: 'إنشاء منتجات برمجية قابلة للتوسع وآمنة وحديثة واحترافية تحل مشكلات الأعمال الحقيقية للشركات من جميع الأحجام.',
    vision_label: 'رؤيتنا',
    vision: 'بناء أنظمة برمجية حديثة ومنصات SaaS وحلول أعمال متخصصة تمكّن الشركات من النمو.',
    timeline_label: 'التسلسل الزمني للشركة',
    type_labels: { founding: 'تأسيس', product_launch: 'إطلاق', milestone: 'معلم', award: 'جائزة', partnership: 'شراكة' },
    cta_heading: 'مهتم بمنتجاتنا؟',
    cta_body: 'تواصل معنا لمعرفة كيف يمكننا مساعدة عملك.',
    cta_label: 'تواصل معنا',
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const f = fallbackContent[locale as keyof typeof fallbackContent] ?? fallbackContent.en
  try {
    const page = await api.page('about', locale)
    if (page?.title) {
      return buildMetadata({ locale, path: '/about', title: page.title, description: page.excerpt ?? f.subtitle })
    }
  } catch {}
  return buildMetadata({ locale, path: '/about', title: f.title, description: f.subtitle })
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!(locales as readonly string[]).includes(locale)) notFound()
  const f = fallbackContent[locale as keyof typeof fallbackContent] ?? fallbackContent.en

  let timeline: TimelineEntry[] = []
  let settings: PublicSettings | undefined
  let cmsPage: StaticPage | undefined
  try {
    [timeline, settings, cmsPage] = await Promise.all([
      api.timeline(locale),
      api.settings(locale),
      api.page('about', locale).catch(() => undefined),
    ])
  } catch {}

  const companyName = settings?.brand?.company_name ?? 'YS Systems & Software'

  let sections: { label: string; text: string }[] = []
  if (cmsPage?.content) {
    try {
      const parsed = JSON.parse(cmsPage.content)
      if (Array.isArray(parsed)) sections = parsed
    } catch {}
  }

  const title    = cmsPage?.title ?? f.title
  const subtitle = cmsPage?.excerpt ?? f.subtitle
  const missionLabel = sections[0]?.label ?? f.mission_label
  const missionText  = sections[0]?.text ?? f.mission
  const visionLabel  = sections[1]?.label ?? f.vision_label
  const visionText   = sections[1]?.text ?? f.vision

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: 'var(--color-background)' }}>
      <section style={{ paddingTop: '7rem', paddingBottom: '5rem', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container-site" style={{ maxWidth: '56rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>About</p>
          <h1 className="font-display font-semibold tracking-tight text-fluid-2xl" style={{ color: 'var(--color-foreground)', marginBottom: '1.5rem' }}>{title}</h1>
          <p className="text-fluid-lg" style={{ color: 'var(--color-foreground-muted)', lineHeight: 1.7 }}>{subtitle}</p>
        </div>
      </section>

      <section className="section-sm" style={{ borderBottom: '1px solid var(--color-border)', overflow: 'hidden' }}>
        <div className="container-site">
          <div style={{ position: 'relative', borderRadius: '1.5rem', overflow: 'hidden', aspectRatio: '21/9', maxHeight: '32rem', backgroundColor: 'var(--color-background-subtle)' }}>
            <img src="/branding/about/about.webp" alt="" className="w-full h-full object-cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
          </div>
        </div>
      </section>

      <section className="section-sm" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <div className="container-site">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { label: missionLabel, text: missionText, icon: Target },
              { label: visionLabel,  text: visionText,  icon: Rocket },
            ].map(({ label, text, icon: Icon }) => (
              <div key={label} style={{ padding: '2rem', borderRadius: '1rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'var(--color-accent-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  <Icon size={20} style={{ color: 'var(--color-accent)' }} aria-hidden="true" />
                </div>
                <h2 className="font-display font-semibold" style={{ color: 'var(--color-foreground)', fontSize: '1.25rem', marginBottom: '1rem' }}>{label}</h2>
                <p style={{ color: 'var(--color-foreground-muted)', lineHeight: 1.7 }}>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {timeline.length > 0 && (
        <section className="section-sm">
          <div className="container-site" style={{ maxWidth: '56rem' }}>
            <h2 className="font-display font-semibold text-fluid-xl" style={{ color: 'var(--color-foreground)', marginBottom: '3rem', textAlign: 'center' }}>{f.timeline_label}</h2>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, backgroundColor: 'var(--color-border)', transform: 'translateX(-50%)' }} className="hidden md:block" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                {timeline.map((entry, i) => (
                  <div key={entry.id} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div style={{ textAlign: i % 2 === 0 ? 'right' : 'left', order: i % 2 === 0 ? 0 : 1 }} className="hidden md:block">
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)', fontWeight: 600 }}>{new Date(entry.event_date).getFullYear()}</span>
                    </div>
                    <div style={{ padding: '1.25rem 1.5rem', borderRadius: '0.875rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', order: i % 2 === 0 ? 1 : 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                          {f.type_labels[entry.type as keyof typeof f.type_labels] ?? entry.type}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }} className="md:hidden">· {new Date(entry.event_date).getFullYear()}</span>
                      </div>
                      <h3 className="font-display font-semibold" style={{ color: 'var(--color-foreground)', marginBottom: '0.25rem' }}>{entry.title}</h3>
                      {entry.description && <p style={{ fontSize: '0.875rem', color: 'var(--color-foreground-muted)', lineHeight: 1.6 }}>{entry.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="section-sm section-divider-top" style={{ backgroundColor: 'var(--color-background-subtle)' }}>
        <div className="container-site" style={{ textAlign: 'center', maxWidth: '40rem', margin: '0 auto' }}>
          <h2 className="font-display font-semibold text-fluid-xl" style={{ color: 'var(--color-foreground)', marginBottom: '1rem' }}>{f.cta_heading}</h2>
          <p style={{ color: 'var(--color-foreground-muted)', marginBottom: '2rem' }}>{f.cta_body}</p>
          <Link href={`/${locale}/contact`} style={{ textDecoration: 'none' }}>
            <Button variant="primary" size="lg">{f.cta_label}</Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
