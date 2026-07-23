import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { api } from '@/lib/api/client'
import { buildMetadata } from '@/lib/seo'
import type { FaqItem } from '@/types'

const locales = ['en', 'ar'] as const

const fallbackFaqs: Record<string, Array<{ q: string; a: string }>> = {
  en: [
    { q: 'What is YS Systems?', a: 'YS Systems & Software is a software company that builds modern, scalable, and secure software systems, SaaS platforms, and industry-specific business solutions for companies of all sizes.' },
    { q: 'What products do you offer?', a: 'We develop a range of software products including YS-Matrix, YS-Sports, and Vortex Trader_Y. Visit our Products page for detailed information about each product.' },
    { q: 'How can I get started?', a: 'The best way to get started is to explore our products and documentation. If you have specific questions or want to discuss a partnership, feel free to reach out through our Contact page.' },
    { q: 'Do you offer enterprise support?', a: 'Yes, we provide support for all our products. You can reach us through the Contact page, and our team will assist you with your inquiry.' },
    { q: 'Is my data secure with your platform?', a: 'We take security seriously. We implement industry-standard security measures including encryption at rest and in transit, access controls, and regular security assessments. Visit our Security page for more details.' },
    { q: 'How do you handle privacy?', a: 'We are committed to protecting your privacy. We only collect information necessary to provide our services, do not sell personal data to third parties, and implement appropriate security measures. See our Privacy Policy for full details.' },
    { q: 'Can I request a feature?', a: 'Absolutely! We welcome feature suggestions. You can check our Roadmap to see what is planned or contact us with your ideas.' },
    { q: 'Do you provide documentation?', a: 'Yes, comprehensive documentation is available for all our products. Visit our Docs section to get started.' },
  ],
  ar: [
    { q: 'ما هي YS Systems؟', a: 'YS Systems & Software هي شركة برمجيات تبني أنظمة برمجية حديثة وقابلة للتوسع وآمنة ومنصات SaaS وحلول أعمال متخصصة للشركات من جميع الأحجام.' },
    { q: 'ما هي المنتجات التي تقدمونها؟', a: 'نقوم بتطوير مجموعة من المنتجات البرمجية بما في ذلك YS-Matrix و YS-Sports و Vortex Trader_Y. تفضل بزيارة صفحة المنتجات للحصول على معلومات مفصلة عن كل منتج.' },
    { q: 'كيف يمكنني البدء؟', a: 'أفضل طريقة للبدء هي استكشاف منتجاتنا والتوثيق. إذا كانت لديك أسئلة محددة أو ترغب في مناقشة شراكة، فلا تتردد في التواصل معنا من خلال صفحة الاتصال.' },
    { q: 'هل تقدمون دعمًا للمؤسسات؟', a: 'نعم، نقدم الدعم لجميع منتجاتنا. يمكنك التواصل معنا من خلال صفحة الاتصال وسيقوم فريقنا بمساعدتك في استفسارك.' },
    { q: 'هل بياناتي آمنة على منصتكم؟', a: 'نحن نأخذ الأمان على محمل الجد. ننفذ تدابير أمنية قياسية في الصناعة بما في ذلك التشفير أثناء التخزين والنقل وضوابط الوصول والتقييمات الأمنية المنتظمة. تفضل بزيارة صفحة الأمان لمزيد من التفاصيل.' },
    { q: 'كيف تتعاملون مع الخصوصية؟', a: 'نحن ملتزمون بحماية خصوصيتك. نجمع فقط المعلومات اللازمة لتقديم خدماتنا، ولا نبيع البيانات الشخصية لأطراف ثالثة، وننفذ تدابير أمنية مناسبة. راجع سياسة الخصوصية للحصول على التفاصيل الكاملة.' },
    { q: 'هل يمكنني طلب ميزة؟', a: 'بالتأكيد! نحن نرحب باقتراحات الميزات. يمكنك الاطلاع على خارطة الطريق لمعرفة ما هو مخطط له أو التواصل معنا بأفكارك.' },
    { q: 'هل توفرون توثيقًا؟', a: 'نعم، يتوفر توثيق شامل لجميع منتجاتنا. تفضل بزيارة قسم التوثيق للبدء.' },
  ],
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata({
    locale, path: '/faq',
    title: locale === 'ar' ? 'الأسئلة الشائعة' : 'FAQ',
    description: locale === 'ar' ? 'الأسئلة الشائعة حول YS Systems & Software' : 'Frequently asked questions about YS Systems & Software',
  })
}

export default async function FAQPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!(locales as readonly string[]).includes(locale)) notFound()
  const isAr = locale === 'ar'

  let faqItems: FaqItem[] = []
  try {
    faqItems = await api.faqs(locale)
  } catch {}

  const items = faqItems.length > 0
    ? faqItems
    : (fallbackFaqs[locale] ?? fallbackFaqs.en).map((f, i) => ({ id: String(i), question: f.q, answer: f.a, category: null }))

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map(item => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: 'var(--color-background)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <section style={{ paddingTop: '7rem', paddingBottom: '5rem', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container-site" style={{ maxWidth: '48rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>
            {isAr ? 'الأسئلة الشائعة' : 'FAQ'}
          </p>
          <h1 className="font-display font-semibold tracking-tight text-fluid-2xl" style={{ color: 'var(--color-foreground)', marginBottom: '1rem' }}>
            {isAr ? 'الأسئلة الشائعة' : 'Frequently Asked Questions'}
          </h1>
          <p className="text-fluid-base" style={{ color: 'var(--color-foreground-muted)', maxWidth: '36rem' }}>
            {isAr ? 'إجابات على الأسئلة الأكثر شيوعًا حول YS Systems ومنتجاتها.' : 'Answers to the most common questions about YS Systems and our products.'}
          </p>
        </div>
      </section>

      <section className="section-sm">
        <div className="container-site" style={{ maxWidth: '48rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {items.map((item, i) => (
            <div key={item.id ?? i} style={{ padding: '1.5rem', borderRadius: '0.875rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
              <h2 className="font-display font-semibold" style={{ fontSize: '1.0625rem', color: 'var(--color-foreground)', marginBottom: '0.75rem' }}>{item.question}</h2>
              <p style={{ color: 'var(--color-foreground-muted)', lineHeight: 1.8, fontSize: '0.9375rem' }}>{item.answer}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-sm section-divider-top" style={{ backgroundColor: 'var(--color-background-subtle)' }}>
        <div className="container-site" style={{ textAlign: 'center', maxWidth: '36rem', marginInline: 'auto' }}>
          <h2 className="font-display font-semibold text-fluid-xl" style={{ color: 'var(--color-foreground)', marginBottom: '0.75rem' }}>
            {isAr ? 'لم تجد إجابتك؟' : 'Didn\'t find your answer?'}
          </h2>
          <p style={{ color: 'var(--color-foreground-muted)', marginBottom: '1.5rem' }}>
            {isAr ? 'تواصل معنا وسنكون سعداء بمساعدتك.' : 'Get in touch and we\'ll be happy to help.'}
          </p>
          <a href={`/${locale}/contact`} style={{ display: 'inline-flex', padding: '0.625rem 1.5rem', borderRadius: 10, backgroundColor: 'var(--color-accent)', color: '#fff', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
            {isAr ? 'تواصل معنا' : 'Contact Us'}
          </a>
        </div>
      </section>
    </div>
  )
}
