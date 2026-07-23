import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { api } from '@/lib/api/client'
import { buildMetadata } from '@/lib/seo'
import type { StaticPage } from '@/types'

const locales = ['en', 'ar'] as const
const fallbackSections = {
  en: [
    { title: 'Information We Collect', body: 'We collect information you provide directly to us, such as when you contact us or use our services.' },
    { title: 'How We Use Your Information', body: 'We use information to provide and improve our services, communicate with you, and ensure security.' },
    { title: 'Information Sharing', body: 'We do not sell your personal information to third parties. We may share it with service providers only when necessary.' },
    { title: 'Security', body: 'We take appropriate security measures to protect your information from unauthorized access or disclosure.' },
    { title: 'Contact Us', body: 'If you have questions about this Privacy Policy, please contact us at cantactys@gmail.com' },
  ],
  ar: [
    { title: 'المعلومات التي نجمعها', body: 'نجمع المعلومات التي تقدمها مباشرةً لنا، مثل عندما تتواصل معنا أو تستخدم خدماتنا.' },
    { title: 'كيف نستخدم معلوماتك', body: 'نستخدم المعلومات لتقديم خدماتنا وتحسينها، والتواصل معك، وضمان الأمان.' },
    { title: 'مشاركة المعلومات', body: 'لا نبيع معلوماتك الشخصية لأطراف ثالثة. قد نشاركها مع مزودي الخدمات فقط عند الضرورة.' },
    { title: 'الأمان', body: 'نتخذ تدابير أمنية مناسبة لحماية معلوماتك من الوصول غير المصرح به أو الإفصاح.' },
    { title: 'الاتصال بنا', body: 'إذا كانت لديك أسئلة حول سياسة الخصوصية، يرجى التواصل معنا على cantactys@gmail.com' },
  ],
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata({
    locale, path: '/privacy',
    title: locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy',
    description: locale === 'ar' ? 'اطلع على سياسة الخصوصية لـ YS Systems & Software. نوضح كيفية جمع واستخدام وحماية معلوماتك الشخصية.' : 'Learn how YS Systems & Software collects, uses, and protects your personal information. Your privacy matters to us.',
  })
}

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!(locales as readonly string[]).includes(locale)) notFound()
  const isAr = locale === 'ar'
  const f = fallbackSections[locale as keyof typeof fallbackSections] ?? fallbackSections.en

  let sections: { title: string; body: string }[] = f
  try {
    const page: StaticPage = await api.page('privacy', locale)
    if (page?.content) {
      const parsed = JSON.parse(page.content)
      if (Array.isArray(parsed)) sections = parsed
    }
  } catch {}

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: 'var(--color-background)' }}>
      <section style={{ paddingTop: '7rem', paddingBottom: '4rem', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container-site" style={{ maxWidth: '48rem' }}>
          <h1 className="font-display font-semibold text-fluid-2xl" style={{ color: 'var(--color-foreground)', marginBottom: '0.75rem' }}>
            {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
          </h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--color-foreground-muted)' }}>
            {isAr ? `آخر تحديث: ${new Date().toLocaleDateString('ar')}` : `Last updated: ${new Date().toLocaleDateString()}`}
          </p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container-site" style={{ maxWidth: '48rem', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
          {sections.map(({ title, body }) => (
            <div key={title}>
              <h2 className="font-display font-semibold" style={{ fontSize: '1.125rem', color: 'var(--color-foreground)', marginBottom: '0.75rem' }}>{title}</h2>
              <p style={{ color: 'var(--color-foreground-muted)', lineHeight: 1.8, whiteSpace: 'pre-line' }}>{body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-sm section-divider-top" style={{ backgroundColor: 'var(--color-background-subtle)' }}>
        <div className="container-site" style={{ textAlign: 'center', maxWidth: '36rem', marginInline: 'auto' }}>
          <h2 className="font-display font-semibold text-fluid-xl" style={{ color: 'var(--color-foreground)', marginBottom: '0.75rem' }}>
            {isAr ? 'هل لديك سؤال عن الخصوصية؟' : 'Questions about privacy?'}
          </h2>
          <p style={{ color: 'var(--color-foreground-muted)', marginBottom: '1.5rem' }}>
            {isAr ? 'نحن هنا للإجابة على استفساراتك.' : "We're here to answer your questions."}
          </p>
          <a href={`/${locale}/contact`} style={{ display: 'inline-flex', padding: '0.625rem 1.5rem', borderRadius: 10, backgroundColor: 'var(--color-accent)', color: '#fff', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
            {isAr ? 'تواصل معنا' : 'Contact Us'}
          </a>
        </div>
      </section>
    </div>
  )
}
