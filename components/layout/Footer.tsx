import Link from 'next/link'
import { Github, Linkedin, Twitter, Globe } from 'lucide-react'
import type { PublicSettings, Menu } from '@/types'

interface FooterProps {
  locale: string
  settings?: PublicSettings
  menus?: Record<string, Menu>
}

const content = {
  en: {
    products: 'Products', company: 'Company', resources: 'Resources',
    privacy: 'Privacy Policy', terms: 'Terms of Service', copyright: 'All rights reserved.',
    tagline: 'Building modern software systems.',
  },
  ar: {
    products: 'المنتجات', company: 'الشركة', resources: 'الموارد',
    privacy: 'سياسة الخصوصية', terms: 'شروط الخدمة', copyright: 'جميع الحقوق محفوظة.',
    tagline: 'نبني أنظمة برمجية حديثة.',
  },
}

function menuLinks(menu: Menu | undefined, _locale: string, fallbackLinks: { href: string; label: string }[]) {
  if (!menu?.items?.length) return fallbackLinks
  return menu.items.map(item => ({
    href: item.url ?? '#',
    label: item.title,
  }))
}

export function Footer({ locale, settings, menus }: FooterProps) {
  const t = content[locale as keyof typeof content] ?? content.en
  const companyName = settings?.brand?.company_name ?? 'YS Systems & Software'
  const tagline = locale === 'ar'
    ? (settings?.brand?.company_tagline_ar ?? t.tagline)
    : (settings?.brand?.company_tagline_en ?? t.tagline)

  const productsLinks = menuLinks(menus?.footer_products, locale, [
    { href: '/products/ys-matrix', label: 'YS-Matrix' },
    { href: '/products/ys-sports', label: 'YS-Sports' },
    { href: '/products/vortex-trader-y', label: 'Vortex Trader_Y' },
  ])

  const companyLinks = menuLinks(menus?.footer_company, locale, [
    { href: '/about',    label: locale === 'ar' ? 'عن الشركة' : 'About' },
    { href: '/careers',  label: locale === 'ar' ? 'الوظائف' : 'Careers' },
    { href: '/contact',  label: locale === 'ar' ? 'تواصل معنا' : 'Contact' },
  ])

  const resourcesLinks = menuLinks(menus?.footer_resources, locale, [
    { href: '/docs',      label: locale === 'ar' ? 'التوثيق' : 'Docs' },
    { href: '/roadmap',   label: locale === 'ar' ? 'خارطة الطريق' : 'Roadmap' },
    { href: '/updates',   label: locale === 'ar' ? 'المستجدات' : 'Updates' },
    { href: '/status',    label: locale === 'ar' ? 'حالة النظام' : 'Status' },
    { href: '/faq',       label: locale === 'ar' ? 'الأسئلة الشائعة' : 'FAQ' },
    { href: '/security',  label: locale === 'ar' ? 'الأمان' : 'Security' },
  ])

  return (
    <footer style={{ borderTop: '1px solid var(--color-border)', backgroundColor: 'var(--color-background-subtle)', marginTop: 'auto' }}>
      <div className="container-site py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <Link href={`/${locale}`} className="flex items-center gap-2.5 shrink-0">
              <img
                src="/branding/logo/logo-light.webp"
                alt="YS Systems"
                width={36}
                height={36}
                className="block dark:hidden"
                style={{ width: 36, height: 36, borderRadius: 10 }}
              />
              <img
                src="/branding/logo/logo-dark.webp"
                alt="YS Systems"
                width={36}
                height={36}
                className="hidden dark:block"
                style={{ width: 36, height: 36, borderRadius: 10 }}
              />
              <span className="font-display font-semibold tracking-tight" style={{ color: 'var(--color-foreground)' }}>{companyName}</span>
            </Link>
            <p style={{ fontSize: '0.875rem', color: 'var(--color-foreground-muted)', lineHeight: 1.7, maxWidth: '18rem' }}>{tagline}</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {[
                { key: 'github',   label: 'GitHub',   url: settings?.social?.github_url,   icon: Github },
                { key: 'linkedin', label: 'LinkedIn',  url: settings?.social?.linkedin_url, icon: Linkedin },
                { key: 'x',        label: 'X (Twitter)', url: settings?.social?.x_url,        icon: Twitter },
                { key: 'tiktok',   label: 'TikTok',   url: settings?.social?.tiktok_url,   icon: Globe },
              ].filter(s => s.url).map(s => (
                <a key={s.key} href={s.url!} target="_blank" rel="noopener noreferrer"
                  aria-label={s.label}
                  className="transition-base"
                  style={{ padding: '0.5rem', borderRadius: 8, color: 'var(--color-foreground-muted)', display: 'inline-flex', textDecoration: 'none' }}>
                  <s.icon size={17} />
                </a>
              ))}
            </div>
          </div>

          <FooterCol title={t.products} locale={locale} links={productsLinks} />
          <FooterCol title={t.company} locale={locale} links={companyLinks} />
          <FooterCol title={t.resources} locale={locale} links={resourcesLinks} />
        </div>

        <div className="section-divider-top" style={{ marginTop: '3rem' }}>
          <div style={{ paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }} className="sm:flex-row">
            <p style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)' }}>
              &copy; {new Date().getFullYear()} {companyName}. {t.copyright}
            </p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {[
                { href: '/privacy',      label: t.privacy },
                { href: '/terms',        label: t.terms },
                { href: '/cookie-policy', label: locale === 'ar' ? 'سياسة ملفات تعريف الارتباط' : 'Cookie Policy' },
              ].map(({ href, label }) => (
                <Link key={href} href={`/${locale}${href}`} style={{ fontSize: '0.75rem', color: 'var(--color-foreground-muted)', textDecoration: 'none' }}>
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterCol({ title, locale, links }: { title: string; locale: string; links: { href: string; label: string }[] }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <h3 style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--color-foreground)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{title}</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link href={`/${locale}${href}`} style={{ fontSize: '0.875rem', color: 'var(--color-foreground-muted)', textDecoration: 'none' }}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
