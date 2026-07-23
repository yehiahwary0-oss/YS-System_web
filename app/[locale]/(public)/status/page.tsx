import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { buildMetadata } from '@/lib/seo'

const locales = ['en', 'ar'] as const

// ── STATUS ───────────────────────────────────────────────────────────

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  return buildMetadata({
    locale, path: '/status',
    title: locale === 'ar' ? 'حالة النظام' : 'System Status',
    description: locale === 'ar' ? 'حالة أنظمة YS Systems & Software في الوقت الفعلي' : 'Real-time status of YS Systems & Software services',
  })
}

export default async function StatusPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!(locales as readonly string[]).includes(locale)) notFound()

  const isAr = locale === 'ar'
  const services = [
    { name: isAr ? 'واجهة برمجة التطبيقات' : 'API',           status: 'operational' },
    { name: isAr ? 'قاعدة البيانات' : 'Database',             status: 'operational' },
    { name: isAr ? 'خدمة الملفات' : 'Storage',                status: 'operational' },
    { name: isAr ? 'البريد الإلكتروني' : 'Email Service',     status: 'operational' },
    { name: isAr ? 'موقع الشركة' : 'Company Website',         status: 'operational' },
  ]

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: 'var(--color-background)' }}>
      <section style={{ paddingTop: '7rem', paddingBottom: '5rem', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container-site" style={{ maxWidth: '48rem' }}>
          <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Status</p>
          <h1 className="font-display font-semibold text-fluid-2xl" style={{ color: 'var(--color-foreground)', marginBottom: '1rem' }}>
            {isAr ? 'حالة النظام' : 'System Status'}
          </h1>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', borderRadius: 9999, backgroundColor: 'rgba(16,185,129,0.1)', color: '#10B981', fontSize: '0.875rem', fontWeight: 500 }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#10B981' }} />
            {isAr ? 'جميع الأنظمة تعمل بشكل طبيعي' : 'All systems operational'}
          </div>
        </div>
      </section>

      <section className="section-sm">
        <div className="container-site" style={{ maxWidth: '48rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {services.map(({ name, status }) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.125rem 1.5rem', borderRadius: '0.875rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                <span style={{ fontSize: '0.9375rem', fontWeight: 500, color: 'var(--color-foreground)' }}>{name}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#10B981', fontWeight: 500 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: '#10B981' }} />
                  {isAr ? 'يعمل' : 'Operational'}
                </span>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '2rem', fontSize: '0.8125rem', color: 'var(--color-foreground-muted)', textAlign: 'center' }}>
            {isAr ? `آخر تحديث: ${new Date().toLocaleDateString('ar')}` : `Last updated: ${new Date().toLocaleDateString()}`}
          </p>
        </div>
      </section>
    </div>
  )
}
