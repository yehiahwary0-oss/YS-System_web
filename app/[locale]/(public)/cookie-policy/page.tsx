import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { api } from '@/lib/api/client'
import { buildMetadata } from '@/lib/seo'
import type { StaticPage } from '@/types'

const locales = ['en', 'ar'] as const

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata({
    locale, path: '/cookie-policy',
    title: locale === 'ar' ? 'سياسة ملفات تعريف الارتباط' : 'Cookie Policy',
    description: locale === 'ar' ? 'تعرف على كيفية استخدام YS Systems & Software لملفات تعريف الارتباط، وأنواعها، وكيفية إدارة تفضيلاتك بسهولة.' : 'Learn how YS Systems & Software uses cookies, the types we set, and how you can manage your cookie preferences at any time.',
  })
}

export default async function CookiePolicyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!(locales as readonly string[]).includes(locale)) notFound()
  const isAr = locale === 'ar'

  const fallbackSections = isAr ? [
    { title: 'ما هي ملفات تعريف الارتباط؟', body: 'ملفات تعريف الارتباط هي ملفات نصية صغيرة يتم وضعها على جهاز الكمبيوتر أو الجهاز المحمول الخاص بك عند زيارة موقع ويب. تُستخدم على نطاق واسع لجعل مواقع الويب تعمل أو تعمل بكفاءة أكبر، بالإضافة إلى توفير معلومات لأصحاب الموقع.' },
    { title: 'كيف نستخدم ملفات تعريف الارتباط', body: 'نستخدم ملفات تعريف الارتباط للأغراض التالية:\n\n• ملفات تعريف الارتباط الأساسية: مطلوبة لتشغيل موقعنا الإلكتروني ولا يمكن إيقاف تشغيلها. يتم تعيينها عادةً فقط استجابةً لإجراءات قمت بها مثل تسجيل الدخول أو ملء النماذج.\n\n• ملفات تعريف الارتباط التحليلية: تساعدنا على فهم كيفية تفاعل الزوار مع موقعنا من خلال جمع المعلومات بشكل مجهول. نستخدم هذه المعلومات لتحسين أداء موقعنا وتجربة المستخدم.' },
    { title: 'الموافقة', body: 'عند زيارتك لموقعنا لأول مرة، سنعرض لك نافذة منبثقة تشرح سياسة ملفات تعريف الارتباط الخاصة بنا. يمكنك اختيار قبول جميع ملفات تعريف الارتباط أو رفض ملفات تعريف الارتباط غير الأساسية أو تخصيص تفضيلاتك. يتم تخزين تفضيلاتك في متصفحك لاستخدامها في الزيارات المستقبلية.' },
    { title: 'إدارة التفضيلات', body: 'يمكنك تغيير تفضيلات ملفات تعريف الارتباط الخاصة بك في أي وقت عن طريق ضبط إعدادات متصفحك. يمكن لمعظم المتصفحات حذف ملفات تعريف الارتباط أو رفضها. يرجى ملاحظة أن تعطيل ملفات تعريف الارتباط الأساسية قد يؤثر على وظائف موقعنا.' },
    { title: 'جهات خارجية', body: 'لا نستخدم خدمات جهات خارجية تضع ملفات تعريف ارتباط غير أساسية دون موافقتك الصريحة. أي ملفات تعريف ارتباط تابعة لجهات خارجية سنطلبها سيتم إدارتها وفقًا لسياسات الخصوصية الخاصة بها.' },
    { title: 'الاتصال بنا', body: 'إذا كانت لديك أسئلة حول سياسة ملفات تعريف الارتباط الخاصة بنا، يرجى التواصل معنا على cantactys@gmail.com.' },
  ] : [
    { title: 'What Are Cookies?', body: 'Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work or work more efficiently, as well as to provide information to the site owners.' },
    { title: 'How We Use Cookies', body: 'We use cookies for the following purposes:\n\n• Essential Cookies: Required for our website to function and cannot be switched off. They are usually set only in response to actions you take such as logging in or filling in forms.\n\n• Analytics Cookies: Help us understand how visitors interact with our website by collecting information anonymously. We use this data to improve our site performance and user experience.' },
    { title: 'Consent', body: 'When you first visit our site, we will show you a pop-up explaining our cookie policy. You can choose to accept all cookies, reject non-essential cookies, or customize your preferences. Your preferences are stored in your browser for use on future visits.' },
    { title: 'Managing Preferences', body: 'You can change your cookie preferences at any time by adjusting your browser settings. Most browsers allow you to delete or reject cookies. Please note that disabling essential cookies may affect the functionality of our site.' },
    { title: 'Third Parties', body: 'We do not use any third-party services that place non-essential cookies without your explicit consent. Any third-party cookies we may request will be managed according to their respective privacy policies.' },
    { title: 'Contact Us', body: 'If you have any questions about our Cookie Policy, please contact us at cantactys@gmail.com.' },
  ]

  let sections = fallbackSections
  try {
    const page: StaticPage = await api.page('cookie-policy', locale)
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
            {isAr ? 'سياسة ملفات تعريف الارتباط' : 'Cookie Policy'}
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
            {isAr ? 'هل لديك سؤال عن الكوكيز؟' : 'Questions about cookies?'}
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
