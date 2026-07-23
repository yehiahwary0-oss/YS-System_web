import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api/client'
import { buildMetadata } from '@/lib/seo'
import { EmptyState } from '@/components/ui/EmptyState'
import type { Career } from '@/types'

const locales = ['en', 'ar'] as const
const content = {
  en: {
    title: 'Careers', subtitle: "Join us in building the future of software. We're always looking for talented people.",
    open_positions: 'Open Positions', apply: 'Apply Now', location: 'Location',
    types: { full_time: 'Full Time', part_time: 'Part Time', contract: 'Contract', internship: 'Internship' },
    no_jobs: 'No open positions at the moment. Check back soon!',
    perks_title: 'Why join us?',
    perks: ['Remote-first culture', 'Competitive compensation', 'Work on cutting-edge products', 'Growth opportunities'],
  },
  ar: {
    title: 'الوظائف', subtitle: 'انضم إلينا في بناء مستقبل البرمجيات. نبحث دائماً عن أشخاص موهوبين.',
    open_positions: 'الوظائف المتاحة', apply: 'تقدم الآن', location: 'الموقع',
    types: { full_time: 'دوام كامل', part_time: 'دوام جزئي', contract: 'عقد', internship: 'تدريب' },
    no_jobs: 'لا توجد وظائف شاغرة في الوقت الحالي. تحقق مرة أخرى قريباً!',
    perks_title: 'لماذا تنضم إلينا؟',
    perks: ['ثقافة العمل عن بُعد', 'تعويضات تنافسية', 'العمل على منتجات متطورة', 'فرص للنمو'],
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const t = content[locale as keyof typeof content] ?? content.en
  return buildMetadata({ locale, path: '/careers', title: t.title, description: t.subtitle })
}

export default async function CareersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  if (!(locales as readonly string[]).includes(locale)) notFound()
  const t = content[locale as keyof typeof content] ?? content.en

  let careers: Career[] = []
  try { careers = await api.careers(locale) } catch {}

  const departments = [...new Set(careers.map(c => c.department))]

  return (
    <div style={{ minHeight: '100dvh', backgroundColor: 'var(--color-background)' }}>
      {/* Hero */}
      <section style={{ paddingTop: '7rem', paddingBottom: '5rem', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container-site">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-accent)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Careers</p>
              <h1 className="font-display font-semibold tracking-tight text-fluid-2xl" style={{ color: 'var(--color-foreground)', marginBottom: '1.5rem' }}>{t.title}</h1>
              <p className="text-fluid-base" style={{ color: 'var(--color-foreground-muted)', lineHeight: 1.7 }}>{t.subtitle}</p>
            </div>

            {/* Perks */}
            <div style={{ padding: '2rem', borderRadius: '1.25rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
              <h2 className="font-display font-semibold" style={{ color: 'var(--color-foreground)', fontSize: '1.125rem', marginBottom: '1.25rem' }}>{t.perks_title}</h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
                {t.perks.map((perk) => (
                  <li key={perk} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9375rem', color: 'var(--color-foreground-muted)' }}>
                    <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>✓</span>
                    {perk}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="section-sm">
        <div className="container-site">
          <h2 className="font-display font-semibold text-fluid-xl" style={{ color: 'var(--color-foreground)', marginBottom: '2.5rem' }}>
            {t.open_positions}
            {careers.length > 0 && (
              <span style={{ fontSize: '1rem', fontWeight: 400, color: 'var(--color-foreground-muted)', marginLeft: '0.75rem' }}>({careers.length})</span>
            )}
          </h2>

          {careers.length === 0 ? (
            <EmptyState message={t.no_jobs} />
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {departments.map(dept => {
                const deptJobs = careers.filter(c => c.department === dept)
                return (
                  <div key={dept}>
                    <h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-foreground-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem', paddingLeft: '0.25rem' }}>
                      {dept}
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {deptJobs.map((career) => (
                        <div key={career.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', padding: '1.25rem 1.5rem', borderRadius: '0.875rem', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', transition: 'all 200ms' }}
                          className="hover:border-border-strong hover:shadow-sm"
                        >
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                            <h4 className="font-display font-semibold" style={{ color: 'var(--color-foreground)', fontSize: '1rem' }}>{career.title}</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                              <span style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>📍 {career.location}</span>
                              <span style={{ fontSize: '0.8125rem', color: 'var(--color-foreground-muted)' }}>
                                {t.types[career.type as keyof typeof t.types] ?? career.type}
                              </span>
                            </div>
                          </div>
                          <Link href={`/${locale}/contact?type=general&subject=Application: ${career.title}`} style={{
                            display: 'inline-flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0,
                            padding: '0.625rem 1.25rem', borderRadius: 8, fontSize: '0.875rem', fontWeight: 500,
                            backgroundColor: 'var(--color-accent)', color: '#fff', textDecoration: 'none',
                          }}>
                            {t.apply}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
